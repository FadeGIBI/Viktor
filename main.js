// IDE add meg a képeidet a kepek mappából
let kartyakTartalom = [
    "kepek/67-kid.jpg",
    "kepek/absoluteCINEMA.jpg",
    "kepek/buek.jpg",
    "kepek/cula.jpg",
    "kepek/cula2.jpg",
    "kepek/csibicsabi.jpg",
    "kepek/hazilinuk.jpg",
    "kepek/horog.jpg",
    "kepek/love.jpg",
    "kepek/mikler.jpg",
    "kepek/niga.jpg",
    "kepek/nyami.jpg",
    "kepek/ocsmany.jpg",
    "kepek/patyesz.jpg",
    "kepek/svedasztal.jpg",
];

const szintSelect = document.getElementById("szint");
const jatek = document.getElementById("jatek");
const lepesKiir = document.getElementById("lepesek");
const uzenet = document.getElementById("uzenet");

let elso = null;
let masodik = null;
let zarolva = false;
let lepesek = 0;
let talalat = 0;

function kever(tomb) {
    return tomb.sort(() => Math.random() - 0.5);
}

function ujJatek() {
    clearInterval(idoInterval);
    ido = 0;
    idoKiir.textContent = 0;

    elso = null;
    masodik = null;
    zarolva = false;
    lepesek = 0;
    talalat = 0;
    lepesKiir.textContent = 0;
    uzenet.textContent = "";

    const meret = parseInt(szintSelect.value);
    const osszKartya = meret * meret;
    const parokSzama = osszKartya / 2;

    // Ellenőrizzük van-e elég kép
    if (kartyakTartalom.length < parokSzama) {
        alert(`Ehhez a szinthez legalább ${parokSzama} különböző kép kell!`);
        return;
    }

    // Grid oszlop beállítás
    jatek.style.gridTemplateColumns = `repeat(${meret}, 1fr)`;

    // Véletlenszerűen kiválasztunk szükséges számú képet
    let kepek = kever([...kartyakTartalom]).slice(0, parokSzama);

    let pakli = [...kepek, ...kepek];

    jatek.classList.add("keveres");

    setTimeout(() => {
        jatek.classList.remove("keveres");

        pakli = kever(pakli);
        jatek.innerHTML = "";

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

            hatul.appendChild(img);
            belso.appendChild(elol);
            belso.appendChild(hatul);
            kartya.appendChild(belso);

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

            jatek.appendChild(kartya);
        });

        idoInterval = setInterval(() => {
            ido++;
            idoKiir.textContent = ido;
        }, 1000);

    }, 800);
}

function ellenoriz(parokSzama) {
    zarolva = true;
    lepesek++;
    lepesKiir.textContent = lepesek;

    const elsoKep = elso.querySelector("img").src;
    const masodikKep = masodik.querySelector("img").src;

    if (elsoKep === masodikKep) {
        talalat++;
        elso = null;
        masodik = null;
        zarolva = false;

        if (talalat === parokSzama) {
            clearInterval(idoInterval);
            uzenet.textContent =
                `🎉 Szint teljesítve! Idő: ${ido} mp | Lépések: ${lepesek}`;
        }

    } else {
        setTimeout(() => {
            elso.classList.remove("megforditva");
            masodik.classList.remove("megforditva");
            elso = null;
            masodik = null;
            zarolva = false;
        }, 800);
    }
}
const idoKiir = document.getElementById("ido");

let ido = 0;
let idoInterval = null;


// Játék indítása
ujJatek();
