document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. LÓGICA DO MENU HAMBÚRGUER
    // ==========================================
    var menuButton = document.getElementById("menu-button");
    var menu = document.getElementById("menu");

    if (menuButton && menu) {
        menuButton.addEventListener("click", function() {
            if (menu.style.display === "block") {
                menu.style.display = "none";
            } else {
                menu.style.display = "block";
            }
        });
    }

    // ==========================================
    // 2. CHAMA A FUNÇÃO DA API DA BOLSA
    // ==========================================
    carregarDadosBolsa(); // É ESTA LINHA QUE FALTAVA PARA ACORDAR A API!
});


// ==========================================
// A FUNÇÃO DA API EM SI 
// ==========================================
async function carregarDadosBolsa() {
    const marketDataContainer = document.getElementById('market-data');
    if (!marketDataContainer) return; // Se não achar a seção de mercado, para por aqui

    const url = `https://api.hgbrasil.com/finance?format=json-cors`;
    
    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        
        const ibovespa = dados.results.stocks.IBOVESPA;
        const nasdaq = dados.results.stocks.NASDAQ;
        const dolar = dados.results.currencies.USD;

        const getCorVariacao = (variacao) => variacao >= 0 ? 'text-up' : 'text-down';
        const getSinal = (variacao) => variacao > 0 ? '+' : '';
        const getIcone = (variacao) => variacao >= 0 ? '▲' : '▼'; 

        // Injeta os cartões modernos no HTML
        marketDataContainer.innerHTML = `
            <div class="market-card">
                <div class="market-card-title">Ibovespa <span>🇧🇷</span></div>
                <div class="market-card-value">${ibovespa.points.toLocaleString('pt-BR')} <span style="font-size: 1rem; color: #aaa; font-weight: 500;">pts</span></div>
                <div class="market-card-variation ${getCorVariacao(ibovespa.variation)}">
                    ${getIcone(ibovespa.variation)} ${getSinal(ibovespa.variation)}${ibovespa.variation}%
                </div>
            </div>

            <div class="market-card">
                <div class="market-card-title">NASDAQ <span>🇺🇸</span></div>
                <div class="market-card-value">${nasdaq.points.toLocaleString('pt-BR')} <span style="font-size: 1rem; color: #aaa; font-weight: 500;">pts</span></div>
                <div class="market-card-variation ${getCorVariacao(nasdaq.variation)}">
                    ${getIcone(nasdaq.variation)} ${getSinal(nasdaq.variation)}${nasdaq.variation}%
                </div>
            </div>

            <div class="market-card">
                <div class="market-card-title">Dólar (Comercial) <span>💵</span></div>
                <div class="market-card-value"><span style="font-size: 1.2rem; color: #aaa; font-weight: 500;">R$</span> ${dolar.buy.toFixed(2).replace('.', ',')}</div>
                <div class="market-card-variation ${getCorVariacao(dolar.variation)}">
                    ${getIcone(dolar.variation)} ${getSinal(dolar.variation)}${dolar.variation}%
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