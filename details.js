const MOVIE_DETAILS_URL = 'https://api.themoviedb.org/3/movie/';
const API_KEY ='api_key=287192cb5f5a2c8035ff273f8797bf14';

async function displayMovieDetails(movieId) {
  try {
    const response = await fetch(`${MOVIE_DETAILS_URL}${movieId}?${API_KEY}&language=en-US`);
    const data = await response.json();
    const movieDetailContainer = document.getElementById('movie-detail-container');

    movieDetailContainer.innerHTML = '';

    const moviePoster = document.createElement('img');
    moviePoster.src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
    moviePoster.alt = data.title;
    movieDetailContainer.appendChild(moviePoster);

    const movieTitle = document.createElement('h2');
    movieTitle.textContent = data.title;
    movieDetailContainer.appendChild(movieTitle);

    const movieOverview = document.createElement('p');
    movieOverview.textContent = data.overview;
    movieDetailContainer.appendChild(movieOverview);

    const movieReleaseDate = document.createElement('p');
    movieReleaseDate.textContent = `Release Date: ${data.release_date}`;
    movieDetailContainer.appendChild(movieReleaseDate);

    const trailerResponse = await fetch(`${MOVIE_DETAILS_URL}${movieId}/videos?${API_KEY}&language=en-US`);
    const trailerData = await trailerResponse.json();
    const trailers = trailerData.results.filter(video => video.type === 'Trailer');

    if (trailers.length > 0) {
      const trailerSection = document.createElement('div');
      trailerSection.innerHTML = '<h3>Trailers</h3>';
      trailers.forEach(trailer => {
        const trailerLink = document.createElement('a');
        trailerLink.href = `https://www.youtube.com/watch?v=${trailer.key}`;
        trailerLink.target = '_blank';
        trailerLink.textContent = trailer.name;
        trailerSection.appendChild(trailerLink);
      });
      movieDetailContainer.appendChild(trailerSection);
    }

    const creditsResponse = await fetch(`${MOVIE_DETAILS_URL}${movieId}/credits?${API_KEY}&language=en-US`);
    const creditsData = await creditsResponse.json();
    const castMembers = creditsData.cast.slice(0, 5);

    if (castMembers.length > 0) {
      const castSection = document.createElement('div');
      castSection.innerHTML = '<h3>Cast</h3>';
      castMembers.forEach(cast => {
        const castMemberDiv = document.createElement('div');
        castMemberDiv.classList.add('cast-member');
        const castImage = document.createElement('img');
        castImage.src = `https://image.tmdb.org/t/p/w200${cast.profile_path}`;
        castImage.alt = cast.name;
        castMemberDiv.appendChild(castImage);

        const castName = document.createElement('p');
        castName.textContent = cast.name;
        castMemberDiv.appendChild(castName);

        castSection.appendChild(castMemberDiv);
      });
      movieDetailContainer.appendChild(castSection);
    }

  } catch (error) {
    console.error('Error fetching movie details:', error);
    const movieDetailContainer = document.getElementById('movie-detail-container');
    movieDetailContainer.innerHTML = 'Error fetching movie details.';
  }
}

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

if (movieId) {
  displayMovieDetails(movieId);
}