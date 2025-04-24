let timeInterval;

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('ageCalculator');
    const resultDiv = document.getElementById('result');
    
    // Initialize date selects
    const today = new Date();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function initializeDateSelects(prefix) {
        const daySelect = document.getElementById(`${prefix}Day`);
        const monthSelect = document.getElementById(`${prefix}Month`);
        const yearSelect = document.getElementById(`${prefix}Year`);
        
        // Clear existing options
        daySelect.innerHTML = '';
        monthSelect.innerHTML = '';
        yearSelect.innerHTML = '';
        
        // Initialize days (1-31)
        for (let i = 1; i <= 31; i++) {
            const option = new Option(i, i);
            daySelect.add(option);
        }
        
        // Initialize months
        months.forEach((month, index) => {
            const option = new Option(month, index);
            monthSelect.add(option);
        });
        
        // Initialize years (100 years ago to current year)
        const currentYear = new Date().getFullYear();
        for (let year = currentYear - 100; year <= currentYear; year++) {
            const option = new Option(year, year);
            yearSelect.add(option);
        }
    }

    // Initialize birth date selects
    initializeDateSelects('birth');
    initializeDateSelects('calc');
    
    // Set initial values for calc date to today
    document.getElementById('calcDay').value = today.getDate();
    document.getElementById('calcMonth').value = today.getMonth();
    document.getElementById('calcYear').value = today.getFullYear();
    updateDateInput('calc');

    // Handle date select changes
    ['birth', 'calc'].forEach(prefix => {
        const daySelect = document.getElementById(`${prefix}Day`);
        const monthSelect = document.getElementById(`${prefix}Month`);
        const yearSelect = document.getElementById(`${prefix}Year`);

        daySelect.addEventListener('change', () => updateDateInput(prefix));
        monthSelect.addEventListener('change', () => {
            updateDaysInMonth(prefix);
            updateDateInput(prefix);
        });
        yearSelect.addEventListener('change', () => {
            updateDaysInMonth(prefix);
            updateDateInput(prefix);
        });
    });
    
    // Use Today button
    document.getElementById('useToday').addEventListener('click', () => {
        const now = new Date();
        document.getElementById('calcDay').value = now.getDate();
        document.getElementById('calcMonth').value = now.getMonth();
        document.getElementById('calcYear').value = now.getFullYear();
        updateDateInput('calc');
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const birthYear = parseInt(document.getElementById('birthYear').value);
        const birthMonth = parseInt(document.getElementById('birthMonth').value);
        const birthDay = parseInt(document.getElementById('birthDay').value);
        
        const calcYear = parseInt(document.getElementById('calcYear').value);
        const calcMonth = parseInt(document.getElementById('calcMonth').value);
        const calcDay = parseInt(document.getElementById('calcDay').value);
        
        const birthDate = new Date(birthYear, birthMonth, birthDay);
        const calcDate = new Date(calcYear, calcMonth, calcDay);
        
        if (birthDate > calcDate) {
            alert('Birth date cannot be in the future!');
            return;
        }

        if (isNaN(birthDate.getTime())) {
            alert('Please enter a valid birth date!');
            return;
        }

        const age = calculateAge(birthDate, calcDate);
        const timeLived = calculateTimeLived(birthDate, calcDate);
        const nextBirthday = calculateNextBirthday(birthDate, calcDate);
        const zodiacInfo = getZodiacInfo(birthDate);
        const dayOfBirth = getDayOfBirth(birthDate);
        const funFacts = generateFunFacts(birthDate, calcDate);
        
        displayResult(age, timeLived, nextBirthday, zodiacInfo, dayOfBirth, funFacts, birthDate);

        // Handle live updates
        if (document.getElementById('liveUpdate').checked) {
            updateLiveCounter(birthDate);
        } else if (timeInterval) {
            clearInterval(timeInterval);
        }
    });

    // Handle live update toggle
    document.getElementById('liveUpdate').addEventListener('change', function() {
        const birthYear = parseInt(document.getElementById('birthYear').value);
        const birthMonth = parseInt(document.getElementById('birthMonth').value);
        const birthDay = parseInt(document.getElementById('birthDay').value);
        const birthDate = new Date(birthYear, birthMonth, birthDay);
        
        if (this.checked && !isNaN(birthDate.getTime())) {
            updateLiveCounter(birthDate);
        } else if (timeInterval) {
            clearInterval(timeInterval);
        }
    });
});

function updateDaysInMonth(prefix) {
    const daySelect = document.getElementById(`${prefix}Day`);
    const monthSelect = document.getElementById(`${prefix}Month`);
    const yearSelect = document.getElementById(`${prefix}Year`);
    const currentDay = parseInt(daySelect.value);

    const daysInMonth = new Date(
        parseInt(yearSelect.value),
        parseInt(monthSelect.value) + 1,
        0
    ).getDate();

    // Update days in month
    while (daySelect.options.length > daysInMonth) {
        daySelect.remove(daySelect.options.length - 1);
    }
    while (daySelect.options.length < daysInMonth) {
        daySelect.add(new Option(daySelect.options.length + 1, daySelect.options.length + 1));
    }

    // Maintain selected day if possible
    if (currentDay <= daysInMonth) {
        daySelect.value = currentDay;
    }
}

