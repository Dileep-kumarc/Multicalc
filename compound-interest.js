document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('compoundInterestForm');
    const ctx = document.getElementById('growthChart').getContext('2d');
    let chart = null;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value) / 100;
        const years = parseInt(document.getElementById('years').value);
        const compounding = parseInt(document.getElementById('compounding').value);
        const currency = document.getElementById('currency').value;
        const currencySymbol = getCurrencySymbol(currency);

        if (chart) chart.destroy();

        const data = {
            labels: [],
            datasets: [
                {
                    label: 'Total Value',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.1
                },
                {
                    label: 'Principal',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true,
                    tension: 0.1
                }
            ]
        };

        for (let i = 0; i <= years; i++) {
            const total = principal * Math.pow(1 + rate / compounding, compounding * i);
            data.labels.push(`Year ${i}`);
            data.datasets[0].data.push(total);
            data.datasets[1].data.push(principal);
        }

        const finalTotal = data.datasets[0].data[years];

        document.getElementById('futureValue').textContent = `${currencySymbol}${finalTotal.toFixed(2)}`;
        document.getElementById('totalInterest').textContent = `${currencySymbol}${(finalTotal - principal).toFixed(2)}`;

        chart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Compound Interest Growth'
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Years'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Amount'
                        },
                        ticks: {
                            callback: function(value) {
                                return currencySymbol + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    });

    function getCurrencySymbol(currency) {
        const symbols = {
            'USD': '$',
            'INR': '₹',
            'EUR': '€',
            'GBP': '£'
        };
        return symbols[currency] || '$';
    }
});
