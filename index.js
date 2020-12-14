const popularApiUrl = 'https://api.themoviedb.org/3/movie/popular?api_key=7826b828b8971b2adc0e3801578e24c7&language=en-US&page=1 ';
const fetchMovieUrl = 'https://api.themoviedb.org/3/configuration?api_key=7826b828b8971b2adc0e3801578e24c7';
const upcomingApiUrl = 'https://api.themoviedb.org/3/movie/upcoming?api_key=7826b828b8971b2adc0e3801578e24c7&language=en-US&page=1'
const movieDetailsUrl = 'https://api.themoviedb.org/3/movie/703771?api_key=7826b828b8971b2adc0e3801578e24c7&language=en-US'


const main = document.querySelector('.main');
const trayBtn = document.querySelector('.navbar-nav');
const overlay = document.querySelector('.overlay');
activeTray = 'popular-btn';

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


function getImage(imagename, imagesizetype) {
    return fetch(fetchMovieUrl)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                return response.json().then(function(data) {
                    baseUrl = data.images.base_url
                    imagesize = data.images[imagesizetype][2];
                    finalurl = baseUrl + imagesize + imagename;
                    return finalurl;
                });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}



function onTrayLoad(url) {
    fetch(url)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function(data) {



                    data.results.forEach(element => {
                        imageName = element.poster_path;
                        // console.log(imageName)


                        getImage(imageName, "poster_sizes").then(imageUrl => {
                            // console.log(element.id);
                            // console.log(imageUrl);

                            const imageItem = document.createElement('div');
                            imageItem.classList.add("image-item");
                            imageItem.setAttribute("movie-id", element.id);
                            imageItem.style.backgroundImage = "url(" + imageUrl + ")";
                            // imageItem.textContent = element.original_title + "    " + element.vote_average

                            const rating = document.createElement('div');
                            rating.classList.add('rating');
                            rating.innerHTML = '<i class="fas fa-star"></i>  &nbsp' + element.vote_average;
                            imageItem.appendChild(rating);

                            main.appendChild(imageItem);
                        });



                    });

                });
            })
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
}

main.addEventListener('click', event => {
    let movieId = event.target.getAttribute("movie-id")
        // console.log(movieId);

    let movieDetails = 'https://api.themoviedb.org/3/movie/' + movieId + '?api_key=7826b828b8971b2adc0e3801578e24c7&language=en-US';

    fetch(movieDetails)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }

                // Examine the text in the response
                response.json().then(function(data) {
                    console.log(data);
                    imageName = data.backdrop_path;
                    tagLine = data.tagline;
                    title = data.original_title;
                    rating = data.vote_average;
                    overview = data.overview;
                    runTime = data.runtime;

                    getImage(imageName, "profile_sizes").then(imageUrl => {
                        overlay.children[0].children[0].style.backgroundImage = "url(" + imageUrl + ")";
                        if (tagLine !== "") {
                            overlay.children[0].children[0].children[0].textContent = '"' + tagLine + '"';
                        }
                        document.querySelector('.overlay-movie-title').textContent = title;
                        document.querySelector('.movie-info-rating').innerHTML += " " + rating;
                        document.querySelector('.movie-info-runtime').innerHTML += " " + Math.floor(parseInt(runTime) / 60) + "h" + " " + parseInt(runTime) % 60 + "m";
                        // console.log(imageUrl)
                    })

                    // console.log(imageUrl + tagLine + title + rating + overview + runTime)

                    overlay.style.display = 'block';


                });

            })
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
});


window.onload = function() {
    onTrayLoad(popularApiUrl);
}