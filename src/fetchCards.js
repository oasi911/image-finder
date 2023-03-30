const url = 'https://pixabay.com/api/';
const key = '34881705-1e85e8c708a083119a0406cc9';
const axios = require('axios/dist/browser/axios.cjs');

export default async function fetchCards(searchQuery, page, perPage) {
  try {
    const response = await axios.get(
      `${url}?key=${key}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
    );
    return response;
  } catch (error) {
    console.log(error.message);
    throw new Error('Failed to fetch content');
  }
}
