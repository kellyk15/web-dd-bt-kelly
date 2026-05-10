console.log('Hoi');

document.documentElement.classList.replace('no-js', 'js');

// Validatie 

// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation

function valideerVeld(input, error, meldingen) {
  const valideren = input.validity
  if (valideren.valueMissing) {
    error.textContent = meldingen.valueMissing ?? 'Dit veld is verplicht'
  } else if (valideren.patternMismatch) {
    error.textContent = meldingen.patternMismatch ?? 'Ongeldig formaat'
  } else {
    error.textContent = ''
  }
}

function koppelValidatie(input, error, meldingen) {
  if (!input || !error) return
  let isGebruikt = false

  input.addEventListener('blur', () => {
    isGebruikt = true
    valideerVeld(input, error, meldingen)
  })

  input.addEventListener('input', () => {
    if (isGebruikt) valideerVeld(input, error, meldingen)
  })
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach voor de aanroep van koppelValidatie op elk veld, zodat we niet voor elk veld aparte code hoeven te schrijven

const velden = [
  {
    input: document.querySelector('#overledene-voorletters'),
    error: document.querySelector('#error-overledene-voorletters'),
    meldingen: { valueMissing: 'Vul voorletters in' }
  },
  {
    input: document.querySelector('#overledene-achternaam'),
    error: document.querySelector('#error-overledene-achternaam'),
    meldingen: { valueMissing: 'Vul een achternaam in' }
  },
  {
    input: document.querySelector('#bsn'),
    error: document.querySelector('#error-ongeldige-bsn'),
    meldingen: {
      valueMissing: 'Vul een BSN in',
      patternMismatch: 'BSN moet 8 of 9 cijfers zijn'
    }
  },
  {
    input: document.querySelector('#notaris-voorletters'),
    error: document.querySelector('#error-notaris-voorletters'),
    meldingen: { valueMissing: 'Vul voorletters in' }
  },
  {
    input: document.querySelector('#notaris-achternaam'),
    error: document.querySelector('#error-notaris-achternaam'),
    meldingen: { valueMissing: 'Vul een achternaam in' }
  }
]

velden.forEach(({ input, error, meldingen }) => koppelValidatie(input, error, meldingen))

// Verkrijgers toevoegen en verwijderen

const verkrijgerKnop = document.querySelector(".verkrijgerToevoegen");
const maxVerkrijgers = document.querySelectorAll(".verkrijger").length;

// Schakel inputs in of uit zodat verborgen verkrijgers niet meegestuurd worden

function setInputsDisabled(fieldset, disabled) {
    fieldset.querySelectorAll("input").forEach(input => {
        input.disabled = disabled;
    });
}

// Zet required op de juiste velden https://claude.ai/chat/b0f93038-9c6d-4b8b-af11-d5a1787aaa4b

function setInputsRequired(fieldset, required) {
    fieldset.querySelector('[id$="-voorletters"]').required = required;
    fieldset.querySelector('[id$="-achternaam"]').required = required;

    // Radio buttons: required op de eerste van elke groep zetten is genoeg
    const radioGroepen = {};
    fieldset.querySelectorAll('input[type="radio"]').forEach(radio => {
        if (!radioGroepen[radio.name]) {
            radioGroepen[radio.name] = radio;
        }
    });
    Object.values(radioGroepen).forEach(radio => radio.required = required);
}

function updateToevoegKnop() {
    const eerste = document.querySelector(".verkrijger:not(.verkrijgerHidden)");
    const isEersteZichtbaar = eerste && !eerste.classList.contains("hidden");
    const extraZichtbaar = document.querySelectorAll(".verkrijgerHidden.zichtbaar").length;
    const totaal = (isEersteZichtbaar ? 1 : 0) + extraZichtbaar;
    verkrijgerKnop.disabled = totaal >= maxVerkrijgers;
}

function hernummer() {
    const zichtbaar = [...document.querySelectorAll(".verkrijger")].filter(f => {
        if (f.classList.contains("verkrijgerHidden")) {
            return f.classList.contains("zichtbaar");
        } else {
            return !f.classList.contains("hidden");
        }
    });

    zichtbaar.forEach((fieldset, index) => {
        const nummer = index + 1;

        const legend = fieldset.querySelector(":scope > legend");
        if (legend) legend.textContent = `Verkrijger ${nummer}`;

        const knop = fieldset.querySelector(".verkrijgerVerwijderenIndividueel");
        if (knop) knop.setAttribute("aria-label", `Verwijder verkrijger ${nummer}`);
    });

    // Laat screen readers weten hoeveel verkrijgers er zijn
    const status = document.getElementById("verkrijger-status");
    if (status) status.textContent = `${zichtbaar.length} verkrijger${zichtbaar.length === 1 ? "" : "s"} actief`;
}

function verwijderVerkrijger(fieldset) {
    fieldset.querySelectorAll("input").forEach(input => {
        if (input.type === "radio") input.checked = false;
        else input.value = "";
    });

    if (!fieldset.classList.contains("verkrijgerHidden")) {
        fieldset.classList.add("hidden");
        setInputsDisabled(fieldset, true);
        setInputsRequired(fieldset, false);
    } else {
        fieldset.classList.remove("zichtbaar");
        setInputsDisabled(fieldset, true);
        setInputsRequired(fieldset, false);
    }

    updateToevoegKnop();
    hernummer();
    verkrijgerKnop.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function verkrijgerToevoegen() {
    const eerste = document.querySelector(".verkrijger:not(.verkrijgerHidden)");
    if (eerste && eerste.classList.contains("hidden")) {
        eerste.classList.remove("hidden");
        setInputsDisabled(eerste, false);
        setInputsRequired(eerste, true);
        eerste.scrollIntoView({ behavior: "smooth", block: "start" });
        updateToevoegKnop();
        hernummer();
        return;
    }

    const volgende = document.querySelector(".verkrijgerHidden:not(.zichtbaar)");
    if (!volgende) return;

    volgende.classList.add("zichtbaar");
    setInputsDisabled(volgende, false);
    setInputsRequired(volgende, true);
    volgende.scrollIntoView({ behavior: "smooth", block: "start" });
    updateToevoegKnop();
    hernummer();
}

document.querySelectorAll(".verkrijgerVerwijderenIndividueel").forEach(knop => {
    const fieldset = knop.closest(".verkrijger");
    knop.addEventListener("click", () => verwijderVerkrijger(fieldset));
});

verkrijgerKnop.addEventListener("click", verkrijgerToevoegen);


document.querySelectorAll('input[name="geenAangifte"]').forEach(radio => {
    radio.addEventListener('change', function () {
        const eersteVerkrijger = document.querySelector(".verkrijger:not(.verkrijgerHidden)");
        if (this.value === 'ja') {
            eersteVerkrijger.classList.remove("hidden");
            setInputsDisabled(eersteVerkrijger, false);
            setInputsRequired(eersteVerkrijger, true);
            verkrijgerKnop.classList.remove("hidden");
        } else {
            verwijderVerkrijger(eersteVerkrijger);
            verkrijgerKnop.classList.add("hidden");
        }
    });
});

// Zet alle verborgen verkrijgers op disabled bij laden
document.querySelectorAll(".verkrijgerHidden").forEach(f => setInputsDisabled(f, true));

updateToevoegKnop();


// Hulpfunctie: reset alle radio's binnen een fieldset en verberg hem
// https://claude.ai/chat/106d79d1-e0c6-4f9e-93aa-e5a424ccea49 
// ik wil met javascript dat als ik op een ja vraag klikt en dan de volgende vragen die uitklappen beantwoord dat als ik weer op nee klik dat die antwoorden gereset woorden radio === false?


function resetEnVerberg(fieldset) {
  if (!fieldset) return;
  fieldset.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  fieldset.classList.add('hidden');
}

// Getrouwd? 
const getrouwdNee = document.getElementById('1b-1-nee');
const getrouwdJa  = document.getElementById('1b-1-ja');

const fsHuwelijksVoorwaarden = document.querySelector('[name="huwelijkseVoorwaarden"]')
                                ?.closest('fieldset');
const fsFinaalVerrekenbeding  = document.querySelector('[name="finaalVerrekenbeding"]')
                                ?.closest('fieldset');
const fsDatumHuwelijks        = document.getElementById('datumHuwelijkseVoorwaarden')
                                ?.closest('fieldset');

getrouwdJa?.addEventListener('change', () => {
  fsHuwelijksVoorwaarden?.classList.remove('hidden');
});

getrouwdNee?.addEventListener('change', () => {
  resetEnVerberg(fsHuwelijksVoorwaarden);
  resetEnVerberg(fsFinaalVerrekenbeding);
  resetEnVerberg(fsDatumHuwelijks);
});

// Huwelijkse voorwaarden?
const huwVoorwaardenNee = document.getElementById('1b-2-nee');
const huwVoorwaardenJa  = document.getElementById('1b-2-ja');

huwVoorwaardenJa?.addEventListener('change', () => {
  fsFinaalVerrekenbeding?.classList.remove('hidden');
});

huwVoorwaardenNee?.addEventListener('change', () => {
  resetEnVerberg(fsFinaalVerrekenbeding);
  resetEnVerberg(fsDatumHuwelijks);
});

// Finaal verrekenbeding? 
const finaalJa  = document.getElementById('1b-3-ja');
const finaalNee = document.getElementById('1b-3-nee');

finaalJa?.addEventListener('change', () => {
  fsDatumHuwelijks?.classList.remove('hidden');
});

finaalNee?.addEventListener('change', () => {
  resetEnVerberg(fsDatumHuwelijks);
});

// Kinderen?
const kinderenNee = document.getElementById('1c-1-nee');
const kinderenJa  = document.getElementById('1c-1-ja');

const fsKinderenOverleden = document.querySelector('[name="kinderenOverleden"]')?.closest('fieldset');
const fsKleinkinderen     = document.querySelector('[name="kleinkinderen"]')?.closest('fieldset');

kinderenJa?.addEventListener('change', () => {
  fsKinderenOverleden?.classList.remove('hidden');
});

kinderenNee?.addEventListener('change', () => {
  resetEnVerberg(fsKinderenOverleden);
  resetEnVerberg(fsKleinkinderen);
});

// Kind eerder overleden? 
const kinderenOverledenJa  = document.getElementById('1c-2-ja');
const kinderenOverledenNee = document.getElementById('1c-2-nee');

kinderenOverledenJa?.addEventListener('change', () => {
  fsKleinkinderen?.classList.remove('hidden');
});

kinderenOverledenNee?.addEventListener('change', () => {
  resetEnVerberg(fsKleinkinderen);
});


// localstorage
// https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

function opslaanGegevens() {
  const data = {}

  // Tekstvelden en datumvelden
  document.querySelectorAll('input[type="text"], input[type="date"]').forEach(input => {
    data[input.id] = input.value
  })

  // Radio buttons (ja/nee vragen)
  document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
    data[radio.name] = radio.value
  })

  localStorage.setItem('aangifteGegevens', JSON.stringify(data))
}

