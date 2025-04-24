document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('dateDiffCalculator');
    const resultDiv = document.getElementById('result');
    
    // Initialize date selects
    const today = new Date();
    initializeDateSelects('start');
    initializeDateSelects('end');
    
    // Set initial end date to today
    document.getElementById('endDay').value = today.getDate();
    document.getElementById('endMonth').value = today.getMonth();
    document.getElementById('endYear').value = today.getFullYear();
    updateDateInput('end');

    // Handle date select changes
    ['start', 'end'].forEach(prefix => {
        document.getElementById(`${prefix}Day`).addEventListener('change', () => updateDateInput(prefix));
        document.getElementById(`${prefix}Month`).addEventListener('change', () => {
            updateDaysInMonth(prefix);
            updateDateInput(prefix);
        });
        document.getElementById(`${prefix}Year`).addEventListener('change', () => {
            updateDaysInMonth(prefix);
            updateDateInput(prefix);
        });
    });

    // Use Today button
    document.getElementById('useToday').addEventListener('click', () => {
        const now = new Date();
        document.getElementById('endDay').value = now.getDate();
        document.getElementById('endMonth').value = now.getMonth();
        document.getElementById('endYear').value = now.getFullYear();
        updateDateInput('end');
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        
        if (endDate < startDate) {
            alert('End date cannot be before start date!');
            return;
        }

        const excludeWeekends = document.getElementById('excludeWeekends').checked;
        const includeEndDate = document.getElementById('includeEndDate').checked;
        
        const timeDiff = calculateTimeDifference(startDate, endDate, includeEndDate);
        const workingDaysInfo = calculateWorkingDays(startDate, endDate, includeEndDate);
        const dateInfo = getDateInformation(startDate, endDate);
        
        displayResults(timeDiff, workingDaysInfo, dateInfo, excludeWeekends);
    });
});

function initializeDateSelects(prefix) {
    const daySelect = document.getElementById(`${prefix}Day`);
    const monthSelect = document.getElementById(`${prefix}Month`);
    const yearSelect = document.getElementById(`${prefix}Year`);
    const currentYear = new Date().getFullYear();

    // Clear existing options
    daySelect.innerHTML = '';
    monthSelect.innerHTML = '';
    yearSelect.innerHTML = '';

    // Add days 1-31
    for (let i = 1; i <= 31; i++) {
        const option = new Option(i, i);
        daySelect.add(option);
    }

    // Add months
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    months.forEach((month, i) => {
        const option = new Option(month, i);
        monthSelect.add(option);
    });

    // Add years (100 years back and forward from current year)
    for (let i = currentYear - 100; i <= currentYear + 100; i++) {
        const option = new Option(i, i);
        yearSelect.add(option);
    }

    updateDaysInMonth(prefix);
}

function updateDaysInMonth(prefix) {
    const daySelect = document.getElementById(`${prefix}Day`);
    const monthSelect = document.getElementById(`${prefix}Month`);
    const yearSelect = document.getElementById(`${prefix}Year`);
    const currentDay = parseInt(daySelect.value) || 1;

    const daysInMonth = new Date(
        parseInt(yearSelect.value),
        parseInt(monthSelect.value) + 1,
        0
    ).getDate();

    // Store current options length
    const currentOptionsLength = daySelect.options.length;

    // Update days in month
    if (currentOptionsLength > daysInMonth) {
        // Remove extra days
        while (daySelect.options.length > daysInMonth) {
            daySelect.remove(daySelect.options.length - 1);
        }
    } else if (currentOptionsLength < daysInMonth) {
        // Add missing days
        for (let i = currentOptionsLength + 1; i <= daysInMonth; i++) {
            daySelect.add(new Option(i, i));
        }
    }

    // Maintain selected day if possible, otherwise select last day of month
    daySelect.value = Math.min(currentDay, daysInMonth);
}

function updateDateInput(prefix) {
    const dateInput = document.getElementById(`${prefix}Date`);
    const day = document.getElementById(`${prefix}Day`).value.padStart(2, '0');
    const month = (parseInt(document.getElementById(`${prefix}Month`).value) + 1).toString().padStart(2, '0');
    const year = document.getElementById(`${prefix}Year`).value;
    dateInput.value = `${year}-${month}-${day}`;
}

function calculateTimeDifference(startDate, endDate, includeEndDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (includeEndDate) {
        end.setHours(23, 59, 59, 999);
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    const totalMilliseconds = end - start;
    const totalDays = Math.ceil(totalMilliseconds / (1000 * 60 * 60 * 24));
    const totalHours = Math.ceil(totalMilliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.ceil(totalMilliseconds / (1000 * 60));
    const totalWeeks = Math.floor(totalDays / 7);

    return {
        years,
        months,
        days,
        totalDays,
        totalHours,
        totalMinutes,
        totalWeeks
    };
}

function calculateWorkingDays(startDate, endDate, includeEndDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (includeEndDate) {
        end.setHours(23, 59, 59, 999);
    }

    let workingDays = 0;
    let weekends = 0;
    const current = new Date(start);

    while (current <= end) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekends++;
        } else {
            workingDays++;
        }
        current.setDate(current.getDate() + 1);
    }

    return { workingDays, weekends };
}

function getDateInformation(startDate, endDate) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const startDay = days[startDate.getDay()];
    const endDay = days[endDate.getDay()];

    // Determine period description
    let period;
    const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 
                     + endDate.getMonth() - startDate.getMonth();
    
    if (monthDiff < 1) {
        period = 'Short-term (Less than a month)';
    } else if (monthDiff < 12) {
        period = 'Medium-term (Less than a year)';
    } else {
        period = 'Long-term (Year or longer)';
    }

    return {
        startDay,
        endDay,
        period
    };
}

function displayResults(timeDiff, workingDaysInfo, dateInfo, excludeWeekends) {
    // Update main difference
    document.getElementById('years').textContent = timeDiff.years;
    document.getElementById('months').textContent = timeDiff.months;
    document.getElementById('days').textContent = timeDiff.days;

    // Update time statistics
    document.getElementById('totalDays').textContent = excludeWeekends ? 
        workingDaysInfo.workingDays : timeDiff.totalDays;
    document.getElementById('workingDays').textContent = workingDaysInfo.workingDays;
    document.getElementById('weekends').textContent = workingDaysInfo.weekends;

    // Update alternative units
    document.getElementById('totalHours').textContent = timeDiff.totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = timeDiff.totalMinutes.toLocaleString();
    document.getElementById('totalWeeks').textContent = timeDiff.totalWeeks.toLocaleString();

    // Update date information
    document.getElementById('startDayOfWeek').textContent = dateInfo.startDay;
    document.getElementById('endDayOfWeek').textContent = dateInfo.endDay;
    document.getElementById('datePeriod').textContent = dateInfo.period;

    // Show results
    document.getElementById('result').style.display = 'block';
}