/**
 * Check CSS Classes - Verifica classes CSS de forma segura
 * 
 * Trata SecurityError ao acessar stylesheets externos (Google Fonts, etc.)
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Verificando classes CSS...\n');

    /**
     * Verifica se uma classe CSS existe de forma segura
     * Trata SecurityError para stylesheets cross-origin
     */
    function checkCSSClass(className) {
        const foundRules = [];
        const externalSheets = [];
        
        // Verificar todas as stylesheets
        Array.from(document.styleSheets).forEach((sheet, index) => {
            try {
                // Tentar acessar as regras CSS
                const rules = sheet.cssRules || sheet.rules;
                
                if (rules) {
                    Array.from(rules).forEach((rule) => {
                        // Verificar se a regra corresponde à classe
                        if (rule.selectorText && rule.selectorText.includes(className)) {
                            foundRules.push({
                                selector: rule.selectorText,
                                cssText: rule.cssText,
                                stylesheet: sheet.href || 'inline',
                                index: index
                            });
                        }
                    });
                }
            } catch (e) {
                // SecurityError ao acessar stylesheets cross-origin é normal
                if (e.name === 'SecurityError') {
                    // Não é um erro real, apenas não podemos acessar stylesheets externos
                    if (sheet.href && sheet.href.includes('fonts.googleapis.com')) {
                        externalSheets.push({
                            href: sheet.href,
                            reason: 'Cross-origin (Google Fonts) - normal'
                        });
                    } else {
                        externalSheets.push({
                            href: sheet.href || 'inline',
                            reason: 'Cross-origin - bloqueado por segurança'
                        });
                    }
                } else {
                    // Outros erros devem ser reportados
                    console.warn(`⚠️ Erro ao ler stylesheet ${index}:`, e.message);
                }
            }
        });
        
        return {
            found: foundRules.length > 0,
            rules: foundRules,
            externalSheets: externalSheets,
            totalSheets: document.styleSheets.length
        };
    }

    /**
     * Verifica se uma classe específica está aplicada e funcionando
     */
    function verifyClassApplied(className, elementSelector = null) {
        const result = {
            classExists: false,
            classApplied: false,
            computedStyles: null,
            issue: null
        };

        // Verificar se a classe existe no CSS
        const cssCheck = checkCSSClass(className);
        result.classExists = cssCheck.found;

        // Verificar se está aplicada em algum elemento
        if (elementSelector) {
            const element = document.querySelector(elementSelector);
            if (element) {
                result.classApplied = element.classList.contains(className);
                if (result.classApplied) {
                    const computed = window.getComputedStyle(element);
                    result.computedStyles = {
                        display: computed.display,
                        padding: computed.padding,
                        margin: computed.margin,
                        backgroundColor: computed.backgroundColor,
                        color: computed.color
                    };
                    
                    // Verificar se realmente está aplicando estilos
                    if (className.includes('p-') && computed.padding === '0px') {
                        result.issue = 'Padding não está sendo aplicado';
                    } else if (className.includes('mb-') && computed.marginBottom === '0px') {
                        result.issue = 'Margin-bottom não está sendo aplicado';
                    }
                } else {
                    result.issue = `Classe ${className} não está aplicada ao elemento ${elementSelector}`;
                }
            } else {
                result.issue = `Elemento ${elementSelector} não encontrado`;
            }
        }

        return {
            ...result,
            cssRules: cssCheck.rules,
            externalSheets: cssCheck.externalSheets
        };
    }

    // Expor funções globalmente
    window.checkCSSClass = checkCSSClass;
    window.verifyClassApplied = verifyClassApplied;

    // Exemplo de uso: verificar classes comuns
    console.log('📋 Verificando classes Tailwind comuns...\n');

    const commonClasses = ['p-8', 'mb-6', 'mb-3', 'w-14', 'h-14', 'bg-white', 'rounded-2xl', 'shadow-md'];
    
    commonClasses.forEach(className => {
        const check = checkCSSClass(className);
        if (check.found) {
            console.log(`✅ ${className}: encontrado (${check.rules.length} regra(s))`);
            check.rules.forEach((rule, i) => {
                console.log(`   ${i + 1}. ${rule.selector}`);
            });
        } else {
            console.log(`⚠️ ${className}: não encontrado no CSS`);
        }
    });

    // Informar sobre sheets externos
    if (checkCSSClass('').externalSheets.length > 0) {
        console.log('\n📝 Nota sobre stylesheets externos:');
        console.log('   SecurityError ao acessar Google Fonts é NORMAL e esperado.');
        console.log('   Navegadores bloqueiam acesso cross-origin por segurança.');
        console.log('   Isso não afeta o funcionamento das fontes.\n');
    }

    console.log('\n💡 Funções disponíveis:');
    console.log('   - checkCSSClass(".minha-classe") - Verifica se classe existe');
    console.log('   - verifyClassApplied("p-8", "#meu-elemento") - Verifica se classe está aplicada');
    console.log('\n✅ Verificação completa!');
});

