import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList, Image } from 'react-native';

interface Helper {
  id: string;
  name: string;
  role: string;
  rating: number;
  specialties: string[];
  available: boolean;
}

export function SupportScreen() {
  const [helpers] = useState<Helper[]>([
    { id: '1', name: 'Dr. Sarah Chen', role: 'Counselor', rating: 4.9, specialties: ['Anxiety', 'Depression'], available: true },
    { id: '2', name: 'Michael Torres', role: 'Peer Support', rating: 4.8, specialties: ['Grief', 'Addiction'], available: true },
    { id: '3', name: 'Emma Wilson', role: 'Listener', rating: 4.7, specialties: ['General Support'], available: false },
    { id: '4', name: 'James Park', role: 'Crisis Responder', rating: 4.9, specialties: ['Crisis', 'PTSD'], available: true },
  ]);

  const renderHelper = ({ item }: { item: Helper }) => (
    <TouchableOpacity style={styles.helperCard}>
      <View style={styles.helperHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.helperInfo}>
          <Text style={styles.helperName}>{item.name}</Text>
          <Text style={styles.helperRole}>{item.role}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>
          </View>
        </View>
        {item.available ? (
          <View style={styles.availableBadge}>
            <Text style={styles.availableText}>Available</Text>
          </View>
        ) : (
          <View style={[styles.availableBadge, { backgroundColor: '#f1f5f9' }]}>
            <Text style={[styles.availableText, { color: '#64748b' }]}>Busy</Text>
          </View>
        )}
      </View>
      <View style={styles.specialtiesContainer}>
        {item.specialties.map((specialty, index) => (
          <View key={index} style={styles.specialtyTag}>
            <Text style={styles.specialtyText}>{specialty}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.connectButton, !item.available && styles.connectButtonDisabled]}
        disabled={!item.available}
      >
        <Text style={styles.connectButtonText}>
          {item.available ? 'Connect Now' : 'Unavailable'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Get Support</Text>
        <Text style={styles.subtitle}>Connect with trained helpers</Text>
      </View>

      <View style={styles.quickHelp}>
        <View style={styles.crisisBanner}>
          <Text style={styles.crisisTitle}>In Crisis?</Text>
          <Text style={styles.crisisText}>24/7 Crisis support available</Text>
          <TouchableOpacity style={styles.crisisButton}>
            <Text style={styles.crisisButtonText}>Call 988 Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Available Helpers</Text>

      <FlatList
        data={helpers}
        renderItem={renderHelper}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  quickHelp: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  crisisBanner: {
    backgroundColor: '#fef2f2',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  crisisTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  crisisText: {
    fontSize: 14,
    color: '#991b1b',
    marginBottom: 12,
  },
  crisisButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  crisisButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  helperCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  helperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  helperInfo: {
    flex: 1,
  },
  helperName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  helperRole: {
    fontSize: 14,
    color: '#64748b',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: 14,
    color: '#64748b',
  },
  availableBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  specialtyTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    color: '#64748b',
  },
  connectButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  connectButtonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
