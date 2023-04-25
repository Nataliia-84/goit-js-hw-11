import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';;

const form = document.querySelector('#search-form')
form.addEventListener('submit', onSearch)
const container=document.querySelector('.gallery')
const loadMore=document.querySelector('.load-more')
loadMore.addEventListener('click', onLoadMore)

let page=1
let input=''
loadMore.hidden=true;

function onSearch(event){
    event.preventDefault();
    container.innerHTML='';
    input = event.currentTarget.elements.searchQuery.value.trim();
     if(!input){
        container.innerHTML='';
       loadMore.hidden = true;
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        return;
     }
        getPictures(input).then(data=>{
        if(data.hits.length===0){
            container.innerHTML='';
             Notify.failure('Sorry, there are no images matching your search query. Please try again.');
             return;
          }
       
        page+=1,container.insertAdjacentHTML('beforeend', createMarkcup(data.hits)),
        Notify.success(`Hooray! We found ${data.totalHits} images.`),
        loadMore.hidden=false;
        (console.log(data.totalHits))
        
    })
        .catch(error=>console.log(error))
     
}


const BASE_URL = 'https://pixabay.com/api/'

function getPictures(pictureName){
     
    const URL = `${BASE_URL}?key=35723548-55cce6d92fe2b0376e8aa06a2&q="${pictureName}"
    &image_type="photo"&orientation="horizontal"&safesearch="true"&per_page=40&page=${page}`;
 return fetch(URL).then(resp=>{ 
    if(!resp.ok){                                                                                                                                           
throw new Error(resp.statusText)
    }
    return resp.json();
})

}
function onLoadMore(){
  getPictures(input).then(data => {
    
    page += 1, container.insertAdjacentHTML('beforeend', createMarkcup(data.hits));
   
    
    console.log(page)}).catch(error=>console.log(error))
    
}

function createMarkcup (arr){
    return arr.map(({webformatURL,tags,likes,views,comments,downloads})=>`<div class="photo-card">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" height="200px" />
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
    </div>`).join('')
    }
    