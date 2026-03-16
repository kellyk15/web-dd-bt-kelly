console.log('Hoi');

document.documentElement.classList.replace('no-js', 'js');

// knop met beetje hulp van claude
// let verkrijgerKnop = document.querySelector(".verkrijgerToevoegen")
// let fieldsetVerkrijgers = document.querySelectorAll(".verkrijger");
// let aantalZichtbaar = 1;

// function verkrijgerToevoegen() {
//     fieldsetVerkrijgers[aantalZichtbaar].classList.add("zichtbaar");
//     aantalZichtbaar++;
//     console.log("heeeey");
// }

// verkrijgerKnop.addEventListener('click', verkrijgerToevoegen);

let verkrijgerKnop = document.querySelector(".verkrijgerToevoegen")
let verkrijgerKnopVerwijder = document.querySelector(".verkrijgerVerwijderen")
// let fieldsetVerkrijgers = document.querySelectorAll(".verkrijgerHidden");
// const volgende = document.querySelector(".verkrijger:not(.zichtbaar)");

function verkrijgerToevoegen() {
    let volgende = document.querySelector(".verkrijgerHidden:not(.zichtbaar)");
    volgende.classList.add("zichtbaar");
}

verkrijgerKnop.addEventListener('click',verkrijgerToevoegen);

function verkrijgerVerwijderen() {
    let alle = document.querySelectorAll(".verkrijgerHidden.zichtbaar");
    let laatste = alle[alle.length - 1];
    laatste.classList.remove("zichtbaar");
}

// https://claude.ai/chat/54cc345c-d803-4393-908e-8c7a2a12fc63

verkrijgerKnopVerwijder.addEventListener('click',verkrijgerVerwijderen);