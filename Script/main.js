var buttonSend = document.getElementById("main_input_button");
var inputLink = document.getElementById("main_input_search");
var count = 0;
var array = new Array(3);

function ajustarLayout() {
    if(window.innerWidth >= 1110){
        let cards = document.querySelectorAll(".main__card");
        for(let i = 0 ; i < cards.length; i++){
        cards[i].style.marginTop = `${i*2.8}rem`;
        }
    }

    if(window.innerWidth >= 1080){
    let element_header_infomations = document.querySelector(".header__informations__container");
    let header = `
        <div class="header_functions">
            <img class="header__img" src="images/logo.svg">
            
            <ul class="navbar__informations">
                <li class="items1">Features</li>
                <li class="items2">Pricing</li>
                <li class="items3">Resources</li>
            </ul>  
        </div>

        <div id="navbar" class="header_button">
            <ul class="navbar__user">
                <li class="lgn">Login</li>
                <li><button class="btn_sign btn btn--primary">Sign Up</button></li>
            </ul>
        </div>
    `;
    element_header_infomations.innerHTML = header;
    } 
    else {
        let element_header_infomations = document.querySelector(".header__informations__container");
        let header = `
                <img class="header__logo" src="images/logo.svg" alt="Shortly Logo">

                <button class="header__menu-button" aria-controls="main-nav" aria-expanded="false">
                    <p>☰</p>
                </button>
        `;
        element_header_infomations.innerHTML = header;
    }
}

window.addEventListener("load", ajustarLayout);
window.addEventListener("resize", ajustarLayout);

function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;  
    }
}

function errorInput(text){
    let error = document.getElementById("error");
    error.innerHTML = text
    if(text == "") {
        inputLink.classList.remove("error_input")
        return;
    }

    inputLink.classList.add("error_input")
}

function addURL(link, shortLink){
    if(count >= array.length) {
        count = 0;
    }

    array[count] = {link: link, short: shortLink}
    count++;
    addCards(count);
}

function addCards(indexAtual){
    let history = document.querySelector(".main__history");
    history.innerHTML = "";

    for(let i = 0; i < array.length;i++) {
        if (array[i].link == "") continue;

        let button = document.createElement("input");
        button.value = "Copy"
        button.type = "button"
        button.classList.add("btn", "btn_copy", "animation_fade_button");

        button.addEventListener("click", ()=> {
            const textToCopy = array[i].short;

            navigator.clipboard.writeText(textToCopy)
            .then(() => {
                button.classList.add("button-copied");
                button.value = "Copied"
            })
            .catch(err => {
                console.error("Erro ao copiar: ", err);
            });
        });
        
        let card = document.createElement("div");
        card.classList.add("container_history__card");
        card.innerHTML = `
            <p class="history_card__title">${array[i].link}</p>
            <p class="history_card__shorten">${array[i].short}</p>
        `;

        if (i == indexAtual-1) {
            card.classList.add("animation_fade_in");
            card.addEventListener("animationend", () => {
                card.classList.remove("animation_fade_in");
            }, { once: true });
        }

        card.appendChild(button);
        history.appendChild(card);
    }
}

async function shortenURL(longURL) {
  const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longURL)}`);
  const shortURL = await response.text();
  return shortURL;
}

async function handleShorten(URL) {
  const shortURL = await shortenURL(URL);
  
  if(shortURL) {
    return shortURL;
  }

  return "";
}

async function sendURL(){
    let value = inputLink.value.replace(/\s+/g,'');

    if(value == ""){
        errorInput("Please add a link!")
        return;
    }
    
    if(!isValidURL(value)){
        errorInput("Please add a valid URL!");
        return;
    }

    errorInput("");
    inputLink.value = ""
    let urlShort = await handleShorten(value);
    addURL(value, urlShort);
}

buttonSend.addEventListener("click", async () => {
    await sendURL();
});

inputLink.addEventListener("keydown", async (event) => {
    if(event.key === "Enter") {
        await sendURL();
    }
});