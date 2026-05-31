document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. LÓGICA DO MENU HAMBÚRGUER
    // ==========================================
    var menuButton = document.getElementById("menu-button");
    var menu = document.getElementById("menu");

    if (menuButton && menu) {
        // Abre/fecha ao clicar no botão hambúrguer
        menuButton.addEventListener("click", function(e) {
            e.stopPropagation();
            menu.style.display = menu.style.display === "block" ? "none" : "block";
        });

        // Fecha ao clicar em qualquer link dentro do menu
        menu.querySelectorAll("a").forEach(function(link) {
            link.addEventListener("click", function() {
                menu.style.display = "none";
            });
        });

        // Fecha ao clicar fora do menu
        document.addEventListener("click", function(e) {
            if (!menu.contains(e.target) && e.target !== menuButton) {
                menu.style.display = "none";
            }
        });
    }

    // ==========================================
    // 2. CHAMA A FUNÇÃO DA API DA BOLSA
    // ==========================================
    carregarDadosBolsa();

    // ==========================================
    // 3. DESTACAR LINK ATIVO NA NAVEGAÇÃO
    // ==========================================
    var currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(function(link) {
        var linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage && linkPage === currentPage) {
            link.style.color = 'var(--accent-yellow)';
            link.style.borderBottom = '2px solid var(--accent-yellow)';
            link.style.paddingBottom = '2px';
        }
    });
});


// ==========================================
// A FUNÇÃO DA API EM SI
// ==========================================
async function carregarDadosBolsa() {
    const marketDataContainer = document.getElementById('market-data');
    if (!marketDataContainer) return; 

    const minhaChave = '8e58a332';
    const url = `https://api.hgbrasil.com/finance?format=json-cors&key=${minhaChave}`;
    
    try {
        const resposta = await fetch(url);
        if (!resposta.ok) throw new Error(`HTTP erro! status: ${resposta.status}`);
        
        const dados = await resposta.json();
        
        // Verificação de segurança: se a API falhar em entregar os blocos, evita que o código quebre
        const ibovespaDados = dados?.results?.stocks?.IBOVESPA;
        const nasdaqDados = dados?.results?.stocks?.NASDAQ;
        const dolarDados = dados?.results?.currencies?.USD;

        // Funções auxiliares para formatação visual
        const getCorVariacao = (variacao) => (variacao || 0) >= 0 ? 'text-up' : 'text-down';
        const getSinal = (variacao) => (variacao || 0) > 0 ? '+' : '';
        const getIcone = (variacao) => (variacao || 0) >= 0 ? '▲' : '▼'; 

        // Tratando o Ibovespa (Garante exibição mesmo se vier null no fim de semana)
        const ibovPontos = ibovespaDados && ibovespaDados.points !== null 
            ? `${ibovespaDados.points.toLocaleString('pt-BR')} <span style="font-size: 1rem; color: #aaa; font-weight: 500;">pts</span>`
            : 'Fechado';
        const ibovVar = ibovespaDados?.variation ?? 0;

        // Tratando a NASDAQ
        const nasdaqPontos = nasdaqDados && nasdaqDados.points !== null 
            ? `${nasdaqDados.points.toLocaleString('pt-BR')} <span style="font-size: 1rem; color: #aaa; font-weight: 500;">pts</span>`
            : 'Fechado';
        const nasdaqVar = nasdaqDados?.variation ?? 0;

        // Tratando o Dólar
        const dolarValor = dolarDados && dolarDados.buy !== null
            ? `<span style="font-size: 1.2rem; color: #aaa; font-weight: 500;">R$</span> ${dolarDados.buy.toFixed(2).replace('.', ',')}`
            : 'Indisponível';
        const dolarVar = dolarDados?.variation ?? 0;

        // Injeta os cartões com os dados validados
        marketDataContainer.innerHTML = `
            <div class="market-card">
                <div class="market-card-title">Ibovespa <span>🇧🇷</span></div>
                <div class="market-card-value">${ibovPontos}</div>
                <div class="market-card-variation ${getCorVariacao(ibovVar)}">
                    ${getIcone(ibovVar)} ${getSinal(ibovVar)}${ibovVar}%
                </div>
            </div>

            <div class="market-card">
                <div class="market-card-title">NASDAQ <span>🇺🇸</span></div>
                <div class="market-card-value">${nasdaqPontos}</div>
                <div class="market-card-variation ${getCorVariacao(nasdaqVar)}">
                    ${getIcone(nasdaqVar)} ${getSinal(nasdaqVar)}${nasdaqVar}%
                </div>
            </div>

            <div class="market-card">
                <div class="market-card-title">Dólar (Comercial) <span>💵</span></div>
                <div class="market-card-value">${dolarValor}</div>
                <div class="market-card-variation ${getCorVariacao(dolarVar)}">
                    ${getIcone(dolarVar)} ${getSinal(dolarVar)}${dolarVar}%
                </div>
            </div>
        `;
    } catch (erro) {
        console.error("Erro ao carregar a API da Bolsa:", erro);
        marketDataContainer.innerHTML = `
            <p style="color: #dc2626; text-align: center; width: 100%; font-weight: bold;">Erro ao carregar dados de mercado. Verifique sua conexão.</p>
        `;
    }
}