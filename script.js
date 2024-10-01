const apiKey = 'e2f79e0213b5d8eb5831c2bd9827bc82'; // Reemplaza con tu clave API
const apiUrl = 'https://api.themoviedb.org/3';
const movieList = document.getElementById('movies');
const movieDetails = document.getElementById('movie-details');
const detailsContainer = document.getElementById('details');
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const favoritesList = document.getElementById('favorites-list');
const addToFavoritesButton = document.getElementById('add-to-favorites');
let selectedMovieId = null;
let favoriteMovies = JSON.parse(localStorage.getItem('favorites')) || [];

// Fetch and display popular movies
async function fetchPopularMovies() {
    try {
        // tu codigo aqui: realiza una solicitud para obtener las películas populares
        const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
        const data = await response.json();
        displayMovies(data.results);
        console.log(data);
        // y llama a displayMovies con los resultados
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

async function test(itemID) {
    try {
        // tu codigo aqui: realiza una solicitud para obtener las películas populares
        const response = await fetch(`https://api.themoviedb.org/3/movie/550?api_key=e2f79e0213b5d8eb5831c2bd9827bc82`);
        const data = await response.json();
        displayMovies(data.results);
        console.log(data);
        // y llama a displayMovies con los resultados
    } catch (error) {
        console.error('Error fetching popular movies:', error);
    }
}

function getMovieDetail(id) {
    return fetch('https://api.themoviedb.org/3/movie/550?api_key=e2f79e0213b5d8eb5831c2bd9827bc82' + id + '?language=en-US', options)
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch(err => console.error(err));
  }

// Display movies
function displayMovies(movies) {
    movieList.innerHTML = ''; // Limpia la lista de películas

    movies.forEach(movie => {
        // Verifica si el movie.id existe antes de proceder
        if (!movie.id) {
            console.error('Movie ID is undefined for movie:', movie);
            return; // Salta esta película si no tiene un ID válido
        }

        const li = document.createElement('li');
        li.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <span>${movie.title}</span>
        `;
        
        // Asigna la función para mostrar los detalles al hacer clic
        li.onclick = () => showMovieDetails(movie.id);

        // Añade el elemento a la lista
        movieList.appendChild(li);
    });
}


// Show movie details
async function showMovieDetails(movieId) {
    try {
        console.log(`Fetching details for movie ID: ${movieId}`); // Verificar el ID recibido

        // Realiza una solicitud para obtener los detalles de la película
        const response = await fetch(`${apiUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const movie = await response.json();
        console.log('Movie data:', movie); // Verificar los datos de la película
        
        // Llama a una función para actualizar el contenedor con los detalles de la película
        updateDetailsContainer(movie);
    }   catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

function updateDetailsContainer(movie) {
    if (!movie){
        console.error("No movie data available");
        return;
    }
    console.log("Actualizando detalles para:",movie.title);
    detailsContainer.innerHTML = `
        <h3>${movie.title}</h3>
        <p><strong>Overview:</strong> ${movie.overview || 'No overview available'}</p>
        <p><strong>Release Date:</strong> ${movie.release_date || 'No release date available'}</p>
        <p><strong>Rating:</strong> ${movie.vote_average ? movie.vote_average + '/10' : 'No rating available'}</p>
        <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(', ') || 'No genres available'}</p>
        <p><strong>Tagline:</strong> ${movie.tagline || 'No tagline available'}</p>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    `;
    detailsContainer.parentElement.classList.remove('hidden');
    selectedMovieId = movie.id; // Guarda el ID de la película seleccionada para favoritos
}



// Search movies
searchButton.addEventListener('click', async () => {
    const query = searchInput.value;
    if (query) {
        try {
            console.log(query);
            // tu codigo aqui: realiza una solicitud para buscar películas
            const response = await fetch(`${apiUrl}/search/movie?api_key=${apiKey}&language=en-US&query=${encodeURIComponent(query)}&page=1`);
            const data = await response.json();
            displayMovies(data.results);
            // y llama a displayMovies con los resultados de la búsqueda
        } catch (error) {
            console.error('Error searching movies:', error);
        }
    } else {
        try {
            // tu codigo aqui: realiza una solicitud para obtener las películas populares
            const response = await fetch(`${apiUrl}/movie/popular?api_key=${apiKey}&language=en-US&page=1`);
            const data = await response.json();
            displayMovies(data.results);
            // y llama a displayMovies con los resultados
        } catch (error) {
            console.error('Error fetching popular movies:', error);
        }
    }
});

// Add movie to favorites
addToFavoritesButton.addEventListener('click', () => {
    if (selectedMovieId) {
        const favoriteMovie = {
            id: selectedMovieId,
            title: document.querySelector('#details h3').textContent
        };
        if (!favoriteMovies.some(movie => movie.id === selectedMovieId)) {
            favoriteMovies.push(favoriteMovie);
            localStorage.setItem('favorites', JSON.stringify(favoriteMovies)); // Guarda en localStorage
            displayFavorites(); // Muestra la lista actualizada de favoritos
        }
    }
});

// Display favorite movies
function displayFavorites() {
    favoritesList.innerHTML = ''; // Limpia la lista de favoritos
    favoriteMovies.forEach(movie => {
        const li = document.createElement('li');
        li.textContent = movie.title;
        favoritesList.appendChild(li);
    });
}

// Initial fetch of popular movies and display favorites
fetchPopularMovies(); // Obtiene y muestra las películas populares
displayFavorites(); // Muestra las películas favoritas guardadas
 