document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('calculator-search');
    const searchBtn = document.getElementById('search-btn');
    const calculatorCards = document.querySelectorAll('.calc-card');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        calculatorCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const isMatch = title.includes(searchTerm) || description.includes(searchTerm);
            card.style.display = isMatch ? 'flex' : 'none';
        });
    }

    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);

    // Add keyboard support
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
});