function gegevensTerugzetten() {
  const opgeslagen = localStorage.getItem('aangifteGegevens')
  if (!opgeslagen) return

  const data = JSON.parse(opgeslagen)

  // Tekstvelden en datumvelden terugzetten
  document.querySelectorAll('input[type="text"], input[type="date"]').forEach(input => {
    if (data[input.id]) input.value = data[input.id]
  })

  // Radio buttons terugzetten + change event zodat conditionele velden uitklappen 
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/bubbles
    // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    if (data[radio.name] === radio.value) {
      radio.checked = true
      radio.dispatchEvent(new Event('change', { bubbles: true }))
    }
  })
}

// Sla op bij elke wijziging (input event voor tekstvelden, change event voor radio buttons)
document.querySelector('form').addEventListener('input', opslaanGegevens)
document.querySelector('form').addEventListener('change', opslaanGegevens)

// Herstel bij laden
gegevensTerugzetten()

// Wis na verzenden
document.querySelector('form').addEventListener('submit', () => {
  localStorage.removeItem('aangifteGegevens')
})

// Alle gegevens wissen bij klikken op reset-knop
const deleteButton = document.getElementById('reset-btn');
	deleteButton.addEventListener('click', resetInfo);

function resetInfo() {
  localStorage.removeItem('aangifteGegevens');
  location.reload();
}