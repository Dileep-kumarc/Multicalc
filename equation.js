document.addEventListener('DOMContentLoaded', () => {
    const linearForm = document.getElementById('linearSolver');
    const quadraticForm = document.getElementById('quadraticSolver');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    const resultDiv = document.getElementById('result');
    const graphContainer = document.getElementById('graphContainer');

    // KaTeX auto-render
    renderMathInElement(document.body, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
        ]
    });

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const targetTab = button.getAttribute('data-tab');
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id.includes(targetTab)) {
                    content.classList.add('active');
                }
            });

            resultDiv.style.display = 'none';
            graphContainer.style.display = 'none';
        });
    });

    const updateLinearPreview = () => {
        const a = document.getElementById('linearA').value || 'a';
        const b = document.getElementById('linearB').value || 'b';
        const c = document.getElementById('linearC').value || 'c';
        katex.render(`${a}x + ${b} = ${c}`, document.getElementById('linearPreview'), { throwOnError: false });
    };

    const updateQuadraticPreview = () => {
        const a = document.getElementById('quadraticA').value || 'a';
        const b = document.getElementById('quadraticB').value || 'b';
        const c = document.getElementById('quadraticC').value || 'c';
        katex.render(`${a}x^2 + ${b}x + ${c} = 0`, document.getElementById('quadraticPreview'), { throwOnError: false });
    };

    ['linearA', 'linearB', 'linearC'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateLinearPreview);
    });
    ['quadraticA', 'quadraticB', 'quadraticC'].forEach(id => {
        document.getElementById(id).addEventListener('input', updateQuadraticPreview);
    });

    updateLinearPreview();
    updateQuadraticPreview();

    linearForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const a = parseFloat(document.getElementById('linearA').value);
        const b = parseFloat(document.getElementById('linearB').value);
        const c = parseFloat(document.getElementById('linearC').value);

        if (a === 0) {
            alert("Coefficient 'a' cannot be zero in a linear equation.");
            return;
        }

        const steps = [];
        const rhs = c - b;
        const x = rhs / a;

        steps.push(`Original equation: ${a}x + ${b} = ${c}`);
        steps.push(`Subtract ${b} from both sides: ${a}x = ${rhs}`);
        steps.push(`Divide both sides by ${a}: x = ${x}`);

        displaySolution(`x = ${x}`, steps);
        plotLinearGraph(a, b, c);
    });

    quadraticForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const a = parseFloat(document.getElementById('quadraticA').value);
        const b = parseFloat(document.getElementById('quadraticB').value);
        const c = parseFloat(document.getElementById('quadraticC').value);

        if (a === 0) {
            alert("Coefficient 'a' cannot be zero in a quadratic equation.");
            return;
        }

        const steps = [];
        const discriminant = b * b - 4 * a * c;
        steps.push(`Standard form: ${a}x² + ${b}x + ${c} = 0`);
        steps.push(`Discriminant (b² - 4ac): ${b}² - 4(${a})(${c}) = ${discriminant}`);

        let solution;
        if (discriminant > 0) {
            const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
            const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
            steps.push(`x₁ = ${x1}`);
            steps.push(`x₂ = ${x2}`);
            solution = `x₁ = ${x1}, x₂ = ${x2}`;
        } else if (discriminant === 0) {
            const x = -b / (2 * a);
            steps.push(`x = ${x}`);
            solution = `x = ${x}`;
        } else {
            const real = -b / (2 * a);
            const imag = Math.sqrt(-discriminant) / (2 * a);
            steps.push(`x₁ = ${real} + ${imag}i`);
            steps.push(`x₂ = ${real} - ${imag}i`);
            solution = `x₁ = ${real} + ${imag}i, x₂ = ${real} - ${imag}i`;
        }

        displaySolution(solution, steps);
        plotQuadraticGraph(a, b, c);
    });

    function displaySolution(solution, steps) {
        document.getElementById('solution').textContent = solution;
        document.getElementById('steps').innerHTML = steps.map(step => `<div class="step">${step}</div>`).join('');
        resultDiv.style.display = 'block';
        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    function plotLinearGraph(a, b, c) {
        const x = [-10, 10];
        const y = x.map(xi => (c - b) / a);
        const trace = {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines',
            name: `${a}x + ${b} = ${c}`
        };
        Plotly.newPlot('graph', [trace], {
            title: 'Linear Function Graph',
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
            hovermode: 'closest'
        });
        graphContainer.style.display = 'block';
    }

    function plotQuadraticGraph(a, b, c) {
        const x = [], y = [];
        for (let i = -10; i <= 10; i += 0.1) {
            x.push(i);
            y.push(a * i * i + b * i + c);
        }
        const trace = {
            x: x,
            y: y,
            type: 'scatter',
            mode: 'lines',
            name: `${a}x² + ${b}x + ${c}`
        };
        Plotly.newPlot('graph', [trace], {
            title: 'Quadratic Function Graph',
            xaxis: { title: 'x' },
            yaxis: { title: 'y' },
            hovermode: 'closest'
        });
        graphContainer.style.display = 'block';
    }
});
