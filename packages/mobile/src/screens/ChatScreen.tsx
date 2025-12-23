import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatScreen({ route }: { route: any }) {
  const { personaId } = route.params || {};
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi, I'm Alex. I... I don't really know why I'm here today. Everything just feels so overwhelming lately.",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand. Can you tell me more about what's been making things feel so heavy?",
        "Thanks for asking. I guess I've been feeling really isolated lately, like no one really gets it.",
        "I don't know... I just feel stuck, you know? Like I can't see a way forward.",
        "Sometimes I wonder if anyone would even notice if I just... disappeared.",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const renderMessage = (message: Message) => (
    <View
      style={[
        styles.messageContainer,
        message.role === 'user' ? styles.userMessage : styles.assistantMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.role === 'user'
            ? styles.userBubble
            : styles.assistantBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.role === 'user' ? styles.userText : styles.assistantText,
          ]}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.chatHeader}>
        <Text style={styles.chatTitle}>Training Session</Text>
        <Text style={styles.chatSubtitle}>Persona: Alex (Moderate Depression)</Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => renderMessage(message))}
        {isTyping && (
          <View style={styles.typingIndicator}>
            <Text style={styles.typingText}>Typing...</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your response..."
          placeholderTextColor="#94a3b8"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  chatHeader: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  chatSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    gap: 12,
  },
  messageContainer: {
    maxWidth: '85%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 14,
  },
  userBubble: {
    backgroundColor: '#0ea5e9',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#fff',
  },
  assistantText: {
    color: '#1e293b',
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    padding: 12,
  },
  typingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#0ea5e9',
    borderRadius: 24,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e2e8f0',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
