document.addEventListener("DOMContentLoaded", function () {
    const pools = [1, 2, 3];
    let totalDraws = 0;
    let upTotals = [0, 0, 0];
    let downTotals = [0, 0, 0];
    let rates = [0, 0, 0];
    const ctx = document.getElementById('poolsChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['卡池1', '卡池2', '卡池3'],
            datasets: [{
                label: '出货率',
                type: 'line',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 0,
                pointBorderWidth: 2,
                pointStyle: 'line',
                pointRadius: 100,
                fill: false,
                data: [0, 0, 0]
            }, {
                label: '置信区间',
                backgroundColor: '#4285F4',
                data: [[0, 0], [0, 0], [0, 0]]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 更新图表的函数
    function updateChart() {
        pools.forEach((poolNumber, index) => {
            const up = upTotals[index];
            const down = downTotals[index];
            const total = up + down;
            const rate = (total > 0) ? up / total : 0;
            const delta = (total > 0) ? Math.sqrt(Math.log(totalDraws) / (2 * total)) * rate : 0;

            chart.data.datasets[0].data[index] = rate;
            chart.data.datasets[1].data[index][1] = rate + delta;
            chart.data.datasets[1].data[index][0] = rate - delta;
        });
        chart.update();
    }

    function updateAllDeltas() {
        pools.forEach((poolNumber, index) => {
            let draws = upTotals[index] + downTotals[index];
            let rate = rates[index];
            let delta = (draws > 0) ? Math.sqrt(Math.log(totalDraws) / (2 * draws)) : 0;
            document.getElementById(`pool${poolNumber}Delta`).textContent = delta.toFixed(4);
            document.getElementById(`pool${poolNumber}UCB`).textContent = (rate + delta).toFixed(4);
        });
    }

    pools.forEach(poolNumber => {
        document.getElementById(`drawPool${poolNumber}`).addEventListener('click', function () {
            let upInput = parseInt(document.getElementById(`pool${poolNumber}up`).value, 10) || 0;
            let downInput = parseInt(document.getElementById(`pool${poolNumber}down`).value, 10) || 0;

            upTotals[poolNumber - 1] += upInput;
            downTotals[poolNumber - 1] += downInput;
            let draws = upInput + downInput;
            totalDraws += draws;

            document.getElementById(`pool${poolNumber}upTotal`).textContent = upTotals[poolNumber - 1];
            document.getElementById(`pool${poolNumber}downTotal`).textContent = downTotals[poolNumber - 1];
            document.getElementById(`pool${poolNumber}Draws`).textContent = upTotals[poolNumber - 1] + downTotals[poolNumber - 1];
            let rate = (upTotals[poolNumber - 1] > 0) ? upTotals[poolNumber - 1] / (upTotals[poolNumber - 1] + downTotals[poolNumber - 1]) * 100 : 0;
            rates[poolNumber - 1] = rate / 100;
            document.getElementById(`pool${poolNumber}Rate`).textContent = rate.toFixed(2) + '%';

            document.getElementById('totalDraws').textContent = totalDraws;

            updateAllDeltas();

            updateChart();

            document.getElementById(`pool${poolNumber}up`).value = "";
            document.getElementById(`pool${poolNumber}down`).value = "";
        });
    });
});
