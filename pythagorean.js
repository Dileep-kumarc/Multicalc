document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('pythagoreanCalculator');
    const sideToFindSelect = document.getElementById('sideToFind');
    const inputA = document.getElementById('inputA');
    const inputB = document.getElementById('inputB');
    const inputC = document.getElementById('inputC');
    const sideAInput = document.getElementById('sideA');
    const sideBInput = document.getElementById('sideB');
    const sideCInput = document.getElementById('sideC');
    const resultValue = document.getElementById('resultValue');
    const calculation = document.getElementById('calculation');

    // Update form based on side to find
    sideToFindSelect.addEventListener('change', function() {
        const sideToFind = this.value;
        
        // Reset form
        form.reset();
        resultValue.textContent = '';
        calculation.textContent = '';
        
        // Show/hide appropriate inputs
        if (sideToFind === 'a') {
            inputA.style.display = 'none';
            inputB.style.display = 'block';
            inputC.style.display = 'block';
            sideBInput.required = true;
            sideCInput.required = true;
            sideAInput.required = false;
        } else if (sideToFind === 'b') {
            inputA.style.display = 'block';
            inputB.style.display = 'none';
            inputC.style.display = 'block';
            sideAInput.required = true;
            sideCInput.required = true;
            sideBInput.required = false;
        } else { // c (hypotenuse)
            inputA.style.display = 'block';
            inputB.style.display = 'block';
            inputC.style.display = 'none';
            sideAInput.required = true;
            sideBInput.required = true;
            sideCInput.required = false;
        }
    });

    // Calculate on form submit
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const sideToFind = sideToFindSelect.value;
        let a, b, c, result;
        
        // Get values based on which side we're finding
        if (sideToFind === 'a') {
            b = parseFloat(sideBInput.value);
            c = parseFloat(sideCInput.value);
            
            // Check if calculation is possible
            if (c <= b) {
                resultValue.textContent = 'Error: Hypotenuse must be greater than the other side.';
                calculation.textContent = '';
                return;
            }
            
            // Calculate side a
            result = Math.sqrt(c * c - b * b);
            calculation.innerHTML = `<p>a = √(c² - b²)</p><p>a = √(${c}² - ${b}²)</p><p>a = √(${(c*c).toFixed(4)} - ${(b*b).toFixed(4)})</p><p>a = √${(c*c - b*b).toFixed(4)}</p><p>a = ${result.toFixed(4)} ${document.getElementById('unitB').value}</p>`;
        } else if (sideToFind === 'b') {
            a = parseFloat(sideAInput.value);
            c = parseFloat(sideCInput.value);
            
            // Check if calculation is possible
            if (c <= a) {
                resultValue.textContent = 'Error: Hypotenuse must be greater than the other side.';
                calculation.textContent = '';
                return;
            }
            
            // Calculate side b
            result = Math.sqrt(c * c - a * a);
            calculation.innerHTML = `<p>b = √(c² - a²)</p><p>b = √(${c}² - ${a}²)</p><p>b = √(${(c*c).toFixed(4)} - ${(a*a).toFixed(4)})</p><p>b = √${(c*c - a*a).toFixed(4)}</p><p>b = ${result.toFixed(4)} ${document.getElementById('unitA').value}</p>`;
        } else { // c (hypotenuse)
            a = parseFloat(sideAInput.value);
            b = parseFloat(sideBInput.value);
            
            // Calculate hypotenuse
            result = Math.sqrt(a * a + b * b);
            calculation.innerHTML = `<p>c = √(a² + b²)</p><p>c = √(${a}² + ${b}²)</p><p>c = √(${(a*a).toFixed(4)} + ${(b*b).toFixed(4)})</p><p>c = √${(a*a + b*b).toFixed(4)}</p><p>c = ${result.toFixed(4)} ${document.getElementById('unitA').value}</p>`;
        }
        
        // Display result
        const unit = sideToFind === 'c' ? document.getElementById('unitA').value : 
                     sideToFind === 'a' ? document.getElementById('unitB').value :
                     document.getElementById('unitA').value;
                     
        resultValue.textContent = `${sideToFind} = ${result.toFixed(4)} ${unit}`;
    });

    // Initialize form
    sideToFindSelect.dispatchEvent(new Event('change'));
    
    // Render KaTeX formulas
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ]
        });
    }
});