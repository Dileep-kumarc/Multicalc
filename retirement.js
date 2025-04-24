document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('retirementCalculator');
    const resultDiv = document.getElementById('result');
    const regionSelect = document.getElementById('region');
    const retirementAgeInput = document.getElementById('retirementAge');
    
    // Update retirement age when region changes
    regionSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        if (value !== 'custom') {
            retirementAgeInput.value = value;
            retirementAgeInput.disabled = true;
        } else {
            retirementAgeInput.disabled = false;
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentAge = parseInt(document.getElementById('currentAge').value);
        const retirementAge = parseInt(retirementAgeInput.value);
        
        if (currentAge >= retirementAge) {
            alert('Current age must be less than retirement age!');
            return;
        }

        const yearsToRetirement = retirementAge - currentAge;
        const retirementYear = new Date().getFullYear() + yearsToRetirement;
        
        displayResult(yearsToRetirement, retirementYear, currentAge, retirementAge);
    });

    function displayResult(years, retirementYear, currentAge, retirementAge) {
        document.getElementById('yearsToRetirement').textContent = years;
        document.getElementById('retirementYear').textContent = retirementYear;
        
        // Generate retirement note
        const note = getRetirementNote(years, currentAge, retirementAge);
        document.getElementById('retirementNote').textContent = note;
        
        resultDiv.style.display = 'block';

        // Initialize AdSense ads
        (adsbygoogle = window.adsbygoogle || []).push({});
    }

    function getRetirementNote(years, currentAge, retirementAge) {
        if (years <= 5) {
            return 'Retirement is very close! Make sure your financial planning is in order.';
        } else if (years <= 15) {
            return 'You\'re getting closer to retirement. Consider reviewing your retirement savings strategy.';
        } else if (years <= 30) {
            return 'You have a good amount of time to plan. Focus on long-term investment strategies.';
        } else {
            return 'You have many years ahead. Start saving early for a comfortable retirement.';
        }
    }
});