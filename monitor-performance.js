/**
 * Monitor Performance - Ferramenta de Monitoramento
 * 
 * Monitora performance de requisições, cache e otimizações
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('📊 Iniciando monitoramento de performance...\n');

    // Performance Observer para recursos
    if ('PerformanceObserver' in window) {
        // Observar recursos (scripts, styles, etc.)
        const resourceObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            
            entries.forEach((entry) => {
                if (entry.initiatorType === 'script' || entry.initiatorType === 'link') {
                    analyzeResource(entry);
                }
            });
        });

        try {
            resourceObserver.observe({ entryTypes: ['resource'] });
            console.log('✅ Performance Observer configurado');
        } catch (e) {
            console.warn('⚠️ Performance Observer não disponível:', e);
        }
    }

    // Analisar recursos já carregados
    if (performance.getEntriesByType) {
        const resources = performance.getEntriesByType('resource');
        console.log(`📋 Analisando ${resources.length} recursos carregados...\n`);

        // Filtrar apenas chunks JavaScript do Next.js
        const chunks = resources.filter(r => 
            r.name.includes('/_next/static/chunks/') && 
            r.name.endsWith('.js')
        );

        if (chunks.length > 0) {
            console.log(`📦 Chunks JavaScript encontrados: ${chunks.length}\n`);
            
            chunks.forEach((chunk, index) => {
                analyzeResource(chunk, index + 1);
            });

            // Estatísticas gerais
            const stats = calculateStats(chunks);
            console.log('\n📊 Estatísticas Gerais:');
            console.log(`   - Total de chunks: ${chunks.length}`);
            console.log(`   - Tempo médio: ${stats.avgTime.toFixed(2)} ms`);
            console.log(`   - Tempo mínimo: ${stats.minTime.toFixed(2)} ms`);
            console.log(`   - Tempo máximo: ${stats.maxTime.toFixed(2)} ms`);
            console.log(`   - Tamanho total: ${formatBytes(stats.totalSize)}`);
            console.log(`   - Tamanho médio: ${formatBytes(stats.avgSize)}`);
        } else {
            console.log('⚠️ Nenhum chunk JavaScript do Next.js encontrado');
        }
    }

    // Função para analisar um recurso
    function analyzeResource(entry, index = null) {
        const name = entry.name.split('/').pop();
        const duration = entry.duration;
        const size = entry.transferSize || entry.decodedBodySize || 0;
        
        // Timing detalhado
        const timing = {
            queueing: entry.queueing || 0,
            dns: entry.domainLookupEnd - entry.domainLookupStart || 0,
            connect: entry.connectEnd - entry.connectStart || 0,
            ttfb: entry.responseStart - entry.requestStart || 0,
            download: entry.responseEnd - entry.responseStart || 0,
            total: duration
        };

        // Análise de performance
        const performance = {
            excellent: duration < 10,
            good: duration < 100,
            needsImprovement: duration < 500,
            poor: duration >= 500
        };

        let status = '❌';
        if (performance.excellent) status = '✅';
        else if (performance.good) status = '⚠️';
        else if (performance.needsImprovement) status = '🔴';

        const prefix = index ? `${index}. ` : '';
        console.log(`${prefix}${status} ${name}`);
        console.log(`   Duration: ${duration.toFixed(2)} ms`);
        console.log(`   Size: ${formatBytes(size)}`);
        console.log(`   Timing:`);
        console.log(`     - Queueing: ${timing.queueing.toFixed(2)} ms`);
        console.log(`     - DNS: ${timing.dns.toFixed(2)} ms`);
        console.log(`     - Connect: ${timing.connect.toFixed(2)} ms`);
        console.log(`     - TTFB: ${timing.ttfb.toFixed(2)} ms`);
        console.log(`     - Download: ${timing.download.toFixed(2)} ms`);

        // Verificar cache
        if (entry.transferSize === 0 && entry.decodedBodySize > 0) {
            console.log(`   ✅ Cache: Served from cache`);
        } else if (entry.transferSize < entry.decodedBodySize) {
            const compression = ((1 - entry.transferSize / entry.decodedBodySize) * 100).toFixed(1);
            console.log(`   ✅ Compression: ${compression}%`);
        }

        // Verificar otimizações
        const optimizations = [];
        if (timing.ttfb < 200) optimizations.push('TTFB excelente');
        if (timing.download < 1000) optimizations.push('Download rápido');
        if (entry.transferSize === 0) optimizations.push('Cache hit');
        if (entry.transferSize < entry.decodedBodySize) optimizations.push('Compression');

        if (optimizations.length > 0) {
            console.log(`   ✅ Otimizações: ${optimizations.join(', ')}`);
        }

        console.log(''); // Linha em branco
    }

    // Calcular estatísticas
    function calculateStats(resources) {
        const times = resources.map(r => r.duration);
        const sizes = resources.map(r => r.transferSize || r.decodedBodySize || 0);

        return {
            avgTime: times.reduce((a, b) => a + b, 0) / times.length,
            minTime: Math.min(...times),
            maxTime: Math.max(...times),
            totalSize: sizes.reduce((a, b) => a + b, 0),
            avgSize: sizes.reduce((a, b) => a + b, 0) / sizes.length
        };
    }

    // Formatar bytes
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Expor funções globalmente
    window.analyzeResource = analyzeResource;
    window.formatBytes = formatBytes;

    // Web Vitals (se disponível)
    if (typeof window.webVitals !== 'undefined') {
        console.log('\n📈 Web Vitals disponível');
        // LCP, FID, CLS serão reportados automaticamente
    } else {
        console.log('\n💡 Para Web Vitals completo, instale: npm install web-vitals');
    }

    console.log('\n✅ Monitoramento configurado!');
    console.log('💡 Funções disponíveis:');
    console.log('   - analyzeResource(performanceEntry)');
    console.log('   - formatBytes(bytes)');
});

