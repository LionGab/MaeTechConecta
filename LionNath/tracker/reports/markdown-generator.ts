import { ProjectInfo } from '../analyzers/project-analyzer';
import { DetectedFeatures, FeatureInfo } from '../analyzers/feature-detector';
import { DependencyReport } from '../analyzers/dependency-tracker';
import { ConfigComparison } from '../analyzers/config-comparator';

/**
 * Gerador de relatórios em Markdown
 */
export class MarkdownGenerator {
  /**
   * Gera relatório completo de análise
   */
  generateAnalysisReport(
    projects: ProjectInfo[],
    features: Map<string, DetectedFeatures>,
    dependencies: DependencyReport,
    configs: ConfigComparison[]
  ): string {
    let markdown = '# 📊 Relatório de Análise Multi-Projeto\n\n';
    markdown += `**Data**: ${new Date().toLocaleDateString('pt-BR')}\n\n`;
    markdown += `**Projetos Analisados**: ${projects.length}\n\n`;

    markdown += '---\n\n';

    // Resumo executivo
    markdown += '## 📋 Resumo Executivo\n\n';
    markdown += this.generateExecutiveSummary(projects, features, dependencies);

    markdown += '\n---\n\n';

    // Análise por projeto
    markdown += '## 🏗️ Análise por Projeto\n\n';
    for (const project of projects) {
      markdown += this.generateProjectSection(project, features.get(project.name));
    }

    markdown += '\n---\n\n';

    // Features identificadas
    markdown += '## ✨ Features Identificadas\n\n';
    markdown += this.generateFeaturesSection(features);

    markdown += '\n---\n\n';

    // Dependências
    markdown += '## 📦 Dependências\n\n';
    markdown += this.generateDependenciesSection(dependencies);

    markdown += '\n---\n\n';

    // Configurações
    markdown += '## ⚙️ Configurações\n\n';
    markdown += this.generateConfigsSection(configs);

    markdown += '\n---\n\n';

    // Recomendações
    markdown += '## 🎯 Recomendações para React Native\n\n';
    markdown += this.generateRecommendations(projects, features, dependencies);

    return markdown;
  }

  /**
   * Gera resumo executivo
   */
  private generateExecutiveSummary(
    projects: ProjectInfo[],
    features: Map<string, DetectedFeatures>,
    dependencies: DependencyReport
  ): string {
    let summary = '### Projetos Analisados\n\n';
    summary += `- **Total**: ${projects.length}\n`;
    summary += `- **Next.js**: ${projects.filter((p) => p.type === 'nextjs').length}\n`;
    summary += `- **Vite**: ${projects.filter((p) => p.type === 'vite').length}\n`;
    summary += `- **Expo**: ${projects.filter((p) => p.type === 'expo').length}\n\n`;

    summary += '### Features Totais\n\n';
    let totalComponents = 0;
    let totalServices = 0;
    let totalHooks = 0;
    for (const [_, projectFeatures] of features) {
      totalComponents += projectFeatures.components.length;
      totalServices += projectFeatures.services.length;
      totalHooks += projectFeatures.hooks.length;
    }
    summary += `- **Componentes**: ${totalComponents}\n`;
    summary += `- **Serviços**: ${totalServices}\n`;
    summary += `- **Hooks**: ${totalHooks}\n\n`;

    summary += '### Dependências\n\n';
    summary += `- **Total**: ${dependencies.allDependencies.length}\n`;
    summary += `- **Compatíveis com React Native**: ${dependencies.reactNativeCompatible.length}\n`;
    summary += `- **Incompatíveis**: ${dependencies.reactNativeIncompatible.length}\n`;
    summary += `- **Conflitos de Versão**: ${dependencies.conflictingVersions.length}\n`;

    return summary;
  }

  /**
   * Gera seção de projeto
   */
  private generateProjectSection(project: ProjectInfo, features?: DetectedFeatures): string {
    let section = `### ${project.name}\n\n`;
    section += `**Tipo**: ${project.type}\n`;
    section += `**Framework**: ${project.framework}\n`;
    section += `**Versão**: ${project.version}\n`;
    section += `**TypeScript**: ${project.hasTypeScript ? '✅' : '❌'}\n`;
    section += `**Testes**: ${project.hasTests ? '✅' : '❌'}\n`;
    section += `**PWA**: ${project.hasPWA ? '✅' : '❌'}\n`;
    section += `**ORM**: ${project.hasORM ? `✅ (${project.ormType})` : '❌'}\n\n`;

    section += '**Estrutura**:\n';
    section += `- App Dir: ${project.structure.hasAppDir ? '✅' : '❌'}\n`;
    section += `- Src Dir: ${project.structure.hasSrcDir ? '✅' : '❌'}\n`;
    section += `- Components: ${project.structure.hasComponents ? '✅' : '❌'}\n`;
    section += `- Lib: ${project.structure.hasLib ? '✅' : '❌'}\n`;
    section += `- Hooks: ${project.structure.hasHooks ? '✅' : '❌'}\n`;
    section += `- Services: ${project.structure.hasServices ? '✅' : '❌'}\n\n`;

    if (project.features.length > 0) {
      section += '**Features**:\n';
      for (const feature of project.features) {
        section += `- ${feature}\n`;
      }
      section += '\n';
    }

    if (features) {
      section += `**Componentes**: ${features.components.length}\n`;
      section += `**Serviços**: ${features.services.length}\n`;
      section += `**Hooks**: ${features.hooks.length}\n`;
      section += `**Utilities**: ${features.utilities.length}\n`;
      section += `**APIs**: ${features.apis.length}\n\n`;
    }

    return section;
  }

