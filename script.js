// URLs containing IMDB score and highest number of votes as endpoints for the API request
const topMovieURL= "http://localhost:8000/api/v1/titles/?imdb_score_min=9.6&sort_by=-votes";
const topSevenURL= "http://localhost:8000/api/v1/titles/?imdb_score_min=9.3&sort_by=-imdb_score&sort_by=-votes";

// URLs containing IMDB score and movie genre as endpoints for the API request
const topComedyURL= "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=comedy&sort_by=-imdb_score";
const topDramaURL= "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=drama&sort_by=-imdb_score";
const topRomanceURL= "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=romance&sort_by=-imdb_score";

// header names following project requirements
const pop_window_headers = [
    "Title",
    "Full Genre",
    "Release date",
    "MPAA rating",
    "IMDb score",
    "Director",
    "List of actors",
    "Duration",
    "Country of origin",
    "Box Office result",
    "Movie summary",
];

// submits a fetch request to the API with promise for one page of results
async function fetchData(url){
  const response = await fetch(url);
  return await response.json();
}

// submits a fetch request to the API for multiple pages
// and create the required elements for the categories
async function fetchPages(url, cat_name, start, end) {
  return new Promise(async (resolve, reject) => {
    try {
      let allData = [];
      // a loop to get the results from page one and two of the API response
      for (let page = 1; page <= 2; page++) {
        let data = await fetchData(`${url}&page=${page}`);
        allData = allData.concat(data.results);
      }

      const sortedList = allData.sort((a, z) => parseFloat(z.imdb_score) - parseFloat(a.imdb_score))
        .slice(start, end);

      const imgURL = sortedList.map((item) => item.image_url);

      // Call the new function to handle carousel creation
      carousel(imgURL, cat_name);

      // Resolve the Promise once everything is complete
      resolve();
    } catch (error) {
      // Reject the Promise if an error occurs
      reject(error);
    }
  });
}

function carousel(imgURL, cat_name) {
  carouselElements (imgURL, cat_name)
  let currentSlide = 0;
  const slidesToShow = 0.5;
  const slideWidth = 36;

  // controls the slideshow
  function showSlide(n) {
    const slides = document.getElementsByClassName(cat_name);
    currentSlide = (n + slides.length) % slides.length;
    const offset = -currentSlide * (slidesToShow * slideWidth);
    document.getElementById(cat_name).style.transform = `translateX(${offset}%)`;
  }

  const previous = document.getElementById("previous" + cat_name);
  previous.addEventListener("click", function () {showSlide(currentSlide - 1);
  });

  const next = document.getElementById("next" + cat_name);
  next.addEventListener("click", function () {showSlide(currentSlide + 1);
  });

  // Initial slideshow display
  showSlide(currentSlide);
}

function carouselElements (imgURL, cat_name){
  const carousel_main = document.createElement("div");
  const carousel_title = document.createElement("h2");
  const carousel_container = document.createElement("div");
  const prev_btn = document.createElement("button");
  const carousel = document.createElement("div");
  const next_btn = document.createElement("button");

  carousel_title.textContent = cat_name;
  carousel_title.classList.add("category_title");
  carousel_container.classList.add("container");
  carousel.classList.add("carousel");
  carousel.setAttribute("id", cat_name);

  prev_btn.classList.add("arrow", "prev");
  prev_btn.setAttribute("id", "previous" + cat_name);
  prev_btn.innerHTML = "&#10094;";

  next_btn.classList.add("arrow", "next");
  next_btn.setAttribute("id", "next" + cat_name);
  next_btn.innerHTML = "&#10095;";

  carousel_container.appendChild(prev_btn);
  carousel_container.appendChild(carousel);
  carousel_container.appendChild(next_btn);
  carousel_main.appendChild(carousel_title);
  carousel_main.appendChild(carousel_container);

  // appending the new elements to the categories section in the HTML
  document.getElementById("categories").appendChild(carousel_main);

  // appending images url to display images in the carousel
  for (let url of imgURL) {
    const new_img = document.createElement("img");
    new_img.src = url;
    new_img.classList.add(cat_name);
    new_img.classList.add("img");
    carousel.appendChild(new_img);
  }
}

// submits a fetch request for the top movie and populate the main banner and pop-up window
fetchData(topMovieURL).then((data) => {
  fetchData(data.results[0]["url"]).then((top_movie_data) => {
    // slicing original image URL to get the full size image
    let new_url = top_movie_data["image_url"].slice(0, top_movie_data["image_url"].indexOf("@") + 1);

    popup(top_movie_data, new_url);

    // creating and adding movie details to the banner
    const top_movie_image = document.getElementById("top-movie-img");
    const top_movie_title = document.getElementById("top-movie-title");
    const top_movie_paragraph = document.getElementById("top-movie-paragraph");

    top_movie_title.textContent = top_movie_data["title"];
    top_movie_paragraph.textContent = top_movie_data["description"];
    top_movie_image.src = new_url;

    const window_container = document.getElementById("popup-window-container");

    const close_btn = document.getElementById("close-btn");
    const play_btn = document.getElementById("play-btn");

    // adding event listeners for the pop-up window buttons
    play_btn.addEventListener("click", function () {
      window_container.style.display = "block";
    });
    close_btn.addEventListener("click", function () {
      window_container.style.display = "none";
    });
  });
});

function popup(data, img_url){
  const pop_window = document.getElementById("popup-window");
  const details = document.querySelector("ul.top_movie_details");
    // required details to be displayed in the pop-up window
  const pop_window_details = [data["title"],
      data["genres"],
      data["date_published"],
      data["rated"],
      data["imdb_score"],
      data["directors"],
      data["actors"],
      data["duration"],
      data["countries"],
      data["usa_gross_income"] +
      data["worldwide_gross_income"],
      data["description"],
    ];

    // adding img element and url to the Top Movie banner
    const best_movie_img = document.createElement("img");
    best_movie_img.classList.add("popup_img");

    best_movie_img.src = img_url;
    pop_window.appendChild(best_movie_img);

    // adding movie specs to the pop-up window
    for (let detail in pop_window_details) {
      const item = document.createElement("li");
      const text = document.createElement("p");
      text.textContent = pop_window_headers[detail] + " : " + pop_window_details[detail];
      item.appendChild(text);
      details.appendChild(item);
    }
}

// Create an array of promises
const promises = [
  fetchPages(topSevenURL, "Top-Rated", 1, 8),
  fetchPages(topComedyURL, "Comedy", 0, 7),
  fetchPages(topDramaURL, "Drama", 0, 7),
  fetchPages(topRomanceURL, "Romance", 0, 7)
];

// Use Promise.all to wait for all promises to resolve
Promise.all(promises)
  .then(() => {
    console.log('All requests completed successfully');
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// to change the location on the page as you click the nav bar buttons
function goToSection(sectionId) {
  window.location = sectionId;
}
