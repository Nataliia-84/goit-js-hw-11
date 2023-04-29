import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';


const form = document.querySelector('#search-form');
form.addEventListener('submit', onSearch);
const container = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');
loadMore.addEventListener('click', onLoadMore);

const BASE_URL = 'https://pixabay.com/api/';
let page = 1;
let limitPage = 14;
let input = '';
loadMore.hidden=true;

function onSearch(event){
    event.preventDefault();
  container.innerHTML = '';
  loadMore.hidden=true;
  input = event.currentTarget.elements.searchQuery.value.trim();
   resetPage();
     if(!input){
        container.innerHTML='';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
  }
  
  getPictures(input).then(data =>{
        if(data.hits.length===0){
          container.innerHTML = '';
          loadMore.hidden=true;
             Notify.failure('Sorry, there are no images matching your search query. Please try again.');
             return;
    }
            loadMore.hidden=false;
        if (limitPage === page) {
            loadMore.hidden = true;     
    }
    
    page += 1, container.insertAdjacentHTML('beforeend', createMarkcup(data.hits)),
      Notify.success(`Hooray! We found ${data.totalHits} images.`),
      lightbox.refresh();
              
    }
  )
        .catch(error=>console.log(error))
     
}




async function getPictures(pictureName){
     
    const URL = `${BASE_URL}?key=35723548-55cce6d92fe2b0376e8aa06a2&q="${pictureName}"
    &image_type="photo"&orientation="horizontal"&safesearch="true"&per_page=40&page=${page}`;
  
  try {
    const response = await axios.get(URL);
      const { data } = response;
    return data;
  }
  catch (error) {
    console.log(error);
    }

}

function onLoadMore() {

  getPictures(input).then(data => {
   
    page += 1, container.insertAdjacentHTML('beforeend', createMarkcup(data.hits));
    loadMore.hidden = false;
    lightbox.refresh();
           if (data.hits.length<40) {
             loadMore.hidden = true;
            Notify.info("We're sorry, but you've reached the end of search results.")
    }
    if (limitPage === page) {
      loadMore.hidden = true;
      Notify.info("We're sorry, but you've reached the end of search results.")
    }
  
  })
    .catch(error => error)
    
}

function createMarkcup(arr) {
 
  return arr.map(({ largeImageURL,webformatURL, tags, likes, views, comments, downloads }) => 
     `<div class="photo-card">
     <a class="photo-link" href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" height="200px" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b> ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>${views}
      </p>
      <p class="info-item">
        <b>Comments</b>${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>${downloads}
      </p>
    </div>
    </div>`
  ).join('')
    }
    
function resetPage() {
      page=1
}

container.addEventListener('click', onClickGallery)


function onClickGallery(event) {
  event.preventDefault()
}
let lightbox = new SimpleLightbox('.gallery a',{ animationSpeed:250, captionsData:"alt"})
    