function updateDateInput(prefix) {
    const dateInput = document.getElementById(`${prefix}Date`);
    const day = document.getElementById(`${prefix}Day`).value.padStart(2, '0');
    const month = (parseInt(document.getElementById(`${prefix}Month`).value) + 1).toString().padStart(2, '0');
    const year = document.getElementById(`${prefix}Year`).value;
    dateInput.value = `${year}-${month}-${day}`;
}

function calculateAge(birthDate, currentDate) {
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    // Adjust for negative days
    if (days < 0) {
        months--;
        // Get last day of previous month
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
        days += lastMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}

function calculateTimeLived(birthDate, currentDate) {
    const milliseconds = currentDate - birthDate;
    const totalDays = Math.floor(milliseconds / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(milliseconds / (1000 * 60 * 60));
    const totalMinutes = Math.floor(milliseconds / (1000 * 60));

    return { totalDays, totalHours, totalMinutes };
}

function calculateNextBirthday(birthDate, currentDate) {
    const today = currentDate;
    const currentYear = today.getFullYear();
    const nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    
    if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
    }
    
    const daysUntil = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    return daysUntil;
}

function getZodiacInfo(birthDate) {
    const day = birthDate.getDate();
    const month = birthDate.getMonth() + 1;
    
    const zodiacSigns = {
        'Aries': { icon: '♈', dates: [[3, 21], [4, 19]] },
        'Taurus': { icon: '♉', dates: [[4, 20], [5, 20]] },
        'Gemini': { icon: '♊', dates: [[5, 21], [6, 20]] },
        'Cancer': { icon: '♋', dates: [[6, 21], [7, 22]] },
        'Leo': { icon: '♌', dates: [[7, 23], [8, 22]] },
        'Virgo': { icon: '♍', dates: [[8, 23], [9, 22]] },
        'Libra': { icon: '♎', dates: [[9, 23], [10, 22]] },
        'Scorpio': { icon: '♏', dates: [[10, 23], [11, 21]] },
        'Sagittarius': { icon: '♐', dates: [[11, 22], [12, 21]] },
        'Capricorn': { icon: '♑', dates: [[12, 22], [1, 19]] },
        'Aquarius': { icon: '♒', dates: [[1, 20], [2, 18]] },
        'Pisces': { icon: '♓', dates: [[2, 19], [3, 20]] }
    };

    for (const [sign, info] of Object.entries(zodiacSigns)) {
        const [[startMonth, startDay], [endMonth, endDay]] = info.dates;
        if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
            return { sign, icon: info.icon };
        }
    }

    return { sign: 'Capricorn', icon: '♑' }; // Default for edge case
}

function getDayOfBirth(birthDate) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[birthDate.getDay()];
}

function generateFunFacts(birthDate, currentDate) {
    const facts = [];
    const msLived = currentDate - birthDate;
    const daysLived = Math.floor(msLived / (1000 * 60 * 60 * 24));
    const weeksLived = Math.floor(daysLived / 7);
    const monthsLived = Math.floor(daysLived / 30.44);
    
    facts.push(`You have lived through approximately ${weeksLived.toLocaleString()} weeks`);
    facts.push(`You have experienced about ${monthsLived.toLocaleString()} months`);
    facts.push(`You have slept roughly ${Math.floor(daysLived * 8).toLocaleString()} hours (assuming 8 hours per day)`);
    facts.push(`Your heart has beaten approximately ${Math.floor(msLived / 1000 * 1.2).toLocaleString()} times (at avg 72 BPM)`);
    facts.push(`You have breathed about ${Math.floor(msLived / 1000 * 0.2).toLocaleString()} times (at avg 12 breaths/min)`);

    return facts;
}

function updateLiveCounter(birthDate) {
    if (timeInterval) {
        clearInterval(timeInterval);
    }

    timeInterval = setInterval(() => {
        const now = new Date();
        const age = calculateAge(birthDate, now);
        const timeLived = calculateTimeLived(birthDate, now);
        const nextBirthday = calculateNextBirthday(birthDate, now);
        const zodiacInfo = getZodiacInfo(birthDate);
        const dayOfBirth = getDayOfBirth(birthDate);
        const funFacts = generateFunFacts(birthDate, now);
        
        displayResult(age, timeLived, nextBirthday, zodiacInfo, dayOfBirth, funFacts, birthDate);
    }, 1000);
}

function displayResult(age, timeLived, nextBirthday, zodiacInfo, dayOfBirth, funFacts, birthDate) {
    // Update age
    document.getElementById('years').textContent = age.years;
    document.getElementById('months').textContent = age.months;
    document.getElementById('days').textContent = age.days;

    // Update time statistics
    document.getElementById('totalDays').textContent = timeLived.totalDays.toLocaleString();
    document.getElementById('totalHours').textContent = timeLived.totalHours.toLocaleString();
    document.getElementById('totalMinutes').textContent = timeLived.totalMinutes.toLocaleString();

    // Update birthday info
    document.getElementById('nextBirthday').textContent = nextBirthday;
    document.getElementById('zodiacSign').textContent = `${zodiacInfo.sign} ${zodiacInfo.icon}`;
    document.getElementById('dayOfBirth').textContent = dayOfBirth;

    // Update fun facts
    const funFactsList = document.getElementById('funFacts');
    funFactsList.innerHTML = funFacts.map(fact => `<li>${fact}</li>`).join('');
    
    // Show results
    document.getElementById('result').style.display = 'block';
}