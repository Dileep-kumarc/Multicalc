document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('simpleInterestForm');
    const ctx = document.getElementById('growthChart').getContext('2d');
    let chart = null;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const principal = parseFloat(document.getElementById('principal').value);
        const rate = parseFloat(document.getElementById('rate').value);
        const years = parseFloat(document.getElementById('years').value);
        const currency = document.getElementById('currency').value;
        const currencySymbol = getCurrencySymbol(currency);
        
        // Clear previous chart if it exists
        if (chart) {
            chart.destroy();
        }
        
        const totalInterest = (principal * rate * years) / 100;
        const futureValue = principal + totalInterest;
        
        document.getElementById('futureValue').textContent = `${currencySymbol}${futureValue.toFixed(2)}`;
        document.getElementById('totalInterest').textContent = `${currencySymbol}${totalInterest.toFixed(2)}`;
        
        const chartData = {
            labels: Array.from({length: years + 1}, (_, i) => `Year ${i}`),
            datasets: [
                {
                    label: 'Total Value',
                    data: Array.from({length: years + 1}, (_, i) => principal + (principal * rate * i) / 100),
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true
                },
                {
                    label: 'Principal',
                    data: Array.from({length: years + 1}, (_, i) => principal),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: true
                }
            ]
        };
        
        chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return currencySymbol + value.toLocaleString();
                            }
                        },
                        title: {
                            display: true,
                            text: 'Amount'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Years'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ' + currencySymbol + context.raw.toFixed(2);
                            }
                        }
                    },
                    title: {
                        display: true,
                        text: 'Simple Interest Growth'
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