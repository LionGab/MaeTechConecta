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

interface WebhookField {
  name: string;
  value: string;
  inline: boolean;
}

interface WebhookEmbed {
  title: string;
  color: number;
  fields: WebhookField[];
  timestamp: string;
}

interface WebhookPayload {
  text: string;
  embeds: WebhookEmbed[];
}

/**
 * Gera payload formatado para notificar a equipe via webhook (Discord/Slack)
 *
 * Cria uma mensagem estruturada com embed colorido contendo informações sobre
 * a situação de risco detectada, incluindo nível, flags, mensagem e contato.
 *
 * @param {RiskAlert & { userName?: string; userPhone?: string }} alert - Dados do alerta de risco
 * @returns {WebhookPayload} Payload formatado para envio ao webhook
 *
 * @example
 * ```typescript
 * const payload = generateWebhookPayload({
 *   userId: 'user-123',
 *   messageId: 'msg-456',
 *   messageExcerpt: 'Não aguento mais...',
 *   riskLevel: 9,
 *   riskFlags: ['suicidal_ideation'],
 *   userName: 'Maria',
 *   userPhone: '+55 11 99999-9999'
 * });
 * // Enviar para webhook: await axios.post(webhookUrl, payload);
 * ```
 */
export function generateWebhookPayload(alert: RiskAlert & { userName?: string; userPhone?: string }): WebhookPayload {
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

