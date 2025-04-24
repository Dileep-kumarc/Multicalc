document.addEventListener('DOMContentLoaded', () => {
    const expressionDisplay = document.getElementById('expression');
    const resultDisplay = document.getElementById('result');
    const historyList = document.getElementById('historyList');
    const degreeModeBtn = document.getElementById('degreeMode');
    const radianModeBtn = document.getElementById('radianMode');
    
    let currentExpression = '';
    let lastResult = 0;
    let isDegreeMode = true;
    let history = [];

    // Constants
    const PI = Math.PI;
    const E = Math.E;

    // Mode switching
    degreeModeBtn.addEventListener('click', () => {
        isDegreeMode = true;
        degreeModeBtn.classList.add('active');
        radianModeBtn.classList.remove('active');
    });

    radianModeBtn.addEventListener('click', () => {
        isDegreeMode = false;
        radianModeBtn.classList.add('active');
        degreeModeBtn.classList.remove('active');
    });

    // Add event listeners to all buttons
    document.querySelectorAll('.calc-buttons button').forEach(button => {
        button.addEventListener('click', () => {
            const action = button.getAttribute('data-action');
            if (action) {
                handleAction(action);
            } else {
                appendNumber(button.textContent);
            }
        });
    });

    // Handle clearing history
    document.getElementById('clearHistory').addEventListener('click', () => {
        history = [];
        updateHistoryDisplay();
    });

    function handleAction(action) {
        switch(action) {
            case 'clear':
                clearCalculator();
                break;
            case 'delete':
                deleteLastChar();
                break;
            case 'equals':
                calculateResult();
                break;
            case 'decimal':
                appendDecimal();
                break;
            case 'openParen':
                appendToExpression('(');
                break;
            case 'closeParen':
                appendToExpression(')');
                break;
            case 'add':
                appendToExpression('+');
                break;
            case 'subtract':
                appendToExpression('-');
                break;
            case 'multiply':
                appendToExpression('*');
                break;
            case 'divide':
                appendToExpression('/');
                break;
            case 'percentage':
                calculatePercentage();
                break;
            case 'factorial':
                calculateFactorial();
                break;
            case 'sin':
                appendFunction('sin');
                break;
            case 'cos':
                appendFunction('cos');
                break;
            case 'tan':
                appendFunction('tan');
                break;
            case 'power':
                appendToExpression('^');
                break;
            case 'sqrt':
                appendFunction('sqrt');
                break;
            case 'log':
                appendFunction('log');
                break;
            case 'ln':
                appendFunction('ln');
                break;
            case 'pi':
                appendToExpression('π');
                break;
            case 'e':
                appendToExpression('e');
                break;
            case 'inverse':
                calculateInverse();
                break;
            case 'exp':
                appendFunction('exp');
                break;
            case 'abs':
                appendFunction('abs');
                break;
        }
        updateDisplay();
    }

    function appendNumber(number) {
        currentExpression += number;
        updateDisplay();
    }

    function appendDecimal() {
        if (!currentExpression.endsWith('.')) {
            currentExpression += '.';
            updateDisplay();
        }
    }

    function appendFunction(func) {
        currentExpression += `${func}(`;
        updateDisplay();
    }

    function appendToExpression(value) {
        currentExpression += value;
        updateDisplay();
    }

    function clearCalculator() {
        currentExpression = '';
        lastResult = 0;
        updateDisplay();
    }

    function deleteLastChar() {
        currentExpression = currentExpression.slice(0, -1);
        updateDisplay();
    }

    function updateDisplay() {
        expressionDisplay.textContent = formatExpression(currentExpression);
        try {
            const result = evaluateExpression(currentExpression);
            if (!isNaN(result) && isFinite(result)) {
                resultDisplay.textContent = formatNumber(result);
                lastResult = result;
            }
        } catch (e) {
            // Don't update result if expression is invalid
        }
    }

    function formatExpression(expr) {
        return expr
            .replace(/\*/g, '×')
            .replace(/\//g, '÷')
            .replace(/pi/g, 'π')
            .replace(/\^/g, '^');
    }

    function formatNumber(num) {
        if (Number.isInteger(num)) {
            return num.toString();
        }
        return num.toFixed(8).replace(/\.?0+$/, '');
    }

    function calculateResult() {
        try {
            const result = evaluateExpression(currentExpression);
            if (!isNaN(result) && isFinite(result)) {
                // Add to history
                history.unshift({
                    expression: formatExpression(currentExpression),
                    result: formatNumber(result)
                });
                updateHistoryDisplay();

                // Update display
                currentExpression = result.toString();
                lastResult = result;
                updateDisplay();
            }
        } catch (e) {
            resultDisplay.textContent = 'Error';
        }
    }

    function updateHistoryDisplay() {
        historyList.innerHTML = history
            .map(item => `
                <div class="history-item">
                    <div class="history-expression">${item.expression}</div>
                    <div class="history-result">${item.result}</div>
                </div>
            `)
            .join('');
    }

    function evaluateExpression(expr) {
        // Replace mathematical constants
        expr = expr.replace(/π/g, Math.PI.toString())
                  .replace(/e/g, Math.E.toString());

        // Handle trigonometric functions
        expr = expr.replace(/sin\((.*?)\)/g, (match, angle) => {
            const value = evaluateExpression(angle);
            return Math.sin(isDegreeMode ? value * Math.PI / 180 : value);
        });
        expr = expr.replace(/cos\((.*?)\)/g, (match, angle) => {
            const value = evaluateExpression(angle);
            return Math.cos(isDegreeMode ? value * Math.PI / 180 : value);
        });
        expr = expr.replace(/tan\((.*?)\)/g, (match, angle) => {
            const value = evaluateExpression(angle);
            return Math.tan(isDegreeMode ? value * Math.PI / 180 : value);
        });

        // Handle other mathematical functions
        expr = expr.replace(/sqrt\((.*?)\)/g, (match, num) => {
            return Math.sqrt(evaluateExpression(num));
        });
        expr = expr.replace(/log\((.*?)\)/g, (match, num) => {
            return Math.log10(evaluateExpression(num));
        });
        expr = expr.replace(/ln\((.*?)\)/g, (match, num) => {
            return Math.log(evaluateExpression(num));
        });
        expr = expr.replace(/abs\((.*?)\)/g, (match, num) => {
            return Math.abs(evaluateExpression(num));
        });
        expr = expr.replace(/exp\((.*?)\)/g, (match, num) => {
            return Math.exp(evaluateExpression(num));
        });

        // Handle power operation
        expr = expr.replace(/(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g, (match, base, exp) => {
            return Math.pow(parseFloat(base), parseFloat(exp));
        });

        // Use Function constructor to evaluate the expression safely
        try {
            return Function(`'use strict'; return (${expr});`)();
        } catch (e) {
            throw new Error('Invalid expression');
        }
    }

    function calculateFactorial() {
        try {
            const num = evaluateExpression(currentExpression);
            if (num < 0 || !Number.isInteger(num)) {
                throw new Error('Invalid factorial input');
            }
            let result = 1;
            for (let i = 2; i <= num; i++) {
                result *= i;
            }
            currentExpression = result.toString();
            updateDisplay();
        } catch (e) {
            resultDisplay.textContent = 'Error';
        }
    }

    function calculatePercentage() {
        try {
            const value = evaluateExpression(currentExpression);
            currentExpression = (value / 100).toString();
            updateDisplay();
        } catch (e) {
            resultDisplay.textContent = 'Error';
        }
    }

    function calculateInverse() {
        try {
            const value = evaluateExpression(currentExpression);
            if (value === 0) {
                throw new Error('Division by zero');
            }
            currentExpression = (1 / value).toString();
            updateDisplay();
        } catch (e) {
            resultDisplay.textContent = 'Error';
        }
    }

    // Initialize calculator
    clearCalculator();
});