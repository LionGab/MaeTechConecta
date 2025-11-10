/**
 * FASE 4: PersonalizedContentCard Component
 *
 * Card de conteúdo personalizado com:
 * - Visual atraente e acessível
 * - Ações: Like, Save, Share, View
 * - Badge "Por que isso?" com explicação
 * - Dark mode support
 * - Accessibility (WCAG 2.1 AA)
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, Share, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PersonalizedContent } from '@/hooks/usePersonalizedContent';
import { getShadowStyle } from '@/utils/platformStyles';

// =====================================================
// TYPES
// =====================================================

interface PersonalizedContentCardProps {
  content: PersonalizedContent;
  onInteraction: (contentId: string, type: 'like' | 'save' | 'share' | 'view') => Promise<void>;
  isDark?: boolean;
}

// =====================================================
// COMPONENT
// =====================================================

export function PersonalizedContentCard({ content, onInteraction, isDark = false }: PersonalizedContentCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReason, setShowReason] = useState(false);

  // Cores baseadas no tema
  const colors = {
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    text: isDark ? '#FFFFFF' : '#1A1A1A',
    textSecondary: isDark ? '#B0B0B0' : '#666666',
    border: isDark ? '#333333' : '#E0E0E0',
    accent: '#FF6B9D',
    like: '#FF6B9D',
    save: '#4CAF50',
    share: '#2196F3',
    badge: isDark ? '#2A2A2A' : '#F5F5F5',
    badgeText: isDark ? '#FFA726' : '#F57C00',
  };

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onInteraction(content.id, 'like');
      setIsLiked(!isLiked);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar sua ação. Tente novamente.');
      console.error('Error liking content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onInteraction(content.id, 'save');
      setIsSaved(!isSaved);
      Alert.alert('Salvo!', 'Conteúdo salvo em suas favoritas.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar. Tente novamente.');
      console.error('Error saving content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await onInteraction(content.id, 'share');

      if (content.source_url) {
        await Share.share({
          message: `${content.title}\n\n${content.summary}\n\nLeia mais: ${content.source_url}`,
          title: content.title,
          url: content.source_url,
        });
      } else {
        await Share.share({
          message: `${content.title}\n\n${content.summary}`,
          title: content.title,
        });
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = async () => {
    if (isLoading || !content.source_url) return;

    setIsLoading(true);
    try {
      await onInteraction(content.id, 'view');

      const canOpen = await Linking.canOpenURL(content.source_url);
      if (canOpen) {
        await Linking.openURL(content.source_url);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o link.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o conteúdo. Tente novamente.');
      console.error('Error opening content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <View
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      accessible={true}
      accessibilityLabel={`Conteúdo recomendado: ${content.title}`}
      accessibilityHint="Toque duas vezes para visualizar detalhes"
    >
      {/* Cabeçalho com badge de relevância */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: colors.badge }]}>
          <Icon name="star" size={12} color={colors.badgeText} />
          <Text style={[styles.badgeText, { color: colors.badgeText }]}>Recomendado para você</Text>
        </View>

        {content.relevance_score && (
          <View style={styles.scoreContainer}>
            <Text style={[styles.scoreText, { color: colors.textSecondary }]}>
              {content.relevance_score}% relevante
            </Text>
          </View>
        )}
      </View>

      {/* Título */}
      <Text
        style={[styles.title, { color: colors.text }]}
        numberOfLines={2}
        accessible={true}
        accessibilityRole="header"
      >
        {content.title}
      </Text>

      {/* Resumo */}
      <Text style={[styles.summary, { color: colors.textSecondary }]} numberOfLines={3} accessible={true}>
        {content.summary}
      </Text>

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {content.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={[styles.tag, { backgroundColor: colors.badge }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* "Por que isso?" */}
      {content.why_relevant && (
        <TouchableOpacity
          style={styles.reasonButton}
          onPress={() => setShowReason(!showReason)}
          accessible={true}
          accessibilityLabel="Por que isso foi recomendado?"
          accessibilityHint="Toque para ver a explicação"
        >
          <Icon name={showReason ? 'chevron-up' : 'information-outline'} size={16} color={colors.accent} />
          <Text style={[styles.reasonButtonText, { color: colors.accent }]}>Por que isso?</Text>
        </TouchableOpacity>
      )}

      {showReason && (
        <View style={[styles.reasonContainer, { backgroundColor: colors.badge }]}>
          <Text style={[styles.reasonText, { color: colors.text }]}>{content.why_relevant}</Text>
        </View>
      )}

      {/* Ações */}
      <View style={styles.actionsContainer}>
        {/* Like */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLike}
          disabled={isLoading}
          accessible={true}
          accessibilityLabel={isLiked ? 'Remover curtida' : 'Curtir conteúdo'}
          accessibilityRole="button"
        >
          <Icon
            name={isLiked ? 'heart' : 'heart-outline'}
            size={24}
            color={isLiked ? colors.like : colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Curtir</Text>
        </TouchableOpacity>

        {/* Save */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleSave}
          disabled={isLoading}
          accessible={true}
          accessibilityLabel={isSaved ? 'Remover dos salvos' : 'Salvar conteúdo'}
          accessibilityRole="button"
        >
          <Icon
            name={isSaved ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color={isSaved ? colors.save : colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Salvar</Text>
        </TouchableOpacity>

        {/* Share */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          disabled={isLoading}
          accessible={true}
          accessibilityLabel="Compartilhar conteúdo"
          accessibilityRole="button"
        >
          <Icon name="share-variant" size={24} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Compartilhar</Text>
        </TouchableOpacity>

        {/* View (se tiver URL) */}
        {content.source_url && (
          <TouchableOpacity
            style={[styles.actionButton, styles.viewButton]}
            onPress={handleView}
            disabled={isLoading}
            accessible={true}
            accessibilityLabel="Abrir conteúdo completo"
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <>
                <Icon name="open-in-new" size={24} color={colors.accent} />
                <Text style={[styles.actionText, { color: colors.accent, fontWeight: '600' }]}>Ver</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    ...getShadowStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scoreContainer: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  scoreText: {
    fontSize: 11,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  reasonButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reasonContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 13,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  viewButton: {
    backgroundColor: 'rgba(255, 107, 157, 0.1)',
    borderRadius: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

