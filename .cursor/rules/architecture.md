## Arquitetura do Projeto

- Separar camadas: `components/`, `screens/`, `services/`, `hooks/`, `theme/`, `utils/`.
- Serviços sem dependência de UI; componentes sem dependência direta de serviços (usar hooks/adapters).
- Manter contratos estáveis (tipos/interfaces) entre camadas.
- Isolar integrações externas em `services/` e centralizar configurações em `config/`.
- Documentar decisões arquiteturais relevantes neste arquivo.
