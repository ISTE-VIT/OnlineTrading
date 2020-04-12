const catogorySlide = () =>{
    const burger = document.querySelector('.burger');
    const section = document.querySelector('.catogories');
    const content = document.querySelector('.content');

    burger.addEventListener('click', ()=>{
        section.classList.toggle('catogories-active');
        burger.classList.toggle('burger-active');
        content.classList.toggle('hidden');
    });
}

catogorySlide();