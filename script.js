const topMovieURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=9.6&sort_by=-votes";
const topSevenURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=9.3&sort_by=-votes&page=1";
const topAdventureURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=adventure&page=1";
const topActionURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=action&page=1";
const topRomanceURL =
  "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=romance&page=1";

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  // console.log(data);
  return data;
};

const fetchPages = async (url) => {
  let allData = [];
  let data = await fetchData(url);
  allData = allData.concat(data.results);
  while (data.next !== null) {
    const parsedUrl = new URL(url);
    let nextPage = parseInt(parsedUrl.searchParams.get("page"));
    nextPage++;
    parsedUrl.searchParams.set("page", nextPage);
    url = parsedUrl.toString(); // Update the url variable with the modified URL
    data = await fetchData(url);
    allData = allData.concat(data.results);
  }
  const sortedList = allData
    .sort((a, z) => parseFloat(z.imdb_score) - parseFloat(a.imdb_score))
    .slice(1, 8);
  const imgURL = sortedList.map((item) => item.image_url);
  console.log(imgURL);
  return imgURL;
};

const top_movie = fetchData(topMovieURL).then((data) => {
  // console.log(data)
  const top_movie_request = fetchData(data.results[0]["url"]).then(
    (top_movie_data) => {
      const top_movie_image = document.getElementById("top-movie-img");
      const top_movie_title = document.getElementById("top-movie-title");
      const top_movie_paragraph = document.getElementById(
        "top-movie-paragraph"
      );

      top_movie_title.textContent = top_movie_data["title"];
      top_movie_paragraph.textContent = top_movie_data["description"];
      top_movie_image.src = top_movie_data["image_url"];
    }
  );
});

const top_seven = fetchPages(topSevenURL).then((imgURL) => {
  const seven_img = document.querySelector("ul.img-slide");
  for (let url of imgURL) {
    const new_lst = document.createElement("li");
    const new_img = document.createElement("img");

    Object.assign(new_img, {
      src: url,
    });
    new_lst.appendChild(new_img);
    seven_img.appendChild(new_lst);
  }
});

// Get the elements by their ID
const playButton = document.getElementsByTagName("button");
const popupWindow = document.getElementById("popup-window");
const closeButton = document.getElementById("close-button");
// Show the pop-up window when the link is clicked
playButton.addEventListener("click", function (event) {
  event.preventDefault();
  popupWindow.style.display = "block";
});
// Hide the pop-up window when the close button is clicked
closeButton.addEventListener("click", function () {
  popupWindow.style.display = "none";
});
