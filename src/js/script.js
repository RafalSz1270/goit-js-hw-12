import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '45026380-4529b8f9b335b30238156ee8d';
const searchForm = document.querySelector('.search-form');
const searchQueryInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');
const gallery = document.getElementById('gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.getElementById('loadMore');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

const fetchImages = async (query, page) => {
  loader.style.display = 'block';
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: 40
      }
    });
      totalHits = response.data.totalHits;
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.'
    });
  } finally {
    loader.style.display = 'none';
  }
};

const displayImages = (images) => {
    if (images.length === 0 && currentPage === 1) {
        iziToast.info({
            title: 'Info',
            message: 'Sorry, there are no images matching your search query. Please try again!'
        });
        return;
    }

    const imageItems = images.map(image => {
        return `
      <a href="${image.largeImageURL}" class="gallery-item">
        <img class="picture" src="${image.webformatURL}" alt="${image.tags}" />
        <p>Likes: ${image.likes} Views: ${image.views} Comments: ${image.comments} Downloads: ${image.downloads}</p>
      </a>
    `;
    }).join('');

    gallery.insertAdjacentHTML('beforeend', imageItems);
    new SimpleLightbox('.gallery a', { captionsData: 'alt', captionDelay: 250 }).refresh();

    if (images.length > 0 && gallery.children.length < totalHits) {
        loadMoreButton.style.display = 'block';
    } else {
        loadMoreButton.style.display = 'none';
        if (gallery.children.length >= totalHits) {
            iziToast.info({
                title: 'Info',
                message: "We're sorry, but you've reached the end of search results."
            });
        }
    }
    const galleryItemHeight = document.querySelector('.gallery-item').getBoundingClientRect().height;
    window.scrollBy({
      top: galleryItemHeight * 2,
      behavior: 'smooth'
    });
};



const clearGallery = () => {
  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';
};

searchButton.addEventListener('click', async () => {
  currentQuery = searchQueryInput.value.trim();
  if (!currentQuery) {
    clearGallery();
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.'
    });
    return;
  }
  currentPage = 1;
  clearGallery();
  const images = await fetchImages(currentQuery, currentPage);
  displayImages(images);
});

loadMoreButton.addEventListener('click', async () => {
  currentPage += 1;
  const images = await fetchImages(currentQuery, currentPage);
  displayImages(images);
});
