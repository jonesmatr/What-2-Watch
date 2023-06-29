// Select the form
const form = document.querySelector('form');
const genreSelect = document.querySelector('#genre-select');

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
                // Create a carousel item
                const item = document.createElement('div');
                item.className = 'carousel-item';
                item.textContent = movie.title;

                // Append the item to the carousel
                carousel.appendChild(item);

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