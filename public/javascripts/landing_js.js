const intViewportWidth = window.innerWidth;
const intViewportHeight = window.innerHeight;

const catogorySlide = () => {
    const burger = document.querySelector('.burger');
    const section = document.querySelector('.catogories');
    const display = document.querySelector('.display');
    const overlay = document.querySelector('.overlay');

    burger.addEventListener('click', () => {
        section.classList.toggle('catogories-active');
        burger.classList.toggle('burger-active');        
        if(intViewportWidth>intViewportHeight){
            display.classList.remove('display-active');
        }
        overlay.classList.toggle('overlay-active');
    });
}

const sectionDisplay = () => {
    const catogory = document.querySelectorAll('.catogories-links li');
    const display = document.querySelector('.display');

    catogory.forEach((item) => {
        item.addEventListener('click', () => {
            if(intViewportWidth>intViewportHeight){
                display.classList.toggle('display-active');
            }
        });
    })

}

const navScroll = () => {
    const nav = document.querySelector('nav');
    const logo = document.querySelector('.logo');
    const links = document.querySelector('.customer-section'); 
    const burger = document.querySelectorAll('.burger-line');

    window.addEventListener('scroll', () => {
        if(window.scrollY >= 6*nav.offsetHeight){
            nav.classList.add('nav-dark');
            links.classList.add('customer-section-dark');
            logo.classList.add('logo-dark');
        } else {
            nav.classList.remove('nav-dark');
            links.classList.remove('customer-section-dark');
            logo.classList.remove('logo-dark');
        }
    });
}

const carousel = () => {
    const carousel = document.querySelector(".recent");
    const card = carousel.querySelector(".recent .small-promo");
    const leftButton = document.querySelector(".button-wrapper .slideLeft");
    const rightButton = document.querySelector(".button-wrapper .slideRight");

    const carouselWidth = carousel.offsetWidth;
    const cardStyle = card.currentStyle || window.getComputedStyle(card)
    const cardMarginRight = Number(cardStyle.marginRight.match(/\d+/g)[0]);

    const cardWidth = card.offsetWidth;

    let offset = 0;
    let  max = carouselWidth - 3*(cardWidth+cardMarginRight);

    console.log(`Max = ${max}`);
    leftButton.addEventListener("click", function() {
    if (offset/(cardWidth + cardMarginRight) !== 0) {
        offset += cardWidth + cardMarginRight;
        carousel.scrollLeft -= cardWidth + cardMarginRight;
        console.log(carousel.scrollLeft);
        }
    })
    
    rightButton.addEventListener("click", function() {
    if (offset/(cardWidth + cardMarginRight) !== -5) {
        offset += cardWidth + cardMarginRight;
        carousel.scrollLeft += cardWidth + cardMarginRight;
        console.log(carousel.scrollLeft);
    }
    })  
    

}


const start = () => {
    catogorySlide();
    sectionDisplay();
    navScroll();
    carousel();
}

console.log("landing page js connected");

start();