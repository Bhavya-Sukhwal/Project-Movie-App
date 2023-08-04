const API_KEY = "api_key=287192cb5f5a2c8035ff273f8797bf14";
const BASE_URL = "https://api.themoviedb.org/3";
const TOP_URL = BASE_URL + "/trending/movie/day?" + API_KEY + "&language=en-US&page=1";
const MOVIE_DETAIL_URL = `https://api.themoviedb.org/3/movie/`;
const POPULAR_URL = "https://api.themoviedb.org/3/movie/popular";

let searchApi = "home";

// Carousel items

fetch(TOP_URL)
  .then((response) => response.json())
  .then((data) => {
    const carouselInner = document.querySelector(".carousel-inner");
    const carouselIndicators = document.querySelector(".carousel-indicators");

    for (let i = 0; i < 3; i++) {
      const movie = data.results[i];
      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (i === 0) {
        carouselItem.classList.add("active");
      }

      const carouselIndicator = document.createElement("li");
      carouselIndicator.setAttribute("data-target", "#movieCarousel");
      carouselIndicator.setAttribute("data-slide-to", i.toString());
      if (i === 0) {
        carouselIndicator.classList.add("active");
      }

      const moviePoster = document.createElement("img");
      moviePoster.classList.add("d-block", "w-100");
      moviePoster.src = posterUrl;
      moviePoster.alt = movie.title;

      moviePoster.addEventListener("click", () => {
        window.location.href = `details.html?id=${movie.id}`;
      });

      carouselItem.appendChild(moviePoster);
      carouselInner.appendChild(carouselItem);
      carouselIndicators.appendChild(carouselIndicator);
    }
  })
  .catch((error) => console.error("Error fetching data:", error));

// Display movie cards

let currentPage = 1;
const moviesPerPage = 10;
let isLoading = false;

async function fetchPopularMovies(page) {
  try {
    const response = await fetch(`${POPULAR_URL}?${API_KEY}&page=${page}`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function displayMovieCards(movies) {
  const moviesContainer = document.getElementById("movies-container");

  if (Array.isArray(movies) && movies.length > 0) {
    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.className = "movie-card";

      const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

      const moviePoster = document.createElement("img");
      moviePoster.src = posterUrl;
      moviePoster.alt = movie.title;
      moviePoster.className = "movie-poster";

      movieCard.addEventListener("click", () => {
        window.location.href = `details.html?id=${movie.id}`;
      });

      const movieTitle = document.createElement("h2");
      movieTitle.textContent = movie.title;
      movieTitle.className = "movie-title";

      movieCard.appendChild(moviePoster);
      movieCard.appendChild(movieTitle);
      moviesContainer.appendChild(movieCard);
    });
  } else {
    moviesContainer.textContent = "No movies found.";
  }
}

async function loadMoreMovies() {
  if (!isLoading) {
    isLoading = true;
    currentPage++;
    const movies = await fetchPopularMovies(currentPage);
    displayMovieCards(movies);
    isLoading = false;
  }
}

// Search Input

const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-input");
const movieSuggestionsSection = document.getElementById("movie-suggestions");
const movieCardsContainer = document.getElementById("movie-cards");

let currentPage1 = 1;
let isLoading1 = false;

function fetchMovieSuggestions(query, page) {
  const url = `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${query}&page=${page}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        if (page === 1) {
          movieCardsContainer.innerHTML = "";
        }
        data.results.forEach((movie) => {
          const movieCard = createMovieCard(movie);
          movieCardsContainer.appendChild(movieCard);
        });
        movieSuggestionsSection.style.display = "block";
        isLoading1 = false;
        const classHiding = document.getElementById("hiding");
        classHiding.style.display = "none";
      } else {
        if (page === 1) {
          movieCardsContainer.innerHTML = "<p>No results found.</p>";
          movieSuggestionsSection.style.display = "block";
          const classHiding = document.getElementById("hiding");
          classHiding.style.display = "none";
        }
        isLoading1 = false;
      }
    })
    .catch((error) => {
      console.error("Error fetching movie suggestions:", error);
      isLoading1 = false;
    });
    searchApi = 'search'
}

function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("col-4", "searchResults");

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

  movieCard.addEventListener("click", () => {
    window.location.href = `details.html?id=${movie.id}`;
  });

  return movieCard;
}

// Lazy loading and infinite results 

window.onload = async function () {
  const movies = await fetchPopularMovies(currentPage);
  displayMovieCards(movies);

  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      if (searchApi == "home") {
        loadMoreMovies();
      } else {
        isLoading1 = true;
            currentPage1++;
            const searchQuery = searchInput.value.trim();
            fetchMovieSuggestions(searchQuery, currentPage1);
      }
    }
  });
};

// Submit on searchForm 

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchQuery = searchInput.value.trim();
  if (searchQuery.length > 0) {
    currentPage1 = 1;
    fetchMovieSuggestions(searchQuery, currentPage1);
  }
});

// clear search function

const clearButton = document.getElementById("clearButton");

clearButton.addEventListener("click", function () {
  movieSuggestionsSection.style.display = "none";
  const classHiding = document.getElementById("hiding");
  classHiding.style.display = "block";
  searchApi = 'home'
  searchForm.reset();
});
