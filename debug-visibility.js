/**
 * Debug Visibility - Ferramenta de Diagnóstico
 * 
 * Identifica elementos invisíveis, cores transparentes e problemas de visibilidade
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Iniciando diagnóstico de visibilidade...\n');

    // 1. Verificar elementos com display: none
    const hiddenElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.display === 'none';
    });

    if (hiddenElements.length > 0) {
        console.warn('❌ Elementos com display: none:', hiddenElements.length);
        hiddenElements.forEach((el, i) => {
            if (i < 10) { // Limitar a 10 primeiros
                console.log(`  - ${el.tagName}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className}` : ''}`);
            }
        });
        if (hiddenElements.length > 10) {
            console.log(`  ... e mais ${hiddenElements.length - 10} elementos`);
        }
    } else {
        console.log('✅ Nenhum elemento com display: none');
    }

    // 2. Verificar elementos com visibility: hidden
    const invisibleElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return style.visibility === 'hidden';
    });

    if (invisibleElements.length > 0) {
        console.warn('❌ Elementos com visibility: hidden:', invisibleElements.length);
        invisibleElements.forEach((el, i) => {
            if (i < 10) {
                console.log(`  - ${el.tagName}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className}` : ''}`);
            }
        });
    } else {
        console.log('✅ Nenhum elemento com visibility: hidden');
    }

    // 3. Verificar elementos com opacity: 0
    const transparentElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        return parseFloat(style.opacity) === 0;
    });

    if (transparentElements.length > 0) {
        console.warn('❌ Elementos com opacity: 0:', transparentElements.length);
        transparentElements.forEach((el, i) => {
            if (i < 10) {
                console.log(`  - ${el.tagName}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className}` : ''}`);
            }
        });
    } else {
        console.log('✅ Nenhum elemento com opacity: 0');
    }

    // 4. Verificar elementos com altura/largura zero
    const zeroSizeElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width === 0 && rect.height === 0 && el.tagName !== 'SCRIPT' && el.tagName !== 'STYLE';
    });

    if (zeroSizeElements.length > 0) {
        console.warn('❌ Elementos com tamanho zero (width: 0, height: 0):', zeroSizeElements.length);
        zeroSizeElements.forEach((el, i) => {
            if (i < 10) {
                console.log(`  - ${el.tagName}${el.id ? `#${el.id}` : ''}${el.className ? `.${el.className}` : ''}`);
            }
        });
    } else {
        console.log('✅ Nenhum elemento com tamanho zero');
    }

    // 5. Verificar elementos fora da tela (position: absolute/fixed)
    const offScreenElements = Array.from(document.querySelectorAll('*')).filter(el => {
        const style = window.getComputedStyle(el);
        const position = style.position;
        if (position === 'absolute' || position === 'fixed') {
            const rect = el.getBoundingClientRect();
            const isOffScreen = rect.right < 0 || rect.bottom < 0 || 
                              rect.left > window.innerWidth || 
                              rect.top > window.innerHeight;
            return isOffScreen;
        }
        return false;
    });

    if (offScreenElements.length > 0) {
        console.warn('❌ Elementos posicionados fora da tela:', offScreenElements.length);
        offScreenElements.forEach((el, i) => {
            if (i < 10) {
                const rect = el.getBoundingClientRect();
                console.log(`  - ${el.tagName}${el.id ? `#${el.id}` : ''}: left=${rect.left}, top=${rect.top}`);
            }
        });
    } else {
        console.log('✅ Nenhum elemento fora da tela');
    }

    // 6. Verificar cores de texto transparentes ou muito claras
    const badTextColorElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button')).filter(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const bgColor = style.backgroundColor;
        
        // Verificar se cor de texto é muito clara ou transparente
        const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbaMatch) {
            const alpha = parseFloat(rgbaMatch[4] || '1');
            const r = parseInt(rgbaMatch[1]);
            const g = parseInt(rgbaMatch[2]);
            const b = parseInt(rgbaMatch[3]);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            
            // Se muito clara (brightness > 240) ou transparente (alpha < 0.1)
            return brightness > 240 || alpha < 0.1;
        }
        return false;
    });

    if (badTextColorElements.length > 0) {
        console.warn('⚠️ Elementos com cor de texto muito clara ou transparente:', badTextColorElements.length);
        badTextColorElements.forEach((el, i) => {
            if (i < 10) {
                const style = window.getComputedStyle(el);
                console.log(`  - ${el.tagName}${el.id ? `#${el.id}` : ''}: color=${style.color}`);
            }
        });
    } else {
        console.log('✅ Cores de texto estão visíveis');
    }

    // 7. Verificar contraste de cores (background vs text)
    const lowContrastElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div, a, button')).filter(el => {
        const style = window.getComputedStyle(el);
        const textColor = style.color;
        const bgColor = style.backgroundColor;
        
        // Calcular contraste (simplificado)
        const getBrightness = (color) => {
            const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            if (rgbaMatch) {
                const r = parseInt(rgbaMatch[1]);
                const g = parseInt(rgbaMatch[2]);
                const b = parseInt(rgbaMatch[3]);
                return (r * 299 + g * 587 + b * 114) / 1000;
            }
            return 128;
        };
        
        const textBrightness = getBrightness(textColor);
        const bgBrightness = getBrightness(bgColor);
        const contrast = Math.abs(textBrightness - bgBrightness);
        
        // Contraste muito baixo (< 50)
        return contrast < 50 && el.textContent.trim().length > 0;
    });

    if (lowContrastElements.length > 0) {
        console.warn('⚠️ Elementos com baixo contraste (texto vs background):', lowContrastElements.length);
        lowContrastElements.forEach((el, i) => {
            if (i < 10) {
                const style = window.getComputedStyle(el);
                console.log(`  - ${el.tagName}${el.id ? `#${el.id}` : ''}: text=${style.color}, bg=${style.backgroundColor}`);
            }
        });
    } else {
        console.log('✅ Contraste de cores está adequado');
    }

    // 8. Verificar elementos filhos do body
    console.log('\n📋 Elementos filhos diretos do <body>:');
    Array.from(document.body.children).forEach((child, index) => {
        const style = window.getComputedStyle(child);
        const rect = child.getBoundingClientRect();
        console.log(`  ${index + 1}. ${child.tagName}${child.id ? `#${child.id}` : ''}${child.className ? `.${child.className.split(' ').join('.')}` : ''}`);
        console.log(`     - display: ${style.display}`);
        console.log(`     - visibility: ${style.visibility}`);
        console.log(`     - opacity: ${style.opacity}`);
        console.log(`     - size: ${rect.width}x${rect.height}`);
        console.log(`     - position: ${style.position}`);
        console.log(`     - z-index: ${style.zIndex}`);
        console.log(`     - color: ${style.color}`);
        console.log(`     - background: ${style.backgroundColor}`);
    });

    // 9. Resumo final
    console.log('\n📊 RESUMO:');
    console.log(`  - Elementos com display: none: ${hiddenElements.length}`);
    console.log(`  - Elementos com visibility: hidden: ${invisibleElements.length}`);
    console.log(`  - Elementos com opacity: 0: ${transparentElements.length}`);
    console.log(`  - Elementos com tamanho zero: ${zeroSizeElements.length}`);
    console.log(`  - Elementos fora da tela: ${offScreenElements.length}`);
    console.log(`  - Elementos com cor de texto problemática: ${badTextColorElements.length}`);
    console.log(`  - Elementos com baixo contraste: ${lowContrastElements.length}`);
    console.log(`  - Filhos diretos do body: ${document.body.children.length}`);

    // 10. Função helper para verificar classes CSS de forma segura
    window.checkCSSClass = (className) => {
        const foundRules = [];
        const externalSheets = [];
        
        Array.from(document.styleSheets).forEach((sheet) => {
            try {
                const rules = sheet.cssRules || sheet.rules;
                if (rules) {
                    Array.from(rules).forEach((rule) => {
                        if (rule.selectorText && rule.selectorText.includes(className)) {
                            foundRules.push({
                                selector: rule.selectorText,
                                cssText: rule.cssText,
                                stylesheet: sheet.href || 'inline'
                            });
                        }
                    });
                }
            } catch (e) {
                // SecurityError ao acessar stylesheets cross-origin é NORMAL
                // Não mostrar warning desnecessário
                if (e.name !== 'SecurityError') {
                    // Apenas reportar erros reais
                    console.warn(`⚠️ Erro ao ler stylesheet:`, e.message);
                }
            }
        });
        
        return {
            found: foundRules.length > 0,
            rules: foundRules
        };
    };

    // 11. Função helper para inspecionar elemento específico
    window.inspectElement = (selector) => {
        const el = document.querySelector(selector);
        if (!el) {
            console.error(`❌ Elemento não encontrado: ${selector}`);
            return;
        }
        
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        
        console.log(`\n🔍 Inspecionando: ${selector}`);
        console.log('  Estilos computados:');
        console.log(`    - display: ${style.display}`);
        console.log(`    - visibility: ${style.visibility}`);
        console.log(`    - opacity: ${style.opacity}`);
        console.log(`    - position: ${style.position}`);
        console.log(`    - top: ${style.top}, left: ${style.left}`);
        console.log(`    - width: ${rect.width}px, height: ${rect.height}px`);
        console.log(`    - padding: ${style.padding}`);
        console.log(`    - margin: ${style.margin}`);
        console.log(`    - color: ${style.color}`);
        console.log(`    - background-color: ${style.backgroundColor}`);
        console.log(`    - z-index: ${style.zIndex}`);
        console.log(`    - overflow: ${style.overflow}`);
        console.log(`    - clip-path: ${style.clipPath}`);
        console.log(`    - transform: ${style.transform}`);
        console.log(`    - textContent: "${el.textContent.substring(0, 50)}..."`);
        
        // Verificar classes CSS aplicadas
        if (el.className) {
            console.log(`  Classes aplicadas: ${el.className}`);
            const classes = el.className.split(' ');
            classes.forEach(cls => {
                const check = window.checkCSSClass(cls);
                if (check.found) {
                    console.log(`    ✅ ${cls}: encontrada no CSS`);
                } else {
                    console.log(`    ⚠️ ${cls}: não encontrada no CSS`);
                }
            });
        }
    };

    console.log('\n✅ Diagnóstico completo!');
    console.log('💡 Funções disponíveis:');
    console.log('   - inspectElement(selector) - Inspeciona elemento específico');
    console.log('   - checkCSSClass(className) - Verifica se classe CSS existe');
    console.log('   Exemplo: inspectElement("#share-button")');
    console.log('\n📝 Nota: SecurityError ao acessar Google Fonts é NORMAL (CORS)');
});

