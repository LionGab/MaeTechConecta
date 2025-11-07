/**
 * PorQueIssoModal Component
 * Modal de transparência: mostra o motivo do plano
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SPACING_DEFAULTS = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

const PRIORITY_LABELS: Record<string, string> = {
  alert: '🆘 Alerta crítico',
  stress: '💆‍♀️ Gerenciamento de stress',
  support: '🤝 Construção de apoio',
  belonging: '💕 Pertencimento e comunidade',
  habit: '🍼 Hábitos saudáveis',
};

const TAG_LABELS: Record<string, string> = {
  tag_father_absent: 'Você mencionou que o pai é ausente',
  tag_lonely: 'Você sinalizou sentir solidão',
  tag_single_mom: 'Você é mãe solo',
  support_low: 'Você tem pouco apoio prático',
  stress_high: 'Seu nível de stress está alto',
  sleep_low: 'Sua qualidade de sono está baixa',
  pp_intrusive: 'Detectamos pensamentos intrusivos (busque ajuda)',
  harm_thoughts: 'Detectamos pensamentos de auto-dano (busque ajuda)',
};

export interface PorQueIssoModalProps {
  /** Visibilidade do modal */
  visible: boolean;
  /** Callback para fechar o modal */
  onClose: () => void;
  /** Rationale do plano */
  rationale?: {
    priority: string;
    tags: string[];
    scores: Record<string, number>;
    reasons: Record<string, string>;
  };
  /** Callback quando clicar em "Diminuir lembretes" */
  onDecreaseFrequency?: () => void;
}

/**
 * Modal "Por que estou vendo isso?"
 *
 * @example
 * <PorQueIssoModal
 *   visible={modalVisible}
 *   onClose={() => setModalVisible(false)}
 *   rationale={plan.rationale}
 *   onDecreaseFrequency={handleDecreaseFrequency}
 * />
 */
