import './css/styles.css';
import {fetchCountries} from './js/fetchcountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';



const DEBOUNCE_DELAY = 300;

const markup = `
    <h1 class="title">Find your favorite country</h1>
`;

document.body.insertAdjacentHTML('beforebegin', markup);


const refs = {
    searchBox: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};


// add eventListeners

refs.searchBox.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch(e) {
    e.preventDefault();

    const searchCountries = e.target.value.trim();

    if (!searchCountries) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        return;
    }

    fetchCountries(searchCountries)
        .then(result => {
            if (result.length > 10) {
                Notify.info('Too many matches found. Please, enter a more specific name.');
                return;
            } else if (result.length === 1) {
                refs.countryList.innerHTML = '';
                countryCardMarkup(result);
            } else  if (result.length > 2 && result.length <= 10) {
                refs.countryInfo.innerHTML = '';
                countriesListMarkup(result);
            }
           
        })
        .catch(error => {
            refs.countryList.innerHTML = '';
            refs.countryInfo.innerHTML = '';
            Notify.failure('Oops, there is no country with that name');
        })
};



function countriesListMarkup(result) {
    const listMarkup = result.map((({flags, name }) => {
        return  `<li>
                        <img src="${flags.svg}" alt="${name.official}" width="60" height="auto">
                        <p>${name.official}</p>
                </li>`;
    })).join('');
    refs.countryList.innerHTML = listMarkup;
    return listMarkup;
}

function countryCardMarkup(result) {
    const cardMarkup = result.map(({ flags, name, capital, population, languages }) => {
        languages = Object.values(languages).join(", ");
        return  `
            
            <img src="${flags.svg}" alt="${name}" width="320" height="auto">
            <p> ${name.official}</p>
            <p>Capital: <span> ${capital}</span></p>
            <p>Population: <span> ${population}</span></p>
            <p>Languages: <span> ${languages}</span></p>`;
    }).join('');
    refs.countryInfo.innerHTML = cardMarkup;
    return cardMarkup;
}