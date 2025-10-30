import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageItem } from '../components/chat/MessageItem';
import { useChatOptimized } from '../hooks/useChatOptimized';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

export default function ChatScreen() {
  const navigation = useNavigation();
  const {
    messages,
    loading,
    error,
    sendMessage,
    resetChat,
  } = useChatOptimized();

  // Handler para envio de mensagem
  const handleSend = useCallback((content: string) => {
    if (!content.trim()) return;
    sendMessage(content);
  }, [sendMessage]);

  // Handler para clique em mensagem (ajuste se necessário)
  const handleMessagePress = useCallback((message) => {
    // Exemplo: alert(message.content);
  }, []);

  // Renderização da mensagem
  const renderMessageItem = useCallback(
    ({ item }) => (
      <MessageItem message={item} onPress={handleMessagePress} />
    ), [handleMessagePress]
  );

  // Key extractor otimizado
  const keyExtractor = useCallback(item => String(item.id), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.headerBack}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversar</Text>
        <TouchableOpacity>
          <Text style={styles.headerEmergency}>🚨 SOS</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <ActivityIndicator style={{ marginTop: 24 }} size="large" color={colors.primary} />
      )}

      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={keyExtractor}
        inverted
        initialNumToRender={20}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews
        contentContainerStyle={styles.messageList}
      />

      {/* Campo de input e ações rápidas podem ser reimplementados abaixo ao integrar 100% do fluxo */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.base,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerBack: {
    fontSize: typography.sizes.base,
    color: colors.primary,
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold as any,
    color: colors.foreground,
  },
  headerEmergency: {
    fontSize: typography.sizes.base,
    color: colors.destructive,
    fontWeight: typography.weights.bold as any,
  },
  messageList: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: spacing.sm,
  },
});

