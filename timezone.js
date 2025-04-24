document.addEventListener('DOMContentLoaded', () => {
    const fromTimezone = document.getElementById('fromTimezone');
    const toTimezone = document.getElementById('toTimezone');
    const fromTime = document.getElementById('fromTime');
    const toTime = document.getElementById('toTime');
    const fromDate = document.getElementById('fromDate');
    const toDate = document.getElementById('toDate');
    const timeDifference = document.getElementById('timeDifference');
    const swapTimezones = document.getElementById('swapTimezones');
    const setCurrent = document.getElementById('setCurrent');
    const commonTimezones = document.getElementById('commonTimezones');

    const timezones = moment.tz.names();
    
    // Populate timezone dropdowns
    timezones.forEach(timezone => {
        const fromOption = new Option(timezone, timezone);
        const toOption = new Option(timezone, timezone);
        fromTimezone.add(fromOption);
        toTimezone.add(toOption);
    });

    // Set default timezones
    fromTimezone.value = moment.tz.guess();
    toTimezone.value = 'Asia/Kolkata'; // Default to India time

    // Common timezone data
    const commonTimezonesData = [
        { name: 'New York', zone: 'America/New_York' },
        { name: 'London', zone: 'Europe/London' },
        { name: 'Tokyo', zone: 'Asia/Tokyo' },
        { name: 'India', zone: 'Asia/Kolkata' },
        { name: 'Sydney', zone: 'Australia/Sydney' },
        { name: 'Dubai', zone: 'Asia/Dubai' }
    ];

    // Populate common timezones
    commonTimezonesData.forEach(tz => {
        const div = document.createElement('div');
        div.className = 'common-timezone';
        div.innerHTML = `
            <h4>${tz.name}</h4>
            <p>${moment().tz(tz.zone).format('hh:mm A')}</p>
        `;
        div.addEventListener('click', () => {
            toTimezone.value = tz.zone;
            updateTimes();
        });
        commonTimezones.appendChild(div);
    });

    function updateTimes() {
        const now = moment();
        const fromTz = fromTimezone.value;
        const toTz = toTimezone.value;

        // Update from time
        const fromMoment = now.tz(fromTz);
        fromTime.textContent = fromMoment.format('hh:mm:ss A');
        fromDate.textContent = fromMoment.format('dddd, MMMM D, YYYY');

        // Update to time
        const toMoment = now.tz(toTz);
        toTime.textContent = toMoment.format('hh:mm:ss A');
        toDate.textContent = toMoment.format('dddd, MMMM D, YYYY');

        // Calculate and display time difference
        const diff = moment.tz.zone(toTz).offset(now) - moment.tz.zone(fromTz).offset(now);
        const hours = Math.abs(diff / 60);
        const diffText = diff === 0 ? 'Same time' :
            `${hours} hour${hours !== 1 ? 's' : ''} ${diff > 0 ? 'behind' : 'ahead'}`;
        timeDifference.textContent = diffText;
    }

    // Event listeners
    fromTimezone.addEventListener('change', updateTimes);
    toTimezone.addEventListener('change', updateTimes);
    
    swapTimezones.addEventListener('click', () => {
        const temp = fromTimezone.value;
        fromTimezone.value = toTimezone.value;
        toTimezone.value = temp;
        updateTimes();
    });

    setCurrent.addEventListener('click', () => {
        fromTimezone.value = moment.tz.guess();
        updateTimes();
    });

    // Update times every second
    updateTimes();
    setInterval(updateTimes, 1000);
});