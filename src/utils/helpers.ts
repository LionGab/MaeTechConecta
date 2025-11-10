// Funções auxiliares

export const formatPregnancyWeek = (week: number): string => {
  if (week <= 12) return '1º Trimestre';
  if (week <= 27) return '2º Trimestre';
  return '3º Trimestre';
};

export const getPregnancyStage = (week: number): string => {
  if (week <= 8) return 'Embrião';
  if (week <= 13) return 'Feto inicial';
  if (week <= 20) return 'Feto médio';
  if (week <= 27) return 'Feto avançado';
  if (week <= 36) return 'Bebê quase pronto';
  return 'Bebê pronto para nascer!';
};

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export const getRandomGreeting = (): string => {
  const greetings = [
    'Oi! Como posso te ajudar? 💕',
    'Olá! O que precisa hoje? 😊',
    'Oi! Vamos conversar? 💬',
    'Olá! Pronta para mais um dia? 🌟',
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
};

export const debounce = (func: Function, wait: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

