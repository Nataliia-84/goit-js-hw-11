import './css/styles.css';
import { getPictures, limitPage } from './servise/api';
import { createMarkcup } from './modules/marckup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";



const form = document.querySelector('#search-form');
const container = document.querySelector('.gallery');
const guard=document.querySelector('.guard')


form.addEventListener('submit', onSearch);


let currentPage=1;
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
  observer.unobserve(guard);
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
              
      if (data.hits.length<40) {
            
          Notify.info("We're sorry, but you've reached the end of search results.")
       };
       if (currentPage !== limitPage) {
          observer.observe(guard);
       }
      
         container.innerHTML = '';
         container.insertAdjacentHTML('beforeend', createMarkcup(data.hits));
         Notify.success(`Hooray! We found ${data.totalHits} images.`);
          
         lightbox.refresh();
      
    }
  )
  .catch(error=>console.log(error))   
}




function onPagination(entries, observer) {
  
  console.log(entries)
  entries.forEach((entry) => {
  
    if (entry.isIntersecting) {
    currentPage += 1;
      getPictures(input, currentPage).then(data => {
        
        container.insertAdjacentHTML('beforeend', createMarkcup(data.hits));
        
        lightbox.refresh();
     
        if (limitPage === currentPage) {
            
          observer.unobserve(guard);
          Notify.info("We're sorry, but you've reached the end of search results.")
        }
        
      }).catch(err => console.log(err));
    }
    
  });
}







