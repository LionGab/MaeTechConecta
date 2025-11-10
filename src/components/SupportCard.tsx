import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';

import { useTheme } from '@/contexts/ThemeContext';

export interface SupportCardProps {
  author: string;
  message: string;
  avatarUri?: string;
  onPressShare?: () => void;
  onPressSave?: () => void;
  supportLevel?: 'inspirational' | 'practical' | 'celebration';
  style?: ViewStyle;
}

const SUPPORT_LEVEL_HINT: Record<NonNullable<SupportCardProps['supportLevel']>, string> = {
  inspirational: 'Mensagem para levantar o ânimo',
  practical: 'Dica prática para atravessar o dia',
  celebration: 'Celebração de uma conquista recente',
};

export const SupportCard: React.FC<SupportCardProps> = React.memo(
  ({ author, message, avatarUri, onPressSave, onPressShare, supportLevel = 'inspirational', style }) => {
    const { colors, spacing, borderRadius, typography } = useTheme();

    const containerStyle = useMemo(
      () => [
        styles.container,
        {
          backgroundColor: colors.surface ?? colors.card,
          borderColor: colors.border,
          padding: spacing.lg,
          borderRadius: borderRadius.md,
        },
      ],
      [borderRadius.md, colors.border, colors.card, colors.surface, spacing.lg]
    );

    const badgeStyle = useMemo(
      () => [
        styles.badge,
        {
          backgroundColor: colors.secondary,
          borderRadius: borderRadius.sm,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
        },
      ],
      [borderRadius.sm, colors.secondary, spacing.sm, spacing.xs]
    );

    const handleShare = useCallback(() => {
      if (!onPressShare) return;
      console.log('SupportCard:onPressShare', { author });
      onPressShare();
    }, [author, onPressShare]);

    const handleSave = useCallback(() => {
      if (!onPressSave) return;
      console.log('SupportCard:onPressSave', { author });
      onPressSave();
    }, [author, onPressSave]);

    return (
      <View style={[containerStyle, style]} accessibilityLabel={`Mensagem de ${author}`}>
        <View style={styles.header}>
          {avatarUri ? (
            <Image
              source={{ uri: avatarUri }}
              style={[styles.avatar, { borderRadius: borderRadius.sm }]}
              accessibilityRole="image"
              accessibilityLabel={`Foto de ${author}`}
            />
          ) : (
            <View
              style={[
                styles.initials,
                {
                  borderRadius: borderRadius.sm,
                  backgroundColor: colors.secondary,
                },
              ]}
              accessibilityElementsHidden
            >
              <Text style={[typography.subtitle, { color: colors.secondaryForeground }]}>
                {author.slice(0, 2).toUpperCase()}
              </Text>
            </View>
          )}

          <View style={styles.authorBlock}>
            <Text style={[typography.subtitle, { color: colors.textPrimary ?? colors.foreground }]}>{author}</Text>
            <Text style={[typography.caption, { color: colors.textSecondary ?? colors.mutedForeground }]}>
              {SUPPORT_LEVEL_HINT[supportLevel]}
            </Text>
          </View>
        </View>

        <Text
          style={[typography.body, styles.message, { color: colors.textPrimary ?? colors.foreground }]}
          accessibilityRole="text"
          accessibilityHint="Mensagem de apoio"
        >
          {message}
        </Text>

        <View style={styles.footer}>
          <View style={badgeStyle}>
            <Text style={[typography.caption, { color: colors.secondaryForeground }]}>Você é forte</Text>
          </View>

          <View style={styles.actions}>
            {onPressShare ? (
              <TouchableOpacity
                onPress={handleShare}
                accessibilityRole="button"
                accessibilityLabel="Compartilhar mensagem"
                accessibilityHint="Abre as opções para enviar apoio"
                style={styles.footerButton}
                activeOpacity={0.88}
              >
                <Text style={[typography.button, { color: colors.primary }]}>Compartilhar</Text>
              </TouchableOpacity>
            ) : null}

            {onPressSave ? (
              <TouchableOpacity
                onPress={handleSave}
                accessibilityRole="button"
                accessibilityLabel="Salvar mensagem"
                accessibilityHint="Mantém essa mensagem favorita"
                style={styles.footerButton}
                activeOpacity={0.88}
              >
                <Text style={[typography.button, { color: colors.primary }]}>Salvar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    );
  }
);

SupportCard.displayName = 'SupportCard';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  initials: {
    width: 48,
    height: 48,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorBlock: {
    flex: 1,
  },
  message: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  badge: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  footerButton: {
    marginLeft: 12,
  },
});

export default SupportCard;