const PorQueIssoModalComponent: React.FC<PorQueIssoModalProps> = ({
  visible,
  onClose,
  rationale,
  onDecreaseFrequency,
}) => {
  const { theme: currentTheme, colors } = useTheme();

  // Mapear escalas de espaçamento e tipografia com fallback
  const spacingScale = (currentTheme.spacing ?? {}) as Record<string, number>;
  const spacingValues = {
    xs: spacingScale.xs ?? SPACING_DEFAULTS.xs,
    sm: spacingScale.sm ?? SPACING_DEFAULTS.sm,
    md: spacingScale.md ?? SPACING_DEFAULTS.md,
    lg: spacingScale.lg ?? SPACING_DEFAULTS.lg,
    xl: spacingScale.xl ?? SPACING_DEFAULTS.xl,
  };
  const { xs, sm, md, lg } = spacingValues;
  const typographyScale = currentTheme.typography as {
    sizes?: Record<string, number>;
    weights?: Record<string, string>;
  };
  const borderRadiusScale = (currentTheme.borderRadius ?? {}) as Record<string, number>;
  const themeColorScale = (currentTheme.colors ?? {}) as Record<string, string>;

  const headingFontSize = typographyScale?.sizes?.xl ?? 20;
  const headingFontWeight = (typographyScale?.weights?.semibold ?? '600') as '600';
  const bodyFontSize = typographyScale?.sizes?.base ?? 16;
  const secondaryBodyFontSize = typographyScale?.sizes?.sm ?? 14;
  const captionFontSize = typographyScale?.sizes?.xs ?? 12;
  const buttonFontSize = typographyScale?.sizes?.base ?? 16;
  const buttonFontWeight = (typographyScale?.weights?.semibold ?? '600') as '600';

  const borderRadiusMd = borderRadiusScale.md ?? 16;
  const borderRadiusXl = borderRadiusScale.xl ?? 32;

  const textColor = colors.foreground ?? themeColorScale.foreground ?? '#1A1A1A';
  const secondaryTextColor = colors.mutedForeground ?? themeColorScale.mutedForeground ?? textColor;
  const surfaceColor = themeColorScale.surface ?? colors.card ?? '#FFFFFF';
  const backgroundColor = colors.background ?? themeColorScale.background ?? '#FFFFFF';
  const primaryColor = colors.primary ?? themeColorScale.primary ?? '#000000';
  const onPrimaryColor = colors.primaryForeground ?? themeColorScale.primaryForeground ?? '#FFFFFF';

  // Tradução de prioridades
  const priorityLabels = PRIORITY_LABELS;

  // Tradução de tags
  const tagLabels = TAG_LABELS;

  // Renderizar motivos
  const renderReasons = useCallback(() => {
    if (!rationale) {
      return null;
    }

    const { tags, scores, reasons } = rationale;

    return (
      <View style={{ marginTop: md }}>
        {/* Tags detectadas */}
        {tags && tags.length > 0 && (
          <View style={{ marginBottom: lg }}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: textColor,
                  fontSize: headingFontSize,
                  fontWeight: headingFontWeight,
                  marginBottom: sm,
                },
              ]}
            >
              O que percebemos:
            </Text>
            {tags.map((tag) => (
              <Text
                key={tag}
                style={[
                  styles.reasonItem,
                  {
                    color: textColor,
                    fontSize: bodyFontSize,
                    marginBottom: xs,
                  },
                ]}
              >
                • {tagLabels[tag] || tag}
              </Text>
            ))}
          </View>
        )}

        {/* Scores (se relevantes) */}
        {scores && Object.keys(scores).length > 0 && (
          <View style={{ marginBottom: lg }}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: textColor,
                  fontSize: headingFontSize,
                  fontWeight: headingFontWeight,
                  marginBottom: sm,
                },
              ]}
            >
              Seus indicadores:
            </Text>
            {scores.stress_score !== undefined && (
              <Text
                style={[
                  styles.reasonItem,
                  {
                    color: textColor,
                    fontSize: bodyFontSize,
                    marginBottom: xs,
                  },
                ]}
              >
                • Stress: {scores.stress_score}/100 {scores.stress_score > 70 && '⚠️'}
              </Text>
            )}
            {scores.support_score !== undefined && (
              <Text
                style={[
                  styles.reasonItem,
                  {
                    color: textColor,
                    fontSize: bodyFontSize,
                    marginBottom: xs,
                  },
                ]}
              >
                • Apoio: {scores.support_score}/100 {scores.support_score < 40 && '⚠️'}
              </Text>
            )}
            {scores.sleep_quality !== undefined && (
              <Text
                style={[
                  styles.reasonItem,
                  {
                    color: textColor,
                    fontSize: bodyFontSize,
                    marginBottom: xs,
                  },
                ]}
              >
                • Sono: {scores.sleep_quality}/100 {scores.sleep_quality < 50 && '⚠️'}
              </Text>
            )}
          </View>
        )}

        {/* Motivos adicionais */}
        {reasons && Object.keys(reasons).length > 0 && (
          <View style={{ marginBottom: lg }}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: textColor,
                  fontSize: headingFontSize,
                  fontWeight: headingFontWeight,
                  marginBottom: sm,
                },
              ]}
            >
              Por isso:
            </Text>
            {Object.entries(reasons).map(([key, value]) => (
              <Text
                key={key}
                style={[
                  styles.reasonItem,
                  {
                    color: textColor,
                    fontSize: bodyFontSize,
                    marginBottom: xs,
                  },
                ]}
              >
                • {value}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }, [rationale, textColor, headingFontSize, headingFontWeight, bodyFontSize, md, lg, sm, xs, tagLabels]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor,
              borderTopLeftRadius: borderRadiusXl,
              borderTopRightRadius: borderRadiusXl,
              padding: lg,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {
                  color: textColor,
                  fontSize: typographyScale?.sizes?.lg ?? 18,
                  fontWeight: headingFontWeight,
                },
              ]}
            >
              Por que estou vendo isso?
            </Text>
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={false} style={[styles.content, { marginTop: md }]}>
            {/* Prioridade */}
            {rationale && (
              <View
                style={[
                  styles.priorityBadge,
                  {
                    backgroundColor: surfaceColor,
                    borderRadius: borderRadiusMd,
                    padding: md,
                    marginBottom: lg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    {
                      color: textColor,
                      fontSize: bodyFontSize,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {priorityLabels[rationale.priority] || rationale.priority}
                </Text>
              </View>
            )}

            {/* Explicação */}
            <Text
              style={[
                styles.explanation,
                {
                  color: secondaryTextColor,
                  fontSize: secondaryBodyFontSize,
                  marginBottom: md,
                  lineHeight: 20,
                },
              ]}
            >
              Personalizamos seu plano com base no seu comportamento dos últimos 14 dias. Tudo que você compartilha nos
              ajuda a te acompanhar melhor. 💕
            </Text>

            {/* Motivos */}
            {renderReasons()}

            {/* Aviso */}
            <View
              style={[
                styles.disclaimer,
                {
                  backgroundColor: surfaceColor,
                  borderRadius: borderRadiusMd,
                  padding: md,
                  marginTop: lg,
                },
              ]}
            >
              <Text
                style={[
                  styles.disclaimerText,
                  {
                    color: secondaryTextColor,
                    fontSize: captionFontSize,
                    lineHeight: 16,
                  },
                ]}
              >
                ⚠️ Este plano não substitui aconselhamento médico ou psicológico. Se você está em crise, busque ajuda
                profissional imediatamente.
              </Text>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={[styles.footer, { marginTop: lg }]}>
            {/* Botão "Diminuir lembretes" */}
            {onDecreaseFrequency && (
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  {
                    borderColor: primaryColor,
                    borderWidth: 1,
                    borderRadius: borderRadiusMd,
                    paddingVertical: sm,
                    paddingHorizontal: md,
                    marginBottom: sm,
                  },
                ]}
                onPress={onDecreaseFrequency}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Diminuir lembretes"
              >
                <Text
                  style={[
                    styles.secondaryButtonText,
                    {
                      color: primaryColor,
                      fontSize: buttonFontSize,
                      fontWeight: buttonFontWeight,
                    },
                  ]}
                >
                  Diminuir lembretes
                </Text>
              </TouchableOpacity>
            )}

            {/* Botão "Entendi" */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                {
                  backgroundColor: primaryColor,
                  borderRadius: borderRadiusMd,
                  paddingVertical: md,
                  minHeight: 48,
                },
              ]}
              onPress={onClose}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Entendi"
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    color: onPrimaryColor,
                    fontSize: buttonFontSize,
                    fontWeight: buttonFontWeight,
                  },
                ]}
              >
                Entendi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const PorQueIssoModal = React.memo(PorQueIssoModalComponent);
PorQueIssoModal.displayName = 'PorQueIssoModal';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    maxHeight: SCREEN_HEIGHT * 0.85,
  },
  header: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  content: {
    flexGrow: 0,
  },
  priorityBadge: {
    alignItems: 'center',
  },
  priorityText: {
    textAlign: 'center',
  },
  explanation: {
    textAlign: 'left',
  },
  sectionTitle: {
    // Handled inline
  },
  reasonItem: {
    // Handled inline
  },
  disclaimer: {
    // Handled inline
  },
  disclaimerText: {
    textAlign: 'left',
  },
  footer: {
    // Handled inline
  },
  secondaryButton: {
    alignItems: 'center',
  },
  secondaryButtonText: {
    // Handled inline
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    // Handled inline
  },
});
