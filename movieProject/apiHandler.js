class APIHandler {
    constructor(apiKey) {
      this.apiKey = apiKey;
    }
  
    async fetchMovieDetails(title) {
      const response = await fetch(`http://www.omdbapi.com/?apikey=${this.apiKey}&t=${title}`);
      return response.json();
    }
  }
  
  module.exports = APIHandler;
  