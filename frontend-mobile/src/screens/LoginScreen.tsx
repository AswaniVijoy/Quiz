// LoginScreen.tsx
//
// FIX: Uses EXPO_PUBLIC_API_URL from .env instead of hardcoded IP.
// Your .env already has: EXPO_PUBLIC_API_URL=https://ignore-uncover-reliant.ngrok-free.dev
// Expo automatically exposes variables prefixed with EXPO_PUBLIC_ to the app.

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView,
} from 'react-native';
import { useAuth } from '../context/AuthContext';

// ✅ Read from .env — works for both web and mobile via Expo
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function LoginScreen() {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setName(''); setEmail(''); setPassword('');
    setConfirmPassword(''); setError(''); setSuccess('');
  };

  const handleSubmit = async () => {
    setError(''); setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields'); return;
    }
    if (isRegistering && !name.trim()) {
      setError('Please enter your name'); return;
    }
    if (isRegistering && password !== confirmPassword) {
      setError('Passwords do not match'); return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters'); return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const res = await fetch(`${BASE_URL}/user-auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');

        setSuccess('Account created! Please sign in with your new credentials.');
        setIsRegistering(false);
        setName(''); setPassword(''); setConfirmPassword('');
      } else {
        const res = await fetch(`${BASE_URL}/user-auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Invalid email or password');

        await login(data.access_token, data.user);
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoArea}>
          <Text style={styles.logoIcon}>◈</Text>
          <Text style={styles.logoText}>QuizForge</Text>
          <Text style={styles.logoSub}>Test your knowledge</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.cardSub}>
            {isRegistering
              ? 'Sign up to start playing quizzes'
              : 'Sign in to continue'}
          </Text>

          {error !== '' && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          {success !== '' && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✓ {success}</Text>
            </View>
          )}

          {isRegistering && (
            <>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                placeholderTextColor="#9aab7a"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </>
          )}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@email.com"
            placeholderTextColor="#9aab7a"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Min. 6 characters"
            placeholderTextColor="#9aab7a"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {isRegistering && (
            <>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter your password"
                placeholderTextColor="#9aab7a"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.btnText}>
                  {isRegistering ? 'Create Account →' : 'Sign In →'}
                </Text>
            }
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleRow}
            onPress={() => { setIsRegistering(!isRegistering); resetForm(); }}
          >
            <Text style={styles.toggleText}>
              {isRegistering
                ? 'Already have an account? '
                : "Don't have an account? "}
              <Text style={styles.toggleLink}>
                {isRegistering ? 'Sign In' : 'Sign Up'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#556B2F' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoArea: { alignItems: 'center', marginBottom: 32 },
  logoIcon: { fontSize: 48, color: '#FFDAB9', marginBottom: 8 },
  logoText: { fontSize: 32, fontWeight: '800', color: '#FFFAF0', letterSpacing: 1 },
  logoSub: { fontSize: 14, color: 'rgba(255,250,240,0.7)', marginTop: 4 },
  card: {
    backgroundColor: '#FFFAF0', borderRadius: 20, padding: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 20, elevation: 8,
  },
  cardTitle: { fontSize: 24, fontWeight: '800', color: '#2d3a1e', marginBottom: 4 },
  cardSub: { fontSize: 14, color: '#7a8c5e', marginBottom: 20 },
  errorBox: {
    backgroundColor: '#fee2e2', borderRadius: 8, padding: 12,
    marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#dc2626',
  },
  errorText: { color: '#991b1b', fontSize: 13 },
  successBox: {
    backgroundColor: '#d4edda', borderRadius: 8, padding: 12,
    marginBottom: 16, borderLeftWidth: 4, borderLeftColor: '#28a745',
  },
  successText: { color: '#155724', fontSize: 13 },
  label: {
    fontSize: 13, fontWeight: '700', color: '#556B2F',
    marginBottom: 6, marginTop: 14,
  },
  input: {
    borderWidth: 1.5, borderColor: '#c8d5a8', borderRadius: 10,
    padding: 13, fontSize: 15, color: '#2d3a1e', backgroundColor: 'white',
  },
  btn: {
    backgroundColor: '#556B2F', borderRadius: 10,
    padding: 16, alignItems: 'center', marginTop: 24,
  },
  btnDisabled: { backgroundColor: '#9aab7a' },
  btnText: { color: 'white', fontSize: 16, fontWeight: '700' },
  toggleRow: { alignItems: 'center', marginTop: 20 },
  toggleText: { fontSize: 14, color: '#7a8c5e' },
  toggleLink: { color: '#556B2F', fontWeight: '700' },
});