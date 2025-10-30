import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export interface MessageItemProps {
  message: {
    id: string | number;
    content: string;
    role: string;
  };
  onPress?: (message: { id: string | number; content: string; role: string }) => void;
}

export const MessageItem = React.memo<MessageItemProps>(({ message, onPress }) => (
  <TouchableOpacity
    style={styles.container}
    onPress={() => onPress?.(message)}
    accessibilityLabel={`Mensagem de ${message.role}`}
    accessible
  >
    <Text style={styles.text}>{message.content}</Text>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 2,
    borderRadius: 12,
    backgroundColor: '#F7F7F7',
  },
  text: {
    fontSize: 16,
    color: '#222',
  },
});

MessageItem.displayName = 'MessageItem';
