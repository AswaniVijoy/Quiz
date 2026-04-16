import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { QuizSet } from '../types';

interface Props {
  quizSet: QuizSet;
  onPress: () => void;
}

export default function QuizCard({ quizSet, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.top}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{quizSet.category || 'General'}</Text>
        </View>
        <Text style={styles.count}>{quizSet.questionIds?.length || 0} Qs</Text>
      </View>
      <Text style={styles.title}>{quizSet.title}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {quizSet.description || 'Tap to start this quiz'}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.startText}>Start Quiz →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8edda',
    shadowColor: '#556B2F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#f0f4e8',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B8E23',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  count: { fontSize: 12, color: '#9aab7a' },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3a1e',
    marginBottom: 6,
  },
  desc: { fontSize: 13, color: '#7a8c5e', lineHeight: 20, marginBottom: 16 },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f4e8',
    paddingTop: 12,
  },
  startText: { fontSize: 13, color: '#556B2F', fontWeight: '700' },
});