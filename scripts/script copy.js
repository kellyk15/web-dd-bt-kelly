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


-----

console.log('Hoi');

document.documentElement.classList.replace('no-js', 'js');

const verkrijgerKnop = document.querySelector(".verkrijgerToevoegen");
const verkrijgerKnopVerwijder = document.querySelector(".verkrijgerVerwijderen");
const maxVerkrijgers = document.querySelectorAll(".verkrijger").length;

function updateKnoppen() {
    // tel zichtbare hidden verkrijgers + de eerste (altijd zichtbaar)
    const aantalZichtbaar = document.querySelectorAll(".verkrijgerHidden.zichtbaar").length + 1;

    verkrijgerKnop.disabled = aantalZichtbaar >= maxVerkrijgers;
    verkrijgerKnopVerwijder.disabled = aantalZichtbaar === 1;
}

function verkrijgerToevoegen() {
    const volgende = document.querySelector(".verkrijgerHidden:not(.zichtbaar)");
    
    // Stopbeveiliging: doe niets als er geen verkrijger meer beschikbaar is
    if (!volgende) return;

    volgende.classList.add("zichtbaar");
    
    // Scroll naar de nieuwe verkrijger
    volgende.scrollIntoView({ behavior: "smooth", block: "start" });

    updateKnoppen();
}

function verkrijgerVerwijderen() {
    const alle = document.querySelectorAll(".verkrijgerHidden.zichtbaar");
    
    // Stopbeveiliging: doe niets als er niets te verwijderen is
    if (alle.length === 0) return;

    const laatste = alle[alle.length - 1];
    laatste.classList.remove("zichtbaar");

    // Maak alle inputs leeg zodat oude data niet meegestuurd wordt
    laatste.querySelectorAll("input").forEach(input => {
        if (input.type === "radio") {
            input.checked = false;
        } else {
            input.value = "";
        }
    });

    updateKnoppen();
}

verkrijgerKnop.addEventListener("click", verkrijgerToevoegen);
verkrijgerKnopVerwijder.addEventListener("click", verkrijgerVerwijderen);

// Zet knoppen goed bij laden van de pagina
updateKnoppen();

document.querySelectorAll("input[required]").forEach(input => {
    // valideer als gebruiker veld verlaat
    input.addEventListener("blur", () => {
        input.classList.add("aangeraakt");
    });

    // verwijder foutmelding zodra het goed is
    input.addEventListener("input", () => {
        if (input.validity.valid) {
            input.classList.add("aangeraakt");
        }
    });
});


document.querySelectorAll('input[name="getrouwd"]').forEach(input => {
    input.addEventListener("change", () => {
        const verborgen = document.querySelectorAll('input[name="huwelijkseVoorwaarden"], input[name="finaalVerrekenbeding"]');
        verborgen.forEach(r => r.disabled = input.value === "nee");
    });
});

document.querySelectorAll('input[name="huwelijkseVoorwaarden"]').forEach(input => {
    input.addEventListener("change", () => {
        const verborgen = document.querySelectorAll('input[name="finaalVerrekenbeding"]');
        verborgen.forEach(r => r.disabled = input.value === "nee");
    });
});

document.querySelectorAll('input[name="kinderen"]').forEach(input => {
    input.addEventListener("change", () => {
        const verborgen = document.querySelectorAll('input[name="kinderenOverleden"], input[name="kleinkinderen"]');
        verborgen.forEach(r => r.disabled = input.value === "nee");
    });
});

document.querySelectorAll('input[name="kinderenOverleden"]').forEach(input => {
    input.addEventListener("change", () => {
        const verborgen = document.querySelectorAll('input[name="kleinkinderen"]');
        verborgen.forEach(r => r.disabled = input.value === "nee");
    });
});