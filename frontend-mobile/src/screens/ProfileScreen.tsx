import { useAuth } from '../context/AuthContext';
import { getAttempts } from '../utils/storage';
import { useEffect, useState } from 'react';
import { QuizAttempt } from '../types';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);

  useEffect(() => {
    getAttempts(user?.id || 'guest').then(setAttempts);
  }, []);

  const avgScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + (a.score / a.total) * 100, 0) / attempts.length)
    : 0;

  const bestScore = attempts.length > 0
    ? Math.max(...attempts.map(a => Math.round((a.score / a.total) * 100)))
    : 0;

  const handleLogout = () => {
    if (Platform.OS === 'web') {
        // Web — use browser confirm instead of Alert
        const confirmed = window.confirm('Are you sure you want to logout?');
        if (confirmed) logout();
    } else {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: logout },
        ]);
    }
    };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{attempts.length}</Text>
          <Text style={styles.statLbl}>Quizzes Taken</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{avgScore}%</Text>
          <Text style={styles.statLbl}>Avg Score</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNum}>{bestScore}%</Text>
          <Text style={styles.statLbl}>Best Score</Text>
        </View>
      </View>

      {/* Recent attempts */}
      <Text style={styles.sectionTitle}>Recent Attempts</Text>
      {attempts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No quizzes taken yet.</Text>
          <Text style={styles.emptySubText}>Go to Home and start playing!</Text>
        </View>
      ) : (
        attempts.slice(0, 10).map((attempt, idx) => (
          <View key={idx} style={styles.attemptCard}>
            <View style={styles.attemptLeft}>
              <Text style={styles.attemptTitle}>{attempt.quizSetTitle}</Text>
              <Text style={styles.attemptDate}>
                {new Date(attempt.completedAt).toLocaleDateString('en-US', {
                  day: 'numeric', month: 'short', year: 'numeric',
                })}
              </Text>
            </View>
            <View style={styles.attemptRight}>
              <Text style={styles.attemptScore}>
                {attempt.score}/{attempt.total}
              </Text>
              <Text style={[
                styles.attemptPct,
                { color: (attempt.score / attempt.total) >= 0.7 ? '#28a745' : '#dc2626' }
              ]}>
                {Math.round((attempt.score / attempt.total) * 100)}%
              </Text>
            </View>
          </View>
        ))
      )}

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFAF0' },
  content: { padding: 20, paddingBottom: 40 },
  profileHeader: {
    alignItems: 'center', padding: 28,
    backgroundColor: 'white', borderRadius: 16,
    marginBottom: 20, borderWidth: 1, borderColor: '#e8edda',
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#556B2F', alignItems: 'center',
    justifyContent: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: 'white' },
  name: { fontSize: 22, fontWeight: '800', color: '#2d3a1e' },
  email: { fontSize: 14, color: '#7a8c5e', marginTop: 4 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statBox: {
    flex: 1, backgroundColor: 'white', borderRadius: 12,
    padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#e8edda',
  },
  statNum: { fontSize: 22, fontWeight: '800', color: '#556B2F' },
  statLbl: { fontSize: 11, color: '#9aab7a', marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#2d3a1e', marginBottom: 14 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 16, fontWeight: '700', color: '#2d3a1e' },
  emptySubText: { fontSize: 13, color: '#9aab7a', marginTop: 4 },
  attemptCard: {
    backgroundColor: 'white', borderRadius: 10, padding: 16,
    marginBottom: 10, flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#e8edda',
  },
  attemptLeft: { flex: 1 },
  attemptTitle: { fontSize: 14, fontWeight: '700', color: '#2d3a1e' },
  attemptDate: { fontSize: 12, color: '#9aab7a', marginTop: 2 },
  attemptRight: { alignItems: 'flex-end' },
  attemptScore: { fontSize: 16, fontWeight: '800', color: '#2d3a1e' },
  attemptPct: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  logoutBtn: {
    marginTop: 24, backgroundColor: '#fee2e2', borderRadius: 12,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#fecaca',
  },
  logoutText: { color: '#dc2626', fontSize: 16, fontWeight: '700' },
});