function start(rl, fileHandler, MovieManager, APIHandler) {
    const movieManager = new MovieManager(fileHandler, 'movies.json');
    const apiHandler = new APIHandler('APIKEY');
  
    movieManager.init().then(() => {
      console.log('Welcome to the Movie Catalog!');
      displayCommands();
      uiLoop();
    });
  
    function uiLoop() {
      rl.question('\nWhat would you like to do? ', (answer) => {
        if (answer === 'exit') {
          rl.close();
          return;
        }
  
        try {
          switch (answer) {
            case 'add':
              addMovieUI().then(postCommand).catch(handleError);
              break;
            case 'update':
              updateMovieUI().then(postCommand).catch(handleError);
              break;
            case 'delete':
              deleteMovieUI().then(postCommand).catch(handleError);
              break;
            case 'display':
              displayMovies().then(postCommand).catch(handleError);
              break;
            case 'search':
              searchMoviesUI().then(postCommand).catch(handleError);
              break;
            case 'filter':
              filterMoviesUI().then(postCommand).catch(handleError);
              break;
            case 'fetch':
              fetchMovieDataUI().then(postCommand).catch(handleError);
              break;
            default:
              console.log('Unknown command');
              postCommand();
          }
        } catch (error) {
          handleError(error);
          postCommand();
        }
      });
    }
  
    function handleError(error) {
      console.error(`Error: ${error.message}`);
    }
  
    function addMovieUI() {
      return new Promise((resolve) => {
        rl.question('Enter the movie title: ', (title) => {
          rl.question('Enter the director: ', (director) => {
            rl.question('Enter the release year: ', (releaseYear) => {
              rl.question('Enter the genre: ', (genre) => {
                movieManager.addMovie(title, director, releaseYear, genre);
                resolve();
              });
            });
          });
        });
      });
    }
  
    function updateMovieUI() {
      return new Promise((resolve) => {
        rl.question('Enter the title of the movie to update: ', (title) => {
          rl.question('Enter the new director: ', (director) => {
            rl.question('Enter the new release year: ', (releaseYear) => {
              rl.question('Enter the new genre: ', (genre) => {
                movieManager.updateMovie(title, { director, releaseYear, genre });
                resolve();
              });
            });
          });
        });
      });
    }
  
    function deleteMovieUI() {
      return new Promise((resolve) => {
        rl.question('Enter the title of the movie to delete: ', (title) => {
          const foundMovie = movieManager.searchMovies(title);
    
          if (foundMovie.length === 0) {
            console.log(`Movie '${title}' not found.`);
          } else {
            const movieToDelete = foundMovie[0]; // Assuming there is only one movie with the same title
            movieManager.deleteMovie(movieToDelete.title);
            console.log(`Movie '${movieToDelete.title}' has been deleted.`);
          }
    
          resolve();
        });
      });
    }
    
  
    async function displayMovies() {
      const movies = await movieManager.getMovies();
      console.log(movies);
    }
  
    function searchMoviesUI() {
      return new Promise((resolve) => {
        rl.question('Enter search query: ', (query) => {
          const movies = movieManager.searchMovies(query);
          console.log(movies);
          resolve();
        });
      });
    }
  
    function filterMoviesUI() {
      return new Promise((resolve) => {
        rl.question('Enter filter criteria as JSON (e.g., {"genre": "Action"}): ', (criteria) => {
          const filter = JSON.parse(criteria);
          const movies = movieManager.filterMovies(filter);
          console.log(movies);
          resolve();
        });
      });
    }
  
    async function fetchMovieDataUI() {
      return new Promise((resolve) => {
        rl.question('Enter the movie title to fetch data for: ', async (title) => {
          const movieData = await apiHandler.fetchMovieDetails(title);
          console.log(movieData);
    
          if (movieData.Response === 'True') {
            const existingMovie = movieManager.searchMovies(title);
            if (existingMovie.length === 0) {
              const { Title, Director, Year, Genre } = movieData; // Destructure the movieData object
              movieManager.addMovie(Title, Director, Year, Genre); // Call addMovie with individual arguments
            } else {
              console.log(`Movie '${title}' already exists in the catalog.`);
            }
          } else {
            console.log(`Movie '${title}' not found.`);
          }
    
          resolve();
        });
      });
    }
      
  
    function postCommand() {
      displayCommands();
      uiLoop();
    }
  
    function displayCommands() {
      console.log('\nCommands:\n' +
        'add: Add a new movie to the catalog\n' +
        'update: Update details of a movie in the catalog\n' +
        'delete: Delete a movie from the catalog\n' +
        'display: Display the movie catalog\n' +
        'search: Search the movie catalog\n' +
        'filter: Filter the movie catalog\n' +
        'fetch: Fetch movie data from the OMDB API\n' +
        'exit: Exit the application\n'
      );
    }
  }
  
  module.exports = { start };
  
