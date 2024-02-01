

document.addEventListener("DOMContentLoaded", () => {
  const moviesList = document.getElementById("container");

  // Fetch movies data from backend API
  fetch("http://localhost:8080/")
    .then((response) => response.json())
    .then((movies) => {
      console.log(movies);
      movies.forEach((movie) => {
        const movieElement = document.createElement("div");
        movieElement.innerHTML = `
                  <h2>${movie.title}</h2>
                  <img src=${movie.img_url} alt="">
                  <!-- Add more details as needed -->
              `;
        moviesList.appendChild(movieElement);
      });
    })
    .catch((error) => console.error("Error fetching movies:", error));
});
