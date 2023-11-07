const topMovieURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=9.6&sort_by=-votes";
const topSevenURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=9.3&sort_by=-votes&page=1";
const topAdventureURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=comedy&page=1";
const topActionURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=drama&page=1";
const topRomanceURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=romance&page=1";

// submits a fetch request to the API for one page of results
const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data);
  return data;
};

// submits a fetch request to the API for multiple pages
// and create the required elements for the categories
const fetchPages = async (url, cat_name) => {
  let allData = [];
  let data = await fetchData(url);
  allData = allData.concat(data.results);
  while (data.next !== null) {
    const nextUrl = new URL(url);
    let nextPage = parseInt(nextUrl.searchParams.get("page"));
    nextPage++;
    nextUrl.searchParams.set("page", nextPage);
    url = nextUrl.toString(); // Update the url variable with the modified URL
    data = await fetchData(url);
    allData = allData.concat(data.results);
  }
  const sortedList = allData
    .sort((a, z) => parseFloat(z.imdb_score) - parseFloat(a.imdb_score))
    .slice(0, 7); // sort the results by IMDB score and returns 7 of them;
  const imgURL = sortedList.map((item) => item.image_url);

  // creates the HTMl elements and append them to the body
    function carousel(imgURL, cat_name) {

    const carousel_main = document.createElement("div");
    const carousel_title = document.createElement("h2");
    const carousel_container = document.createElement("div");
    const prev_btn = document.createElement("button");
    const carousel = document.createElement("div");
    const next_btn = document.createElement("button");

    carousel_title.textContent = cat_name;
    carousel_title.classList.add("category_title");
    carousel_container.classList.add("carousel-container");
    carousel.classList.add("carousel");
    carousel.setAttribute("id",  cat_name);

    prev_btn.classList.add("arrow", "prev");
    prev_btn.setAttribute("id", "previous" + cat_name);
    prev_btn.innerHTML = '&#10094;';

    next_btn.classList.add("arrow", "next");
    next_btn.setAttribute("id", "next" + cat_name);
    next_btn.innerHTML = '&#10095;';

    carousel_container.appendChild(prev_btn);
    carousel_container.appendChild(carousel);
    carousel_container.appendChild(next_btn);
    carousel_main.appendChild(carousel_title);
    carousel_main.appendChild(carousel_container);

    document.getElementById("categories").appendChild(carousel_main);

    // append images url to display images in the carousel
    for (let url of imgURL) {
        const new_img = document.createElement("img");
        new_img.src = url;
        new_img.classList.add(cat_name);
        new_img.classList.add("img");
        new_img.style.width = '50%';
        new_img.style.height = '400px';
        new_img.style.objectFit = 'cover';
        new_img.style.margin = '0 13px';
        carousel.appendChild(new_img);
    }

    let currentSlide = 0;
    const slidesToShow = 0.5;
    const slideWidth = 15;


    // controls the slideshow
    function showSlide(n) {

        const slides = document.getElementsByClassName(cat_name);
        currentSlide = (n + slides.length) % slides.length;
        const offset = -currentSlide * (slidesToShow * slideWidth);
        document.getElementById(
            cat_name
        ).style.transform = `translateX(${offset}%)`;
    }

    const previous = document.getElementById("previous" + cat_name);
    previous.addEventListener("click", function () {
        showSlide(currentSlide - 1);
    });

    const next = document.getElementById("next" + cat_name);
    next.addEventListener("click", function () {
        showSlide(currentSlide + 1);
    });

    // Initial display
    showSlide(currentSlide);
}

carousel(imgURL,cat_name);

};

// submits a fetch request for the top movie and populate the main banner and pop-up window
const top_movie = fetchData(topMovieURL).then((data) => {
  const top_movie_request = fetchData(data.results[0]["url"]).then(
    (top_movie_data) => {
      const pop_window = document.getElementById("popup-window");
      const details = document.querySelector("ul.top_movie_details");
      // required details to be displayed in the pop-up window
      const pop_window_details = [
        top_movie_data["title"],
        top_movie_data["genres"],
        top_movie_data["date_published"],
        top_movie_data["rated"],
        top_movie_data["imdb_score"],
        top_movie_data["directors"],
        top_movie_data["actors"],
        top_movie_data["duration"],
        top_movie_data["countries"],
        top_movie_data["usa_gross_income"] +
          top_movie_data["worldwide_gross_income"],
        top_movie_data["description"],
      ];
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

      const best_movie_img = document.createElement("img");
      best_movie_img.src = top_movie_data["image_url"];
      pop_window.appendChild(best_movie_img);

      for (let detail in pop_window_details) {
        const item = document.createElement("li");
        const text = document.createElement("p");
        text.textContent =
          pop_window_headers[detail] + " : " + pop_window_details[detail];
        item.appendChild(text);
        details.appendChild(item);
      }

      const top_movie_image = document.getElementById("top-movie-img");
      const top_movie_title = document.getElementById("top-movie-title");
      const top_movie_paragraph = document.getElementById(
        "top-movie-paragraph"
      );

      const top_movie_details = document.querySelector("ul.top_movie_details");

      top_movie_title.textContent = top_movie_data["title"];
      top_movie_paragraph.textContent = top_movie_data["description"];
      top_movie_image.src = top_movie_data["image_url"];

      const window_container = document.getElementById(
        "popup-window-container"
      );

      const close_btn = document.getElementById("close-btn");
      const play_btn = document.getElementById("play-btn");

      play_btn.addEventListener("click", function () {
        window_container.style.display = "block";
      });
      close_btn.addEventListener("click", function () {
        window_container.style.display = "none";
      });
    }
  );
});


fetchPages(topActionURL, "Drama");
fetchPages(topSevenURL, "Top-Rated");
fetchPages(topAdventureURL, "Comedy");
fetchPages(topRomanceURL, "Romance");