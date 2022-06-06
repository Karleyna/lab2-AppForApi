const spinner = document.getElementById("spinner");
const linkAdvanced = document.getElementById("link-advanced-search");
const filmList = document.getElementById("film");
const filmDetailsContent = document.querySelector(".film-details-content");
const descriptionCloseBtn = document.getElementById("description-close-btn");
const form = document.getElementById("search-form");
let data = {
    "films":[]
};

// event listeners

//get all films from API
form.addEventListener("submit", async e=>{
    spinner.style.display = "inline";
    e.preventDefault();
    const response = await fetch(`https://ghibliapi.herokuapp.com/films/?fields=title,id,image`);
    data.films = await response.json();
    spinner.style.display = "none";
    getfilmList();

});




//get film list that matches with the words in title and also all films
function getfilmList() {
    let searchInputTxt = document.getElementById("search-input").value.trim();
    let html = "";
    if (searchInputTxt === "") {
        for (let item of data.films) {
            html += `
                    <!-- film item -->
                 <div class = "film-item" id = ${item.id}>
                    <div class = "film-img">
                        <img src = "${item.image ? item.image : ""}" alt = "anime">
                    </div>
                    <div class = "film-name">
                        <h3>${item.title}</h3>
                        <a href = "#" class = "description-btn">Get Description</a>
                    </div>
                 </div>
                 <!-- end of film item -->
            `;
        };
    }
    else {
        let count = 0;
        for (let item of data.films) {
            if (item.title.includes(searchInputTxt)) {
                html += `
                    <!-- film item -->
                 <div class = "film-item" id = ${item.id}>
                    <div class = "film-img">
                        <img src = "${item.image ? item.image : ""}" alt = "anime">
                    </div>
                    <div class = "film-name">
                        <h3>${item.title}</h3>
                        <a href = "#" class = "description-btn">Get Description</a>
                    </div>
                 </div>
                 <!-- end of film item -->
            `;
                count++;
            }
        };
        if (count===0){
            html = `
                <p></p>
                
                `;
            linkAdvanced.parentElement.classList.add("show-advanced-search");


        };

    };
    console.log(linkAdvanced);
    filmList.innerHTML = html;
};

//Searching through description,producer or release day
linkAdvanced.addEventListener("click", async e=> {
    spinner.style.display = "inline";
    e.preventDefault()
    let dataAdvanced = {
        "items":[]
    };
    const response = await fetch(`https://ghibliapi.herokuapp.com/films/?fields=id,description,producer,release_date`);
    dataAdvanced.items = await response.json();
    let searchInputTxt = document.getElementById("search-input").value.trim();
    spinner.style.display = "none";
    let html = "";
        let count = 0;
        for (let item of dataAdvanced.items) {
            if (item.description.includes(searchInputTxt) || item.producer.includes(searchInputTxt) || item.release_date.includes(searchInputTxt)) {
                for (let itemi of data.films) {
                    if (item.id === itemi.id) {
                        html += `
                    <!-- film item -->
                         <div class = "film-item" id = ${item.id}>
                            <div class = "film-img">
                                <img src = "${itemi.image ? itemi.image : ""}" alt = "anime">
                            </div>
                            <div class = "film-name">
                                <h3>${itemi.title}</h3>
                                <a href = "#" class = "description-btn">Get Description</a>
                            </div>
                         </div>
                 <!-- end of film item -->
            `;
                        count++;
                    }
                }
            }
        }
        if (count===0){
            html = `
            <p></p>
            Sorry, we didn't find any results :(
            `
        }
    linkAdvanced.parentElement.classList.remove("show-advanced-search");
    filmList.innerHTML = html;
})
filmList.addEventListener("click", getfilmdescription);
descriptionCloseBtn.addEventListener("click", () => {
    filmDetailsContent.parentElement.classList.remove("show-description");
});

// get description of the film
async function getfilmdescription(e){
    spinner.style.display = "inline";
    e.preventDefault();
    let dataDescription = {};
    if(e.target.classList.contains("description-btn")){
        let filmItem = e.target.parentElement.parentElement;
        const response = await fetch(`https://ghibliapi.herokuapp.com/films/${filmItem.id}/?fields=description,producer,release_date,title,movie_banner`)
        dataDescription = await response.json();
        spinner.style.display = "none";
        filmdescriptionModal(dataDescription);
    }
}
//
// create a modal
function filmdescriptionModal(film){
    let html = `
        <h2 class = "description-title">${film.title}</h2>
        <p class = "description-author">${film.producer}, ${film.release_date}</p>
        <div class = "description-instruct">
            <h3>Description:</h3>
            <p>${film.description}</p>
        </div>
        <div class = "description-film-img">
            <img src = "${film.movie_banner}" alt = "">
        </div>
        <div class = "description-link">
            <a href = "https://www.google.com/search?&q=${film.title}&ie=UTF-8&oe=UTF-8" target = "_blank">Search anime</a>
        </div>
    `;
    filmDetailsContent.innerHTML = html;
    filmDetailsContent.parentElement.classList.add("show-description");
};
