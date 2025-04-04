let definMode = true

let searchBar;
let searchButton;

let results;
let originalLang;
let translatedLang;
let switchLang;
let currLang = 'fr'; // language of text

let conjugation;

document.addEventListener('DOMContentLoaded', () => {    
    searchBar = document.getElementById("searchbar");
    searchBar.addEventListener("keyup", (event) => {
        if (event.key == "Enter") {

        }
    })
    searchBar.addEventListener("input", (event) => {
        searchBar.value = searchBar.value.replace(/[\/\\]/g, '')
    })
    searchButton = document.getElementById('searchbutton');
    searchButton.addEventListener("click", (event) => {
        switchMode();
    })
    
    results = document.getElementById("results");
    originalLang = document.getElementById("original-lang");
    translatedLang = document.getElementById('translated-lang');
    switchLang = document.getElementById('switch-lang');
    switchLang.addEventListener("click", (event) => {
        if (currLang == "fr") {
            currLang = "en"
        } else {
            currLang = "fr"
        }
        switchLang(currLang);
    })
    conjugation = document.getElementById('conjugation');
    verb = document.getElementById('verb');
    verb.addEventListener("click", (event) => {
        switchMode();
    })
    hint = document.getElementById('hint');
})

document.addEventListener('keyup', (event) => {
    if (event.key == '/') {
        switchMode();
    }
})

function switchMode() {
    definMode = !definMode
        if (definMode == true) {
            searchButton.innerHTML = "defin"
            conjugation.style.height = '28px'
            hint.style.visibility = "visible"
            hint.style.opacity = 1;
        } else {
            searchButton.innerHTML = "conjug"
            conjugation.style.height = '320px'
            hint.style.opacity = 0;
            hint.style.visibility = "hidden";
        }
}

function setLanguage(lang) {
    if (lang == "fr") {
        originalLang.innerHTML = "Français";
        translatedLang.innerHTML = "English";
    } else {
        originalLang.innerHTML = "English";
        translatedLang.innerHTML = "Français";
    }
}