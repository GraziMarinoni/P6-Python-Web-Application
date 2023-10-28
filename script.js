const topMovieURL= "http://localhost:8000/api/v1/titles/?imdb_score_min=9.6&sort_by=-votes";
const topSevenURL = "http://localhost:8000/api/v1/titles/?imdb_score_min=9.3&sort_by=-votes&page=1";
const topAdventureURL = "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=adventure&page=1";
const topActionURL = "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=action&page=1";
const topRomanceURL = "http://localhost:8000/api/v1/titles/?imdb_score_min=8.8&genre=romance&page=1";

const url = 'http://localhost:8000/api/v1/titles/?imdb_score_min=9.3&page=1';

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
    let nextPage = parseInt(parsedUrl.searchParams.get('page'));
    nextPage++;
    parsedUrl.searchParams.set('page', nextPage);
    url = parsedUrl.toString(); // Update the url variable with the modified URL
    data = await fetchData(url);
    allData = allData.concat(data.results);
  }
    const sortedList = allData.sort((a, z) => parseFloat(z.imdb_score) - parseFloat(a.imdb_score)).slice(0, 7);
    const imgURL = sortedList.map(item => item.image_url);
    console.log(imgURL)
};
const top_movie = fetchData(topMovieURL)
    .then(data => {
        const test = data.results[0];
        console.log(test['title']);
    });
