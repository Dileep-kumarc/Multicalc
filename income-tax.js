// Income Tax Calculator

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taxForm') || document.querySelector('form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const income = parseFloat(document.getElementById('income').value);
        const deductions = parseFloat(document.getElementById('deductions').value || 0);
        
        if (isNaN(income)) {
            alert('Please enter a valid income amount');
            return;
        }
        
        const taxableIncome = income - deductions;
        let tax = 0;
        let taxBreakdown = [];
        
        // Tax brackets (adjust based on actual tax laws)
        if (taxableIncome <= 0) {
            tax = 0;
        } else {
            // First bracket: 10% on first 10,000
            const bracket1 = Math.min(taxableIncome, 10000);
            const tax1 = bracket1 * 0.10;
            if (bracket1 > 0) taxBreakdown.push(`10% on first $10,000: $${tax1.toFixed(2)}`);
            
            // Second bracket: 15% on 10,001 to 40,000
            const bracket2 = Math.max(0, Math.min(taxableIncome - 10000, 30000));
            const tax2 = bracket2 * 0.15;
            if (bracket2 > 0) taxBreakdown.push(`15% on $10,001-$40,000: $${tax2.toFixed(2)}`);
            
            // Third bracket: 25% on 40,001 to 85,000
            const bracket3 = Math.max(0, Math.min(taxableIncome - 40000, 45000));
            const tax3 = bracket3 * 0.25;
            if (bracket3 > 0) taxBreakdown.push(`25% on $40,001-$85,000: $${tax3.toFixed(2)}`);
            
            // Fourth bracket: 35% on income over 85,000
            const bracket4 = Math.max(0, taxableIncome - 85000);
            const tax4 = bracket4 * 0.35;
            if (bracket4 > 0) taxBreakdown.push(`35% on income over $85,000: $${tax4.toFixed(2)}`);
            
            tax = tax1 + tax2 + tax3 + tax4;
        }
        
        const effectiveRate = taxableIncome > 0 ? (tax / taxableIncome * 100) : 0;
        
        // Display results
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h3>Tax Calculation Results:</h3>
            <p>Gross Income: $${income.toFixed(2)}</p>
            <p>Deductions: $${deductions.toFixed(2)}</p>
            <p>Taxable Income: $${taxableIncome.toFixed(2)}</p>
            <p>Total Tax: $${tax.toFixed(2)}</p>
            <p>Effective Tax Rate: ${effectiveRate.toFixed(2)}%</p>
            <div class="tax-breakdown">
                <h4>Tax Breakdown:</h4>
                <ul>
                    ${taxBreakdown.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `;
    });
});