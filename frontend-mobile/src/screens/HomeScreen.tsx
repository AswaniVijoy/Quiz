import { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, StyleSheet,
  ActivityIndicator, RefreshControl, TouchableOpacity, Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchQuizSets } from '../api/api';
import { getAttempts } from '../utils/storage';
import { useOffline } from '../context/OfflineContext';
import {useNotifications} from '../hooks/useNotifications';
import QuizCard from '../components/QuizCard';
import { QuizSet, QuizAttempt } from '../types';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { isOnline } = useOffline();
  const { sendReminderNotification } = useNotifications();
  const { user } = useAuth();

  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fromCache, setFromCache] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const sets = await fetchQuizSets();
      setFromCache(!isOnline);
      setQuizSets(sets);

      const savedAttempts = await getAttempts(user?.id || 'guest');
      setAttempts(savedAttempts);
    } catch (e) {
      Alert.alert('Error', 'Could not load quizzes.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isOnline]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // 🔄 Loading state
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#556B2F" />
        <Text style={styles.loadingText}>Loading quizzes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Offline Banner */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            ⚠ You are offline — showing cached content
          </Text>
        </View>
      )}

      <FlatList
        data={quizSets}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#556B2F"
          />
        }

        ListHeaderComponent={
          <View>

            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Welcome back 👋</Text>
                <Text style={styles.subtitle}>
                  {fromCache
                    ? 'Cached quizzes'
                    : 'Pick a quiz and test yourself'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.reminderBtn}
                onPress={() => {
                  sendReminderNotification();
                  Alert.alert('Reminder set!', 'You will get a reminder in 5 seconds.');
                }}
              >
                <Text style={styles.reminderIcon}>🔔</Text>
              </TouchableOpacity>
            </View>

            {/* Stats */}
            {attempts.length > 0 && (
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{attempts.length}</Text>
                  <Text style={styles.statLbl}>Quizzes Taken</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statNum}>
                    {Math.round(
                      attempts.reduce(
                        (sum, a) => sum + (a.score / a.total) * 100,
                        0
                      ) / attempts.length
                    )}%
                  </Text>
                  <Text style={styles.statLbl}>Avg Score</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{quizSets.length}</Text>
                  <Text style={styles.statLbl}>Available</Text>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Available Quizzes</Text>
          </View>
        }

        renderItem={({ item }) => (
          <QuizCard
            quizSet={item}
            onPress={() =>
              navigation.navigate('Quiz', { quizSet: item })
            }
          />
        )}

        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              {isOnline ? '📭' : '📵'}
            </Text>
            <Text style={styles.emptyText}>
              {isOnline
                ? 'No quizzes available yet.'
                : 'No cached quizzes found.'}
            </Text>
            <Text style={styles.emptySubText}>
              {isOnline
                ? 'Check back later!'
                : 'Go online to load quizzes first.'}
            </Text>
          </View>
        }

        contentContainerStyle={styles.list}
      />
    </View>
  );
}

// ✅ CLEAN styles (works for both web + mobile)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#7a8c5e',
  },

  offlineBanner: {
    backgroundColor: '#CD853F',
    padding: 8,
    alignItems: 'center',
  },

  offlineText: {
    color: 'white',
    fontWeight: '600',
  },

  list: {
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  greeting: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2d3a1e',
  },

  subtitle: {
    color: '#7a8c5e',
  },

  reminderBtn: {
    backgroundColor: 'white',
    borderRadius: 22,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  reminderIcon: {
    fontSize: 20,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },

  statBox: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  statNum: {
    fontSize: 20,
    fontWeight: '800',
  },

  statLbl: {
    fontSize: 12,
    color: '#9aab7a',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  empty: {
    alignItems: 'center',
    marginTop: 50,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '700',
  },

  emptySubText: {
    color: '#9aab7a',
  },
});