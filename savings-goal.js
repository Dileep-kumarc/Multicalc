document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('savingsGoalForm');
    const ctx = document.getElementById('savingsChart').getContext('2d');
    let savingsChart = null;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const goalAmount = parseFloat(document.getElementById('goalAmount').value);
        const initialDeposit = parseFloat(document.getElementById('initialDeposit').value) || 0;
        const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
        const timeFrame = parseInt(document.getElementById('timeFrame').value);
        const timeUnit = document.getElementById('timeUnit').value;
        const contributionFrequency = document.getElementById('contributionFrequency').value;
        const currency = document.getElementById('currency').value;
        
        // Convert time frame to months for calculation
        const timeFrameMonths = timeUnit === 'years' ? timeFrame * 12 : timeFrame;
        
        // Calculate payments per year based on contribution frequency
        const paymentsPerYear = {
            'monthly': 12,
            'quarterly': 4,
            'annually': 1
        }[contributionFrequency];
        
        // Calculate total number of payments
        const totalPayments = (timeFrameMonths / 12) * paymentsPerYear;
        
        // Calculate required periodic contribution
        const periodicContribution = calculatePeriodicContribution(
            goalAmount,
            initialDeposit,
            interestRate,
            totalPayments,
            paymentsPerYear
        );
        
        // Calculate total contributions and interest
        const totalContributions = periodicContribution * totalPayments;
        const totalInterest = goalAmount - initialDeposit - totalContributions;
        
        // Display results
        const currencySymbol = getCurrencySymbol(currency);
        document.getElementById('requiredContribution').textContent = 
            `${currencySymbol}${periodicContribution.toFixed(2)} per ${contributionFrequency.slice(0, -2)}${contributionFrequency === 'monthly' ? '' : 'er'}`;
        document.getElementById('totalContributions').textContent = 
            `${currencySymbol}${totalContributions.toFixed(2)}`;
        document.getElementById('totalInterest').textContent = 
            `${currencySymbol}${totalInterest.toFixed(2)}`;
        
        // Generate chart data
        generateSavingsChart(
            ctx,
            initialDeposit,
            periodicContribution,
            interestRate,
            totalPayments,
            paymentsPerYear,
            currencySymbol
        );
    });
    
    function calculatePeriodicContribution(goalAmount, initialDeposit, annualRate, numPayments, paymentsPerYear) {
        // Calculate periodic interest rate
        const periodicRate = annualRate / paymentsPerYear;
        
        // Calculate required periodic payment using the formula for future value of annuity
        // FV = P * ((1 + r)^n - 1) / r
        // Solving for P: P = FV * r / ((1 + r)^n - 1)
        const targetAmount = goalAmount - initialDeposit * Math.pow(1 + periodicRate, numPayments);
        const contribution = targetAmount * periodicRate / (Math.pow(1 + periodicRate, numPayments) - 1);
        
        return contribution;
    }
    
    function generateSavingsChart(ctx, initialDeposit, periodicContribution, annualRate, numPayments, paymentsPerYear, currencySymbol) {
        // Clear previous chart if exists
        if (savingsChart) {
            savingsChart.destroy();
        }
        
        // Calculate periodic interest rate
        const periodicRate = annualRate / paymentsPerYear;
        
        // Generate data points for chart
        const labels = [];
        const balanceData = [];
        const contributionsData = [];
        const interestData = [];
        
        let balance = initialDeposit;
        let totalContributions = initialDeposit;
        let totalInterest = 0;
        
        // Add initial point
        labels.push('Start');
        balanceData.push(balance);
        contributionsData.push(totalContributions);
        interestData.push(totalInterest);
        
        // Calculate balance at each payment period
        for (let i = 1; i <= numPayments; i++) {
            // Add contribution
            balance += periodicContribution;
            totalContributions += periodicContribution;
            
            // Add interest
            const interest = balance * periodicRate;
            balance += interest;
            totalInterest += interest;
            
            // Add data point
            const period = Math.ceil(i / (numPayments / (numPayments > 24 ? 12 : numPayments)));
            if (i === numPayments || i % Math.ceil(numPayments / (numPayments > 24 ? 12 : numPayments)) === 0) {
                labels.push(`Period ${period}`);
                balanceData.push(balance);
                contributionsData.push(totalContributions);
                interestData.push(totalInterest);
            }
        }
        
        // Create chart
        savingsChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Total Balance',
                        data: balanceData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Contributions',
                        data: contributionsData,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        fill: true
                    },
                    {
                        label: 'Interest',
                        data: interestData,
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        borderColor: 'rgba(255, 206, 86, 1)',
                        borderWidth: 2,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return currencySymbol + value.toLocaleString();
                            }
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
                    }
                }
            }
        });
    }
    
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