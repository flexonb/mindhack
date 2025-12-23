import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Award, BookOpen, Shield, LogOut, ChevronRight } from 'lucide-react-native';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Sessions', value: '12' },
    { label: 'Avg Score', value: '78%' },
    { label: 'Streak', value: '5 days' },
    { label: 'Badges', value: '4' },
  ];

  const menuItems = [
    { icon: Award, label: 'My Progress', onPress: () => {} },
    { icon: BookOpen, label: 'Resources', onPress: () => {} },
    { icon: Shield, label: 'Safety Tools', onPress: () => {} },
    { icon: Settings, label: 'Settings', onPress: () => {} },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <View>
            <Text style={styles.name}>{user?.name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Menu</Text>
        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={22} color="#0ea5e9" />
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.safetyCard}>
          <View style={styles.safetyHeader}>
            <Shield size={24} color="#10b981" />
            <Text style={styles.safetyTitle}>Crisis Resources</Text>
          </View>
          <Text style={styles.safetyText}>
            If you're in crisis, call 988 (US) or your local crisis line.
          </Text>
          <TouchableOpacity style={styles.crisisButton}>
            <Text style={styles.crisisButtonText}>View Crisis Resources</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <LogOut size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.version}>MindHack v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
  },
  email: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0ea5e9',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemLabel: {
    fontSize: 16,
    color: '#1e293b',
  },
  safetyCard: {
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#86efac',
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  safetyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
  },
  safetyText: {
    fontSize: 14,
    color: '#15803d',
    lineHeight: 20,
    marginBottom: 16,
  },
  crisisButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  crisisButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    paddingBottom: 32,
  },
});
