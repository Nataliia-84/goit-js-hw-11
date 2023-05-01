import './css/styles.css';
import { getPictures, limitPage } from './servise/api';
import { createMarkcup } from './modules/marckup';
import { scroll } from './modules/scroll';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const form = document.querySelector('#search-form');
const container = document.querySelector('.gallery');
const guard=document.querySelector('.guard')


form.addEventListener('submit', onSearch);

container.addEventListener('click', onClickGallery)


let currentPage = 1;
let input = '';

const options = {
  root: null,
  rootMargin: '400px',
  threshold: 0.0,
}
const observer = new IntersectionObserver(onPagination, options);
let lightbox = new SimpleLightbox('.gallery a', { animationSpeed: 250, captionsData: "alt" });

function onSearch(event){
    event.preventDefault();
    container.innerHTML = '';
    input = event.currentTarget.elements.searchQuery.value.trim();
    currentPage = 1;
  if(!input){
        container.innerHTML='';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
    };
     getPictures(input, currentPage).then(data => {
  
  if(data.hits.length===0){
          container.innerHTML = '';
          Notify.failure('Sorry, there are no images matching your search query. Please try again.');
          return;
         };
              
         currentPage += 1;
         container.insertAdjacentHTML('beforeend', createMarkcup(data.hits)),
         Notify.success(`Hooray! We found ${data.totalHits} images.`),
         observer.observe(guard);
         lightbox.refresh();
              
    }
  )
  .catch(error=>console.log(error))   
}




function onPagination(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
    
      scroll();
        getPictures(input, currentPage).then(data => {
          
        container.insertAdjacentHTML('beforeend', createMarkcup(data.hits));
        
        lightbox.refresh();
          if (limitPage === currentPage || data.hits.length < 40) {
              observer.unobserve(guard);
          Notify.info("We're sorry, but you've reached the end of search results.")
        }
      });
    }
    
  });
}



function onClickGallery(event) {
  event.preventDefault()
}





