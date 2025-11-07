/**
 * PlanoDoDia Component
 * Exibe o plano do dia com 3 itens personalizados
 */

import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { PlanItem } from '@/services/personalization';
import { colors, spacing, typography, borderRadius } from '@/theme/colors';
import { getShadowStyle } from '@/utils/platformStyles';

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
    // Note: Este componente usa os valores do tema diretamente dos imports
    // para evitar problemas de tipagem com o ThemeContext

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
    const renderTag = useCallback((tag: string) => {
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
        <View
          key={tag}
          style={[
            styles.tagChip,
            {
              backgroundColor: colors.muted,
              borderColor: colors.primary,
            },
          ]}
        >
          <Text
            style={[
              styles.tagText,
              {
                color: colors.primary,
                fontSize: typography.sizes.xs,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      );
    }, []);

    // Renderizar card de item
    const renderItem = useCallback(
      (item: PlanItem, index: number) => {
        const icon = iconByType[item.type] || '✨';

        return (
          <View
            key={index}
            style={[
              styles.itemCard,
              {
                backgroundColor: colors.card,
                borderRadius: borderRadius.lg,
                padding: spacing.md,
                marginBottom: spacing.md,
              },
            ]}
          >
            {/* Horário + Tipo */}
            <View style={styles.itemHeader}>
              <Text style={[styles.itemIcon, { fontSize: 24 }]}>{icon}</Text>
              <Text
                style={[
                  styles.itemTime,
                  {
                    color: colors.mutedForeground,
                    fontSize: typography.sizes.sm,
                    marginLeft: spacing.sm,
                  },
                ]}
              >
                {item.scheduled_at}
              </Text>
            </View>

            {/* Mensagem */}
            <Text
              style={[
                styles.itemMessage,
                {
                  color: colors.foreground,
                  fontSize: typography.sizes.base,
                  marginTop: spacing.sm,
                  lineHeight: 22,
                },
              ]}
            >
              {item.message_text}
            </Text>

            {/* CTA (se houver) */}
            {item.cta && (
              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  {
                    backgroundColor: colors.primary,
                    borderRadius: borderRadius.md,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.md,
                    marginTop: spacing.md,
                  },
                ]}
                onPress={() => onItemCtaPressed?.(item)}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={item.cta}
              >
                <Text
                  style={[
                    styles.ctaText,
                    {
                      color: colors.primaryForeground,
                      fontSize: typography.sizes.base,
                      fontWeight: typography.weights.semibold,
                    },
                  ]}
                >
                  {item.cta}
                </Text>
              </TouchableOpacity>
            )}

            {/* Link "Por que isso?" */}
            <TouchableOpacity
              style={[styles.whyThisButton, { marginTop: spacing.sm }]}
              onPress={onWhyThisPressed}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Por que estou vendo isso?"
            >
              <Text
                style={[
                  styles.whyThisText,
                  {
                    color: colors.primary,
                    fontSize: typography.sizes.xs,
                  },
                ]}
              >
                Por que estou vendo isso?
              </Text>
            </TouchableOpacity>
          </View>
        );
      },
      [iconByType, onWhyThisPressed, onItemCtaPressed]
    );

    if (isLoading) {
      return (
        <View style={[styles.loadingContainer, { padding: spacing.lg }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              {
                color: colors.mutedForeground,
                fontSize: typography.sizes.sm,
                marginTop: spacing.md,
              },
            ]}
          >
            Carregando seu plano do dia...
          </Text>
        </View>
      );
    }

    if (items.length === 0) {
      return (
        <View style={[styles.emptyContainer, { padding: spacing.lg }]}>
          <Text style={[styles.emptyIcon, { fontSize: 48 }]}>📅</Text>
          <Text
            style={[
              styles.emptyText,
              {
                color: colors.mutedForeground,
                fontSize: typography.sizes.base,
                marginTop: spacing.md,
              },
            ]}
          >
            Nenhum plano disponível para hoje
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {/* Header com tags */}
        {rationale && rationale.tags.length > 0 && (
          <View
            style={[
              styles.tagsContainer,
              {
                marginBottom: spacing.md,
                flexDirection: 'row',
                flexWrap: 'wrap',
              },
            ]}
          >
            {rationale.tags.slice(0, 3).map(renderTag)}
          </View>
        )}

        {/* Itens do plano */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.lg }}>
          {sortedItems.map(renderItem)}
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
  },
  tagsContainer: {
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '600',
  },
  itemCard: {
    ...getShadowStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    }),
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    // Emoji spacing
  },
  itemTime: {
    fontWeight: '600',
  },
  itemMessage: {
    // Line height handled inline
  },
  ctaButton: {
    alignItems: 'center',
    minHeight: 44, // iOS touch target
  },
  ctaText: {
    // Font handled inline
  },
  whyThisButton: {
    alignSelf: 'flex-start',
  },
  whyThisText: {
    textDecorationLine: 'underline',
  },
});
