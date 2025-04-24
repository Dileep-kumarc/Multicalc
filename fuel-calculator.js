document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const fuelForm = document.getElementById('fuelCalculator');
    const tripDistanceInput = document.getElementById('tripDistance');
    const distanceUnitSelect = document.getElementById('distanceUnit');
    const fuelEfficiencyInput = document.getElementById('fuelEfficiency');
    const efficiencyUnitSelect = document.getElementById('efficiencyUnit');
    const fuelPriceInput = document.getElementById('fuelPrice');
    const priceUnitSelect = document.getElementById('priceUnit');
    const currencySelect = document.getElementById('currency');
    const resetButton = document.getElementById('reset');
    const fuelRequiredSpan = document.getElementById('fuelRequired');
    const totalCostSpan = document.getElementById('totalCost');
    const costPerKmSpan = document.getElementById('costPerKm');
    const calculationSteps = document.getElementById('calculationSteps');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const toast = document.getElementById('toast');

    // Conversion constants
    const LITERS_PER_GALLON = 3.78541;
    const MILES_PER_KM = 0.621371;
    const KM_PER_MILE = 1.60934;

    // Currency symbols
    const CURRENCY_SYMBOLS = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        CAD: '$',
        AUD: '$',
        INR: '₹'
    };

    // Initialize the calculator
    function initCalculator() {
        setupEventListeners();
        checkDarkModePreference();
    }

    // Calculate fuel cost
    function calculateFuelCost(event) {
        if (event) event.preventDefault();

        // Get input values
        const tripDistance = parseFloat(tripDistanceInput.value);
        const distanceUnit = distanceUnitSelect.value;
        const fuelEfficiency = parseFloat(fuelEfficiencyInput.value);
        const efficiencyUnit = efficiencyUnitSelect.value;
        const fuelPrice = parseFloat(fuelPriceInput.value);
        const priceUnit = priceUnitSelect.value;
        const currency = currencySelect.value;

        // Validate inputs
        if (isNaN(tripDistance) || isNaN(fuelEfficiency) || isNaN(fuelPrice)) {
            showToast('Please enter valid numbers in all fields');
            return;
        }

        // Convert all units to standard units (km and liters)
        let distanceInKm = distanceUnit === 'mi' ? tripDistance * KM_PER_MILE : tripDistance;
        let fuelEfficiencyL100km;

        // Convert efficiency to L/100km
        switch (efficiencyUnit) {
            case 'mpg':
                // Convert mpg to L/100km: 235.214583 / mpg
                fuelEfficiencyL100km = 235.214583 / fuelEfficiency;
                break;
            case 'kmpl':
                // Convert km/L to L/100km: 100 / kmpl
                fuelEfficiencyL100km = 100 / fuelEfficiency;
                break;
            default: // l100km
                fuelEfficiencyL100km = fuelEfficiency;
        }

        // Calculate fuel required in liters
        const fuelRequiredLiters = (distanceInKm * fuelEfficiencyL100km) / 100;

        // Convert fuel price to per liter if needed
        let fuelPricePerLiter = priceUnit === 'perGallon' ? fuelPrice / LITERS_PER_GALLON : fuelPrice;

        // Calculate total cost
        const totalCost = fuelRequiredLiters * fuelPricePerLiter;

        // Calculate cost per km
        const costPerKm = totalCost / distanceInKm;

        // Display results
        fuelRequiredSpan.textContent = `${fuelRequiredLiters.toFixed(2)} L`;
        totalCostSpan.textContent = `${CURRENCY_SYMBOLS[currency]}${totalCost.toFixed(2)}`;
        costPerKmSpan.textContent = `${CURRENCY_SYMBOLS[currency]}${costPerKm.toFixed(2)}`;

        // Show calculation steps
        calculationSteps.innerHTML = `
            <strong>Trip Distance:</strong> ${tripDistance} ${distanceUnit} (${distanceInKm.toFixed(2)} km)<br>
            <strong>Fuel Efficiency:</strong> ${fuelEfficiency} ${efficiencyUnit} (${fuelEfficiencyL100km.toFixed(2)} L/100km)<br>
            <strong>Fuel Price:</strong> ${CURRENCY_SYMBOLS[currency]}${fuelPrice} ${priceUnit}<br>
            <strong>Calculation:</strong> (${distanceInKm.toFixed(2)} km × ${fuelEfficiencyL100km.toFixed(2)} L/100km) / 100 = ${fuelRequiredLiters.toFixed(2)} L<br>
            <strong>Total Cost:</strong> ${fuelRequiredLiters.toFixed(2)} L × ${fuelPricePerLiter.toFixed(2)} ${CURRENCY_SYMBOLS[currency]}/L = ${CURRENCY_SYMBOLS[currency]}${totalCost.toFixed(2)}
        `;
    }

    // Reset the calculator
    function resetCalculator() {
        fuelForm.reset();
        fuelRequiredSpan.textContent = '0';
        totalCostSpan.textContent = '0';
        costPerKmSpan.textContent = '0';
        calculationSteps.textContent = '';
        showToast('Calculator reset');
    }

    // Show toast notification
    function showToast(message, duration = 3000) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }

    // Dark mode functionality
    function checkDarkModePreference() {
        if (localStorage.getItem('darkMode') === 'enabled' || 
            (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.body.classList.add('dark-mode');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    function toggleDarkMode() {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }

    // Set up event listeners
    function setupEventListeners() {
        fuelForm.addEventListener('submit', calculateFuelCost);
        resetButton.addEventListener('click', resetCalculator);
        darkModeToggle.addEventListener('click', toggleDarkMode);

        // Auto-calculate when any input changes
        const inputs = [tripDistanceInput, fuelEfficiencyInput, fuelPriceInput];
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (tripDistanceInput.value && fuelEfficiencyInput.value && fuelPriceInput.value) {
                    calculateFuelCost();
                }
            });
        });

        // Unit change also triggers calculation
        const selects = [distanceUnitSelect, efficiencyUnitSelect, priceUnitSelect, currencySelect];
        selects.forEach(select => {
            select.addEventListener('change', function() {
                if (tripDistanceInput.value && fuelEfficiencyInput.value && fuelPriceInput.value) {
                    calculateFuelCost();
                }
            });
        });

        // Copy result on click
        [fuelRequiredSpan, totalCostSpan, costPerKmSpan].forEach(el => {
            el.addEventListener('click', function() {
                if (el.textContent !== '0') {
                    navigator.clipboard.writeText(el.textContent);
                    showToast('Copied to clipboard!');
                }
            });
        });
    }

    // Initialize the calculator
    initCalculator();
});