import axios from 'axios';



export let per_page = 40;
export let limitPage = 0;
export async function getPictures(pictureName,page=1){
    const BASE_URL = 'https://pixabay.com/api/'; 
    const API_KEY='35723548-55cce6d92fe2b0376e8aa06a2';
    const params = new URLSearchParams({
        key: API_KEY,
        q: pictureName,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: "true",
        per_page: per_page,
        page:page,
    })
    // const URL = `${BASE_URL}?key=35723548-55cce6d92fe2b0376e8aa06a2&q=${pictureName}
    // &image_type="photo"&orientation="horizontal"&safesearch="true"&per_page=${per_page}&page=${page}`;
  
    try {
      const response = await axios.get(`${BASE_URL}?${params}`);
    // const response = await axios.get(URL);
      const { data } = response;
      limitPage = Math.round(data.totalHits / per_page);
      console.log(limitPage);
    return data;
  }
  catch (error) {
    console.log(error);
    }

}

