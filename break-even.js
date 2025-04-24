// Break-Even Calculator

function calculateBreakEven(fixedCosts, variableCosts, pricePerUnit) {
    // Prevent division by zero or negative contribution margin
    if (pricePerUnit <= variableCosts) {
        return null; // Cannot break even if price <= variable cost
    }
    const breakEvenUnits = fixedCosts / (pricePerUnit - variableCosts);
    return breakEvenUnits;
}

function updateChart(fixedCosts, variableCosts, pricePerUnit, breakEvenUnits) {
    const chart = document.getElementById('breakEvenChart');
    
    // Clear previous dynamic elements
    const dynamicElements = chart.querySelectorAll('.dynamic-element');
    dynamicElements.forEach(el => el.remove());
    
    // Calculate positions for the chart
    const maxUnits = Math.ceil(breakEvenUnits * 1.5); // Show 150% of break-even point
    const unitWidth = 500 / maxUnits; // 500 is the width of our chart (550-50)
    
    // Calculate break-even point position
    const bepX = 50 + (breakEvenUnits * unitWidth);
    const bepY = 250 - (breakEvenUnits * pricePerUnit * 200 / (maxUnits * pricePerUnit)); // Scale to fit
    
    // Update break-even point marker
    const bepCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bepCircle.setAttribute('cx', bepX);
    bepCircle.setAttribute('cy', bepY);
    bepCircle.setAttribute('r', '6');
    bepCircle.setAttribute('fill', '#3498db');
    bepCircle.classList.add('dynamic-element');
    chart.appendChild(bepCircle);
    
    // Update break-even point text
    const bepText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    bepText.setAttribute('x', bepX + 10);
    bepText.setAttribute('y', bepY - 10);
    bepText.setAttribute('font-size', '12');
    bepText.setAttribute('fill', '#3498db');
    bepText.textContent = `Break-even (${breakEvenUnits.toFixed(0)} units)`;
    bepText.classList.add('dynamic-element');
    chart.appendChild(bepText);
    
    // Update fixed cost line
    const fixedCostY = 250 - (fixedCosts * 200 / (maxUnits * pricePerUnit));
    const fixedCostLine = chart.querySelector('line:nth-of-type(3)');
    fixedCostLine.setAttribute('y1', fixedCostY);
    fixedCostLine.setAttribute('y2', fixedCostY);
    
    // Update total cost line
    const totalCostLine = chart.querySelector('line:nth-of-type(4)');
    totalCostLine.setAttribute('y1', fixedCostY);
    totalCostLine.setAttribute('y2', 250 - ((fixedCosts + variableCosts * maxUnits) * 200 / (maxUnits * pricePerUnit)));
    
    // Update revenue line
    const revenueLine = chart.querySelector('line:nth-of-type(5)');
    revenueLine.setAttribute('y2', 250 - (maxUnits * pricePerUnit * 200 / (maxUnits * pricePerUnit)));
}

function updateResults() {
    const fixedCosts = parseFloat(document.getElementById('fixedCosts').value);
    const variableCosts = parseFloat(document.getElementById('variableCosts').value);
    const pricePerUnit = parseFloat(document.getElementById('pricePerUnit').value);
    
    // Validate inputs
    if (isNaN(fixedCosts) || isNaN(variableCosts) || isNaN(pricePerUnit)) {
        document.getElementById('result').innerHTML = `<p class="error">Please enter valid numbers for all fields.</p>`;
        return;
    }
    
    if (pricePerUnit <= variableCosts) {
        document.getElementById('result').innerHTML = `
            <p class="error">Your selling price ($${pricePerUnit.toFixed(2)}) must be greater than your variable costs ($${variableCosts.toFixed(2)}).</p>
            <p>You cannot break even if your selling price doesn't exceed your variable costs.</p>
        `;
        return;
    }
    
    const breakEvenUnits = calculateBreakEven(fixedCosts, variableCosts, pricePerUnit);
    const contributionMargin = pricePerUnit - variableCosts;
    const contributionMarginRatio = contributionMargin / pricePerUnit * 100;
    
    // Update the chart
    updateChart(fixedCosts, variableCosts, pricePerUnit, breakEvenUnits);
    
    // Display detailed results
    document.getElementById('result').innerHTML = `
        <h3>Break-Even Analysis Results:</h3>
        <div class="result-grid">
            <div class="result-item">
                <span>Break-Even Point:</span>
                <strong>${breakEvenUnits.toFixed(2)} units</strong>
            </div>
            <div class="result-item">
                <span>Break-Even Revenue:</span>
                <strong>$${(breakEvenUnits * pricePerUnit).toFixed(2)}</strong>
            </div>
            <div class="result-item">
                <span>Contribution Margin:</span>
                <strong>$${contributionMargin.toFixed(2)} per unit</strong>
            </div>
            <div class="result-item">
                <span>Contribution Margin Ratio:</span>
                <strong>${contributionMarginRatio.toFixed(2)}%</strong>
            </div>
        </div>
        <p class="result-explanation">At ${breakEvenUnits.toFixed(0)} units, your revenue will equal your total costs, resulting in zero profit or loss.</p>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('calculate').addEventListener('click', updateResults);
    
    // Add example values button
    const form = document.getElementById('breakEvenForm');
    const exampleBtn = document.createElement('button');
    exampleBtn.type = 'button';
    exampleBtn.id = 'exampleBtn';
    exampleBtn.className = 'secondary-button';
    exampleBtn.textContent = 'Use Example Values';
    exampleBtn.addEventListener('click', () => {
        document.getElementById('fixedCosts').value = '10000';
        document.getElementById('variableCosts').value = '15';
        document.getElementById('pricePerUnit').value = '25';
        updateResults();
    });
    
    // Insert after the calculate button
    const calculateBtn = document.getElementById('calculate');
    calculateBtn.parentNode.insertBefore(exampleBtn, calculateBtn.nextSibling);
});