  /**
   * Gera seção de features
   */
  private generateFeaturesSection(features: Map<string, DetectedFeatures>): string {
    let section = '### Features por Projeto\n\n';

    for (const [projectName, projectFeatures] of features) {
      section += `#### ${projectName}\n\n`;

      // Componentes reutilizáveis
      const reusableComponents = projectFeatures.components.filter((c) => c.isReusable);
      if (reusableComponents.length > 0) {
        section += '**Componentes Reutilizáveis**:\n';
        for (const comp of reusableComponents.slice(0, 10)) {
          section += `- \`${comp.name}\` - ${comp.reactNativeCompatible ? '✅' : '⚠️'} ${comp.migrationNotes || ''}\n`;
        }
        section += '\n';
      }

      // Serviços (focando em NathIA/Gemini)
      const nathIAServices = projectFeatures.services.filter(
        (s) => s.path.includes('nathia') || s.path.includes('chat') || s.path.includes('gemini')
      );
      if (nathIAServices.length > 0) {
        section += '**Serviços de IA (NathIA/Gemini)**:\n';
        for (const service of nathIAServices) {
          section += `- \`${service.name}\` - ${service.reactNativeCompatible ? '✅' : '⚠️'}\n`;
          if (service.migrationNotes) {
            section += `  - ${service.migrationNotes}\n`;
          }
        }
        section += '\n';
      }

      // Hooks
      const reusableHooks = projectFeatures.hooks.filter((h) => h.isReusable);
      if (reusableHooks.length > 0) {
        section += '**Hooks Reutilizáveis**:\n';
        for (const hook of reusableHooks.slice(0, 10)) {
          section += `- \`${hook.name}\` - ${hook.reactNativeCompatible ? '✅' : '⚠️'}\n`;
        }
        section += '\n';
      }
    }

    return section;
  }

  /**
   * Gera seção de dependências
   */
  private generateDependenciesSection(dependencies: DependencyReport): string {
    let section = '### Dependências Principais\n\n';

    // Compatíveis com React Native
    section += '#### ✅ Compatíveis com React Native\n\n';
    const importantCompatible = dependencies.reactNativeCompatible.filter((d) =>
      ['react', 'react-native', 'expo', '@supabase', '@tanstack', '@google/generative-ai'].some((p) =>
        d.name.includes(p)
      )
    );
    for (const dep of importantCompatible.slice(0, 20)) {
      section += `- \`${dep.name}\` (${dep.version}) - ${dep.notes || 'Compatível'}\n`;
    }
    section += '\n';

    // Incompatíveis (com alternativas)
    section += '#### ⚠️ Incompatíveis (com Alternativas)\n\n';
    const incompatibleWithAlternatives = dependencies.reactNativeIncompatible.filter((d) => d.reactNativeAlternative);
    for (const dep of incompatibleWithAlternatives.slice(0, 15)) {
      section += `- \`${dep.name}\` → \`${dep.reactNativeAlternative}\`\n`;
      if (dep.notes) {
        section += `  - ${dep.notes}\n`;
      }
    }
    section += '\n';

    // Conflitos de versão
    if (dependencies.conflictingVersions.length > 0) {
      section += '#### 🔄 Conflitos de Versão\n\n';
      for (const dep of dependencies.conflictingVersions) {
        section += `- \`${dep.name}\`: ${dep.notes}\n`;
      }
      section += '\n';
    }

    return section;
  }

  /**
   * Gera seção de configurações
   */
  private generateConfigsSection(configs: ConfigComparison[]): string {
    let section = '### Configurações por Projeto\n\n';

    for (const config of configs) {
      section += `#### ${config.project}\n\n`;
      for (const cfg of config.configs) {
        section += `**${cfg.name}**:\n`;
        section += `- Otimizações: ${cfg.optimizations.join(', ') || 'Nenhuma'}\n`;
        section += `- Compatível com React Native: ${cfg.reactNativeCompatible ? '✅' : '❌'}\n`;
        if (cfg.migrationNotes) {
          section += `- Notas: ${cfg.migrationNotes}\n`;
        }
        section += '\n';
      }
    }

    return section;
  }

