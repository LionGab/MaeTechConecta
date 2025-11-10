/**
 * PlanoDoDia Component
 * Exibe o plano do dia com 3 itens personalizados
 */

import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import useThemeStyles from '@/shared/hooks/useThemeStyles';
import { PlanItem } from '@/services/personalization';

export interface PlanoDoDiaProps {
  /** Itens do plano (3 cards) */
  items: PlanItem[];
  /** Rationale (motivo) do plano */
  rationale?: {
    priority: string;
    tags: string[];
    scores: Record<string, number>;
    reasons: Record<string, string>;
  };
  /** Callback quando clicar em "Por que isso?" */
  onWhyThisPressed?: () => void;
  /** Callback quando clicar em CTA de um item */
  onItemCtaPressed?: (item: PlanItem) => void;
  /** Loading state */
  isLoading?: boolean;
}

/**
 * Componente Plano do Dia
 *
 * @example
 * <PlanoDoDia
 *   items={plan.items}
 *   rationale={plan.rationale}
 *   onWhyThisPressed={() => setModalVisible(true)}
 *   onItemCtaPressed={(item) => handleCta(item)}
 * />
 */
export const PlanoDoDia: React.FC<PlanoDoDiaProps> = React.memo(
  ({ items, rationale, onWhyThisPressed, onItemCtaPressed, isLoading = false }) => {
    const { color, space, radius, text, shadow, theme } = useThemeStyles();

    const semibold = theme.typography.weights.semibold;

    const styles = useMemo(
      () =>
        StyleSheet.create({
          container: {
            flex: 1,
          },
          loadingContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: space('lg'),
          },
          loadingText: {
            ...text('bodySmall', { color: color('textSecondary') }),
            textAlign: 'center',
            marginTop: space('md'),
          },
          emptyContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: space('lg'),
          },
          emptyIcon: {
            opacity: 0.5,
            fontSize: 48,
          },
          emptyText: {
            ...text('body', { color: color('textSecondary') }),
            textAlign: 'center',
            marginTop: space('md'),
          },
          tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: space('sm'),
            marginBottom: space('md'),
          },
          tagChip: {
            paddingHorizontal: space('md'),
            paddingVertical: space('xs'),
            borderRadius: radius('xl'),
            borderWidth: 1,
            backgroundColor: color('muted'),
            borderColor: color('primary'),
          },
          tagText: {
            ...text('bodySmall', {
              color: color('primary'),
              fontWeight: semibold,
            }),
          },
          itemCard: {
            backgroundColor: color('card'),
            borderRadius: radius('lg'),
            padding: space('md'),
            marginBottom: space('md'),
            ...shadow('md'),
          },
          itemHeader: {
            flexDirection: 'row',
            alignItems: 'center',
          },
          itemIcon: {
            fontSize: 24,
          },
          itemTime: {
            ...text('bodySmall', {
              color: color('textSecondary'),
              fontWeight: theme.typography.weights.semibold,
            }),
            marginLeft: space('sm'),
          },
          itemMessage: {
            ...text('body'),
            marginTop: space('sm'),
          },
          ctaButton: {
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 44,
            backgroundColor: color('primary'),
            borderRadius: radius('md'),
            paddingVertical: space('sm'),
            paddingHorizontal: space('md'),
            marginTop: space('md'),
          },
          ctaText: {
            ...text('button', {
              color: color('textOnPrimary'),
              fontWeight: semibold,
            }),
          },
          whyThisButton: {
            alignSelf: 'flex-start',
            marginTop: space('sm'),
          },
          whyThisText: {
            ...text('caption', { color: color('primary') }),
            textDecorationLine: 'underline',
          },
          scrollContent: {
            paddingBottom: space('lg'),
          },
        }),
      [color, radius, shadow, semibold, space, text]
    );

    // Ícones por tipo
    const iconByType = useMemo(
      () => ({
        'check-in': '🌅',
        content: '📖',
        habit: '🍼',
        alert: '🆘',
        closure: '🌙',
      }),
      []
    );

    // Ordenar itens por horário
    const sortedItems = useMemo(() => {
      return [...items].sort((a, b) => a.scheduled_at.localeCompare(b.scheduled_at));
    }, [items]);

    // Renderizar chip de tag
    const renderTag = useCallback(
      (tag: string) => {
        const tagLabels: Record<string, string> = {
          tag_father_absent: 'Pai ausente',
          tag_lonely: 'Solidão',
          tag_single_mom: 'Mãe solo',
          support_low: 'Apoio baixo',
          stress_high: 'Stress alto',
          sleep_low: 'Sono ruim',
          pp_intrusive: 'Alerta',
        };

        const label = tagLabels[tag] || tag;

        return (
          <View key={tag} style={styles.tagChip}>
            <Text style={styles.tagText}>{label}</Text>
          </View>
        );
      },
      [styles]
    );

    // Renderizar card de item
    const renderItem = useCallback(
      (item: PlanItem, index: number) => {
        const icon = iconByType[item.type] || '✨';

        return (
          <View key={index} style={styles.itemCard}>
            {/* Horário + Tipo */}
            <View style={styles.itemHeader}>
              <Text style={styles.itemIcon}>{icon}</Text>
              <Text style={styles.itemTime}>{item.scheduled_at}</Text>
            </View>

            {/* Mensagem */}
            <Text style={styles.itemMessage}>{item.message_text}</Text>

            {/* CTA (se houver) */}
            {item.cta && (
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={() => onItemCtaPressed?.(item)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={item.cta}
              >
                <Text style={styles.ctaText}>{item.cta}</Text>
              </TouchableOpacity>
            )}

            {/* Link "Por que isso?" */}
            <TouchableOpacity
              style={styles.whyThisButton}
              onPress={onWhyThisPressed}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Por que estou vendo isso?"
            >
              <Text style={styles.whyThisText}>Por que estou vendo isso?</Text>
            </TouchableOpacity>
          </View>
        );
      },
      [iconByType, onItemCtaPressed, onWhyThisPressed, styles]
    );

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color('primary')} />
          <Text style={styles.loadingText}>Carregando seu plano do dia...</Text>
        </View>
      );
    }

    if (items.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📅</Text>
          <Text style={styles.emptyText}>Nenhum plano disponível para hoje</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Header com tags */}
        {rationale && rationale.tags.length > 0 && (
          <View style={styles.tagsContainer}>{rationale.tags.slice(0, 3).map(renderTag)}</View>
        )}

        {/* Itens do plano */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {sortedItems.map(renderItem)}
        </ScrollView>
      </View>
    );
  }
);
