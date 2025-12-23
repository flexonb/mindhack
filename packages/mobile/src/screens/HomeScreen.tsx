import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Brain, Heart, BookOpen, User, LogOut } from 'lucide-react-native';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{user?.name || 'User'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <User size={28} color="#0ea5e9" />
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Sessions</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>72%</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Choose Your Path</Text>

      <View style={styles.pathsContainer}>
        <TouchableOpacity
          style={styles.pathCard}
          onPress={() => navigation.navigate('Training')}
        >
          <View style={[styles.pathIcon, { backgroundColor: '#dbeafe' }]}>
            <Brain size={32} color="#0ea5e9" />
          </View>
          <Text style={styles.pathTitle}>AI Training</Text>
          <Text style={styles.pathDescription}>
            Practice conversations with AI personas simulating mental health conditions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.pathCard}
          onPress={() => navigation.navigate('Support')}
        >
          <View style={[styles.pathIcon, { backgroundColor: '#dcfce7' }]}>
            <Heart size={32} color="#10b981" />
          </View>
          <Text style={styles.pathTitle}>Human Support</Text>
          <Text style={styles.pathDescription}>
            Connect with trained listeners and counselors for real support
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <BookOpen size={24} color="#0ea5e9" />
            <Text style={styles.actionText}>Resources</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Brain size={24} color="#8b5cf6" />
            <Text style={styles.actionText}>My Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={logout}>
            <LogOut size={24} color="#ef4444" />
            <Text style={styles.actionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#64748b',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: '30%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  pathsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  pathCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  pathIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pathTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  pathDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 32,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#64748b',
  },
});
