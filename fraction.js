document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fractionCalculator');
    const resultDiv = document.getElementById('result');
    const operationBtns = document.querySelectorAll('.operation-btn');
    let currentOperation = 'add';

    // Operation button handling
    operationBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            operationBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentOperation = btn.getAttribute('data-operation');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get input values
        const num1 = parseInt(document.getElementById('num1').value);
        const den1 = parseInt(document.getElementById('den1').value);
        const num2 = parseInt(document.getElementById('num2').value);
        const den2 = parseInt(document.getElementById('den2').value);

        // Validate denominators
        if (den1 === 0 || den2 === 0) {
            alert('Denominators cannot be zero!');
            return;
        }

        let result, steps;
        try {
            // Perform calculation based on selected operation
            switch (currentOperation) {
                case 'add':
                    [result, steps] = addFractions(num1, den1, num2, den2);
                    break;
                case 'subtract':
                    [result, steps] = subtractFractions(num1, den1, num2, den2);
                    break;
                case 'multiply':
                    [result, steps] = multiplyFractions(num1, den1, num2, den2);
                    break;
                case 'divide':
                    [result, steps] = divideFractions(num1, den1, num2, den2);
                    break;
            }

            displayResult(result, steps);
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });

    function addFractions(num1, den1, num2, den2) {
        const steps = [];
        
        // Find common denominator
        const lcm = findLCM(den1, den2);
        steps.push(`Find common denominator (LCM of ${den1} and ${den2}): ${lcm}`);

        // Convert fractions to equivalent fractions with common denominator
        const factor1 = lcm / den1;
        const factor2 = lcm / den2;
        const newNum1 = num1 * factor1;
        const newNum2 = num2 * factor2;
        
        if (lcm !== den1 || lcm !== den2) {
            steps.push(`Convert fractions to equivalent fractions with denominator ${lcm}:`);
            steps.push(`${num1}/${den1} = ${newNum1}/${lcm}`);
            steps.push(`${num2}/${den2} = ${newNum2}/${lcm}`);
        }

        // Add numerators
        const resultNum = newNum1 + newNum2;
        steps.push(`Add numerators: ${newNum1} + ${newNum2} = ${resultNum}`);

        // Simplify result
        const simplified = simplifyFraction(resultNum, lcm);
        if (simplified[0] !== resultNum || simplified[1] !== lcm) {
            steps.push(`Simplify result: ${resultNum}/${lcm} = ${simplified[0]}/${simplified[1]}`);
        }

        return [simplified, steps];
    }

    function subtractFractions(num1, den1, num2, den2) {
        const steps = [];
        
        // Find common denominator
        const lcm = findLCM(den1, den2);
        steps.push(`Find common denominator (LCM of ${den1} and ${den2}): ${lcm}`);

        // Convert fractions to equivalent fractions with common denominator
        const factor1 = lcm / den1;
        const factor2 = lcm / den2;
        const newNum1 = num1 * factor1;
        const newNum2 = num2 * factor2;
        
        if (lcm !== den1 || lcm !== den2) {
            steps.push(`Convert fractions to equivalent fractions with denominator ${lcm}:`);
            steps.push(`${num1}/${den1} = ${newNum1}/${lcm}`);
            steps.push(`${num2}/${den2} = ${newNum2}/${lcm}`);
        }

        // Subtract numerators
        const resultNum = newNum1 - newNum2;
        steps.push(`Subtract numerators: ${newNum1} - ${newNum2} = ${resultNum}`);

        // Simplify result
        const simplified = simplifyFraction(resultNum, lcm);
        if (simplified[0] !== resultNum || simplified[1] !== lcm) {
            steps.push(`Simplify result: ${resultNum}/${lcm} = ${simplified[0]}/${simplified[1]}`);
        }

        return [simplified, steps];
    }

    function multiplyFractions(num1, den1, num2, den2) {
        const steps = [];
        
        // Multiply numerators and denominators
        const resultNum = num1 * num2;
        const resultDen = den1 * den2;
        steps.push(`Multiply numerators: ${num1} × ${num2} = ${resultNum}`);
        steps.push(`Multiply denominators: ${den1} × ${den2} = ${resultDen}`);

        // Simplify result
        const simplified = simplifyFraction(resultNum, resultDen);
        if (simplified[0] !== resultNum || simplified[1] !== resultDen) {
            steps.push(`Simplify result: ${resultNum}/${resultDen} = ${simplified[0]}/${simplified[1]}`);
        }

        return [simplified, steps];
    }

    function divideFractions(num1, den1, num2, den2) {
        if (num2 === 0) {
            throw new Error('Cannot divide by zero!');
        }

        const steps = [];
        steps.push(`To divide fractions, multiply by the reciprocal:`);
        steps.push(`${num1}/${den1} ÷ ${num2}/${den2} = ${num1}/${den1} × ${den2}/${num2}`);

        // Multiply by reciprocal
        const resultNum = num1 * den2;
        const resultDen = den1 * num2;
        steps.push(`Multiply numerators: ${num1} × ${den2} = ${resultNum}`);
        steps.push(`Multiply denominators: ${den1} × ${num2} = ${resultDen}`);

        // Simplify result
        const simplified = simplifyFraction(resultNum, resultDen);
        if (simplified[0] !== resultNum || simplified[1] !== resultDen) {
            steps.push(`Simplify result: ${resultNum}/${resultDen} = ${simplified[0]}/${simplified[1]}`);
        }

        return [simplified, steps];
    }

    function findGCD(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    function findLCM(a, b) {
        return Math.abs(a * b) / findGCD(a, b);
    }

    function simplifyFraction(num, den) {
        const gcd = findGCD(num, den);
        let simplifiedNum = num / gcd;
        let simplifiedDen = den / gcd;
        
        // Ensure negative sign is on numerator
        if (simplifiedDen < 0) {
            simplifiedNum = -simplifiedNum;
            simplifiedDen = -simplifiedDen;
        }
        
        return [simplifiedNum, simplifiedDen];
    }

    function getMixedNumber(num, den) {
        const whole = Math.floor(Math.abs(num) / den);
        const remainder = Math.abs(num) % den;
        const sign = num < 0 ? '-' : '';
        
        if (whole === 0) {
            return remainder === 0 ? '0' : `${sign}${remainder}/${den}`;
        } else if (remainder === 0) {
            return `${sign}${whole}`;
        } else {
            return `${sign}${whole} ${remainder}/${den}`;
        }
    }

    function displayResult([num, den], steps) {
        // Update fraction display
        document.getElementById('resultNum').textContent = num;
        document.getElementById('resultDen').textContent = den;
        
        // Update decimal result
        const decimal = num / den;
        document.getElementById('decimalResult').textContent = decimal.toFixed(4);
        
        // Update mixed number
        const mixedNumber = getMixedNumber(num, den);
        document.getElementById('mixedNumber').textContent = mixedNumber;
        
        // Update calculation steps
        document.getElementById('calculationSteps').innerHTML = steps.join('<br>');
        
        // Show result container
        resultDiv.style.display = 'block';

        // Initialize AdSense ads
        (adsbygoogle = window.adsbygoogle || []).push({});
    }
});