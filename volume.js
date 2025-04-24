document.addEventListener('DOMContentLoaded', () => {
    const shapeBtns = document.querySelectorAll('.shape-btn');
    const shapeForms = document.querySelectorAll('.shape-form');
    const resultContainer = document.getElementById('result');

    // Unit conversion factors (to cubic centimeters)
    const unitFactors = {
        mm: 0.001,
        cm: 1,
        m: 1000000,
        in: 16.3871,
        ft: 28316.8
    };

    // Show/hide calculators based on selected shape
    shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const shape = btn.dataset.shape;
            shapeBtns.forEach(b => b.classList.remove('active'));
            shapeForms.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${shape}Calculator`).classList.add('active');
            resultContainer.style.display = 'none';
        });
    });

    // Handle form submissions
    shapeForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const shape = form.id.replace('Calculator', '');
            calculateVolume(shape);
        });
    });

    function calculateVolume(shape) {
        let volume = 0;
        let formula = '';
        let steps = [];
        let unit = document.getElementById(`${shape}Unit`).value;

        switch (shape) {
            case 'cube':
                const length = parseFloat(document.getElementById('cubeLength').value);
                const width = parseFloat(document.getElementById('cubeWidth').value);
                const height = parseFloat(document.getElementById('cubeHeight').value);
                volume = length * width * height;
                formula = `V = l × w × h`;
                steps.push(`Length (l) = ${length} ${unit}`);
                steps.push(`Width (w) = ${width} ${unit}`);
                steps.push(`Height (h) = ${height} ${unit}`);
                steps.push(`Volume = ${length} × ${width} × ${height} = ${volume} ${unit}³`);
                break;

            case 'sphere':
                const radius = parseFloat(document.getElementById('sphereRadius').value);
                volume = (4/3) * Math.PI * Math.pow(radius, 3);
                formula = `V = \\frac{4}{3}πr³`;
                steps.push(`Radius (r) = ${radius} ${unit}`);
                steps.push(`Volume = (4/3) × π × ${radius}³`);
                steps.push(`Volume = ${volume.toFixed(4)} ${unit}³`);
                break;

            case 'cylinder':
                const cylRadius = parseFloat(document.getElementById('cylinderRadius').value);
                const cylHeight = parseFloat(document.getElementById('cylinderHeight').value);
                volume = Math.PI * Math.pow(cylRadius, 2) * cylHeight;
                formula = `V = πr²h`;
                steps.push(`Radius (r) = ${cylRadius} ${unit}`);
                steps.push(`Height (h) = ${cylHeight} ${unit}`);
                steps.push(`Volume = π × ${cylRadius}² × ${cylHeight}`);
                steps.push(`Volume = ${volume.toFixed(4)} ${unit}³`);
                break;

            case 'cone':
                const coneRadius = parseFloat(document.getElementById('coneRadius').value);
                const coneHeight = parseFloat(document.getElementById('coneHeight').value);
                volume = (1/3) * Math.PI * Math.pow(coneRadius, 2) * coneHeight;
                formula = `V = \\frac{1}{3}πr²h`;
                steps.push(`Radius (r) = ${coneRadius} ${unit}`);
                steps.push(`Height (h) = ${coneHeight} ${unit}`);
                steps.push(`Volume = (1/3) × π × ${coneRadius}² × ${coneHeight}`);
                steps.push(`Volume = ${volume.toFixed(4)} ${unit}³`);
                break;

            case 'pyramid':
                const pyramidLength = parseFloat(document.getElementById('pyramidLength').value);
                const pyramidWidth = parseFloat(document.getElementById('pyramidWidth').value);
                const pyramidHeight = parseFloat(document.getElementById('pyramidHeight').value);
                volume = (1/3) * pyramidLength * pyramidWidth * pyramidHeight;
                formula = `V = \\frac{1}{3} × l × w × h`;
                steps.push(`Base Length (l) = ${pyramidLength} ${unit}`);
                steps.push(`Base Width (w) = ${pyramidWidth} ${unit}`);
                steps.push(`Height (h) = ${pyramidHeight} ${unit}`);
                steps.push(`Volume = (1/3) × ${pyramidLength} × ${pyramidWidth} × ${pyramidHeight}`);
                steps.push(`Volume = ${volume.toFixed(4)} ${unit}³`);
                break;

            case 'prism':
                const prismBase = parseFloat(document.getElementById('prismBase').value);
                const prismHeight = parseFloat(document.getElementById('prismHeight').value);
                const prismLength = parseFloat(document.getElementById('prismLength').value);
                volume = (1/2) * prismBase * prismHeight * prismLength;
                formula = `V = \\frac{1}{2} × b × h × l`;
                steps.push(`Base (b) = ${prismBase} ${unit}`);
                steps.push(`Height (h) = ${prismHeight} ${unit}`);
                steps.push(`Length (l) = ${prismLength} ${unit}`);
                steps.push(`Volume = (1/2) × ${prismBase} × ${prismHeight} × ${prismLength}`);
                steps.push(`Volume = ${volume.toFixed(4)} ${unit}³`);
                break;
        }

        // Convert result if needed
        const convertedVolume = volume * Math.pow(unitFactors[unit], 3);

        // Display results
        document.getElementById('volumeValue').textContent = convertedVolume.toFixed(4);
        document.getElementById('volumeUnit').textContent = `${unit}³`;
        document.getElementById('formula').innerHTML = '';
        katex.render(formula, document.getElementById('formula'));
        
        const stepsHtml = steps.map(step => `<div class="step">${step}</div>`).join('');
        document.getElementById('steps').innerHTML = stepsHtml;
        resultContainer.style.display = 'block';
    }
});