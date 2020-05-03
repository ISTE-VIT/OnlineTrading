const intViewportWidth = window.innerWidth;
const intViewportHeight = window.innerHeight;

const catogorySlide = () => {
    const burger = document.querySelector('.burger');
    const section = document.querySelector('.catogories');
    const display = document.querySelector('.display');

    burger.addEventListener('click', () => {
        section.classList.toggle('catogories-active');
        burger.classList.toggle('burger-active');        
        if(intViewportWidth>intViewportHeight){
            display.classList.remove('display-active');
        }
    });
}

const sectionDisplay = () => {
    const catogory = document.querySelectorAll('.catogories-links li');
    const display = document.querySelector('.display');

    catogory.forEach((item) => {
        item.addEventListener('click', () =>{
            if(intViewportWidth>intViewportHeight){
                display.classList.toggle('display-active');
            }
            console.log(item)
        });
    })

}

const start = () => {
    catogorySlide();
    sectionDisplay();
}

start();