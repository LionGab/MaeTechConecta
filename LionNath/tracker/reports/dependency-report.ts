import { DependencyReport } from '../analyzers/dependency-tracker';
import { MarkdownGenerator } from './markdown-generator';

/**
 * Gerador de relatório de dependências
 */
export class DependencyReportGenerator {
  private markdownGenerator: MarkdownGenerator;

  constructor() {
    this.markdownGenerator = new MarkdownGenerator();
  }

  /**
   * Gera relatório de dependências
   */
  generateReport(dependencies: DependencyReport): string {
    let markdown = '# 📦 Relatório de Dependências\n\n';
    markdown += `**Data**: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    markdown += '## Resumo\n\n';
    markdown += `- **Total de Dependências**: ${dependencies.allDependencies.length}\n`;
    markdown += `- **Únicas**: ${dependencies.uniqueDependencies.length}\n`;
    markdown += `- **Compatíveis com React Native**: ${dependencies.reactNativeCompatible.length}\n`;
    markdown += `- **Incompatíveis**: ${dependencies.reactNativeIncompatible.length}\n`;
    markdown += `- **Conflitos de Versão**: ${dependencies.conflictingVersions.length}\n\n`;

    markdown += '---\n\n';

    // Dependências compatíveis
    markdown += '## ✅ Compatíveis com React Native\n\n';
    markdown += this.generateCompatibleDependencies(dependencies.reactNativeCompatible);

    markdown += '\n---\n\n';

    // Dependências incompatíveis
    markdown += '## ⚠️ Incompatíveis (com Alternativas)\n\n';
    markdown += this.generateIncompatibleDependencies(dependencies.reactNativeIncompatible);

    markdown += '\n---\n\n';

    // Conflitos
    if (dependencies.conflictingVersions.length > 0) {
      markdown += '## 🔄 Conflitos de Versão\n\n';
      markdown += this.generateConflicts(dependencies.conflictingVersions);
      markdown += '\n---\n\n';
    }

    // Recomendações
    markdown += '## 🎯 Recomendações\n\n';
    markdown += this.generateRecommendations(dependencies);

    return markdown;
  }

  private generateCompatibleDependencies(deps: DependencyReport['reactNativeCompatible']): string {
    let section = '### Dependências Principais\n\n';

    // Agrupa por categoria
    const categories: Record<string, typeof deps> = {
      'React/React Native': [],
      Expo: [],
      Supabase: [],
      'IA (Gemini)': [],
      'State Management': [],
      'Forms/Validation': [],
      'UI/Icons': [],
      Outras: [],
    };

    for (const dep of deps) {
      if (dep.name.includes('react') || dep.name.includes('react-native')) {
        categories['React/React Native'].push(dep);
      } else if (dep.name.includes('expo')) {
        categories['Expo'].push(dep);
      } else if (dep.name.includes('supabase')) {
        categories['Supabase'].push(dep);
      } else if (dep.name.includes('gemini') || dep.name.includes('generative-ai')) {
        categories['IA (Gemini)'].push(dep);
      } else if (dep.name.includes('query') || dep.name.includes('zustand') || dep.name.includes('redux')) {
        categories['State Management'].push(dep);
      } else if (dep.name.includes('form') || dep.name.includes('zod')) {
        categories['Forms/Validation'].push(dep);
      } else if (dep.name.includes('lucide') || dep.name.includes('ui')) {
        categories['UI/Icons'].push(dep);
      } else {
        categories['Outras'].push(dep);
      }
    }

    for (const [category, categoryDeps] of Object.entries(categories)) {
      if (categoryDeps.length > 0) {
        section += `#### ${category}\n\n`;
        for (const dep of categoryDeps) {
          section += `- \`${dep.name}\` (${dep.version})\n`;
          if (dep.notes) {
            section += `  - ${dep.notes}\n`;
          }
        }
        section += '\n';
      }
    }

    return section;
  }

  private generateIncompatibleDependencies(deps: DependencyReport['reactNativeIncompatible']): string {
    let section = '';

    const withAlternatives = deps.filter((d) => d.reactNativeAlternative);
    const withoutAlternatives = deps.filter((d) => !d.reactNativeAlternative);

    if (withAlternatives.length > 0) {
      section += '### Com Alternativas\n\n';
      for (const dep of withAlternatives) {
        section += `- \`${dep.name}\` → \`${dep.reactNativeAlternative}\`\n`;
        if (dep.notes) {
          section += `  - ${dep.notes}\n`;
        }
      }
      section += '\n';
    }

    if (withoutAlternatives.length > 0) {
      section += '### Sem Alternativas (Não Usar)\n\n';
      for (const dep of withoutAlternatives) {
        section += `- \`${dep.name}\` - ${dep.notes || 'Não compatível com React Native'}\n`;
      }
      section += '\n';
    }

    return section;
  }

  private generateConflicts(conflicts: DependencyReport['conflictingVersions']): string {
    let section = '';

    for (const conflict of conflicts) {
      section += `- \`${conflict.name}\`\n`;
      section += `  - ${conflict.notes}\n`;
      section += `  - Projetos: ${conflict.projects.join(', ')}\n`;
      section += '\n';
    }

    return section;
  }

  private generateRecommendations(dependencies: DependencyReport): string {
    let recommendations = '### Dependências Recomendadas para React Native\n\n';
    recommendations += '```json\n';
    recommendations += '{\n';
    recommendations += '  "dependencies": {\n';
    recommendations += '    "@google/generative-ai": "latest",\n';
    recommendations += '    "@supabase/supabase-js": "latest",\n';
    recommendations += '    "@tanstack/react-query": "latest",\n';
    recommendations += '    "react-hook-form": "latest",\n';
    recommendations += '    "zod": "latest",\n';
    recommendations += '    "nativewind": "latest",\n';
    recommendations += '    "lucide-react-native": "latest",\n';
    recommendations += '    "date-fns": "latest"\n';
    recommendations += '  }\n';
    recommendations += '}\n';
    recommendations += '```\n\n';

    recommendations += '### ⚠️ Dependências a Evitar\n\n';
    recommendations += '- `@anthropic-ai/sdk` - Não usar (focar apenas em Gemini)\n';
    recommendations += '- `@ai-sdk/anthropic` - Não usar\n';
    recommendations += '- `@ai-sdk/openai` - Não usar\n';
    recommendations += '- `openai` - Não usar\n';
    recommendations += '- `next` - Não usar (usar Expo Router)\n';
    recommendations += '- `vite` - Não usar (usar Metro bundler)\n';
    recommendations += '- `tailwindcss` - Não usar (usar NativeWind)\n';
    recommendations += '- `react-dom` - Não usar (usar react-native)\n';

    return recommendations;
  }
}
