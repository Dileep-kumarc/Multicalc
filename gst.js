// GST Calculator

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gstForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('amount').value);
        const taxRate = parseFloat(document.getElementById('taxRate').value);
        
        if (isNaN(amount) || isNaN(taxRate)) {
            alert('Please enter valid numbers for amount and tax rate');
            return;
        }
        
        const gstAmount = (amount * taxRate) / 100;
        const totalAmount = amount + gstAmount;
        
        document.getElementById('result').innerHTML = `
            <h3>Calculation Results:</h3>
            <p>Original Amount: ₹${amount.toFixed(2)}</p>
            <p>GST Rate: ${taxRate}%</p>
            <p>GST Amount: ₹${gstAmount.toFixed(2)}</p>
            <p>Total Amount: ₹${totalAmount.toFixed(2)}</p>
        `;
    });
});