const form = document.querySelector("form");
const genreSelect = document.querySelector("#genre-select");
const genreCards = document.querySelector(".card");
const searchInput = document.querySelector(".input");
const searchButton = document.querySelector(".button");
const randomButton = document.querySelector(".random-button");
const backButton = document.querySelector(".back-button");
const carousel = document.querySelector(".carousel");

document.addEventListener('DOMContentLoaded', () => {
  // Get the genre ID from local storage
  const genre = localStorage.getItem('genre');
  // If a genre ID was stored
  if (genre) {
    // Convert the genre ID to a number
    const genreId = parseInt(genre, 10);
    // Fetch and display the movies of that genre
    fetchMoviesByGenre(genre);
    // Clear the genre ID from local storage
    localStorage.removeItem('genre');
  }
});

// Fetch genres from TMDB API
fetch(
  `https://api.themoviedb.org/3/genre/movie/list?api_key=${"a16424a76b8dcba0de70b84fd12abde3"}&language=en-US`
)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => populateGenres(data))  
  .catch((error) =>
    console.error("There has been a problem with your fetch operation:", error)
  );

// Populate genres
function populateGenres(data) {
  for (let genre of data.genres) {
    const option = document.createElement("option");
    option.value = genre.id;
    option.textContent = genre.name;
    genreSelect.appendChild(option);
  }
}

// Add event listeners to genre cards
function addGenreCardListeners() {
  const genreCards = document.querySelectorAll(".card");
  genreCards.forEach((card) => {
    card.addEventListener("mouseover", () => {
      card.classList.add("card-hover");
    });
    card.addEventListener("mouseout", () => {
      card.classList.remove("card-hover");
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Get the search query from the local storage
  const query = localStorage.getItem("query");

  // Set the search input value to the query
  searchInput.value = query;

  // Trigger a click event on the search button
  searchButton.click();

  // Update the search history
  updateSearchHistory();
});

// Define updateSearchHistory function
function updateSearchHistory() {
  const searches = JSON.parse(localStorage.getItem("searches")) || [];
  const historyDiv = document.querySelector(".aside-buttons");
  const historyList = document.createElement("ul");
  historyList.className = "history-list";

  //Clear old list
  const oldList = document.querySelector(".history-list");
  if (oldList) {
    historyDiv.removeChild(oldList);
  }

  historyList.className = "history-list";
  const lastTenSearches = searches.slice(0, 10);

  lastTenSearches.forEach((query) => {
    const card = document.createElement("div");
    card.className = "card history-card";
    card.innerHTML = `
          <div class="card-content">
              <div class="media">
                  <div class="media-content">
                      <p class="title is-4">${query}</p>
                  </div>
              </div>
          </div>
      `;
    card.addEventListener("click", () => {
      searchInput.value = query;
      searchButton.click();
    });
    historyList.appendChild(card);
  });

  // append the history list to the aside buttons div
  historyDiv.appendChild(historyList);
}

// Add a click event listener to the search button
searchButton.addEventListener("click", (event) => {
  // Prevent the form from being submitted
  event.preventDefault();

  // Get the search query
  const query = searchInput.value;

  // add this line to store the search query in the localStorage
  if (query) {
    const searches = JSON.parse(localStorage.getItem("searches")) || [];
    if (!searches.includes(query)) {
      // Add new search query to the beginning of the array
      searches.unshift(query);
      // If the size exceeds 10, remove the oldest search
      if (searches.length > 10) {
        searches.pop();
      }
    }
    localStorage.setItem("searches", JSON.stringify(searches));
  }
  // Clear the search input
  if (!query) {
    return;
  }

  // Call updateSearchHistory function when the page loads
  updateSearchHistory();
});

// Search movies function (TMDB API)
function searchMovies(query) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${"a16424a76b8dcba0de70b84fd12abde3"}&query=${query}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => populateMovies(data)) // Call the populateMovies function
    .catch((error) =>
      console.error(
        "There has been a problem with your fetch operation:",
        error
      )
    );
}

function populateMovies(data) {
  // Clear the carousel
  carousel.innerHTML = "";
  // Loop through the movies
  for (let movie of data.results) {
    // Create a column for each card
    const column = document.createElement("div");
    column.className = "column card movie-card is-4 m-1 level-item";

    // Create a carousel item
    const item = document.createElement("div");
    item.className = "level-item carousel-item is-flex-wrap-wrap";
    item.innerHTML = `
    <div class="card-image">
          <figure class="image is-4by4">
              <img src="${
                movie.poster_path
                  ? "https://image.tmdb.org/t/p/w500" + movie.poster_path
                  : "assets/img/clapper-board.png"
              }" alt="${movie.title}">
          </figure>
      </div>
      <div class="card-content">
          <div class="media">
              <div class="media-content">
                  <p class="title is-4">${movie.title}</p>
              </div>
          </div>
          <div class="content">
              ${movie.overview}
          </div>
          <div class="availability"> <!-- This is the new div -->
              Availability: Loading...
          </div>
      </div>
  </div>`;

    // Append the item to the column
    column.appendChild(item);

    // Append the column to the carousel
    carousel.appendChild(column);

    // Call the Utelly API
    fetch(
      `https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${movie.title}&country=us`,
      {
        headers: {
          "X-RapidAPI-Key":
            "014185e72cmsh93a40585366113fp1ab874jsn76d5fb150940",
          "X-RapidAPI-Host":
            "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        // Add the availability information to the item
        const availabilityDiv = item.querySelector(".availability");
        // Check if there is any location
        if (data.results[0] && data.results[0].locations) {
          availabilityDiv.textContent =
            "Availability: " +
            data.results[0].locations // Get the locations
              .map((location) => location.display_name) // Get the display names
              .join(", "); // Join the names with a comma
        } else {
          availabilityDiv.textContent = "Availability: Not available";
        }
      })
      .catch((error) =>
        console.error(
          "There has been a problem with your fetch operation:",
          error
        )
      );
  }
}

// Add an event listener to the search button
searchButton.addEventListener("click", (event) => {
  // Get the search query
  const query = searchInput.value;
  // Call the searchMovies function
  searchMovies(query);
  // Update the search history
  updateSearchHistory();
});

// Genre select event listener
genreSelect.addEventListener("change", (event) => {
  const genre = event.target.value;
  if (!genre) {
    return;
  }
  fetchMoviesByGenre(genre);
});

// Fetch movies by genre
function fetchMoviesByGenre(genre) {
  // Clear the carousel
  genreSelect.value = genre;
  carousel.innerHTML = "";

  fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${"a16424a76b8dcba0de70b84fd12abde3"}&with_genres=${genre}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => populateMovies(data))
    .catch((error) =>
      console.error(
        "There has been a problem with your fetch operation:",
        error
      )
    );
}

// Add an event listener to the random button
randomButton.addEventListener("click", () => {
  let genreOptions = Array.from(genreSelect.options);
  let randomIndex = Math.floor(Math.random() * genreOptions.length);
  genreSelect.selectedIndex = randomIndex;

  // trigger change event
  let event = new Event("change");
  genreSelect.dispatchEvent(event);
});

// Add an event listener to the back button
backButton.addEventListener("click", () => {
  window.location.href = "index.html";
});
