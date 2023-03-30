import Notiflix from 'notiflix';
import fetchCards from './fetchCards';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const perPage = 40;
const errorNoMatches =
  'Sorry, there are no images matching your search query. Please try again.';

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  refs.gallery.innerHTML = '';
  const searchQuery = e.currentTarget.elements.searchQuery.value;
  if (searchQuery === '') {
    Notiflix.Notify.failure(errorNoMatches);
    return;
  }
  fetchCards(searchQuery, 1, perPage).then(data => {
    if (data.data.hits.length === 0) {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.failure(errorNoMatches);
      return;
    }
    Notiflix.Notify.success(`Hooray! We found ${data.data.totalHits} images.`);
    renderPictures(data);
    checkLoadMoreCondition(data);
  });
});

refs.loadMoreBtn.style.display = 'none';
refs.loadMoreBtn.addEventListener('click', () => {
  fetchCards(refs.form.elements.searchQuery.value, page + 1, perPage).then(
    data => {
      renderPictures(data);
      checkLoadMoreCondition(data);
      page += 1;
    }
  );
});

let page = 1;

function renderPictures({ data: { hits } }) {
  const photoCard = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <div class="photo-card">
        <a href="${largeImageURL}">
          <img class="image" src="${webformatURL}" alt="${tags}" loading="lazy" data-source="${largeImageURL}" width="300"/></a>
          <div class="info">
            <p>Number of likes: <b>${likes}</b></p>
            <p>Number of views: <b>${views}</b></p>
            <p>Number of comments: <b>${comments}</b></p>
            <p>Number of downloads: <b>${downloads}</b></p>
          </div>
      </div>
    `
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', photoCard);
}

function checkLoadMoreCondition(data) {
  const shownPictures = page * perPage;
  if (
    (data.data.hits.length < perPage && data.data.hits.length !== 0) ||
    shownPictures >= data.data.totalHits
  ) {
    refs.loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
  } else {
    refs.loadMoreBtn.style.display = 'block';
  }
}
