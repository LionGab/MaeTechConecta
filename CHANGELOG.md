# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2024-01-XX

### ✨ Adicionado

#### Onboarding
- Tela de boas-vindas personalizada com logo
- Fluxo de onboarding em 4 etapas
- Coleta de informações: nome, tipo (gestante/mãe/tentante)
- Seleção de semana de gravidez com slider
- Seleção de preferências de interesse
- Salvamento automático no Supabase

#### Chat Conversacional
- Interface estilo WhatsApp com Gifted Chat
- Integração com Claude 3.5 Sonnet
- System prompt empático e personalizado
- Histórico completo de conversas (user + assistant)
- Detecção de keywords de urgência
- Alertas de emergência para sintomas críticos
- Disclaimer médico em todas as respostas
- Temperatura 0.4 para evitar alucinações

#### Plano Diário
- Geração automática por GPT-4
- Prioridades personalizadas
- Dica do dia empática
- Receitas econômicas e saudáveis
- Salvamento no Supabase
- Visualização por data

#### Perfil e Configurações
- Visualização de perfil do usuário
- Estatísticas (dias no app, interações)
- Exibição de preferências selecionadas
- Configurações básicas
- Logout seguro

#### Freemium
- Sistema de limites por assinatura
- Contador de interações diárias
- Limite Free: 10 interações/dia
- Premium: Ilimitado
- Reset automático por dia

#### UI/UX
- Design empático e humanizado
- Paleta de cores suave (rosa #FFE5F1, #E91E63)
- Logo personalizado
- Botão de emergência vermelho
- Navegação intuitiva
- Componentes reutilizáveis

#### Backend
- Integração completa com Supabase
- Autenticação anônima
- Tabelas: user_profiles, chat_messages, daily_plans
- Row Level Security (RLS) configurado
- Triggers automáticos

### 🔧 Corrigido

- Histórico de chat agora exibe mensagens completas (user + assistant)
- IDs únicos para mensagens do chat
- Ordem cronológica correta das mensagens
- Timestamps ajustados para ordem visual

### 📝 Documentação

- README.md completo
- SETUP.md com guia passo a passo
- FEATURES.md listando funcionalidades
- PROJECT_SUMMARY.md com status do projeto
- ASSETS_INSTRUCTIONS.md
- CHAT_HISTORY_FIX.md
- CONTRIBUTING.md
- Templates de Issue e PR

### 🔐 Segurança

- Disclaimer médico em todas as respostas
- Sempre encaminhamento para médico
- Temperatura baixa (0.4) para evitar alucinações
- Nenhum diagnóstico médico
- Logs auditáveis

---

## Tipos de Mudança

- **✨ Adicionado** para novas funcionalidades
- **🔧 Corrigido** para correções de bugs
- **📝 Documentação** para mudanças na documentação
- **💎 Melhorado** para melhorias de código
- **🔐 Segurança** para questões de segurança
- **⚡ Performance** para melhorias de performance
- **🗑️ Removido** para funcionalidades removidas
- **🔄 Alterado** para mudanças que quebram compatibilidade

