console.log('Hoi');

document.documentElement.classList.replace('no-js', 'js');

// Validatie 

// https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation

function valideerVeld(input, error, meldingen) {
  input.checkValidity();
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

// Verkrijgers: hardcoded fieldsets als no-JS fallback, dynamisch met JS
// Bron: Victor (teamsbericht 20-03) en dan met behulp van claude

const verkrijgerKnop = document.querySelector('.verkrijgerToevoegen');
const dynamischeContainer = document.createElement('div');
dynamischeContainer.id = 'verkrijgers-container';
let teller = 0;

// Verberg hardcoded verkrijgers en disable hun inputs (no-JS fallback blijft in DOM)
document.querySelectorAll('.verkrijger').forEach(f => {
    f.setAttribute('aria-hidden', 'true');
    f.style.display = 'none';
    f.querySelectorAll('input').forEach(i => i.disabled = true);
});

// Voeg dynamische container in vóór de .verkrijgerKnoppen div
document.querySelector('.verkrijgerKnoppen').before(dynamischeContainer);

// Bouw een verkrijger fieldset op basis van volgnummer en uniek ID
function maakVerkrijgerFieldset(nummer, uniekId) {
    const fs = document.createElement('fieldset');
    fs.className = 'mainFieldset test verkrijger dynamisch';
    fs.dataset.verkrijgerId = uniekId;

    fs.innerHTML = `
        <div class="wrapper-verkrijger-btn">
            <legend>Verkrijger ${nummer}</legend>
            <button class="verkrijgerVerwijderenIndividueel" type="button"
                    aria-label="Verwijder verkrijger ${nummer}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="size-6" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
                </svg>
                Verwijder verkrijger
            </button>
        </div>

        <fieldset class="mainFieldset instellingOfPersoon">
            <legend>Gaat het om een persoon of instelling?</legend>
            <div class="mainHolder">
                <div class="holder">
                  <label for="verkrijger${uniekId}-type-persoon">Persoon
                      <input type="radio" id="verkrijger${uniekId}-type-persoon"
                            name="verkrijger${uniekId}-type" value="persoon" checked>
                  </label>
              </div>
              <div class="holder">
                  <label for="verkrijger${uniekId}-type-instelling">Instelling
                      <input type="radio" id="verkrijger${uniekId}-type-instelling"
                            name="verkrijger${uniekId}-type" value="instelling">
                  </label>
              </div>
            </div>
        </fieldset>

        <div class="name">
            <div>
                <label for="verkrijger${uniekId}-bsnRsin">BSN/RSIN
                    <input id="verkrijger${uniekId}-bsnRsin" type="text"
                           pattern="[0-9]{8,9}" inputmode="numeric" maxlength="9"
                           title="Vul een geldig BSN/RSIN in (8 of 9 cijfers)"
                           aria-describedby="error-verkrijger${uniekId}-bsnRsin">
                </label>
                <p class="error" id="error-verkrijger${uniekId}-bsnRsin">
                    Vul een geldig BSN/RSIN in (8 of 9 cijfers)
                </p>
            </div>
        </div>

        <div class="name">
            <div>
                <label for="verkrijger${uniekId}-voorletters">Voorletter(s)
                    <input id="verkrijger${uniekId}-voorletters" type="text"
                           pattern="[A-Za-z]+" title="Vul alleen letters in" required
                           aria-describedby="error-verkrijger${uniekId}-voorletters">
                </label>
                <p class="error" id="error-verkrijger${uniekId}-voorletters">Vul voorletters in</p>
            </div>
            <div>
                <label for="verkrijger${uniekId}-tussenvoegsel">Tussenvoegsel(s)
                    <input id="verkrijger${uniekId}-tussenvoegsel" type="text">
                </label>
            </div>
            <div class="achternaam">
                <label for="verkrijger${uniekId}-achternaam">
                    <span>Achternaam</span>
                    <input id="verkrijger${uniekId}-achternaam" type="text"
                           pattern="[A-Za-z]+" title="Vul alleen letters in" required
                           aria-describedby="error-verkrijger${uniekId}-achternaam">
                </label>
                <p class="error" id="error-verkrijger${uniekId}-achternaam">Vul achternaam in</p>
            </div>
        </div>

        <fieldset class="mainFieldset test">
            <legend>Krijgt deze verkrijger het hele vermogen?</legend>
            <div class="mainHolder">
                <div class="holder">
                    <label for="verkrijger${uniekId}-heleVermogen-ja">Ja</label>
                    <input type="radio" id="verkrijger${uniekId}-heleVermogen-ja"
                           name="verkrijger${uniekId}-heleVermogen" value="ja" required>
                </div>
                <div class="holder">
                    <label for="verkrijger${uniekId}-heleVermogen-nee">Nee</label>
                    <input type="radio" id="verkrijger${uniekId}-heleVermogen-nee"
                           name="verkrijger${uniekId}-heleVermogen" value="nee">
                </div>
            </div>
            <p class="error" id="error-verkrijger${uniekId}-heleVermogen">Maak een keuze</p>
        </fieldset>

        <fieldset class="mainFieldset test">
            <legend>Doet deze verkrijger een beroep op diens legitieme portie?</legend>
            <div class="mainHolder">
                <div class="holder">
                    <label for="verkrijger${uniekId}-legitiemePortie-ja">Ja</label>
                    <input type="radio" id="verkrijger${uniekId}-legitiemePortie-ja"
                           name="verkrijger${uniekId}-legitiemePortie" value="ja" required>
                </div>
                <div class="holder">
                    <label for="verkrijger${uniekId}-legitiemePortie-nee">Nee</label>
                    <input type="radio" id="verkrijger${uniekId}-legitiemePortie-nee"
                           name="verkrijger${uniekId}-legitiemePortie" value="nee">
                </div>
            </div>
            <p class="error" id="error-verkrijger${uniekId}-legitiemePortie">Maak een keuze</p>
        </fieldset>
    `;

    // Persoon/instelling toggle
    fs.querySelectorAll(`input[name="verkrijger${uniekId}-type"]`).forEach(radio => {
        radio.addEventListener('change', function () {
            const span = fs.querySelector(`label[for="verkrijger${uniekId}-achternaam"] span`);
            const voorletters = fs.querySelector(`#verkrijger${uniekId}-voorletters`);
            const tussenvoegsel = fs.querySelector(`#verkrijger${uniekId}-tussenvoegsel`);
            if (this.value === 'instelling') {
                span.textContent = 'Naam instelling';
                voorletters.disabled = true;
                tussenvoegsel.disabled = true;
            } else {
                span.textContent = 'Achternaam';
                voorletters.disabled = false;
                tussenvoegsel.disabled = false;
            }
        });
    });

    // Verwijder-knop
    fs.querySelector('.verkrijgerVerwijderenIndividueel').addEventListener('click', () => {
        fs.remove();
        hernummer();
        verkrijgerKnop.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    return fs;
}

// Hernummer alle actieve verkrijgers
function hernummer() {
    dynamischeContainer.querySelectorAll('.verkrijger').forEach((fs, i) => {
        const nummer = i + 1;
        const legend = fs.querySelector(':scope > .wrapper-verkrijger-btn > legend');
        if (legend) legend.textContent = `Verkrijger ${nummer}`;
        const knop = fs.querySelector('.verkrijgerVerwijderenIndividueel');
        if (knop) knop.setAttribute('aria-label', `Verwijder verkrijger ${nummer}`);
    });
}

// Voeg een nieuwe verkrijger toe
// https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild
// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView feedback van victor

function voegVerkrijgerToe() {
    teller++;
    const nummer = dynamischeContainer.querySelectorAll('.verkrijger').length + 1;
    const fs = maakVerkrijgerFieldset(nummer, teller);
    console.log('fieldset aangemaakt:', fs);
    dynamischeContainer.appendChild(fs);
    console.log('container na toevoegen:', dynamischeContainer.innerHTML);
    fs.scrollIntoView({ behavior: 'smooth', block: 'start' });
    fs.querySelector('input')?.focus();
}

verkrijgerKnop.addEventListener('click', voegVerkrijgerToe);

// Ja/nee voor "zijn er verkrijgers zonder aangifte"
document.querySelectorAll('input[name="geenAangifte"]').forEach(radio => {
    radio.addEventListener('change', function () {
        if (this.value === 'ja') {
            verkrijgerKnop.classList.remove('hidden');
            // Voeg automatisch eerste toe als er nog geen zijn
            if (dynamischeContainer.querySelectorAll('.verkrijger').length === 0) {
                voegVerkrijgerToe();
            }
        } else {
            // Verwijder alle dynamische verkrijgers en verberg de knop
            dynamischeContainer.innerHTML = '';
            teller = 0;
            verkrijgerKnop.classList.add('hidden');
        }
    });
});


// Hulpfunctie: reset alle radio's binnen een fieldset en verberg hem
// https://claude.ai/chat/106d79d1-e0c6-4f9e-93aa-e5a424ccea49 
// ik wil met javascript dat als ik op een ja vraag klikt en dan de volgende vragen die uitklappen beantwoord dat als ik weer op nee klik dat die antwoorden gereset woorden radio === false?


function resetEnVerberg(fieldset) {
  if (!fieldset) return;
  fieldset.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
  fieldset.classList.add('hidden');
}

// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
// Getrouwd? 
const getrouwdNee = document.getElementById('1b-1-nee');
const getrouwdJa = document.getElementById('1b-1-ja');

const fsHuwelijksVoorwaarden = document
    .querySelector('[name="huwelijkseVoorwaarden"]')
    ?.closest('fieldset');

const fsFinaalVerrekenbeding = document
    .querySelector('[name="finaalVerrekenbeding"]')
    ?.closest('fieldset');

const fsDatumHuwelijks = document
    .getElementById('datumHuwelijkseVoorwaarden')
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
const kinderenJa = document.getElementById('1c-1-ja');

const fsKinderenOverleden = document.querySelector('[name="kinderenOverleden"]')?.closest('fieldset');
const fsKleinkinderen = document.querySelector('[name="kleinkinderen"]')?.closest('fieldset');

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
// const deleteButton = document.getElementById('reset-btn');
// deleteButton.addEventListener('click', resetInfo);

// function resetInfo() {
//   localStorage.removeItem('aangifteGegevens');
//   location.reload();
// }


const resetDialog = document.getElementById('reset-dialog');
const deleteButton = document.getElementById('reset-btn');

deleteButton.addEventListener('click', openResetDialog);

function openResetDialog() {
  resetDialog.showModal();
}

document.getElementById('dialog-annuleer').addEventListener('click', sluitResetDialog);

function sluitResetDialog() {
  resetDialog.close();
}

document.getElementById('dialog-bevestig').addEventListener('click', bevestigReset);

function bevestigReset() {
  localStorage.removeItem('aangifteGegevens');
  location.reload();
}

resetDialog.addEventListener('click', sluitBuitenDialog);

function sluitBuitenDialog(e) {
  if (e.target === resetDialog) resetDialog.close();
}
