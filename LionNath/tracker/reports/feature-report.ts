import { DetectedFeatures, FeatureInfo } from '../analyzers/feature-detector';
import { MarkdownGenerator } from './markdown-generator';

/**
 * Gerador de relatório de features
 */
export class FeatureReport {
  private markdownGenerator: MarkdownGenerator;

  constructor() {
    this.markdownGenerator = new MarkdownGenerator();
  }

  /**
   * Gera relatório de features
   */
  generateReport(features: Map<string, DetectedFeatures>): string {
    return this.markdownGenerator.generateFeaturesReport(features);
  }

  /**
   * Gera resumo de features por categoria
   */
  generateSummary(features: Map<string, DetectedFeatures>): {
    totalComponents: number;
    totalServices: number;
    totalHooks: number;
    totalUtilities: number;
    nathIAServices: FeatureInfo[];
    reactNativeCompatible: number;
    reactNativeIncompatible: number;
  } {
    let totalComponents = 0;
    let totalServices = 0;
    let totalHooks = 0;
    let totalUtilities = 0;
    const nathIAServices: FeatureInfo[] = [];
    let reactNativeCompatible = 0;
    let reactNativeIncompatible = 0;

    for (const [_, projectFeatures] of features) {
      totalComponents += projectFeatures.components.length;
      totalServices += projectFeatures.services.length;
      totalHooks += projectFeatures.hooks.length;
      totalUtilities += projectFeatures.utilities.length;

      // Serviços de NathIA/Gemini
      const nathIA = projectFeatures.services.filter(
        (s) => s.path.includes('nathia') || s.path.includes('chat') || s.path.includes('gemini')
      );
      nathIAServices.push(...nathIA);

      // Compatibilidade React Native
      for (const comp of projectFeatures.components) {
        if (comp.reactNativeCompatible) reactNativeCompatible++;
        else reactNativeIncompatible++;
      }
      for (const service of projectFeatures.services) {
        if (service.reactNativeCompatible) reactNativeCompatible++;
        else reactNativeIncompatible++;
      }
      for (const hook of projectFeatures.hooks) {
        if (hook.reactNativeCompatible) reactNativeCompatible++;
        else reactNativeIncompatible++;
      }
    }

    return {
      totalComponents,
      totalServices,
      totalHooks,
      totalUtilities,
      nathIAServices,
      reactNativeCompatible,
      reactNativeIncompatible,
    };
  }
}
