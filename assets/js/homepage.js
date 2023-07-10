// This event is fired every time the page is loaded, including when navigating back to the page
window.onpageshow = function(event) {
  if (event.persisted) {
    window.location.reload();
  }
};

const homeInput = document.querySelector(".home-input");
const homeSearch = document.querySelector(".home-search");

homeSearch.addEventListener("click", (event) => {
  // Prevent the form from being submitted
  event.preventDefault();

  // Get the search query
  const query = homeInput.value;

  // Store the search query in the local storage
  localStorage.setItem("query", query);

  // Redirect to the search-results.html page
  window.location.href = "search-results.html";
});

document.addEventListener('DOMContentLoaded', () => {
  const homeInput = document.querySelector(".home-input");
  const homeSearch = document.querySelector(".home-search");
  homeSearch.addEventListener("click", (event) => {
    // Prevent the form from being submitted
    event.preventDefault();
    // Get the search query
    const query = homeInput.value;
    // Store the search query in the local storage
    localStorage.setItem("query", query);
    // Redirect to the search-results.html page
    window.location.href = "search-results.html";
  });
  // Fetch genres from TMDB API
  fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${'a16424a76b8dcba0de70b84fd12abde3'}&language=en-US`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then(data => populateGenres(data))
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
  // Populate genres
  function populateGenres(data) {
    const columnsHeader = document.querySelector(".columns");
    for (let genre of data.genres) {
      // Create a new 'div' for each genre
      const genreDiv = document.createElement("div");
      genreDiv.className = "column is-one-quarter"; // Bulma class for grid layout
      // Fetch the third movie in each genre
      fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${'a16424a76b8dcba0de70b84fd12abde3'}&with_genres=${genre.id}&language=en-US&page=1`)
        .then(response => response.json())
        .then(data => {
          if (data.results[3]) {
            const movie = data.results[3];
            genreDiv.innerHTML = `
            <div class="column">
              <div class="card">
                <div class="card-image">
                  <figure class="image is-4by3">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4">${genre.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            `;
            columnsHeader.appendChild(genreDiv);
          }
        });

        // Add click event listener to the genreDiv
    genreDiv.addEventListener('click', () => {
      // Store the genre ID in local storage
      localStorage.setItem('genre', genre.id);
      // Redirect to the search-results.html page
      window.location.href = 'search-results.html';
    });
    
    }
  }
});