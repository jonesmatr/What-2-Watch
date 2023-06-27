//Create variables and assign them to the elements in the HTML
//API Key
const settings = {
	async: true,
	crossDomain: true,
	url: 'https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup?term=bojack&country=uk',
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '014185e72cmsh93a40585366113fp1ab874jsn76d5fb150940',
		'X-RapidAPI-Host': 'utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com'
	}
};

$.ajax(settings).done(function (response) {
	console.log(response);
});

const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhMTY0MjRhNzZiOGRjYmEwZGU3MGI4NGZkMTJhYmRlMyIsInN1YiI6IjY0OWEyMGRlMjk3NWNhMDE0NGNjOTUwMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.S3lnnuQ7KF-BGan5iMJitixVDKxQUvdkl26pyTxsgo0'
    }
  };
  
  fetch('https://api.themoviedb.org/3/authentication', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));