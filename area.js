document.addEventListener('DOMContentLoaded', () => {
    const shapeBtns = document.querySelectorAll('.shape-btn');
    const shapeForms = document.querySelectorAll('.shape-form');
    const resultDiv = document.getElementById('result');
    const unitSelects = document.querySelectorAll('.unit-select');

    // Initialize KaTeX auto-render
    renderMathInElement(document.body, {
        delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false}
        ]
    });

    // Shape switching
    shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            shapeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const shape = btn.getAttribute('data-shape');
            shapeForms.forEach(form => {
                form.classList.remove('active');
                if (form.id.includes(shape)) {
                    form.classList.add('active');
                }
            });

            // Hide results when switching shapes
            resultDiv.style.display = 'none';
        });
    });

    // Unit synchronization within each calculator
    unitSelects.forEach(select => {
        select.addEventListener('change', () => {
            const form = select.closest('form');
            const unitLabels = form.querySelectorAll('.unit-label');
            unitLabels.forEach(label => {
                label.textContent = select.value;
            });
        });
    });

    // Triangle calculator tab switching
    const triangleTabBtns = document.querySelectorAll('#triangleCalculator .tab-button');
    const triangleTabContents = document.querySelectorAll('#triangleCalculator .tab-content');

    triangleTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            triangleTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const tab = btn.getAttribute('data-tab');
            triangleTabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id.includes(tab)) {
                    content.classList.add('active');
                }
            });
        });
    });

    // Circle Calculator
    document.getElementById('circleCalculator').addEventListener('submit', (e) => {
        e.preventDefault();
        const radius = parseFloat(document.getElementById('circleRadius').value);
        const unit = document.getElementById('circleUnit').value;
        
        const area = Math.PI * radius * radius;
        const steps = [
            `Area = πr²`,
            `Area = π × ${radius} × ${radius}`,
            `Area = ${area.toFixed(4)}`
        ];
        
        displayResult(area, unit, 'A = \\pi r^2', steps);
    });

    // Rectangle Calculator
    document.getElementById('rectangleCalculator').addEventListener('submit', (e) => {
        e.preventDefault();
        const width = parseFloat(document.getElementById('rectWidth').value);
        const height = parseFloat(document.getElementById('rectHeight').value);
        const unit = document.getElementById('rectUnit').value;
        
        const area = width * height;
        const steps = [
            `Area = width × height`,
            `Area = ${width} × ${height}`,
            `Area = ${area.toFixed(4)}`
        ];
        
        displayResult(area, unit, 'A = w \\times h', steps);
    });

    // Triangle Calculator
    document.getElementById('triangleCalculator').addEventListener('submit', (e) => {
        e.preventDefault();
        const unit = document.getElementById('triangleUnit').value;
        let area, steps;

        if (document.getElementById('baseHeight').classList.contains('active')) {
            // Base and height method
            const base = parseFloat(document.getElementById('triangleBase').value);
            const height = parseFloat(document.getElementById('triangleHeight').value);
            
            area = (base * height) / 2;
            steps = [
                `Area = (base × height) ÷ 2`,
                `Area = (${base} × ${height}) ÷ 2`,
                `Area = ${area.toFixed(4)}`
            ];
            
            displayResult(area, unit, 'A = \\frac{b \\times h}{2}', steps);
        } else {
            // Heron's formula method
            const a = parseFloat(document.getElementById('sideA').value);
            const b = parseFloat(document.getElementById('sideB').value);
            const c = parseFloat(document.getElementById('sideC').value);
            
            // Check if triangle is possible
            if (a + b <= c || b + c <= a || a + c <= b) {
                alert('These side lengths cannot form a triangle!');
                return;
            }
            
            const s = (a + b + c) / 2; // semi-perimeter
            area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
            
            steps = [
                `Semi-perimeter (s) = (a + b + c) ÷ 2`,
                `s = (${a} + ${b} + ${c}) ÷ 2 = ${s.toFixed(4)}`,
                `Area = √(s(s-a)(s-b)(s-c))`,
                `Area = √(${s.toFixed(4)} × ${(s-a).toFixed(4)} × ${(s-b).toFixed(4)} × ${(s-c).toFixed(4)})`,
                `Area = ${area.toFixed(4)}`
            ];
            
            displayResult(area, unit, 'A = \\sqrt{s(s-a)(s-b)(s-c)}', steps);
        }
    });

    // Trapezoid Calculator
    document.getElementById('trapezoidCalculator').addEventListener('submit', (e) => {
        e.preventDefault();
        const a = parseFloat(document.getElementById('topBase').value);
        const b = parseFloat(document.getElementById('bottomBase').value);
        const h = parseFloat(document.getElementById('trapezoidHeight').value);
        const unit = document.getElementById('trapezoidUnit').value;
        
        const area = ((a + b) * h) / 2;
        const steps = [
            `Area = ((a + b) × h) ÷ 2`,
            `Area = ((${a} + ${b}) × ${h}) ÷ 2`,
            `Area = (${a + b} × ${h}) ÷ 2`,
            `Area = ${area.toFixed(4)}`
        ];
        
        displayResult(area, unit, 'A = \\frac{(a + b)h}{2}', steps);
    });

    // Ellipse Calculator
    document.getElementById('ellipseCalculator').addEventListener('submit', (e) => {
        e.preventDefault();
        const a = parseFloat(document.getElementById('semiMajor').value);
        const b = parseFloat(document.getElementById('semiMinor').value);
        const unit = document.getElementById('ellipseUnit').value;
        
        const area = Math.PI * a * b;
        const steps = [
            `Area = π × a × b`,
            `Area = π × ${a} × ${b}`,
            `Area = ${area.toFixed(4)}`
        ];
        
        displayResult(area, unit, 'A = \\pi ab', steps);
    });

    // Regular Polygon Calculator
    document.getElementById('polygonCalculator').addEventListener('submit', (e) => {
        e.preventDefault();
        const n = parseInt(document.getElementById('numSides').value);
        const s = parseFloat(document.getElementById('sideLength').value);
        const unit = document.getElementById('polygonUnit').value;
        
        // Calculate apothem (distance from center to middle of any side)
        const apothem = s / (2 * Math.tan(Math.PI / n));
        const perimeter = n * s;
        const area = (perimeter * apothem) / 2;
        
        const steps = [
            `Number of sides (n) = ${n}`,
            `Side length (s) = ${s}`,
            `Perimeter (P) = n × s = ${n} × ${s} = ${perimeter.toFixed(4)}`,
            `Apothem (a) = s ÷ (2 × tan(π/n))`,
            `Apothem = ${s} ÷ (2 × tan(π/${n})) = ${apothem.toFixed(4)}`,
            `Area = (P × a) ÷ 2`,
            `Area = (${perimeter.toFixed(4)} × ${apothem.toFixed(4)}) ÷ 2`,
            `Area = ${area.toFixed(4)}`
        ];
        
        displayResult(area, unit, 'A = \\frac{P \\times a}{2}', steps);
    });

    function displayResult(area, unit, formula, steps) {
        document.getElementById('areaValue').textContent = area.toFixed(4);
        document.getElementById('areaUnit').textContent = unit + '²';
        
        // Render formula using KaTeX
        katex.render(formula, document.getElementById('formula'), {
            throwOnError: false,
            displayMode: true
        });
        
        // Display calculation steps
        document.getElementById('steps').innerHTML = steps
            .map(step => `<div class="step">${step}</div>`)
            .join('');
        
        resultDiv.style.display = 'block';
        
        // Initialize AdSense
        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    // Initialize unit labels
    unitSelects.forEach(select => {
        const form = select.closest('form');
        const unitLabels = form.querySelectorAll('.unit-label');
        unitLabels.forEach(label => {
            label.textContent = select.value;
        });
    });
});