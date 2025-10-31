/**
 * Team Notifier - Sistema de notificação para equipe
 *
 * Notifica equipe da Natália sobre situações de alto risco
 */

import { supabase } from '../../services/supabase';

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
 * Notifica equipe sobre situação de alto risco
 */
export async function notifyTeam(alert: RiskAlert): Promise<void> {
  try {
    // 1. Salvar alerta no banco para auditoria
    await saveAlertLog(alert);

    // 2. Buscar informações do usuário
    const userInfo = await getUserInfo(alert.userId);
    if (!userInfo) {
      console.error('Usuário não encontrado para alerta:', alert.userId);
      return;
    }

    // 3. Enviar para webhook (Slack/Discord)
    const webhookUrl = process.env.EXPO_PUBLIC_TEAM_WEBHOOK_URL;
    if (webhookUrl) {
      await sendWebhookNotification(webhookUrl, {
        ...alert,
        userName: userInfo.full_name,
        userPhone: userInfo.phone,
      });
    }

    // 4. Email para equipe de moderação (via Supabase Edge Function)
    // Isso seria feito por uma Edge Function separada ou serviço de email
    console.log('Alerta de alto risco:', {
      userId: alert.userId,
      userName: userInfo.full_name,
      riskLevel: alert.riskLevel,
      flags: alert.riskFlags,
    });
  } catch (error) {
    console.error('Erro ao notificar equipe:', error);
    // Não falhar silenciosamente - log estruturado
  }
}

/**
 * Salva log de alerta no banco
 */
async function saveAlertLog(alert: RiskAlert): Promise<void> {
  try {
    const { error } = await supabase.from('alert_logs').insert({
      user_id: alert.userId,
      message_id: alert.messageId,
      risk_level: alert.riskLevel,
      risk_flags: alert.riskFlags,
      notified_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Erro ao salvar alert_log:', error);
    }
  } catch (error) {
    console.error('Erro ao salvar alerta:', error);
  }
}

/**
 * Busca informações do usuário
 */
async function getUserInfo(userId: string): Promise<{ full_name: string; phone?: string } | null> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('full_name, phone')
      .eq('id', userId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      full_name: data.full_name || 'Usuária',
      phone: data.phone || undefined,
    };
  } catch (error) {
    console.error('Erro ao buscar informações do usuário:', error);
    return null;
  }
}

/**
 * Envia notificação para webhook (Slack/Discord)
 */
async function sendWebhookNotification(webhookUrl: string, alert: RiskAlert & { userName?: string; userPhone?: string }): Promise<void> {
  try {
    const payload = {
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

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Erro ao enviar webhook:', error);
  }
}
