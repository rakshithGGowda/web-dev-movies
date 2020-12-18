const popularApiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=7826b828b8971b2adc0e3801578e24c7&language=en-US&page=1 ';
const fetchMovieUrl = 'https://api.themoviedb.org/3/configuration?api_key=7826b828b8971b2adc0e3801578e24c7';
const upcomingApiUrl = 'https://api.themoviedb.org/3/movie/upcoming?api_key=7826b828b8971b2adc0e3801578e24c7&language=en-US&page=1'
const movieDetailsUrl = 'https://api.themoviedb.org/3/movie/'
const API_KEY = '?api_key=7826b828b8971b2adc0e3801578e24c7&language=en-US';

//DOM
const main = document.querySelector('.main');
const trayBtn = document.querySelector('.navbar-nav');
const overlay = document.querySelector('.overlay');
const closeOverlayBtn = document.querySelector('.overlay-close-btn')
activeTray = 'popular-btn';

//Onclick on popular and upcoming tray
trayBtn.addEventListener('click', event => {
    event.preventDefault();

    trayClicked = event.target.classList[1]
    if (activeTray != trayClicked) {
        const imageItem = document.querySelectorAll('.image-item');

        imageItem.forEach(element => {
            element.remove();
        });
        activeTray = trayClicked;
        if (trayClicked == "popular-btn") {
            onTrayLoad(popularApiUrl);

        } else if (trayClicked == "upcoming-btn") {
            onTrayLoad(upcomingApiUrl);
        }
        document.querySelector('.popular-btn').classList.toggle('active');
        document.querySelector('.upcoming-btn').classList.toggle('active');
    }
})

//returns the image Url from the image name
function getImage(imagename, imagesizetype) {
    return fetch(fetchMovieUrl)
        .then(
            function (response) {
                if (response.status !== 200) {
                    alert('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                return response.json().then(function (data) {
                    baseUrl = data.images.base_url
                    imagesize = data.images[imagesizetype][2];
                    finalurl = baseUrl + imagesize + imagename;
                    return finalurl;
                });
            }
        )
        .catch(function (err) {
            alert('Fetch Error :-S', err);
        });
}


//Main Posters Items fetch
function onTrayLoad(url) {
    fetch(url)
        .then(
            function (response) {
                if (response.status !== 200) {
                    alert('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                response.json().then(function (data) {

                    data.results.forEach(element => {
                        imageName = element.poster_path;

                        getImage(imageName, "poster_sizes").then(imageUrl => {

                            const imageItem = document.createElement('div');
                            imageItem.classList.add("image-item");
                            imageItem.setAttribute("movie-id", element.id);
                            imageItem.style.backgroundImage = "url(" + imageUrl + ")";

                            const rating = document.createElement('div');
                            rating.classList.add('rating');
                            rating.innerHTML = '<i class="fas fa-star"></i>  &nbsp' + element.vote_average;
                            imageItem.appendChild(rating);

                            main.appendChild(imageItem);
                        });

                    });

                });
            })
        .catch(function (err) {
            alert('Fetch Error :-S', err);
        });
}

//Onclick on Poster Items to open overlay
main.addEventListener('click', event => {
    let movieId = event.target.getAttribute("movie-id")
    if (movieId == null) return;
    let genresValue = "";
    let movieDetails = movieDetailsUrl + movieId + API_KEY;

    fetch(movieDetails)
        .then(
            function (response) {
                if (response.status !== 200) {
                    alert('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                response.json().then(function (data) {
                    imageName = data.backdrop_path;
                    tagLine = data.tagline;
                    title = data.original_title;
                    rating = data.vote_average;
                    overview = data.overview;
                    runTime = data.runtime;
                    genres = data.genres;
                    getImage(imageName, "profile_sizes").then(imageUrl => {
                        document.querySelector('.overlay-cover').style.backgroundImage = "url(" + imageUrl + ")";
                        if (tagLine !== "") {
                            document.querySelector('.movie-tagline').textContent = '"' + tagLine + '"';
                        }
                        document.querySelector('.overlay-movie-title').textContent = title;
                        document.querySelector('.movie-info-rating').innerHTML += " " + rating;
                        document.querySelector('.movie-info-runtime').innerHTML += " " + Math.floor(parseInt(runTime) / 60) + "h" + " " + parseInt(runTime) % 60 + "m";
                        document.querySelector('.movie-info-overview').textContent = overview;
                        genres.forEach(element => {
                            genresValue += element.name + ","
                        })
                        genresValue = genresValue.replace(/.$/, ".");
                        document.querySelector('.genres-info').innerHTML += genresValue;
                    })

                    overlay.style.display = 'block';


                });

            })
        .catch(function (err) {
            alert('Fetch Error :-S', err);
        });
});

//overlay close btn
closeOverlayBtn.addEventListener('click', event => {
    overlay.style.display = 'none';
    document.querySelector('.movie-tagline').textContent = "";
    document.querySelector('.overlay-movie-title').textContent = ""
    document.querySelector('.movie-info-rating').innerHTML = '<i class="fas fa-star"> </i>'
    document.querySelector('.movie-info-runtime').innerHTML = '<i class="fas fa-clock"></i>'
    document.querySelector('.movie-info-overview').textContent = ""
    document.querySelector('.genres-info').textContent = "";
})

//Onlad main page
window.onload = function () {
    onTrayLoad(popularApiUrl);
}