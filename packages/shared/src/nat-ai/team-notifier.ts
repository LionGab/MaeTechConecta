/**
 * Team Notifier - Sistema de notificação para equipe
 *
 * Notifica equipe da Natália sobre situações de alto risco
 */

export interface RiskAlert {
  userId: string;
  messageId: string;
  messageExcerpt: string;
  riskLevel: number;
  riskFlags: string[];
  userName?: string;
  userPhone?: string;
}

/**
 * Gera payload de notificação para webhook
 */
export function generateWebhookPayload(alert: RiskAlert & { userName?: string; userPhone?: string }): any {
  return {
    text: `🚨 ALERTA DE ALTO RISCO - NAT-AI`,
    embeds: [
      {
        title: `Usuária: ${alert.userName || 'N/A'}`,
        color: alert.riskLevel >= 9 ? 15158332 : 16776960, // Vermelho se >= 9, amarelo se 7-8
        fields: [
          {
            name: 'Nível de Risco',
            value: `${alert.riskLevel}/10`,
            inline: true,
          },
          {
            name: 'Flags',
            value: alert.riskFlags.join(', ') || 'Nenhuma',
            inline: true,
          },
          {
            name: 'Mensagem (excerpt)',
            value: alert.messageExcerpt.substring(0, 200) + '...',
            inline: false,
          },
          {
            name: 'Telefone',
            value: alert.userPhone || 'N/A',
            inline: true,
          },
          {
            name: 'User ID',
            value: alert.userId,
            inline: false,
          },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };
}