  /**
   * Gera recomendações
   */
  generateRecommendations(
    projects: ProjectInfo[],
    features: Map<string, DetectedFeatures>,
    dependencies: DependencyReport
  ): string {
    let recommendations = '### 🎯 Features Prioritárias para Migração\n\n';

    recommendations += '#### Alta Prioridade\n\n';
    recommendations += '1. **Sistema de Chat com IA (NathIA/Gemini)**\n';
    recommendations += '   - Focar apenas em Gemini (não multi-IA)\n';
    recommendations += '   - Usar `@google/generative-ai`\n';
    recommendations += '   - Migrar serviços de chat dos projetos\n';
    recommendations += '   - Implementar memória vetorial (já documentado)\n\n';

    recommendations += '2. **Sistema de Grupos/Comunidade**\n';
    recommendations += '   - Adaptar componentes de grupos\n';
    recommendations += '   - Migrar serviços de posts/comentários\n';
    recommendations += '   - Implementar notificações push\n\n';

    recommendations += '3. **Gamificação**\n';
    recommendations += '   - Sistema de pontos e badges\n';
    recommendations += '   - Conquistas e atividades\n';
    recommendations += '   - Adaptar para React Native\n\n';

    recommendations += '4. **Design System**\n';
    recommendations += '   - Adaptar tokens de design\n';
    recommendations += '   - Converter para NativeWind\n';
    recommendations += '   - Criar componentes base\n\n';

    recommendations += '\n### 📦 Dependências Recomendadas\n\n';
    recommendations += '```json\n';
    recommendations += '{\n';
    recommendations += '  "dependencies": {\n';
    recommendations += '    "@google/generative-ai": "latest",\n';
    recommendations += '    "@supabase/supabase-js": "latest",\n';
    recommendations += '    "@tanstack/react-query": "latest",\n';
    recommendations += '    "react-hook-form": "latest",\n';
    recommendations += '    "zod": "latest",\n';
    recommendations += '    "nativewind": "latest",\n';
    recommendations += '    "lucide-react-native": "latest"\n';
    recommendations += '  }\n';
    recommendations += '}\n';
    recommendations += '```\n\n';

    recommendations += '\n### ⚠️ Dependências a Evitar\n\n';
    recommendations += '- `@anthropic-ai/sdk` - Não usar (focar apenas em Gemini)\n';
    recommendations += '- `@ai-sdk/anthropic` - Não usar\n';
    recommendations += '- `@ai-sdk/openai` - Não usar\n';
    recommendations += '- `openai` - Não usar\n';
    recommendations += '- `next` - Não usar (usar Expo Router)\n';
    recommendations += '- `vite` - Não usar (usar Metro bundler)\n';
    recommendations += '- `tailwindcss` - Não usar (usar NativeWind)\n';

    return recommendations;
  }

  /**
   * Gera relatório de features
   */
  generateFeaturesReport(features: Map<string, DetectedFeatures>): string {
    let markdown = '# ✨ Relatório de Features\n\n';
    markdown += `**Data**: ${new Date().toLocaleDateString('pt-BR')}\n\n`;

    for (const [projectName, projectFeatures] of features) {
      markdown += `## ${projectName}\n\n`;

      // Componentes
      if (projectFeatures.components.length > 0) {
        markdown += '### Componentes\n\n';
        for (const comp of projectFeatures.components) {
          markdown += `- **${comp.name}**\n`;
          markdown += `  - Caminho: \`${comp.path}\`\n`;
          markdown += `  - Reutilizável: ${comp.isReusable ? '✅' : '❌'}\n`;
          markdown += `  - Compatível RN: ${comp.reactNativeCompatible ? '✅' : '⚠️'}\n`;
          if (comp.migrationNotes) {
            markdown += `  - Notas: ${comp.migrationNotes}\n`;
          }
          markdown += '\n';
        }
      }

      // Serviços (focando em NathIA)
      if (projectFeatures.services.length > 0) {
        markdown += '### Serviços\n\n';
        const nathIAServices = projectFeatures.services.filter(
          (s) => s.path.includes('nathia') || s.path.includes('chat') || s.path.includes('gemini')
        );
        if (nathIAServices.length > 0) {
          markdown += '#### Serviços de IA (NathIA/Gemini)\n\n';
          for (const service of nathIAServices) {
            markdown += `- **${service.name}**\n`;
            markdown += `  - Caminho: \`${service.path}\`\n`;
            markdown += `  - Compatível RN: ${service.reactNativeCompatible ? '✅' : '⚠️'}\n`;
            if (service.migrationNotes) {
              markdown += `  - Notas: ${service.migrationNotes}\n`;
            }
            markdown += '\n';
          }
        }
      }
    }

    return markdown;
  }
}
