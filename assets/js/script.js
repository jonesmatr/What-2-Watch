// Select the form
const form = document.querySelector('form');
const genreSelect = document.querySelector('#genre-select');
const genreCards = document.querySelector('.card');

// Select the search input and button
const searchInput = document.querySelector('.input');
const searchButton = document.querySelector('.button');

//Select the random button
const randomButton = document.querySelector('.random-button');

//Select the back button
const backButton = document.querySelector('.back-button');

// Fetch genres from TMDB API
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${'a16424a76b8dcba0de70b84fd12abde3'}&language=en-US`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        // Loop through the genres
        for (let genre of data.genres) {
            // Create an option element
            const option = document.createElement('option') ;
            option.value = genre.id;
            option.textContent = genre.name;

            // Append the option to the genre select
            genreSelect.appendChild(option);
        }
        const genreCards = document.querySelectorAll('.card');

        genreCards.forEach(card => {
            card.addEventListener('mouseover', () => {
                card.classList.add('card-hover');
            });

            card.addEventListener('mouseout', () => {
                card.classList.remove('card-hover');
            });
        });
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

// Select the carousel
const carousel = document.querySelector('.carousel');

// Add a click event listener to the search button
searchButton.addEventListener('click', event => {
  // Prevent the form from being submitted
  event.preventDefault();

  // Get the search query
  const query = searchInput.value;

  // add this line to store the search query in the localStorage
  if(query) {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    if(!searches.includes(query)) {
    searches.push(query);
    localStorage.setItem('searches', JSON.stringify(searches));
    }
  }
  // Clear the search input
  if (!query) {
      return;
  }

  function updateSearchHistory() {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    const historyDiv = document.querySelector('.aside-buttons');
    const historyList = document.createElement('ul');
    historyList.className = 'history-list';

    //Clear old list
    const oldList = document.querySelector('.history-list');
    if (oldList) {
        historyDiv.removeChild(oldList);
    }
    
    historyList.className = 'history-list';

    searches.forEach(query => {
      const card = document.createElement('div');
      card.className = 'card history-card';
      card.innerHTML = `
          <div class="card-content">
              <div class="media">
                  <div class="media-content">
                      <p class="title is-4">${query}</p>
                  </div>
              </div>
          </div>
      `;
      card.addEventListener('click', () => {
          searchInput.value = query;
          searchButton.click();
      });
        historyList.appendChild(card);
    });

    // append the history list to the aside buttons div
    historyDiv.appendChild(historyList);
}

// call updateSearchHistory function when the page loads
updateSearchHistory();

  // Call the TMDB API
  fetch(`https://api.themoviedb.org/3/search/movie?api_key=${'a16424a76b8dcba0de70b84fd12abde3'}&query=${query}`)
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok");
          }
          return response.json();
      })
      .then(data => {
          // Clear the carousel
          carousel.innerHTML = '';

          // Loop through the movies
          for (let movie of data.results) {
              // Create a column for each card
              const column = document.createElement('div');
              column.className = 'column card movie-card is-4 m-1 level-item';

              // Create a carousel item
              const item = document.createElement('div');
              item.className = 'level-item carousel-item is-flex-wrap-wrap';
              item.innerHTML = `
                <div class="card-image">
                  <figure class="image is-4by4">
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
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
              fetch(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${movie.title}&country=us`, {
                  headers: {
                      'X-RapidAPI-Key': '014185e72cmsh93a40585366113fp1ab874jsn76d5fb150940',
                      'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
                  }
                })
              .then(response => {
                if (!response.ok) {
                  throw new Error("Network response was not ok");
                }
                return response.json();
              })
              .then(data => {
                  // Add the availability information to the item
                  const availabilityDiv = item.querySelector('.availability');
                if(data.results[0] && data.results[0].locations) {
                  availabilityDiv.textContent = 'Availability: ' + data.results[0].locations.map(location => location.display_name).join(', ');
                } else {
                  availabilityDiv.textContent = 'Availability: Not available';
                }
              })
              .catch(error => console.error('There has been a problem with your fetch operation:',error));
          }
      })
      .catch(error => console.error('There has been a problem with your fetch operation:',error));
});

// Add an event listener to the genre select
    genreSelect.addEventListener('change', event => {
    // Get the genre
    const genre = event.target.value;

    if (!genre) {
        return;
    }

    // Prevent the form from being submitted
    // event.preventDefault();

    // Call the TMDB API
    fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${'a16424a76b8dcba0de70b84fd12abde3'}&with_genres=${genre}`)
        .then(response => {
          console.log(response.status)
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        
        .then(data => {
            // Clear the carousel
            carousel.innerHTML = '';

            // Loop through the movies
            for (let movie of data.results) {

                // Create a column for each card
                const column = document.createElement('div');
                column.className = 'column card movie-card is-4 m-1 level-item';

                // Create a carousel item
                const item = document.createElement('div');
                item.className = 'level-item carousel-item is-flex-wrap-wrap';
                item.innerHTML = `
                  <div class="card-image">
                    <figure class="image is-4by4">
                      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
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
                (function(item) {
                fetch(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${movie.title}&country=us`, {
                    headers: {
                        'X-RapidAPI-Key': '014185e72cmsh93a40585366113fp1ab874jsn76d5fb150940',
                        'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
                    }
                  })
                .then(response => {
                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }
                  return response.json();
                })

                .then(data => {
                  console.log(data);
                    // Add the availability information to the item
                    const availabilityDiv = item.querySelector('.availability');
                  if(data.results[0] && data.results[0].locations) {
                    availabilityDiv.textContent = 'Availability: ' + data.results[0].locations.map(location => location.display_name).join(', ');
                  } else {
                    availabilityDiv.textContent = 'Availability: Not available';
                  }
                })
                .catch(error => console.error('There has been a problem with your fetch operation:',error));
                // alert('Oops! Something went wrong. Please try again later.');
              })(item);
            }
          })
          .catch(error => console.error('There has been a problem with your fetch operation:',error));
          // alert('Oops! Something went wrong. Please try again later.');
    });

// Add an event listener to the random button
randomButton.addEventListener('click', () => {
  let genreOptions = Array.from(genreSelect.options);
  let randomIndex = Math.floor(Math.random() * genreOptions.length);
  genreSelect.selectedIndex = randomIndex;

  // trigger change event
  let event = new Event('change');
  genreSelect.dispatchEvent(event);
});

// Add an event listener to the back button
backButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});

    // Add a change event listener to the genre select on homepage
genreCards.forEach(card => {
  card.addEventListener('mouseover', event => {
    card.classList.add('card-hover');
  });

  card.addEventListener('mouseout', event => {
    card.classList.remove('card-hover');
  });
});