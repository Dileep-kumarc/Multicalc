document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gradeCalculator');
    const resultDiv = document.getElementById('result');
    const gradesContainer = document.getElementById('gradesContainer');
    const addGradeBtn = document.getElementById('addGrade');
    const gradeSystemSelect = document.getElementById('gradeSystem');
    const gradeUnit = document.getElementById('gradeUnit');
    let gradeCount = 0;

    // Initialize with first grade entry
    addGradeEntry();

    // Add grade entry when button is clicked
    addGradeBtn.addEventListener('click', addGradeEntry);

    // Update grade input ranges when system changes
    gradeSystemSelect.addEventListener('change', () => {
        const system = gradeSystemSelect.value;
        const isPercentage = system === '100';
        gradeUnit.textContent = isPercentage ? '%' : 'GPA';
        updateAllGradeInputs();
    });

    function addGradeEntry() {
        gradeCount++;
        const gradeDiv = document.createElement('div');
        gradeDiv.classList.add('grade-entry');
        gradeDiv.innerHTML = `
            <div class="form-group">
                <label for="grade${gradeCount}">Grade ${gradeCount}:</label>
                <div class="input-group">
                    <input type="number" id="grade${gradeCount}" 
                           required min="0" max="100" step="0.1">
                    <span class="unit-label">%</span>
                </div>
            </div>
            <div class="form-group">
                <label for="weight${gradeCount}">Weight (%):</label>
                <input type="number" id="weight${gradeCount}" 
                       required min="0" max="100" value="20">
            </div>
            ${gradeCount > 1 ? '<button type="button" class="remove-grade">Remove</button>' : ''}
        `;

        gradesContainer.appendChild(gradeDiv);

        // Add remove button functionality
        const removeBtn = gradeDiv.querySelector('.remove-grade');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                gradeDiv.remove();
                updateTotalWeight();
            });
        }

        // Add weight change listener
        const weightInput = gradeDiv.querySelector(`#weight${gradeCount}`);
        weightInput.addEventListener('change', updateTotalWeight);
        updateTotalWeight();
    }

    function updateAllGradeInputs() {
        const system = gradeSystemSelect.value;
        const isPercentage = system === '100';
        const inputs = gradesContainer.querySelectorAll('input[id^="grade"]');
        inputs.forEach(input => {
            if (isPercentage) {
                input.min = '0';
                input.max = '100';
                input.step = '0.1';
                input.nextElementSibling.textContent = '%';
            } else {
                input.min = '0';
                input.max = '4.0';
                input.step = '0.1';
                input.nextElementSibling.textContent = 'GPA';
            }
        });
    }

    function updateTotalWeight() {
        const weights = Array.from(gradesContainer.querySelectorAll('input[id^="weight"]'))
            .map(input => parseFloat(input.value) || 0);
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        const finalWeight = parseFloat(document.getElementById('finalWeight').value) || 0;
        
        // If total weight including final exceeds 100%, adjust final weight
        if (totalWeight + finalWeight > 100) {
            document.getElementById('finalWeight').value = Math.max(0, 100 - totalWeight);
        }
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const system = gradeSystemSelect.value;
        const isPercentage = system === '100';
        const finalWeight = parseFloat(document.getElementById('finalWeight').value) / 100;
        const desiredGrade = parseFloat(document.getElementById('desiredGrade').value);

        // Calculate current weighted average
        let totalPoints = 0;
        let totalWeight = 0;
        
        const gradeEntries = gradesContainer.getElementsByClassName('grade-entry');
        Array.from(gradeEntries).forEach(entry => {
            const grade = parseFloat(entry.querySelector('input[id^="grade"]').value);
            const weight = parseFloat(entry.querySelector('input[id^="weight"]').value) / 100;
            
            totalPoints += grade * weight;
            totalWeight += weight;
        });

        const currentAverage = totalPoints / totalWeight;

        // Calculate required final grade
        let requiredGrade;
        if (isPercentage) {
            requiredGrade = (desiredGrade - currentAverage * (1 - finalWeight)) / finalWeight;
        } else {
            // Convert GPA calculations
            const desiredGpaPercent = (desiredGrade / 4) * 100;
            const currentGpaPercent = (currentAverage / 4) * 100;
            requiredGrade = (desiredGpaPercent - currentGpaPercent * (1 - finalWeight)) / finalWeight;
            requiredGrade = (requiredGrade / 100) * 4;
        }

        // Display results
        document.getElementById('requiredGrade').textContent = requiredGrade.toFixed(1);
        document.getElementById('currentAverage').textContent = currentAverage.toFixed(1);
        document.getElementById('requiredGradeLabel').textContent = isPercentage ? '%' : 'GPA';

        // Add feasibility note
        const feasibilityNote = document.getElementById('feasibilityNote');
        if (isPercentage) {
            if (requiredGrade > 100) {
                feasibilityNote.textContent = 'Note: It is mathematically impossible to achieve your desired grade, even with 100% on the final.';
                feasibilityNote.style.color = '#ef4444';
            } else if (requiredGrade < 0) {
                feasibilityNote.textContent = 'Note: You have already achieved higher than your desired grade!';
                feasibilityNote.style.color = '#22c55e';
            } else {
                feasibilityNote.textContent = 'This grade is achievable. Good luck!';
                feasibilityNote.style.color = '#3b82f6';
            }
        } else {
            if (requiredGrade > 4.0) {
                feasibilityNote.textContent = 'Note: It is mathematically impossible to achieve your desired GPA, even with a 4.0 on the final.';
                feasibilityNote.style.color = '#ef4444';
            } else if (requiredGrade < 0) {
                feasibilityNote.textContent = 'Note: You have already achieved higher than your desired GPA!';
                feasibilityNote.style.color = '#22c55e';
            } else {
                feasibilityNote.textContent = 'This GPA is achievable. Good luck!';
                feasibilityNote.style.color = '#3b82f6';
            }
        }

        resultDiv.style.display = 'block';

        // Initialize AdSense ads
        (adsbygoogle = window.adsbygoogle || []).push({});
    });
});