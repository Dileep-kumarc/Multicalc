document.addEventListener('DOMContentLoaded', () => {
    const speedForm = document.getElementById('speedForm');
    const distanceForm = document.getElementById('distanceForm');
    const timeForm = document.getElementById('timeForm');
    const result = document.getElementById('result');
    const resultValue = document.getElementById('resultValue');
    const resultLabel = document.getElementById('resultLabel');
    const calculationSteps = document.getElementById('calculationSteps');
    const speedConversions = document.getElementById('speedConversions');
    
    // Tab switching
    const tabs = document.querySelectorAll('.tab-button');
    const forms = {
        'speed': speedForm,
        'distance': distanceForm,
        'time': timeForm
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            Object.values(forms).forEach(form => {
                form.classList.remove('active');
            });
            const activeForm = forms[tab.dataset.tab];
            if (activeForm) {
                activeForm.classList.add('active');
            }
            
            resetCalculator();
        });
    });

    // Unit conversion rates
    const distanceConversions = {
        km: { to: { m: 1000, mi: 0.621371 } },
        m: { to: { km: 0.001, mi: 0.000621371 } },
        mi: { to: { km: 1.60934, m: 1609.34 } }
    };

    const timeConversions = {
        hr: { to: { min: 60, sec: 3600 } },
        min: { to: { hr: 1/60, sec: 60 } },
        sec: { to: { hr: 1/3600, min: 1/60 } }
    };

    function convertDistance(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        return value * distanceConversions[fromUnit].to[toUnit];
    }

    function convertTime(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        return value * timeConversions[fromUnit].to[toUnit];
    }

    function formatNumber(num) {
        return parseFloat(num.toFixed(2));
    }

    function calculateSpeed(distance, distanceUnit, time, timeUnit) {
        // Convert everything to base units (km and hours)
        const distanceInKm = convertDistance(distance, distanceUnit, 'km');
        const timeInHours = convertTime(time, timeUnit, 'hr');
        const speedInKmh = distanceInKm / timeInHours;

        // Generate conversions
        const speedInMph = convertDistance(speedInKmh, 'km', 'mi');
        const speedInMs = (convertDistance(distance, distanceUnit, 'm') / 
                          convertTime(time, timeUnit, 'sec'));

        return {
            kmh: formatNumber(speedInKmh),
            mph: formatNumber(speedInMph),
            ms: formatNumber(speedInMs)
        };
    }

    function calculateDistance(speed, speedUnit, time, timeUnit) {
        // Convert speed to km/h first
        let speedInKmh = speed;
        if (speedUnit === 'mph') {
            speedInKmh = convertDistance(speed, 'mi', 'km');
        } else if (speedUnit === 'ms') {
            speedInKmh = (convertDistance(speed * 3600, 'm', 'km'));
        }

        const timeInHours = convertTime(time, timeUnit, 'hr');
        const distanceInKm = speedInKmh * timeInHours;

        return {
            km: formatNumber(distanceInKm),
            mi: formatNumber(convertDistance(distanceInKm, 'km', 'mi')),
            m: formatNumber(convertDistance(distanceInKm, 'km', 'm'))
        };
    }

    function calculateTime(distance, distanceUnit, speed, speedUnit) {
        // Convert everything to base units (km and km/h)
        const distanceInKm = convertDistance(distance, distanceUnit, 'km');
        let speedInKmh = speed;
        if (speedUnit === 'mph') {
            speedInKmh = convertDistance(speed, 'mi', 'km');
        } else if (speedUnit === 'ms') {
            speedInKmh = (convertDistance(speed * 3600, 'm', 'km'));
        }

        const timeInHours = distanceInKm / speedInKmh;

        return {
            hr: formatNumber(timeInHours),
            min: formatNumber(convertTime(timeInHours, 'hr', 'min')),
            sec: formatNumber(convertTime(timeInHours, 'hr', 'sec'))
        };
    }

    function updateConversions(values, type) {
        if (type === 'speed') {
            speedConversions.innerHTML = `
                <div class="conversion-item">
                    <span>${values.kmh} km/h</span>
                </div>
                <div class="conversion-item">
                    <span>${values.mph} mph</span>
                </div>
                <div class="conversion-item">
                    <span>${values.ms} m/s</span>
                </div>
            `;
        } else if (type === 'distance') {
            speedConversions.innerHTML = `
                <div class="conversion-item">
                    <span>${values.km} km</span>
                </div>
                <div class="conversion-item">
                    <span>${values.mi} mi</span>
                </div>
                <div class="conversion-item">
                    <span>${values.m} m</span>
                </div>
            `;
        } else if (type === 'time') {
            speedConversions.innerHTML = `
                <div class="conversion-item">
                    <span>${values.hr} hours</span>
                </div>
                <div class="conversion-item">
                    <span>${values.min} minutes</span>
                </div>
                <div class="conversion-item">
                    <span>${values.sec} seconds</span>
                </div>
            `;
        }
    }

    function resetCalculator() {
        speedForm.reset();
        distanceForm.reset();
        timeForm.reset();
        result.style.display = 'none';
    }

    function validateNumberInput(input, fieldName) {
        const value = input.value.trim();
        if (!value) {
            alert(`Please enter a value for ${fieldName}`);
            input.focus();
            return false;
        }
        if (!/^\d*\.?\d+$/.test(value)) {
            alert(`Please enter a valid number for ${fieldName}`);
            input.focus();
            return false;
        }
        const numValue = parseFloat(value);
        if (numValue <= 0) {
            alert(`Please enter a positive number for ${fieldName}`);
            input.focus();
            return false;
        }
        return true;
    }

    speedForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const distanceInput = document.getElementById('speedDistance');
        const timeInput = document.getElementById('speedTime');
        
        // Validate inputs
        if (!validateNumberInput(distanceInput, 'distance')) return;
        if (!validateNumberInput(timeInput, 'time')) return;
        
        const distance = parseFloat(distanceInput.value);
        const time = parseFloat(timeInput.value);
        const distanceUnit = document.getElementById('speedDistanceUnit').value;
        const timeUnit = document.getElementById('speedTimeUnit').value;

        const calculationResult = calculateSpeed(distance, distanceUnit, time, timeUnit);
        resultLabel.textContent = 'Speed';
        resultValue.textContent = `${calculationResult.kmh} km/h`;
        calculationSteps.textContent = 
            `${distance} ${distanceUnit} ÷ ${time} ${timeUnit} = ${calculationResult.kmh} km/h`;
        
        updateConversions(calculationResult, 'speed');
        result.style.display = 'block';
    });

    distanceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const speedInput = document.getElementById('distanceSpeed');
        const timeInput = document.getElementById('distanceTime');
        
        // Validate inputs
        if (!validateNumberInput(speedInput, 'speed')) return;
        if (!validateNumberInput(timeInput, 'time')) return;
        
        const speed = parseFloat(speedInput.value);
        const time = parseFloat(timeInput.value);
        const speedUnit = document.getElementById('distanceSpeedUnit').value;
        const timeUnit = document.getElementById('distanceTimeUnit').value;

        const calculationResult = calculateDistance(speed, speedUnit, time, timeUnit);
        resultLabel.textContent = 'Distance';
        resultValue.textContent = `${calculationResult.km} km`;
        calculationSteps.textContent = 
            `${speed} ${speedUnit} × ${time} ${timeUnit} = ${calculationResult.km} km`;
        
        updateConversions(calculationResult, 'distance');
        result.style.display = 'block';
    });

    timeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const distanceInput = document.getElementById('timeDistance');
        const speedInput = document.getElementById('timeSpeed');
        
        // Validate inputs
        if (!validateNumberInput(distanceInput, 'distance')) return;
        if (!validateNumberInput(speedInput, 'speed')) return;
        
        const distance = parseFloat(distanceInput.value);
        const speed = parseFloat(speedInput.value);
        const distanceUnit = document.getElementById('timeDistanceUnit').value;
        const speedUnit = document.getElementById('timeSpeedUnit').value;

        const calculationResult = calculateTime(distance, distanceUnit, speed, speedUnit);
        resultLabel.textContent = 'Time';
        resultValue.textContent = `${calculationResult.hr} hours`;
        calculationSteps.textContent = 
            `${distance} ${distanceUnit} ÷ ${speed} ${speedUnit} = ${calculationResult.hr} hours`;
        
        updateConversions(calculationResult, 'time');
        result.style.display = 'block';
    });
});