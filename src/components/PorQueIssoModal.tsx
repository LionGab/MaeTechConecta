/**
 * PorQueIssoModal Component
 * Modal de transparência: mostra o motivo do plano
 */

import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
export const PorQueIssoModal: React.FC<PorQueIssoModalProps> = React.memo(
  ({ visible, onClose, rationale, onDecreaseFrequency }) => {
    const theme = useTheme();

    // Tradução de prioridades
    const priorityLabels: Record<string, string> = {
      alert: '🆘 Alerta crítico',
      stress: '💆‍♀️ Gerenciamento de stress',
      support: '🤝 Construção de apoio',
      belonging: '💕 Pertencimento e comunidade',
      habit: '🍼 Hábitos saudáveis',
    };

    // Tradução de tags
    const tagLabels: Record<string, string> = {
      tag_father_absent: 'Você mencionou que o pai é ausente',
      tag_lonely: 'Você sinalizou sentir solidão',
      tag_single_mom: 'Você é mãe solo',
      support_low: 'Você tem pouco apoio prático',
      stress_high: 'Seu nível de stress está alto',
      sleep_low: 'Sua qualidade de sono está baixa',
      pp_intrusive: 'Detectamos pensamentos intrusivos (busque ajuda)',
      harm_thoughts: 'Detectamos pensamentos de auto-dano (busque ajuda)',
    };

    // Renderizar motivos
    const renderReasons = useCallback(() => {
      if (!rationale) return null;

      const { tags, scores, reasons } = rationale;

      return (
        <View style={{ marginTop: theme.spacing.md }}>
          {/* Tags detectadas */}
          {tags && tags.length > 0 && (
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: theme.typography.h6.fontWeight,
                    marginBottom: theme.spacing.sm,
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
                      color: theme.colors.text,
                      fontSize: theme.typography.body1.fontSize,
                      marginBottom: theme.spacing.xs,
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
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: theme.typography.h6.fontWeight,
                    marginBottom: theme.spacing.sm,
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
                      color: theme.colors.text,
                      fontSize: theme.typography.body1.fontSize,
                      marginBottom: theme.spacing.xs,
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
                      color: theme.colors.text,
                      fontSize: theme.typography.body1.fontSize,
                      marginBottom: theme.spacing.xs,
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
                      color: theme.colors.text,
                      fontSize: theme.typography.body1.fontSize,
                      marginBottom: theme.spacing.xs,
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
            <View style={{ marginBottom: theme.spacing.lg }}>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.h6.fontSize,
                    fontWeight: theme.typography.h6.fontWeight,
                    marginBottom: theme.spacing.sm,
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
                      color: theme.colors.text,
                      fontSize: theme.typography.body1.fontSize,
                      marginBottom: theme.spacing.xs,
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
    }, [rationale, theme]);

    return (
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.colors.background,
                borderTopLeftRadius: theme.borderRadius.xl,
                borderTopRightRadius: theme.borderRadius.xl,
                padding: theme.spacing.lg,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.h5.fontSize,
                    fontWeight: theme.typography.h5.fontWeight,
                  },
                ]}
              >
                Por que estou vendo isso?
              </Text>
            </View>

            {/* Content */}
            <ScrollView showsVerticalScrollIndicator={false} style={[styles.content, { marginTop: theme.spacing.md }]}>
              {/* Prioridade */}
              {rationale && (
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor: theme.colors.surface,
                      borderRadius: theme.borderRadius.md,
                      padding: theme.spacing.md,
                      marginBottom: theme.spacing.lg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.body1.fontSize,
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
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.body2.fontSize,
                    marginBottom: theme.spacing.md,
                    lineHeight: 20,
                  },
                ]}
              >
                Personalizamos seu plano com base no seu comportamento dos últimos 14 dias. Tudo que você compartilha
                nos ajuda a te acompanhar melhor. 💕
              </Text>

              {/* Motivos */}
              {renderReasons()}

              {/* Aviso */}
              <View
                style={[
                  styles.disclaimer,
                  {
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.borderRadius.md,
                    padding: theme.spacing.md,
                    marginTop: theme.spacing.lg,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.disclaimerText,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.caption.fontSize,
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
            <View style={[styles.footer, { marginTop: theme.spacing.lg }]}>
              {/* Botão "Diminuir lembretes" */}
              {onDecreaseFrequency && (
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    {
                      borderColor: theme.colors.primary,
                      borderWidth: 1,
                      borderRadius: theme.borderRadius.md,
                      paddingVertical: theme.spacing.sm,
                      paddingHorizontal: theme.spacing.md,
                      marginBottom: theme.spacing.sm,
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
                        color: theme.colors.primary,
                        fontSize: theme.typography.button.fontSize,
                        fontWeight: theme.typography.button.fontWeight,
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
                    backgroundColor: theme.colors.primary,
                    borderRadius: theme.borderRadius.md,
                    paddingVertical: theme.spacing.md,
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
                      color: theme.colors.onPrimary,
                      fontSize: theme.typography.button.fontSize,
                      fontWeight: theme.typography.button.fontWeight,
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
  }
);

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
