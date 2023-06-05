class MovieManager {
    constructor(fileHandler, filename) {
      this.fileHandler = fileHandler;
      this.filename = filename;
      this.movies = [];
    }
  
    async init() {
      this.movies = await this.fileHandler.readJSONFile(this.filename);
    }
  
    async addMovie(title, director, releaseYear, genre) {
      const exists = this.movies.find(movie => movie.title === title);
      if (exists) {
        throw new Error(`Movie with title ${title} already exists`);
      }
  
      const newMovie = { title, director, releaseYear, genre };
      this.movies.push(newMovie);
      await this.saveMovies();
    }
  
    async updateMovie(title, updatedMovie) {
      const movieIndex = this.movies.findIndex(movie => movie.title === title);
      if (movieIndex === -1) {
        throw new Error('Movie not found');
      }
  
      const updated = { ...this.movies[movieIndex], ...updatedMovie };
      this.movies[movieIndex] = updated;
      await this.saveMovies();
    }
  
    async deleteMovie(title) {
      const movieIndex = this.movies.findIndex(movie => movie.title === title);
      if (movieIndex === -1) {
        throw new Error('Movie not found');
      }
  
      this.movies.splice(movieIndex, 1);
      await this.saveMovies();
    }
  
    searchMovies(query) {
        return this.movies.filter(movie => {
          const title = movie.title ? movie.title.toLowerCase() : '';
          const director = movie.director ? movie.director.toLowerCase() : '';
          const genre = movie.genre ? movie.genre.toLowerCase() : '';
          return (
            typeof title === 'string' && title.includes(query.toLowerCase()) ||
            typeof director === 'string' && director.includes(query.toLowerCase()) ||
            typeof genre === 'string' && genre.includes(query.toLowerCase())
          );
        });
      }
      
  
    filterMovies(filter) {
      return this.movies.filter(movie => {
        for (let key in filter) {
          if (movie[key] !== filter[key]) {
            return false;
          }
        }
        return true;
      });
    }
  
    async saveMovies() {
      await this.fileHandler.writeJSONFile(this.filename, this.movies);
    }
  
    getMovies() {
      return this.movies;
    }
  }
  
  module.exports = MovieManager;
  