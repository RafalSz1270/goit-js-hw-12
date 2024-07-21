import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchForm = document.querySelector('.search-form');
const searchQueryInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');
const gallery = document.getElementById('gallery');
const loader = document.querySelector('.loader');




async function fetchImages(query, page = 1, perPage = 40) {
  const API_KEY = '45026380-4529b8f9b335b30238156ee8d';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`;

  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

let currentPage = 1;
let currentQuery = '';

const loadMoreButton = document.getElementById('load-more');

loadMoreButton.addEventListener('click', loadMoreImages);

function handleSearch(query) {
  currentQuery = query;
  currentPage = 1;
  fetchImages(query, currentPage).then(data => {
    // Renderowanie obrazów
    loadMoreButton.style.display = 'block';
  });
}

function loadMoreImages() {
  currentPage += 1;
  fetchImages(currentQuery, currentPage).then(data => {
    // Renderowanie kolejnych obrazów
    const { height: cardHeight } = document.querySelector('.gallery').firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    if (currentPage * 40 >= data.totalHits) {
      loadMoreButton.style.display = 'none';
      alert("We're sorry, but you've reached the end of search results.");
    }
  });
}




searchButton.addEventListener('click', async () => {
  const query = searchQueryInput.value.trim();
  if (!query) {
    gallery.innerHTML = '';
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.'
    });
    return;
  }

  const images = await fetchImages(query);
  displayImages(images);
});

// ---------NA click działa a na submit nie----------------


// searchButton.addEventListener('submit', async (event) => {
//   event.preventDefault(); 

//   const query = searchQueryInput.value.trim();
//   if (!query) {
//     gallery.innerHTML = '';
//     iziToast.warning({
//       title: 'Warning',
//       message: 'Please enter a search query.'
//     });
//     return;
//   }

//   const images = await fetchImages(query);
//   displayImages(images);
// });
