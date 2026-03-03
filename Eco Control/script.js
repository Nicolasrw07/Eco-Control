// Configuração Global do Chart.js para temas escuros
Chart.defaults.color = '#94a3b8'; // var(--text-dim)
Chart.defaults.font.family = "'Rajdhani', sans-serif";

// --- INICIALIZAÇÃO DOS GRÁFICOS ---

// 1. Gráfico de Histórico (Linha Interativo)
const ctxLine = document.getElementById('consumptionLineChart').getContext('2d');
const lineChart = new Chart(ctxLine, {
    type: 'line',
    data: {
        labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '23:59'],
        datasets: [{
            label: 'Consumo Total',
            data: [1.1, 0.9, 0.7, 1.3, 2.8, 3.5, 3.9, 3.2, 2.1, 4.3, 4.9, 2.8, 1.5],
            borderColor: '#00f2ff', // var(--primary-cyan)
            borderWidth: 3,
            backgroundColor: 'rgba(0, 242, 255, 0.05)',
            fill: true,
            tension: 0.4,
            pointRadius: 4,
            pointBackgroundColor: '#00f2ff',
            pointBorderColor: '#050609',
            pointHoverRadius: 7,
            pointHoverBackgroundColor: '#fff'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(17, 25, 40, 0.9)',
                titleFont: { size: 14, weight: 'bold' },
                bodyFont: { size: 13 },
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context) => `Pico: ${context.parsed.y} kW`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { callback: (value) => value + ' kW' }
            },
            x: {
                grid: { display: false }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        }
    }
});

// 2. Medidor Principal (Gauge - Simples)
const ctxGauge = document.getElementById('mainGaugeCanvas').getContext('2d');
const gaugeChart = new Chart(ctxGauge, {
    type: 'doughnut',
    data: {
        datasets: [{
            data: [3.45, 1.55], // Consumo atual vs Restante da escala
            backgroundColor: ['#00f2ff', '#111928'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
            borderRadius: 10
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '85%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: false }
        }
    }
});

// --- FUNCIONALIDADES DO DASHBOARD ---

// 1. Simulação de Dados em Tempo Real (Oscilação)
const powerEl = document.getElementById('power-value');
const voltEl = document.getElementById('volt-value');
const ampEl = document.getElementById('amp-value');

function updateDashboardData() {
    // Oscilação suave da potência (kW)
    const basePower = 3.4;
    const powerNoise = (Math.random() - 0.5) * 0.4; // +/- 0.2
    const currentPower = (basePower + powerNoise).toFixed(1);
    
    // Atualiza texto e gráfico gauge
    powerEl.innerText = currentPower;
    gaugeChart.data.datasets[0].data = [currentPower, 5 - currentPower]; // Escala max 5kW
    gaugeChart.update('none'); // Update sem animação para performance

    // Oscilação da voltagem (V)
    const currentVolt = (127 + (Math.random() - 0.5) * 2).toFixed(1);
    voltEl.innerHTML = `${currentVolt}<span>V</span>`;

    // Cálculo e oscilação da corrente (A)
    const currentAmp = ((currentPower * 1000) / currentVolt).toFixed(1);
    ampEl.innerHTML = `${currentAmp}<span>A</span>`;
}

// Atualiza a cada 2.5 segundos
setInterval(updateDashboardData, 2500);
// Executa uma vez no início
updateDashboardData();


// 2. Modo Tela Cheia
const fullscreenBtn = document.getElementById('fullscreen-btn');
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.error(`Erro ao tentar ativar tela cheia: ${err.message}`);
        });
        fullscreenBtn.querySelector('span').innerText = 'fullscreen_exit';
    } else {
        document.exitFullscreen();
        fullscreenBtn.querySelector('span').innerText = 'fullscreen';
    }
});


// 3. Feedback nos Filtros do Gráfico
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        // Aqui você adicionaria a lógica para atualizar os dados do gráfico 'lineChart'
    });
});


// 4. Simulação de Insight da IA
const aiBtn = document.querySelector('.ai-assistant-btn');
aiBtn.addEventListener('click', () => {
    alert("Insight da EnergyCore AI:\n\nDetectamos um padrão de consumo elevado na 'Cozinha' entre 18h e 20h nos últimos 3 dias. Sugerimos verificar se há eletrodomésticos ligados desnecessariamente neste horário.");
});