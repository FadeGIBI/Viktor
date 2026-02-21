// IDE add meg a képeidet a kepek mappából
let kartyakTartalom = [
    "kepek/67-kid.jpg", "kepek/absoluteCINEMA.jpg", "kepek/buek.jpg", "kepek/cula.jpg", "kepek/cula2.jpg", "kepek/csibicsabi.jpg", "kepek/hazilinuk.jpg",
    "kepek/horog.jpg", "kepek/love.jpg", "kepek/mikler.jpg", "kepek/niga.jpg", "kepek/nyami.jpg", "kepek/ocsmany.jpg", "kepek/patyesz.jpg", "kepek/svedasztal.jpg",
    "kepek/ja.jpg", "kepek/szabey.jpg", "kepek/zaba.jpg"
];
// HTML elemek lekéréses
const szintSelect = document.getElementById("szint");
const jatek = document.getElementById("jatek");
const lepesKiir = document.getElementById("lepesek");
const uzenet = document.getElementById("uzenet");
const pontKiir = document.getElementById("pontszam");
const idoKiir = document.getElementById("ido");
// Játék állapotának változói
let elso = null;
let masodik = null;
let zarolva = false;
let lepesek = 0;
let talalat = 0;
let pontok = 0;
let voltMarTalalat = false;
let ido = 0;
let idoInterval = null;
// Keverő függvény a kártyák véletlenszerű sorrendjéhez
function kever(tomb) {
    return tomb.sort(() => Math.random() - 0.5);
}

function idoFormatum(osszMasodperc) {
    const perc = Math.floor(osszMasodperc / 60);
    const mp = osszMasodperc % 60;

    if (perc > 0) {
        // Ha eléri az egy percet, kiírja a perceket is
        return `${perc}p ${mp < 10 ? '0' : ''}${mp}`;
    } else {
        // Egy perc alatt csak a másodperceket írja
        return `${mp} `;
    }
}

function ujJatek() {
    // Idő számláló leállítása és nullázása
    clearInterval(idoInterval);
    ido = 0;
    idoKiir.textContent = 0;

    //alaphelyzetbe állítások
    elso = null;
    masodik = null;
    zarolva = false;
    lepesek = 0;
    talalat = 0;
    pontok = 0;             //pontok nullázása
    voltMarTalalat = false; //logika nullázása
    lepesKiir.textContent = 0;
    if (pontKiir) pontKiir.textContent = 0; //nullázása
    uzenet.textContent = "";
    // Szint alapján kártyák előkészítése
    const meret = parseInt(szintSelect.value);
    const osszKartya = meret * meret;
    const parokSzama = osszKartya / 2;
    // Ellenőrzés, hogy van-e elég kép a kiválasztott szinthez
    if (kartyakTartalom.length < parokSzama) {
        alert(`Ehhez a szinthez legalább ${parokSzama} különböző kép kell!`);
        return;
    }

    jatek.style.gridTemplateColumns = `repeat(${meret}, 1fr)`;
    // Képek kiválasztása és duplikálása a párokhoz
    let kepek = kever([...kartyakTartalom]).slice(0, parokSzama);
    let pakli = [...kepek, ...kepek];

    jatek.classList.add("keveres");

    setTimeout(() => {
        jatek.classList.remove("keveres");
        pakli = kever(pakli);
        jatek.innerHTML = "";
        // Kártyák létrehozása és megjelenítése
        pakli.forEach(tartalom => {
            const kartya = document.createElement("div");
            kartya.classList.add("kartya");
            const belso = document.createElement("div");
            belso.classList.add("belso");
            const elol = document.createElement("div");
            elol.classList.add("elol");
            const hatul = document.createElement("div");
            hatul.classList.add("hatul");
            const img = document.createElement("img");
            img.src = tartalom;
            // Kép hozzáadása a hátulhoz
            hatul.appendChild(img);
            belso.appendChild(elol);
            belso.appendChild(hatul);
            kartya.appendChild(belso);
            // Kattintás esemény hozzáadása
            kartya.addEventListener("click", () => {
                if (zarolva || kartya.classList.contains("megforditva")) return;
                kartya.classList.add("megforditva");
                if (!elso) {
                    elso = kartya;
                } else {
                    masodik = kartya;
                    ellenoriz(parokSzama);
                }
            });
            jatek.appendChild(kartya); // Kártya hozzáadása a játékterülethez
        });
        // Idő számláló indítása
        idoInterval = setInterval(() => {
            ido++;
            idoKiir.textContent = idoFormatum(ido);
        }, 1000);

    }, 800);
}

function ellenoriz(parokSzama) {
    zarolva = true; // lépek összehasonlítása alatt ne lehessen újabb képet megfordítani
    lepesek++; // lépések számlálása minden két megfordított kártya után
    lepesKiir.textContent = lepesek;

    const elsoKep = elso.querySelector("img").src;
    const masodikKep = masodik.querySelector("img").src;

    if (elsoKep === masodikKep) {
        //jó találat
        talalat++;
        pontok += 300;       // --> kap 300 pontot
        voltMarTalalat = true; // az elso talaltig nem von le pontot, de utana minden rossz talalatnal vonunk le 100 pontot

        elso = null;
        masodik = null;
        zarolva = false;
        // Szint teljesítése ellenőrzése
        if (talalat === parokSzama) {
            clearInterval(idoInterval);
            uzenet.textContent = `🎉 Szint teljesítve! Pontszám: ${pontok} | Lépések: ${lepesek} | Idő: ${idoFormatum(ido)} mp.`;
        }
    } else {
        //rossz talalat
        if (voltMarTalalat) {
            pontok -= 100;   // Csak akkor vonunk le, ha már volt korábban találata
        }
        // Kártyák visszafordítása 800ms múlva
        setTimeout(() => {
            elso.classList.remove("megforditva");
            masodik.classList.remove("megforditva");
            elso = null;
            masodik = null;
            zarolva = false;
        }, 800);
    }

    if (pontKiir) pontKiir.textContent = pontok; //pontszám kijelző frissítése minden ellenőrzés után
}

ujJatek();
