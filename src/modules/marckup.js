export function createMarkcup(arr) {
 
  return arr.map(({ largeImageURL,webformatURL, tags, likes, views, comments, downloads }) => 
     `<ul class="photo-card">
     <li class="photo-card__item">
     <div class="photo-thumb"><a href="${largeImageURL}">
    <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
    </div>
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
    </li>
    </ul>`
  ).join('')
}
