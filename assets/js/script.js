// Select the form
const form = document.querySelector('form');
const genreSelect = document.querySelector('#genre-select');
const genreCards = document.querySelector('.card');


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
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;

            // Append the option to the genre select
            genreSelect.appendChild(option);
        }
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

// Select the carousel
const carousel = document.querySelector('.carousel');

// Add a submit event listener to the form
form.addEventListener('submit', event => {
    // Get the genre
    const genre = event.target.querySelector('select').value;

    if (!genre) {
        return;
    }

    // Prevent the form from being submitted
    event.preventDefault();

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
                column.className = 'column is-one-quarter';

                // Create a carousel item
                const item = document.createElement('div');
                item.className = 'movie-card carousel-item';
                item.innerHTML = `
                  <div class="card-image">
                    <figure class="image is-4by5">
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
                  </div>`;


                // Append the item to the column
                column.appendChild(item);
                
                // Append the column to the carousel
                carousel.appendChild(column);
            

                // Call the Utelly API
                (function(item) {
                fetch(`https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=${item.textContent}&country=us`, {
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
                    if(data.results[0] && data.results[0].locations) {
                    item.textContent += ' Available on: ' + data.results[0].locations.map(location => location.display_name).join(', ');
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

    // Add a change event listener to the genre select on homepage
genreCards.forEach(card => {
  card.addEventListener('mouseover', event => {
    card.classList.add('card-hover');
  });

  card.addEventListener('mouseout', event => {
    card.classList.remove('card-hover');
  });
});