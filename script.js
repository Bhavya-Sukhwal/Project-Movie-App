const API_KEY ='api_key=287192cb5f5a2c8035ff273f8797bf14';
const BASE_URL ='https://api.themoviedb.org/3';
const TOP_URL = BASE_URL + '/trending/movie/day?' + API_KEY + "&language=en-US&page=1";
const MOVIE_DETAIL_URL = `https://api.themoviedb.org/3/movie/`;
const POPULAR_URL = 'https://api.themoviedb.org/3/movie/popular';

const topdiv = document.getElementById("topdiv");

// Carousel items 

fetch(TOP_URL)
  .then(response => response.json())
  .then(data => {
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselIndicators = document.querySelector('.carousel-indicators');

    for (let i = 0; i < 3; i++) {
      const movie = data.results[i];
      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');
      if (i === 0) {
        carouselItem.classList.add('active');
      }

      const carouselIndicator = document.createElement('li');
      carouselIndicator.setAttribute('data-target', '#movieCarousel');
      carouselIndicator.setAttribute('data-slide-to', i.toString());
      if (i === 0) {
        carouselIndicator.classList.add('active');
      }

      const moviePoster = document.createElement('img');
      moviePoster.classList.add('d-block', 'w-100');
      moviePoster.src = posterUrl;
      moviePoster.alt = movie.title;

      moviePoster.addEventListener('click', () => {
        window.location.href = `details.html?id=${movie.id}`;
      });

      carouselItem.appendChild(moviePoster);
      carouselInner.appendChild(carouselItem);
      carouselIndicators.appendChild(carouselIndicator);
    }
  })
  .catch(error => console.error('Error fetching data:', error));

  // Display movie cards 

  async function fetchPopularMovies() {
    try {
      const response = await fetch(`${POPULAR_URL}?${API_KEY}`);
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
  }

  function displayMovieCards(movies) {
    const moviesContainer = document.getElementById('movies-container');

    if (Array.isArray(movies) && movies.length > 0) {
    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';

      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

      const moviePoster = document.createElement('img');
      moviePoster.src = posterUrl;
      moviePoster.alt = movie.title;
      moviePoster.className = 'movie-poster';

      movieCard.addEventListener('click', () => {
        window.location.href = `details.html?id=${movie.id}`;
      });

      const movieTitle = document.createElement('h2');
      movieTitle.textContent = movie.title;
      movieTitle.className = 'movie-title';

      movieCard.appendChild(moviePoster);
      movieCard.appendChild(movieTitle);
      moviesContainer.appendChild(movieCard);
    });
  } else {
    moviesContainer.textContent = 'No movies found.';
  }
}
  window.onload = async function () {
    const movies = await fetchPopularMovies();
    displayMovieCards(movies);
  };

  // Search Input 
  
  const searchForm = document.getElementById('search');
  const searchInput = document.getElementById('search-input');
  const movieSuggestionsSection = document.getElementById('movie-suggestions');
  const movieCardsContainer = document.getElementById('movie-cards');
  
  searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const searchQuery = searchInput.value.trim();
      if (searchQuery.length > 0) {
          fetchMovieSuggestions(searchQuery);
      }
  });
  
  function fetchMovieSuggestions(query) {
      const url = `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${query}`;
      
      fetch(url)
          .then(response => response.json())
          .then(data => {
              movieCardsContainer.innerHTML = '';
  
              if (data.results && data.results.length > 0) {
                  data.results.forEach(movie => {
                      const movieCard = createMovieCard(movie);
                      movieCardsContainer.appendChild(movieCard);
                  });
                  movieSuggestionsSection.style.display = 'block';
              } else {
                  movieSuggestionsSection.style.display = 'none';
              }
          })
          .catch(error => {
              console.error('Error fetching movie suggestions:', error);
          });
  }
  
  function createMovieCard(movie){
      const movieCard = document.createElement('div');
      movieCard.classList.add('col-4');
  
      const cardContent = `
          <div class="card mb-3">
              <img src="https://image.tmdb.org/t/p/w300/${movie.poster_path}" class="card-img-top" alt="${movie.title}">
              <div class="card-body">
                  <h5 class="card-title">${movie.title}</h5>
                  <p class="card-text">${movie.release_date}</p>
              </div>
          </div>
      `;
  
      movieCard.innerHTML = cardContent;

      movieCard.addEventListener('click', () => {
        window.location.href = `details.html?id=${movie.id}`;
      });

      return movieCard;
  }
