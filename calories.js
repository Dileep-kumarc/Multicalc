document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('caloriesCalculator');
    const result = document.getElementById('result');
    const unitToggles = document.querySelectorAll('input[name="unit"]');

    // Unit labels
    const heightUnit = document.getElementById('heightUnit');
    const weightUnit = document.getElementById('weightUnit');

    // Handle unit changes
    unitToggles.forEach(radio => {
        radio.addEventListener('change', () => {
            const isMetric = radio.value === 'metric';
            heightUnit.textContent = isMetric ? 'cm' : 'inches';
            weightUnit.textContent = isMetric ? 'kg' : 'lbs';
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const unit = document.querySelector('input[name="unit"]:checked').value;
        const gender = document.getElementById('gender').value;
        const age = parseInt(document.getElementById('age').value);
        let height = parseFloat(document.getElementById('height').value);
        let weight = parseFloat(document.getElementById('weight').value);
        const activity = parseFloat(document.getElementById('activity').value);
        const goal = document.getElementById('goal').value;

        // Convert imperial to metric if needed
        if (unit === 'imperial') {
            height *= 2.54;  // inches to cm
            weight *= 0.453592;  // lbs to kg
        }

        // Calculate BMR using Mifflin-St Jeor Equation
        const bmr = calculateBMR(gender, weight, height, age);
        
        // Calculate TDEE (Total Daily Energy Expenditure)
        const maintenanceCalories = Math.round(bmr * activity);
        
        // Calculate goal calories
        const goalCalories = calculateGoalCalories(maintenanceCalories, goal);
        
        // Update results
        document.getElementById('maintenanceCalories').textContent = maintenanceCalories;
        document.getElementById('goalCalories').textContent = goalCalories;
        document.getElementById('goalLabel').textContent = getGoalLabel(goal);

        // Calculate and display macronutrient breakdown
        const macros = calculateMacros(goalCalories, weight);
        displayMacros(macros);

        result.style.display = 'block';
    });
});

function calculateBMR(gender, weight, height, age) {
    // Mifflin-St Jeor Equation
    if (gender === 'male') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
}

function calculateGoalCalories(maintenance, goal) {
    switch (goal) {
        case 'lose':
            return Math.round(maintenance - 500); // 500 calorie deficit for weight loss
        case 'gain':
            return Math.round(maintenance + 500); // 500 calorie surplus for weight gain
        default:
            return maintenance;
    }
}

function getGoalLabel(goal) {
    switch (goal) {
        case 'lose':
            return 'Weight Loss Calories';
        case 'gain':
            return 'Weight Gain Calories';
        default:
            return 'Maintenance Calories';
    }
}

function calculateMacros(totalCalories, weight) {
    // Protein: 2g per kg of body weight
    const proteinGrams = Math.round(weight * 2);
    const proteinCals = proteinGrams * 4;

    // Fat: 25% of total calories
    const fatCals = Math.round(totalCalories * 0.25);
    const fatGrams = Math.round(fatCals / 9);

    // Remaining calories from carbs
    const carbsCals = totalCalories - proteinCals - fatCals;
    const carbsGrams = Math.round(carbsCals / 4);

    return {
        protein: { grams: proteinGrams, calories: proteinCals },
        carbs: { grams: carbsGrams, calories: carbsCals },
        fat: { grams: fatGrams, calories: fatCals }
    };
}

function displayMacros(macros) {
    document.getElementById('proteinGrams').textContent = `${macros.protein.grams}g`;
    document.getElementById('proteinCals').textContent = `${macros.protein.calories} kcal`;
    
    document.getElementById('carbsGrams').textContent = `${macros.carbs.grams}g`;
    document.getElementById('carbsCals').textContent = `${macros.carbs.calories} kcal`;
    
    document.getElementById('fatGrams').textContent = `${macros.fat.grams}g`;
    document.getElementById('fatCals').textContent = `${macros.fat.calories} kcal`;
}