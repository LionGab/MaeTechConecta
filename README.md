# Nossa Maternidade by MaeTech

Uma plataforma completa de acompanhamento gestacional e apoio à maternidade, desenvolvida com tecnologias modernas e inteligência artificial.

## 🎯 Sobre o Projeto

**Nossa Maternidade** é um aplicativo PWA (Progressive Web App) desenvolvido para acompanhar gestantes durante toda a jornada da gravidez, oferecendo:

- 📊 **Acompanhamento Semanal**: Monitore cada semana da sua gestação com informações sobre o desenvolvimento do bebê
- 🤖 **NathIA**: Assistente virtual com IA especializada em maternidade e saúde gestacional
- 📝 **Registro de Sintomas**: Análise inteligente de sintomas com recomendações personalizadas
- ⏱️ **Cronômetro de Contrações**: Ferramenta essencial para saber quando ir ao hospital
- 📚 **Conteúdo Educativo**: Biblioteca organizada por trimestre com artigos e vídeos
- 📅 **Gerenciamento de Consultas**: Nunca mais perca uma consulta pré-natal
- 🎮 **Rotinas Gamificadas**: Tarefas diárias personalizadas por trimestre
- 👥 **Comunidade**: Conecte-se com outras mães na mesma fase

## 🚀 Tecnologias

### Frontend
- **Next.js 15.3.3** - Framework React com App Router
- **TypeScript 5** - Tipagem estática para maior segurança
- **Tailwind CSS** - Estilização moderna e responsiva
- **Radix UI** - Componentes acessíveis e customizáveis
- **PWA** - Instalável e funciona offline

### Backend & IA
- **Firebase 11.9.1** - Autenticação, Firestore e Hosting
- **Genkit AI** - Integração com Google Gemini 2.5 Flash
- **Google AI** - Processamento de linguagem natural para NathIA

### Recursos de IA

#### 1. NathIA - Assistente Virtual Inteligente
- Conversação contextualizada por trimestre
- Perguntas sugeridas específicas para cada fase
- Detecção de urgência médica
- Respostas em português com empatia e acolhimento

#### 2. Análise de Sintomas
- Avaliação inteligente de sintomas gestacionais
- Recomendações personalizadas por trimestre
- Detecção de sinais de alerta
- Mensagens de reasseguramento

#### 3. Geração de Rotinas Diárias
- Tarefas personalizadas por trimestre e preferências
- Consideração de nível de atividade física
- Adaptação a restrições alimentares
- Gamificação com pontos e conquistas

## 📱 Funcionalidades Principais

### Para Gestantes no 1º Trimestre (1-13 semanas)
- Rastreamento de náuseas e fadiga
- Lembretes de ácido fólico e hidratação
- Informações sobre primeiros sintomas
- Preparo para primeira ultrassom

### Para Gestantes no 2º Trimestre (14-27 semanas)
- Monitoramento de movimentos do bebê
- Exercícios seguros para gestantes
- Planejamento de chá de bebê
- Exames importantes do período

### Para Gestantes no 3º Trimestre (28-40 semanas)
- Cronômetro de contrações (Regra 5-1-1)
- Preparação da bolsa maternidade
- Exercícios para facilitar o parto
- Sinais de trabalho de parto

### Para Pós-Parto
- Dicas de amamentação
- Suporte para saúde mental
- Cuidados com o recém-nascido
- Rede de apoio

## 🎨 Design System

### Cores
- **Primária**: Lavanda Suave (#E6E6FA) - Acolhimento e tranquilidade
- **Background**: Lavanda Muito Clara (#F5F5FF) - Serenidade
- **Accent**: Rosa Pálido (#FFBCCD) - Carinho e empatia

### Tipografia
- **Headlines**: Playfair (elegante e maternal)
- **Body**: PT Sans (moderna e legível)

### Princípios
- Acessibilidade WCAG 2.1 AA
- Mobile-first design
- Ícones hand-drawn style
- Animações sutis e gentis

## 🔐 Segurança e Privacidade

- Autenticação Firebase (Google, Apple, Email)
- Firestore Security Rules implementadas
- Conformidade com LGPD
- Dados criptografados
- Sem armazenamento de informações sensíveis

## 🚀 Começando

### Pré-requisitos
```bash
Node.js 20+ 
npm ou yarn
```

### Instalação
```bash
# Clone o repositório
git clone https://github.com/LionGab/MaeTechConecta.git

# Entre no diretório
cd MaeTechConecta

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Adicione suas credenciais Firebase e Google AI

# Execute o servidor de desenvolvimento
npm run dev
```

### Build para Produção
```bash
npm run build
npm run start
```

## 📊 Status do Projeto

### ✅ Concluído
- [x] Sistema completo de tipos para tracking de gravidez
- [x] Três flows de IA especializados
- [x] NathIA com contexto de trimestre
- [x] Página de Jornada completa
- [x] Registro e análise de sintomas
- [x] Cronômetro de contrações
- [x] Navegação otimizada
- [x] Design system maternal

### 🚧 Em Desenvolvimento
- [ ] Biblioteca de conteúdo educativo completa
- [ ] Sistema de notificações push
- [ ] Integração com calendário
- [ ] Modo família compartilhado
- [ ] Teleconsulta integrada

### 📅 Roadmap
- [ ] Testes automatizados completos
- [ ] Auditoria de segurança CodeQL
- [ ] Auditoria de acessibilidade
- [ ] Otimização de performance
- [ ] Deploy em produção

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença privada. Todos os direitos reservados.

## 👥 Time

- **Desenvolvido por**: MaeTech Team
- **Inspirado por**: Nathália Valente
- **Powered by**: Google AI & Firebase

## 📞 Suporte

Para suporte, envie um email para: support@maetechconecta.com

---

**Nossa Maternidade** - Acompanhando você em cada momento especial ❤️
