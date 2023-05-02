import './css/styles.css';
import { getPictures, limitPage } from './servise/api';
import { createMarkcup } from './modules/marckup';
import { scroll } from './modules/scroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';;
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const form = document.querySelector('#search-form');
const container = document.querySelector('.gallery');

const loadMore = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
loadMore.addEventListener('click', onLoadMore);
container.addEventListener('click', onClickGallery)


let currentPage = 1;
let input = '';
loadMore.hidden = true;


let lightbox = new SimpleLightbox('.gallery a', { animationSpeed: 250, captionsData: "alt" });

function onSearch(event){
    event.preventDefault();
    container.innerHTML = '';
  loadMore.hidden = true;
  loadMore.style.display = "none";
    input = event.currentTarget.elements.searchQuery.value.trim();
    currentPage = 1;
  if(!input){
        container.innerHTML='';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
  }
     getPictures(input, currentPage).then(data => {
  
  if(data.hits.length===0){
          container.innerHTML = '';
          loadMore.hidden=true;
          Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          return;
    }
            
  if (limitPage === currentPage || data.hits.length<40) {
         loadMore.hidden=true;
          loadMore.style.display = "none";
          Notify.info("We're sorry, but you've reached the end of search results.")
    }
    
       loadMore.hidden = false;
       loadMore.style.display = "block";
    currentPage += 1;
       container.insertAdjacentHTML('beforeend', createMarkcup(data.hits)),
         Notify.success(`Hooray! We found ${data.totalHits} images.`),
        
    lightbox.refresh();
    }         
    
  )
  .catch(error=>console.log(error))   
}


function onLoadMore() {

  getPictures(input, currentPage).then(data => {
         loadMore.hidden = false;
   loadMore.style.display = "block";
    currentPage += 1;
    container.insertAdjacentHTML('beforeend', createMarkcup(data.hits));
    lightbox.refresh();
    scroll();
    if (limitPage === currentPage || data.hits.length < 40) {
      loadMore.style.display = "none";
      Notify.info("We're sorry, but you've reached the end of search results.")
    }
   
    
  }
  )
    .catch(err => {
      console.log(err);
      Notify.failure('Please try again.')
    })
    
}

function onClickGallery(event) {
  event.preventDefault()
}



