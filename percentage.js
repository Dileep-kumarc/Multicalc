document.addEventListener('DOMContentLoaded', () => {
    const basicForm = document.getElementById('basicPercentage');
    const changeForm = document.getElementById('percentageChange');
    const discountForm = document.getElementById('discountCalculator');
    const resultDiv = document.getElementById('result');
    const mainResult = document.getElementById('mainResult');
    const mainResultLabel = document.getElementById('mainResultLabel');
    const secondaryResult = document.getElementById('secondaryResult');
    const secondaryResultValue = document.getElementById('secondaryResultValue');
    const secondaryResultLabel = document.getElementById('secondaryResultLabel');
    const calculationSteps = document.getElementById('calculationSteps');

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Show selected calculator form
            const targetTab = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id.includes(targetTab)) {
                    content.classList.add('active');
                }
            });

            // Hide results when switching tabs
            resultDiv.style.display = 'none';
        });
    });

    // Basic percentage calculation
    basicForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const percentage = parseFloat(document.getElementById('percentageValue').value);
        const baseValue = parseFloat(document.getElementById('baseValue').value);
        const result = (percentage / 100) * baseValue;

        mainResult.textContent = formatNumber(result);
        mainResultLabel.textContent = `${percentage}% of ${formatNumber(baseValue)}`;
        
        calculationSteps.innerHTML = `
            <strong>Calculation:</strong><br>
            ${formatNumber(baseValue)} × ${percentage}% = ${formatNumber(baseValue)} × ${percentage}/100 = ${formatNumber(result)}
        `;

        secondaryResult.style.display = 'none';
        resultDiv.style.display = 'block';
    });

    // Percentage change calculation
    changeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const oldValue = parseFloat(document.getElementById('oldValue').value);
        const newValue = parseFloat(document.getElementById('newValue').value);
        
        const change = newValue - oldValue;
        const percentageChange = (change / Math.abs(oldValue)) * 100;

        mainResult.textContent = formatNumber(percentageChange) + '%';
        mainResultLabel.textContent = 'Percentage Change';
        
        secondaryResultValue.textContent = formatNumber(Math.abs(change));
        secondaryResultLabel.textContent = `Absolute Change (${change >= 0 ? 'Increase' : 'Decrease'})`;
        
        calculationSteps.innerHTML = `
            <strong>Calculation:</strong><br>
            Change = ${formatNumber(newValue)} - ${formatNumber(oldValue)} = ${formatNumber(change)}<br>
            Percentage Change = (Change ÷ Original Value) × 100<br>
            = (${formatNumber(change)} ÷ ${formatNumber(oldValue)}) × 100 = ${formatNumber(percentageChange)}%
        `;

        secondaryResult.style.display = 'block';
        resultDiv.style.display = 'block';
    });

    // Discount calculation
    discountForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const originalPrice = parseFloat(document.getElementById('originalPrice').value);
        const discountPercent = parseFloat(document.getElementById('discountPercent').value);
        
        const discountAmount = (discountPercent / 100) * originalPrice;
        const finalPrice = originalPrice - discountAmount;

        mainResult.textContent = `$${formatNumber(finalPrice)}`;
        mainResultLabel.textContent = 'Final Price';
        
        secondaryResultValue.textContent = `$${formatNumber(discountAmount)}`;
        secondaryResultLabel.textContent = 'You Save';
        
        calculationSteps.innerHTML = `
            <strong>Calculation:</strong><br>
            Discount = ${discountPercent}% of $${formatNumber(originalPrice)}<br>
            = $${formatNumber(originalPrice)} × ${discountPercent}/100<br>
            = $${formatNumber(discountAmount)}<br><br>
            Final Price = $${formatNumber(originalPrice)} - $${formatNumber(discountAmount)}<br>
            = $${formatNumber(finalPrice)}
        `;

        secondaryResult.style.display = 'block';
        resultDiv.style.display = 'block';
    });

    function formatNumber(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return parseFloat(num.toFixed(2)).toString();
    }
});