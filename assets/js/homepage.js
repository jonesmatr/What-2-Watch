const homeInput = document.querySelector('.home-input');
const homeSearch = document.querySelector('.home-search');

homeSearch.addEventListener('click', event => {
    // Prevent the form from being submitted
    event.preventDefault();

    // Get the search query
    const query = homeInput.value;

    // Store the search query in the local storage
    localStorage.setItem('query', query);

    // Redirect to the search-results.html page
    window.location.href = 'search-results.html';
});
