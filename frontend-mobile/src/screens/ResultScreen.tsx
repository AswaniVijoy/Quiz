// ResultScreen.tsx
//
// FIXES IN THIS FILE:
// 1. Removed the <div> wrapper around <ScrollView> — this was blocking
//    all touch/scroll events and causing the "props.pointerEvents is
//    deprecated" warning. In React Native you never use HTML tags.
// 2. Added paddingBottom: 48 to content so buttons aren't clipped.
// 3. flex: 1 on container ensures ScrollView fills the screen properly.

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Question } from '../types';

export default function ResultScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { score, total, questions, answers, quizSet } = route.params;

  const percentage = Math.round((score / total) * 100);

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent!', color: '#28a745', emoji: '🏆' };
    if (percentage >= 70) return { label: 'Good Job!', color: '#556B2F', emoji: '🎉' };
    if (percentage >= 50) return { label: 'Keep Trying!', color: '#CD853F', emoji: '💪' };
    return { label: 'Need Practice', color: '#dc2626', emoji: '📚' };
  };

  const grade = getGrade();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Score card */}
      <View style={styles.scoreCard}>
        <Text style={styles.gradeEmoji}>{grade.emoji}</Text>
        <Text style={styles.gradeLabel}>{grade.label}</Text>
        <Text style={styles.quizTitle}>{quizSet.title}</Text>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreNum}>{score}</Text>
          <Text style={styles.scoreTotal}>/ {total}</Text>
        </View>
        <Text style={[styles.percentage, { color: grade.color }]}>{percentage}%</Text>
      </View>

      {/* Answer review */}
      <Text style={styles.reviewTitle}>Answer Review</Text>

      {questions.map((q: Question, idx: number) => {
        const userAnswer = answers[idx]?.selected;
        const isCorrect = userAnswer === q.correctAnswer;

        return (
          <View key={q._id} style={styles.reviewCard}>
            <View style={styles.reviewTop}>
              <Text style={styles.reviewNum}>Q{idx + 1}</Text>
              <Text style={isCorrect ? styles.correct : styles.wrong}>
                {isCorrect ? '✓ Correct' : '✗ Wrong'}
              </Text>
            </View>
            <Text style={styles.reviewQ}>{q.question}</Text>
            <View style={styles.reviewAnswers}>
              <Text style={styles.yourAnswer}>
                Your answer:{' '}
                <Text style={isCorrect ? styles.correct : styles.wrong}>
                  {userAnswer} — {q.options.find(o => o.label === userAnswer)?.text}
                </Text>
              </Text>
              {!isCorrect && (
                <Text style={styles.correctAnswer}>
                  Correct:{' '}
                  <Text style={styles.correct}>
                    {q.correctAnswer} — {q.options.find(o => o.label === q.correctAnswer)?.text}
                  </Text>
                </Text>
              )}
            </View>
          </View>
        );
      })}

      {/* Buttons */}
      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.replace('Quiz', { quizSet })}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('MainTabs')}
        >
          <Text style={styles.homeText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,                      // ← CRITICAL: must be flex:1 for ScrollView to work
    backgroundColor: '#FFFAF0',
  },
  content: {
    padding: 20,
    paddingBottom: 48,            // ← extra space so buttons aren't clipped at bottom
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: '#e8edda',
    shadowColor: '#556B2F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  gradeEmoji: { fontSize: 52, marginBottom: 8 },
  gradeLabel: { fontSize: 22, fontWeight: '800', color: '#2d3a1e', marginBottom: 4 },
  quizTitle: { fontSize: 14, color: '#7a8c5e', marginBottom: 24 },
  scoreCircle: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 8 },
  scoreNum: { fontSize: 64, fontWeight: '800', color: '#556B2F', lineHeight: 70 },
  scoreTotal: { fontSize: 24, color: '#9aab7a', marginBottom: 10, marginLeft: 4 },
  percentage: { fontSize: 18, fontWeight: '700' },
  reviewTitle: { fontSize: 17, fontWeight: '700', color: '#2d3a1e', marginBottom: 14 },
  reviewCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8edda',
  },
  reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  reviewNum: { fontSize: 12, fontWeight: '700', color: '#9aab7a' },
  reviewQ: { fontSize: 14, color: '#2d3a1e', lineHeight: 20, marginBottom: 10 },
  reviewAnswers: { gap: 4 },
  yourAnswer: { fontSize: 13, color: '#7a8c5e' },
  correctAnswer: { fontSize: 13, color: '#7a8c5e' },
  correct: { color: '#28a745', fontWeight: '700' },
  wrong: { color: '#dc2626', fontWeight: '700' },
  buttons: { gap: 12, marginTop: 8 },
  retryBtn: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#556B2F',
  },
  retryText: { fontSize: 16, fontWeight: '700', color: '#556B2F' },
  homeBtn: {
    backgroundColor: '#556B2F',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  homeText: { fontSize: 16, fontWeight: '700', color: 'white' },
});