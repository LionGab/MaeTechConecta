/**
 * share-modal.js
 * 
 * SOLUÇÃO PARA O ERRO: "Cannot read properties of null (reading 'addEventListener')"
 * 
 * PROBLEMA:
 * O JavaScript tenta acessar elementos DOM antes deles estarem carregados.
 * Isso acontece quando o script é executado antes do HTML ser totalmente parseado.
 * 
 * SOLUÇÃO:
 * Usar DOMContentLoaded para garantir que o DOM está completamente carregado
 * antes de tentar acessar qualquer elemento.
 * 
 * ALTERNATIVAS:
 * 1. Colocar o <script> no final do <body>
 * 2. Usar atributo defer no <script>: <script src="share-modal.js" defer>
 * 3. Usar DOMContentLoaded (melhor prática - mais robusto)
 */

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // ✅ AGORA é seguro acessar elementos DOM
    // Todos os elementos HTML já foram parseados e estão disponíveis
    
    // Buscar elementos do DOM
    const shareButton = document.getElementById('share-button');
    const shareModal = document.getElementById('share-modal');
    const closeModal = document.getElementById('close-modal');

    // ✅ BOA PRÁTICA: Sempre verificar se o elemento existe antes de usar
    // Isso evita erros e torna o código mais robusto
    if (!shareButton) {
        console.error('❌ Erro: Botão share-button não encontrado no DOM!');
        console.error('Verifique se o elemento existe no HTML com id="share-button"');
        return; // Para a execução se o elemento não existir
    }

    if (!shareModal) {
        console.error('❌ Erro: Modal share-modal não encontrado no DOM!');
        console.error('Verifique se o elemento existe no HTML com id="share-modal"');
        return;
    }

    // ✅ Adicionar evento de clique no botão de compartilhar
    shareButton.addEventListener('click', () => {
        console.log('✅ Botão de compartilhar clicado!');
        shareModal.classList.add('show'); // Mostra o modal
    });

    // ✅ Fechar modal ao clicar no botão de fechar
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            console.log('✅ Fechando modal...');
            shareModal.classList.remove('show');
        });
    }

    // ✅ Fechar modal ao clicar fora do conteúdo (no backdrop)
    shareModal.addEventListener('click', (e) => {
        // Se clicou diretamente no modal (não no conteúdo dentro dele)
        if (e.target === shareModal) {
            console.log('✅ Fechando modal (clicou fora)...');
            shareModal.classList.remove('show');
        }
    });

    // ✅ Fechar modal com a tecla ESC (melhor UX)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && shareModal.classList.contains('show')) {
            console.log('✅ Fechando modal (tecla ESC)...');
            shareModal.classList.remove('show');
        }
    });

    // Confirmação de inicialização bem-sucedida
    console.log('✅ Share modal inicializado com sucesso!');
    console.log('📋 Elementos encontrados:', {
        shareButton: !!shareButton,
        shareModal: !!shareModal,
        closeModal: !!closeModal
    });
});

/**
 * EXEMPLOS DE USO ALTERNATIVOS:
 * 
 * // Opção 1: Usar querySelector (mais flexível)
 * const shareButton = document.querySelector('#share-button');
 * const shareButton = document.querySelector('.share-button'); // por classe
 * 
 * // Opção 2: Verificação inline (mais verboso)
 * const shareButton = document.getElementById('share-button');
 * if (shareButton) {
 *     shareButton.addEventListener('click', handler);
 * }
 * 
 * // Opção 3: Usar defer no script tag (HTML)
 * <script src="share-modal.js" defer></script>
 * // O defer garante que o script só executa após o DOM estar pronto
 */

