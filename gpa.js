document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button and content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Settings variables
    let gpaScale = 4.0;
    let isWeighted = false;
    let honorsWeight = 0.5;
    let apIbWeight = 1.0;
    let customScale = 4.0;
    
    // Grade scales for different GPA systems
    const gradeScales = {
        '4.0': [
            { value: '4.0', label: 'A (4.0)' },
            { value: '3.7', label: 'A- (3.7)' },
            { value: '3.3', label: 'B+ (3.3)' },
            { value: '3.0', label: 'B (3.0)' },
            { value: '2.7', label: 'B- (2.7)' },
            { value: '2.3', label: 'C+ (2.3)' },
            { value: '2.0', label: 'C (2.0)' },
            { value: '1.7', label: 'C- (1.7)' },
            { value: '1.3', label: 'D+ (1.3)' },
            { value: '1.0', label: 'D (1.0)' },
            { value: '0.0', label: 'F (0.0)' }
        ],
        '5.0': [
            { value: '5.0', label: 'A+ (5.0)' },
            { value: '4.7', label: 'A (4.7)' },
            { value: '4.3', label: 'A- (4.3)' },
            { value: '4.0', label: 'B+ (4.0)' },
            { value: '3.7', label: 'B (3.7)' },
            { value: '3.3', label: 'B- (3.3)' },
            { value: '3.0', label: 'C+ (3.0)' },
            { value: '2.7', label: 'C (2.7)' },
            { value: '2.3', label: 'C- (2.3)' },
            { value: '2.0', label: 'D+ (2.0)' },
            { value: '1.7', label: 'D (1.7)' },
            { value: '1.3', label: 'D- (1.3)' },
            { value: '0.0', label: 'F (0.0)' }
        ],
        '10.0': [
            { value: '10.0', label: 'A+ (10.0)' },
            { value: '9.0', label: 'A (9.0)' },
            { value: '8.0', label: 'B+ (8.0)' },
            { value: '7.0', label: 'B (7.0)' },
            { value: '6.0', label: 'C+ (6.0)' },
            { value: '5.0', label: 'C (5.0)' },
            { value: '4.0', label: 'D (4.0)' },
            { value: '0.0', label: 'F (0.0)' }
        ]
    };

    // DOM Elements
    const courseList = document.getElementById('course-list');
    const addCourseBtn = document.getElementById('add-course');
    const semesterGpaDisplay = document.getElementById('semester-gpa');
    const semesterProgress = document.getElementById('semester-progress');
    const scaleDisplay = document.getElementById('scale-display');
    const newGpaInput = document.getElementById('new-gpa');
    const newCreditsInput = document.getElementById('new-credits');
    const currentGpaInput = document.getElementById('current-gpa');
    const currentCreditsInput = document.getElementById('current-credits');
    const cumulativeGpaDisplay = document.getElementById('cumulative-gpa');
    const cumulativeProgress = document.getElementById('cumulative-progress');
    const calculateCumulativeBtn = document.getElementById('calculate-cumulative');
    const gpaScaleSelect = document.getElementById('gpa-scale');
    const customScaleContainer = document.getElementById('custom-scale-container');
    const customScaleInput = document.getElementById('custom-scale-value');
    const gpaWeightingSelect = document.getElementById('gpa-weighting');
    const weightedSettings = document.getElementById('weighted-settings');
    const honorsWeightInput = document.getElementById('honors-weight');
    const apIbWeightInput = document.getElementById('ap-ib-weight');
    const applySettingsBtn = document.getElementById('apply-settings');
    const printReportBtn = document.getElementById('print-report');
    const exportPdfBtn = document.getElementById('export-pdf');
    const shareButtons = document.querySelectorAll('.share-btn');

    // Add course functionality
    addCourseBtn.addEventListener('click', addCourse);

    // Initial course row event listeners
    addCourseRowListeners(courseList.querySelector('.course-row'));

    // Calculate cumulative GPA
    calculateCumulativeBtn.addEventListener('click', calculateCumulativeGPA);

    // Settings event listeners
    gpaScaleSelect.addEventListener('change', toggleCustomScale);
    gpaWeightingSelect.addEventListener('change', toggleWeightedSettings);
    applySettingsBtn.addEventListener('click', applySettings);

    // Export and share buttons
    printReportBtn.addEventListener('click', printReport);
    exportPdfBtn.addEventListener('click', exportPDF);
    shareButtons.forEach(btn => {
        btn.addEventListener('click', shareGPA);
    });

    // Function to add a new course row
    function addCourse() {
        const newRow = document.createElement('tr');
        newRow.className = 'course-row';
        newRow.innerHTML = `
            <td><input type="text" class="course-name" placeholder="e.g. Mathematics 101"></td>
            <td><input type="number" class="credit-hours" min="0" step="0.5" value="3"></td>
            <td>
                <select class="grade">
                    <!-- Grade options will be populated dynamically -->
                </select>
            </td>
            <td>
                <button class="btn btn-danger remove-course">Remove</button>
            </td>
        `;
        courseList.appendChild(newRow);
        
        // Populate the grade dropdown based on current scale
        const gradeSelect = newRow.querySelector('.grade');
        populateGradeOptions(gradeSelect);
        
        addCourseRowListeners(newRow);
        calculateSemesterGPA(); // Recalculate GPA when adding a course
    }

    // Add event listeners to course row inputs
    function addCourseRowListeners(row) {
        const removeBtn = row.querySelector('.remove-course');
        const inputs = row.querySelectorAll('input, select');

        removeBtn.addEventListener('click', function() {
            row.remove();
            calculateSemesterGPA(); // Recalculate GPA when removing a course
        });

        inputs.forEach(input => {
            input.addEventListener('input', calculateSemesterGPA); // Live calculation
        });
    }

    // Calculate semester GPA
    function calculateSemesterGPA() {
        const courseRows = document.querySelectorAll('.course-row');
        let totalPoints = 0;
        let totalCredits = 0;

        courseRows.forEach(row => {
            const creditHours = parseFloat(row.querySelector('.credit-hours').value) || 0;
            let gradePoints = parseFloat(row.querySelector('.grade').value) || 0;

            // Apply weighting if enabled
            if (isWeighted) {
                const courseName = row.querySelector('.course-name').value.toLowerCase();
                if (courseName.includes('honors')) {
                    gradePoints += honorsWeight;
                } else if (courseName.includes('ap') || courseName.includes('ib')) {
                    gradePoints += apIbWeight;
                }
                // Cap at maximum scale value
                gradePoints = Math.min(gradePoints, gpaScale);
            }

            totalPoints += creditHours * gradePoints;
            totalCredits += creditHours;
        });

        let gpa = 0;
        if (totalCredits > 0) {
            gpa = totalPoints / totalCredits;
        }

        // Update semester GPA display
        semesterGpaDisplay.textContent = gpa.toFixed(2);
        
        // Update progress bar
        const progressPercentage = (gpa / gpaScale) * 100;
        semesterProgress.style.width = `${Math.min(progressPercentage, 100)}%`;

        // Update new semester inputs in cumulative tab
        newGpaInput.value = gpa.toFixed(2);
        newCreditsInput.value = totalCredits.toFixed(1);

        return {
            gpa: gpa,
            credits: totalCredits
        };
    }

    // Calculate cumulative GPA
    function calculateCumulativeGPA() {
        const currentGPA = parseFloat(currentGpaInput.value) || 0;
        const currentCredits = parseFloat(currentCreditsInput.value) || 0;
        const newGPA = parseFloat(newGpaInput.value) || 0;
        const newCredits = parseFloat(newCreditsInput.value) || 0;

        let cumulativeGPA = 0;
        const totalCredits = currentCredits + newCredits;

        if (totalCredits > 0) {
            const currentPoints = currentGPA * currentCredits;
            const newPoints = newGPA * newCredits;
            cumulativeGPA = (currentPoints + newPoints) / totalCredits;
        }

        // Update cumulative GPA display
        cumulativeGpaDisplay.textContent = cumulativeGPA.toFixed(2);
        
        // Update progress bar
        const progressPercentage = (cumulativeGPA / gpaScale) * 100;
        cumulativeProgress.style.width = `${Math.min(progressPercentage, 100)}%`;
    }

    // Toggle custom scale input
    function toggleCustomScale() {
        if (gpaScaleSelect.value === 'custom') {
            customScaleContainer.style.display = 'block';
        } else {
            customScaleContainer.style.display = 'none';
        }
    }

    // Toggle weighted settings
    function toggleWeightedSettings() {
        if (gpaWeightingSelect.value === 'weighted') {
            weightedSettings.style.display = 'block';
        } else {
            weightedSettings.style.display = 'none';
        }
    }

    // Apply settings
    function applySettings() {
        // Set GPA scale
        if (gpaScaleSelect.value === 'custom') {
            gpaScale = parseFloat(customScaleInput.value) || 4.0;
        } else {
            gpaScale = parseFloat(gpaScaleSelect.value);
        }

        // Set weighting
        isWeighted = gpaWeightingSelect.value === 'weighted';
        honorsWeight = parseFloat(honorsWeightInput.value) || 0.5;
        apIbWeight = parseFloat(apIbWeightInput.value) || 1.0;

        // Update scale display
        scaleDisplay.textContent = gpaScale.toFixed(1);
        
        // Update grade options in all dropdowns
        updateGradeOptions();

        // Update GPA calculations
        calculateSemesterGPA();
        calculateCumulativeGPA();

        alert('Settings applied successfully!');
    }

    // Print GPA report
    function printReport() {
        // Create a print-friendly version of the GPA report
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        
        // Get current GPA data
        const semesterGPA = document.getElementById('semester-gpa').textContent;
        const cumulativeGPA = document.getElementById('cumulative-gpa').textContent;
        const currentScale = gpaScale.toFixed(1);
        
        // Get course data
        const courseRows = document.querySelectorAll('.course-row');
        let courseTableHTML = '';
        
        courseRows.forEach(row => {
            const courseName = row.querySelector('.course-name').value || 'Unnamed Course';
            const creditHours = row.querySelector('.credit-hours').value || '0';
            const gradeSelect = row.querySelector('.grade');
            const gradeValue = gradeSelect.value;
            const gradeLabel = gradeSelect.options[gradeSelect.selectedIndex].textContent;
            
            courseTableHTML += `
                <tr>
                    <td>${courseName}</td>
                    <td>${creditHours}</td>
                    <td>${gradeLabel}</td>
                </tr>
            `;
        });
        
        // Create the print document
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>GPA Report - MultiCalc</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        color: #343a40;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 10px;
                        border-bottom: 2px solid #4a6fa5;
                    }
                    .logo {
                        font-size: 24px;
                        font-weight: bold;
                        color: #4a6fa5;
                    }
                    .report-date {
                        font-size: 14px;
                        color: #6c757d;
                        margin-top: 5px;
                    }
                    .gpa-summary {
                        background-color: #f8f9fa;
                        border-radius: 8px;
                        padding: 20px;
                        margin-bottom: 30px;
                        text-align: center;
                    }
                    .gpa-value {
                        font-size: 36px;
                        font-weight: bold;
                        color: #4a6fa5;
                    }
                    .gpa-label {
                        font-size: 14px;
                        color: #6c757d;
                    }
                    .courses-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    .courses-table th {
                        background-color: #4a6fa5;
                        color: white;
                        text-align: left;
                        padding: 10px;
                    }
                    .courses-table td {
                        padding: 10px;
                        border-bottom: 1px solid #ddd;
                    }
                    .footer {
                        text-align: center;
                        font-size: 12px;
                        color: #6c757d;
                        margin-top: 50px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">MultiCalc GPA Report</div>
                    <div class="report-date">Generated on ${new Date().toLocaleDateString()}</div>
                </div>
                
                <div class="gpa-summary">
                    <div class="gpa-value">${semesterGPA}</div>
                    <div class="gpa-label">Semester GPA (Scale: ${currentScale})</div>
                </div>
                
                <h2>Course Details</h2>
                <table class="courses-table">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Credit Hours</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${courseTableHTML}
                    </tbody>
                </table>
                
                <div class="footer">
                    <p>This report was generated using MultiCalc GPA Calculator.</p>
                    <p>&copy; ${new Date().getFullYear()} MultiCalc. All rights reserved.</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        
        // Wait for the content to load before printing
        printWindow.onload = function() {
            printWindow.print();
            // printWindow.close(); // Uncomment to automatically close after print dialog
        };
    }

    // Export as PDF
    function exportPDF() {
        alert('PDF export functionality would be implemented here with a library like jsPDF.');
        // In a real implementation, you would use a library like jsPDF to generate a PDF
    }

    // Share GPA
    function shareGPA(event) {
        const platform = event.target.textContent.trim();
        const gpa = semesterGpaDisplay.textContent;
        const message = `My GPA is ${gpa} out of ${gpaScale.toFixed(1)}! Calculated with MultiCalc GPA Calculator.`;
        let url = '';

        switch (platform) {
            case 'WhatsApp':
                url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                break;
            case 'Facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(message)}`;
                break;
            case 'Twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
                break;
            case 'Instagram':
                // Instagram doesn't have a direct sharing API, so we'll copy to clipboard
                navigator.clipboard.writeText(message)
                    .then(() => alert('Message copied to clipboard! You can paste it on Instagram.'))
                    .catch(err => alert('Failed to copy message: ' + err));
                return;
        }

        if (url) {
            window.open(url, '_blank');
        }
    }

    // Function to update all grade dropdowns based on the current scale
    function updateGradeOptions() {
        const gradeSelects = document.querySelectorAll('.grade');
        gradeSelects.forEach(select => {
            const selectedValue = select.value; // Store current selection
            populateGradeOptions(select);
            
            // Try to restore previous selection if it exists in new options
            if (select.querySelector(`option[value="${selectedValue}"]`)) {
                select.value = selectedValue;
            }
        });
    }
    
    // Function to populate a single grade dropdown
    function populateGradeOptions(selectElement) {
        // Clear existing options
        selectElement.innerHTML = '';
        
        // Determine which scale to use
        let scaleKey = '4.0'; // Default
        if (gpaScale === 5.0) {
            scaleKey = '5.0';
        } else if (gpaScale === 10.0) {
            scaleKey = '10.0';
        } else if (gpaScale !== 4.0) {
            // For custom scales, use the closest standard scale and adjust values
            if (gpaScale > 5.0) {
                scaleKey = '10.0';
            } else if (gpaScale > 4.0) {
                scaleKey = '5.0';
            }
        }
        
        // Get the appropriate grade scale
        const grades = gradeScales[scaleKey];
        
        // Add options to the select element
        grades.forEach(grade => {
            const option = document.createElement('option');
            option.value = grade.value;
            
            // For custom scales, adjust the displayed value
            if (gpaScale !== parseFloat(scaleKey)) {
                const adjustedValue = (parseFloat(grade.value) * gpaScale / parseFloat(scaleKey)).toFixed(1);
                const letterGrade = grade.label.split(' ')[0];
                option.value = adjustedValue;
                option.textContent = `${letterGrade} (${adjustedValue})`;
            } else {
                option.textContent = grade.label;
            }
            
            selectElement.appendChild(option);
        });
    }

    // Initialize with default settings
    applySettings();
});