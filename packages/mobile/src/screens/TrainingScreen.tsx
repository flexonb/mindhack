import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Persona {
  id: string;
  name: string;
  condition: string;
  difficulty: string;
  description: string;
}

export function TrainingScreen() {
  const navigation = useNavigation<any>();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load personas from API
    setPersonas([
      { id: '1', name: 'Alex', condition: 'Depression', difficulty: 'Moderate', description: 'Feeling overwhelmed and hopeless' },
      { id: '2', name: 'Sam', condition: 'Anxiety', difficulty: 'Mild', description: 'Experiencing worry and restlessness' },
      { id: '3', name: 'Jordan', condition: 'PTSD', difficulty: 'Severe', description: 'Dealing with flashbacks and hypervigilance' },
      { id: '4', name: 'Casey', condition: 'Bipolar', difficulty: 'Moderate', description: 'Mood swings between highs and lows' },
      { id: '5', name: 'Riley', condition: 'OCD', difficulty: 'Mild', description: 'Managing intrusive thoughts and compulsions' },
      { id: '6', name: 'Morgan', condition: 'Addiction', difficulty: 'Moderate', description: 'Struggling with substance use' },
      { id: '7', name: 'Taylor', condition: 'Eating Disorder', difficulty: 'Severe', description: 'Body image and food struggles' },
      { id: '8', name: ' crisis', condition: 'Crisis', difficulty: 'Critical', description: 'Immediate intervention needed' },
    ]);
    setLoading(false);
  }, []);

  const getConditionEmoji = (condition: string) => {
    const emojis: Record<string, string> = {
      Depression: '😔',
      Anxiety: '😰',
      PTSD: '😨',
      Bipolar: '🎭',
      OCD: '🔄',
      Addiction: '💊',
      'Eating Disorder': '🍽️',
      Crisis: '🆘',
    };
    return emojis[condition] || '🧠';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Mild: '#10b981',
      Moderate: '#f59e0b',
      Severe: '#ef4444',
      Critical: '#dc2626',
    };
    return colors[difficulty] || '#64748b';
  };

  const renderPersona = ({ item }: { item: Persona }) => (
    <TouchableOpacity
      style={styles.personaCard}
      onPress={() => navigation.navigate('Chat', { personaId: item.id })}
    >
      <View style={styles.personaHeader}>
        <Text style={styles.personaEmoji}>{getConditionEmoji(item.condition)}</Text>
        <View style={styles.personaInfo}>
          <Text style={styles.personaName}>{item.name}</Text>
          <Text style={styles.personaCondition}>{item.condition}</Text>
        </View>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) + '20' }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(item.difficulty) }]}>
            {item.difficulty}
          </Text>
        </View>
      </View>
      <Text style={styles.personaDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Training Personas</Text>
        <Text style={styles.subtitle}>Practice conversations with realistic AI personas</Text>
      </View>

      <FlatList
        data={personas}
        renderItem={renderPersona}
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
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 16,
  },
  personaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  personaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  personaEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  personaInfo: {
    flex: 1,
  },
  personaName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  personaCondition: {
    fontSize: 14,
    color: '#64748b',
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  personaDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});
