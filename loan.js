document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loanCalculator');
    const result = document.getElementById('result');
    const termUnit = document.getElementById('termUnit');
    const loanTerm = document.getElementById('loanTerm');

    // Update max term based on unit selection
    termUnit.addEventListener('change', () => {
        loanTerm.max = termUnit.value === 'years' ? 30 : 360;
        loanTerm.value = Math.min(loanTerm.value, loanTerm.max);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let amount = parseFloat(document.getElementById('loanAmount').value);
        let rate = parseFloat(document.getElementById('interestRate').value);
        let term = parseInt(document.getElementById('loanTerm').value);
        
        // Convert years to months if needed
        if (termUnit.value === 'years') {
            term *= 12;
        }

        // Convert annual rate to monthly
        const monthlyRate = rate / 12 / 100;

        // Calculate monthly payment using the loan payment formula
        // P = L[c(1 + c)^n]/[(1 + c)^n - 1]
        // Where: P = Monthly Payment, L = Loan Amount, c = Monthly Interest Rate, n = Total Number of Months
        const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
        
        const totalPayment = monthlyPayment * term;
        const totalInterest = totalPayment - amount;

        // Update summary results
        document.getElementById('monthlyPayment').textContent = formatCurrency(monthlyPayment);
        document.getElementById('totalInterest').textContent = formatCurrency(totalInterest);
        document.getElementById('totalPayment').textContent = formatCurrency(totalPayment);

        // Generate amortization schedule
        generateAmortizationSchedule(amount, monthlyRate, term, monthlyPayment);

        result.style.display = 'block';
    });
});

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function generateAmortizationSchedule(principal, monthlyRate, term, monthlyPayment) {
    const tbody = document.querySelector('#amortizationTable tbody');
    tbody.innerHTML = '';

    let remainingBalance = principal;
    let totalInterest = 0;

    for (let month = 1; month <= term; month++) {
        const interestPayment = remainingBalance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        remainingBalance -= principalPayment;
        totalInterest += interestPayment;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${month}</td>
            <td>${formatCurrency(monthlyPayment)}</td>
            <td>${formatCurrency(principalPayment)}</td>
            <td>${formatCurrency(interestPayment)}</td>
            <td>${formatCurrency(Math.max(0, remainingBalance))}</td>
        `;
        tbody.appendChild(row);

        // Add class for alternating rows
        if (month % 2 === 0) {
            row.classList.add('alternate-row');
        }
    }
}