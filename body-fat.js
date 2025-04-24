document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bodyFatCalculator');
    const result = document.getElementById('result');
    const unitToggles = document.querySelectorAll('input[name="unit"]');
    const genderSelect = document.getElementById('gender');
    const hipGroup = document.getElementById('hipGroup');

    // Unit labels
    const heightUnit = document.getElementById('heightUnit');
    const weightUnit = document.getElementById('weightUnit');
    const neckUnit = document.getElementById('neckUnit');
    const waistUnit = document.getElementById('waistUnit');
    const hipUnit = document.getElementById('hipUnit');

    // Show/hide hip measurement based on gender
    genderSelect.addEventListener('change', () => {
        hipGroup.style.display = genderSelect.value === 'female' ? 'block' : 'none';
        document.getElementById('hip').required = genderSelect.value === 'female';
    });

    // Handle unit changes
    unitToggles.forEach(radio => {
        radio.addEventListener('change', () => {
            const isMetric = radio.value === 'metric';
            heightUnit.textContent = isMetric ? 'cm' : 'inches';
            weightUnit.textContent = isMetric ? 'kg' : 'lbs';
            neckUnit.textContent = isMetric ? 'cm' : 'inches';
            waistUnit.textContent = isMetric ? 'cm' : 'inches';
            hipUnit.textContent = isMetric ? 'cm' : 'inches';
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const unit = document.querySelector('input[name="unit"]:checked').value;
        const gender = document.getElementById('gender').value;
        let height = parseFloat(document.getElementById('height').value);
        let weight = parseFloat(document.getElementById('weight').value);
        let neck = parseFloat(document.getElementById('neck').value);
        let waist = parseFloat(document.getElementById('waist').value);
        let hip = parseFloat(document.getElementById('hip').value || 0);

        // Convert imperial to metric if needed
        if (unit === 'imperial') {
            height *= 2.54;  // inches to cm
            weight *= 0.453592;  // lbs to kg
            neck *= 2.54;  // inches to cm
            waist *= 2.54;  // inches to cm
            if (hip > 0) hip *= 2.54;  // inches to cm
        }

        const bodyFat = calculateBodyFat(gender, height, neck, waist, hip);
        const category = getBodyFatCategory(gender, bodyFat);

        document.getElementById('bodyFatValue').textContent = bodyFat.toFixed(1);
        document.getElementById('bodyFatCategory').textContent = category;
        document.getElementById('bodyFatCategory').className = 'bodyfat-category ' + category.toLowerCase().replace(' ', '-');

        result.style.display = 'block';
    });
});

function calculateBodyFat(gender, height, neck, waist, hip) {
    if (gender === 'male') {
        return 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(height)) - 450;
    } else {
        return 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.22100 * Math.log10(height)) - 450;
    }
}

function getBodyFatCategory(gender, bodyFat) {
    if (gender === 'male') {
        if (bodyFat < 6) return 'Essential Fat';
        if (bodyFat < 14) return 'Athletes';
        if (bodyFat < 18) return 'Fitness';
        if (bodyFat < 25) return 'Average';
        return 'Obese';
    } else {
        if (bodyFat < 14) return 'Essential Fat';
        if (bodyFat < 21) return 'Athletes';
        if (bodyFat < 25) return 'Fitness';
        if (bodyFat < 32) return 'Average';
        return 'Obese';
    }
}