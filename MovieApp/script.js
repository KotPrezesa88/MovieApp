const APIURL =
    `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1`;
const IMGPATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI =
    "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const APICAROUSEL =
    `https://api.themoviedb.org/3/discover/movie?sort_by=vote_average.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1`;


const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const carousel = document.getElementById("media__list");
// initially get fav movies
getMovies(APIURL);

async function getMovies(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    const sortedResults = SortingMovies(respData);
    // console.log(typeof(respData));
    console.log(respData.results);
    // console.log(sortedRsults);
    showMovies(sortedResults);
}

//Popular by default
function showMovies(movies) {
    // clear main
    main.innerHTML = "";

    console.log("movies: "+movies.length)
    if (movies.length == 0) {
        const warning = document.createElement("span");
        warning.classList.add('warning')
        warning.innerHTML="Could not find any movies"
        main.appendChild(warning);
        return
    }

    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview } = movie;

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");

        movieEl.innerHTML = `
            <img
                src="${IMGPATH + poster_path}"
                alt="${title}"
            />
            <div class="movie__info">
                <h3>${title}</h3>
                <span class="${getClassByRate(
                    vote_average
                )}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview:</h3>
                ${overview}
            </div>
        `;
        main.appendChild(movieEl);
    });
}

//CSS accorfing do rating
function getClassByRate(vote) {
    if (vote >= 8) {
        return "gold";
    } else if (vote >= 5) {
        return "silver";
    } else {
        return "bronze";
    }
}

//Dynamic search
search.addEventListener('input', (e) => {
    e.preventDefault();
    
    const searchTerm = search.value;
    console.log(searchTerm)
    if (searchTerm == "") {
        getMovies(APIURL);
        return
    }

    if (searchTerm) {
        getMovies(SEARCHAPI + searchTerm);
        return
    }
});


//Not used anymore
//Search after clinking enter
// form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const searchTerm = search.value;
//     if (searchTerm == "") {
//         getMovies(APIURL);
//         return
//     }

//     if (searchTerm) {
//         getMovies(SEARCHAPI + searchTerm);
//         search.value = "";
//     }
// });






//Sorting movies according to rating
const SortingMovies = (respData) => {
    return mergeSort(respData.results)
}

//Sorting algoryth [merge]
function mergeSort(arr) {
  // Base case
  if (arr.length <= 1) return arr
  let mid = Math.floor(arr.length / 2)
  // Recursive calls
  let left = mergeSort(arr.slice(0, mid))
  let right = mergeSort(arr.slice(mid))
  return merge(left, right)
}

function merge(left, right) {
  let sortedArr = [] // the sorted items will go here
  while (left.length && right.length) {
    // Insert the smallest item into sortedArr
    if (left[0].vote_average > right[0].vote_average) {
      sortedArr.push(left.shift())
    } else {
      sortedArr.push(right.shift())
    }
  }
  // Use spread operators to create a new array, combining the three arrays
  return [...sortedArr, ...left, ...right]
}

//// Carousel Section
GetCarousel(APIURL)

async function GetCarousel(url) {
    const resp = await fetch(url);
    const respData = await resp.json();
    const sortedResults = SortingMovies(respData);
    // console.log(typeof(respData));
    console.log(respData.results);
    // console.log(sortedRsults);
    CreateCarousel(sortedResults.slice(0, 5));
}

const CreateCarousel = (movies) => {
    let counter = 0;
    carousel.innerHTML = ` `
    movies.forEach((movie) => {
        const { poster_path, title, vote_average, overview } = movie;
        const carouselElements = document.createElement("li");
        carouselElements.classList.add("slide");
        if (counter == 0) {
            carouselElements.dataset.active ='true';
            carouselElements.innerHTML = `
                    <img
                        src="${IMGPATH + poster_path}"
                        alt="${title}"
                    />
                    <div class="carousel__overview">
                        <h3>${title}</h3>
                        <span>${overview}</span>
                    </div>
            `;
            carousel.appendChild(carouselElements);
            counter = 1;
        } else {
            carouselElements.innerHTML = `
                    <img
                        src="${IMGPATH + poster_path}"
                        alt="${title}"
                    />
                    <div class="carousel__overview">
                        <h3>${title}</h3>
                        <span>${overview}</span>
                    </div>
            `;
        carousel.appendChild(carouselElements);
        }
    });
    CarouselSlider()
}

const CarouselSlider = () => {
    const buttons = document.querySelectorAll("[data-carousel-button]")

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const offset = button.dataset.carouselButton === "next" ? 1 : -1
            const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]")

            const activeSlide = slides.querySelector("[data-active]")
            let newIndex = [...slides.children].indexOf(activeSlide) + offset
            if (newIndex < 0) newIndex = slides.children.length - 1
            if (newIndex >= slides.children.length) newIndex = 0

            slides.children[newIndex].dataset.active = true
            delete activeSlide.dataset.active
        })
    })
}