import * as fs from 'fs/promises';
import * as path from 'path';
import { ProjectAnalyzer, ProjectInfo } from './analyzers/project-analyzer';
import { FeatureDetector, DetectedFeatures } from './analyzers/feature-detector';
import { DependencyTracker, DependencyInfo } from './analyzers/dependency-tracker';
import { ConfigComparator, ConfigComparison } from './analyzers/config-comparator';
import { MarkdownGenerator } from './reports/markdown-generator';
import { FeatureReport } from './reports/feature-report';
import { DependencyReportGenerator } from './reports/dependency-report';

/**
 * Projetos a serem analisados
 */
const PROJECTS = [
  {
    name: 'v0-nossa-maternidade-app',
    path: 'C:\\Users\\Usuario\\Documents\\gl\\v0-nossa-maternidade-app-2\\v0-nossa-maternidade-app\\v0-nossa-maternidade-app',
  },
  {
    name: 'v0-nossa-maternidade-app-drizzle',
    path: 'C:\\Users\\Usuario\\Documents\\gl\\v0-nossa-maternidade-app-2\\v0-nossa-maternidade-app',
  },
  {
    name: 'NathaliaValente',
    path: 'C:\\Users\\Usuario\\Desktop\\Nathalia\\NathaliaValente',
  },
];

/**
 * Sistema principal de rastreamento
 */
export class TrackerSystem {
  private basePath: string;
  private dataPath: string;
  private reportsPath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
    this.dataPath = path.join(basePath, 'data');
    this.reportsPath = path.join(basePath, 'reports');
  }

  /**
   * Executa análise completa
   */
  async run(): Promise<void> {
    console.log('🚀 Iniciando análise de projetos...\n');

    // Garante que os diretórios existem
    await this.ensureDirectories();

    // Analisa projetos
    const projects: ProjectInfo[] = [];
    const featuresMap = new Map<string, DetectedFeatures>();
    const allDependencies: DependencyInfo[] = [];
    const configs: ConfigComparison[] = [];

    for (const project of PROJECTS) {
      console.log(`📊 Analisando ${project.name}...`);

      try {
        // Analisa projeto
        const analyzer = new ProjectAnalyzer(project.path);
        const projectInfo = await analyzer.analyzeProject(project.name, project.path);
        projects.push(projectInfo);

        // Detecta features
        const featureDetector = new FeatureDetector(project.path);
        const features = await featureDetector.detectFeatures(project.path);
        featuresMap.set(project.name, features);

        // Rastreia dependências
        const dependencyTracker = new DependencyTracker(project.path);
        const dependencies = await dependencyTracker.trackDependencies(project.name, project.path);
        allDependencies.push(...dependencies);

        // Compara configurações
        const configComparator = new ConfigComparator(project.path);
        const config = await configComparator.compareConfigs(project.name, project.path);
        configs.push(config);

        console.log(`✅ ${project.name} analisado com sucesso\n`);
      } catch (error) {
        console.error(`❌ Erro ao analisar ${project.name}:`, error);
      }
    }

    // Consolida dependências
    console.log('📦 Consolidando dependências...');
    const dependencyTracker = new DependencyTracker(this.basePath);
    const dependencyReport = dependencyTracker.consolidateDependencies(allDependencies);

    // Salva dados
    console.log('💾 Salvando dados...');
    await this.saveData(projects, featuresMap, dependencyReport, configs);

    // Gera relatórios
    console.log('📝 Gerando relatórios...');
    await this.generateReports(projects, featuresMap, dependencyReport, configs);

    console.log('\n✅ Análise completa!');
    console.log(`📁 Relatórios salvos em: ${this.reportsPath}`);
  }

  /**
   * Garante que os diretórios existem
   */
  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(this.dataPath, { recursive: true });
      await fs.mkdir(this.reportsPath, { recursive: true });
    } catch (error) {
      console.error('Erro ao criar diretórios:', error);
    }
  }

  /**
   * Salva dados estruturados
   */
  private async saveData(
    projects: ProjectInfo[],
    features: Map<string, DetectedFeatures>,
    dependencies: any,
    configs: ConfigComparison[]
  ): Promise<void> {
    // Salva projetos
    await fs.writeFile(path.join(this.dataPath, 'projects.json'), JSON.stringify(projects, null, 2), 'utf-8');

    // Salva features
    const featuresObj: Record<string, DetectedFeatures> = {};
    for (const [name, featuresData] of features) {
      featuresObj[name] = featuresData;
    }
    await fs.writeFile(path.join(this.dataPath, 'features.json'), JSON.stringify(featuresObj, null, 2), 'utf-8');

    // Salva dependências
    await fs.writeFile(path.join(this.dataPath, 'dependencies.json'), JSON.stringify(dependencies, null, 2), 'utf-8');

    // Salva configurações
    await fs.writeFile(path.join(this.dataPath, 'configs.json'), JSON.stringify(configs, null, 2), 'utf-8');
  }

  /**
   * Gera relatórios
   */
  private async generateReports(
    projects: ProjectInfo[],
    features: Map<string, DetectedFeatures>,
    dependencies: any,
    configs: ConfigComparison[]
  ): Promise<void> {
    const markdownGenerator = new MarkdownGenerator();
    const featureReport = new FeatureReport();
    const dependencyReportGenerator = new DependencyReportGenerator();

    // Relatório completo
    const analysisReport = markdownGenerator.generateAnalysisReport(projects, features, dependencies, configs);
    await fs.writeFile(path.join(this.reportsPath, 'analysis-report.md'), analysisReport, 'utf-8');

    // Relatório de features
    const featuresReport = featureReport.generateReport(features);
    await fs.writeFile(path.join(this.reportsPath, 'features-report.md'), featuresReport, 'utf-8');

    // Relatório de dependências
    const dependenciesReport = dependencyReportGenerator.generateReport(dependencies);
    await fs.writeFile(path.join(this.reportsPath, 'dependencies-report.md'), dependenciesReport, 'utf-8');

    // Relatório de recomendações
    const recommendations = this.generateRecommendationsReport(projects, features, dependencies);
    await fs.writeFile(path.join(this.reportsPath, 'recommendations.md'), recommendations, 'utf-8');
  }

  /**
   * Gera relatório de recomendações
   */
  private generateRecommendationsReport(
    projects: ProjectInfo[],
    features: Map<string, DetectedFeatures>,
    dependencies: any
  ): string {
    const markdownGenerator = new MarkdownGenerator();
    return markdownGenerator.generateRecommendations(projects, features, dependencies);
  }
}

/**
 * Executa o sistema
 */
async function main() {
  const basePath = path.resolve(__dirname, '..');
  const tracker = new TrackerSystem(basePath);
  await tracker.run();
}

// Executa se for chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

export { TrackerSystem };
