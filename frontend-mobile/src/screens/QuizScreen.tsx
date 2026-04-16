import { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { fetchQuestions } from '../api/api';
import { saveAttempt } from '../utils/storage';
import  {useNotifications}  from '../hooks/useNotifications';
import { Question, QuizSet } from '../types';
import { useAuth } from '../context/AuthContext';

export default function QuizScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { quizSet }: { quizSet: QuizSet } = route.params;
  const { sendQuizCompletedNotification } = useNotifications();

  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selected: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState(false);

  useEffect(() => {
    fetchQuestions(quizSet.questionIds).then(qs => {
      setQuestions(qs);
      setLoading(false);
    }).catch(() => {
      Alert.alert('Error', 'Could not load questions.');
      navigation.goBack();
    });
  }, []);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 0;

  const handleSelectAnswer = (label: string) => {
    if (answered) return;
    setSelectedAnswer(label);
    setAnswered(true);
  };

  const handleNext = async () => {
    if (!selectedAnswer) {
      Alert.alert('Please select an answer');
      return;
    }

    const newAnswers = [...answers, {
      questionId: currentQuestion._id,
      selected: selectedAnswer,
    }];
    setAnswers(newAnswers);

    if (isLastQuestion) {
      const score = newAnswers.filter((a, i) => a.selected === questions[i].correctAnswer).length;

      await saveAttempt({
        quizSetId: quizSet._id,
        quizSetTitle: quizSet.title,
        answers: newAnswers,
        score,
        total: questions.length,
        completedAt: new Date().toISOString(),
        synced: false,
      }, user?.id || 'guest');

      await sendQuizCompletedNotification(score, questions.length);

      navigation.replace('Result', {
        score,
        total: questions.length,
        questions,
        answers: newAnswers,
        quizSet,
      });
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#556B2F" />
      </View>
    );
  }

  const getOptionStyle = (label: string) => {
    if (!answered) {
      return label === selectedAnswer ? styles.optionSelected : styles.option;
    }
    if (label === currentQuestion.correctAnswer) return styles.optionCorrect;
    if (label === selectedAnswer && label !== currentQuestion.correctAnswer) return styles.optionWrong;
    return styles.option;
  };

  const getOptionTextStyle = (label: string) => {
    if (!answered) return label === selectedAnswer ? styles.optionTextSelected : styles.optionText;
    if (label === currentQuestion.correctAnswer) return styles.optionTextCorrect;
    if (label === selectedAnswer) return styles.optionTextWrong;
    return styles.optionText;
  };

  return (

    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (Platform.OS === 'web') {
            const confirmed = window.confirm('Are you sure you want to quit?');
            if (confirmed) {
              navigation.goBack();
            }
          } else {
            Alert.alert('Quit Quiz', 'Are you sure you want to quit?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Quit', onPress: () => navigation.goBack(), style: 'destructive' },
            ]);
          }
        }}>
          <Text style={styles.quit}>✕ Quit</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>{currentIndex + 1} / {questions.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        >
        {/* Category */}
        <View style={styles.catBadge}>
          <Text style={styles.catText}>{quizSet.category || 'General'}</Text>
        </View>

        {/* Question */}
        <Text style={styles.questionText}>{currentQuestion.question}</Text>

        {/* Options */}
        <View style={styles.options}>
          {currentQuestion.options.map(opt => (
            <TouchableOpacity
              key={opt.label}
              style={getOptionStyle(opt.label)}
              onPress={() => handleSelectAnswer(opt.label)}
              activeOpacity={0.85}
            >
              <View style={styles.optionRow}>
                <View style={styles.labelCircle}>
                  <Text style={styles.labelText}>{opt.label}</Text>
                </View>
                <Text style={getOptionTextStyle(opt.label)} numberOfLines={3}>
                  {opt.text}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Feedback */}
        {answered && (
          <View style={selectedAnswer === currentQuestion.correctAnswer ? styles.feedbackCorrect : styles.feedbackWrong}>
            <Text style={styles.feedbackText}>
              {selectedAnswer === currentQuestion.correctAnswer
                ? '✓ Correct!'
                : `✗ Wrong! Answer: ${currentQuestion.correctAnswer}`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Next button — kept outside ScrollView so it stays pinned at bottom */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !selectedAnswer && styles.nextBtnDisabled]}
          onPress={handleNext}
          disabled={!selectedAnswer}
        >
          <Text style={styles.nextBtnText}>
            {isLastQuestion ? 'See Results →' : 'Next Question →'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
    ...(Platform.OS === 'web' && { overflow: 'hidden' }),
    },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFAF0' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
  },
  quit: { fontSize: 14, color: '#9aab7a' },
  progress: { fontSize: 14, fontWeight: '700', color: '#556B2F' },
  progressBar: { height: 4, backgroundColor: '#e8edda', marginHorizontal: 20, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#556B2F', borderRadius: 2 },
  // FIX: Added scrollView style with flex:1 so the ScrollView is properly
  // bounded between the header/progressBar above and the footer below.
  scrollView: { flex: 1 },
  content: { padding: 20, paddingTop: 24 },
  catBadge: {
    alignSelf: 'flex-start', backgroundColor: '#f0f4e8',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginBottom: 16,
  },
  catText: { fontSize: 11, fontWeight: '700', color: '#6B8E23', textTransform: 'uppercase', letterSpacing: 0.8 },
  questionText: { fontSize: 20, fontWeight: '700', color: '#2d3a1e', lineHeight: 30, marginBottom: 28 },
  options: { gap: 12 },
  option: {
    backgroundColor: 'white', borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: '#e8edda',
  },
  optionSelected: {
    backgroundColor: '#f0f4e8', borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: '#556B2F',
  },
  optionCorrect: {
    backgroundColor: '#d4edda', borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: '#28a745',
  },
  optionWrong: {
    backgroundColor: '#fee2e2', borderRadius: 12, padding: 16,
    borderWidth: 1.5, borderColor: '#dc2626',
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  labelCircle: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f4e8',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  labelText: { fontSize: 13, fontWeight: '700', color: '#556B2F' },
  optionText: { flex: 1, fontSize: 15, color: '#2d3a1e', lineHeight: 22 },
  optionTextSelected: { flex: 1, fontSize: 15, color: '#2d3a1e', fontWeight: '600', lineHeight: 22 },
  optionTextCorrect: { flex: 1, fontSize: 15, color: '#155724', fontWeight: '600', lineHeight: 22 },
  optionTextWrong: { flex: 1, fontSize: 15, color: '#991b1b', lineHeight: 22 },
  feedbackCorrect: {
    marginTop: 16, backgroundColor: '#d4edda', borderRadius: 10,
    padding: 14, borderLeftWidth: 4, borderLeftColor: '#28a745',
  },
  feedbackWrong: {
    marginTop: 16, backgroundColor: '#fee2e2', borderRadius: 10,
    padding: 14, borderLeftWidth: 4, borderLeftColor: '#dc2626',
  },
  feedbackText: { fontSize: 14, fontWeight: '700', color: '#2d3a1e' },
  footer: { padding: 20, paddingBottom: 32 },
  nextBtn: {
    backgroundColor: '#556B2F', borderRadius: 12, padding: 16, alignItems: 'center',
  },
  nextBtnDisabled: { backgroundColor: '#c8d5a8' },
  nextBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },
});