import './sass/main.scss';

import PhotoApi from './js/API';
import imageTpl from './template/photo-card.hbs';

import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

import LoadMoreBtn from './js/loadBtn';

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

const PhotoApiSearch = new PhotoApi();
const refs = {
  searchForm: document.querySelector('.search-form'),
  galleryListRef: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  PhotoApiSearch.query = e.currentTarget.elements.query.value;
  PhotoApiSearch.resetPage();
  refs.galleryListRef.innerHTML = '';
  loadMoreBtn.show();
  loadMoreBtn.disable();
  onLoadMore()
}

function onLoadMore(hits) {
  PhotoApiSearch.fetchPhoto()
    .then(PhotoMarcup)
    .then(data => {
      loadMoreBtn.enable();
      window.scrollTo({
        top: document.documentElement.offsetHeight,
        behavior: 'smooth',
      });
    })
     
   
}
function PhotoMarcup(hits) {
  refs.galleryListRef.insertAdjacentHTML('beforeend', imageTpl(hits));
}

document.body.addEventListener('click', event => {
  if (event.target.nodeName !== 'IMG') return;

  const instance = basicLightbox.create(
    `<img class="img-lightbox" src="${event.target.dataset.source}" />`,
  );
  instance.show();
});

