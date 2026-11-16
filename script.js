// script.js – das Verhalten von Campus Idle

const gespeicherterZustand = JSON.parse(localStorage.getItem("campusIdleZustand"));
const hatSpielstand = Boolean(gespeicherterZustand);
const darkmodeGespeichert = localStorage.getItem("campusIdleDarkmode") !== "inaktiv";
document.body.classList.toggle("darkmodus", darkmodeGespeichert);
const startOverlay = document.getElementById("start-overlay");
const willkommenBudget = document.getElementById("willkommen-budget");
const willkommenAusgaben = document.getElementById("willkommen-ausgaben");
const willkommenRabatt = document.getElementById("willkommen-rabatt");
const willkommenKategorien = document.getElementById("willkommens-kategorien");
const willkommenFehlermeldung = document.getElementById("willkommens-fehlermeldung");
const willkommenStartKnopf = document.getElementById("willkommens-start-knopf");
const startguthaben = 1750;

// Der Zustand enthält alle Werte, die sich im Spiel verändern können.
const grundausstattung = {
  pc: 1,
  tisch: 1,
  musikanlage: 1,
  unterrichtsstoff: 1,
  accessoires: 1
};

const zustand = {
  wissen: 0,
  geld: 0,
  bibliothekFreigeschaltet: false,
  lerngruppenraumFreigeschaltet: false,
  cafeFreigeschaltet: false,
  hoersaalFreigeschaltet: false,
  semester: 1,
  verbleibendeSekunden: 300,
  studiumAbgeschlossen: false,
  ausruestung: { ...grundausstattung },
  aktiverBoost: null,
  spielGestartet: false,
  pcWissensBonus: 0,
  pcGeldBonus: 0,
  lehrmittelBonus: 0,
  semesterLaeuft: false,
  pruefungsSchwelle: 0,
  semesterEcts: 0,
  gesamtEcts: 0,
  wiederholung: false,
  ausgewaehlteKurse: [],
  willkommensShopAbgeschlossen: false,
  ...gespeicherterZustand
};
zustand.ausruestung = { ...grundausstattung, ...(gespeicherterZustand?.ausruestung || {}) };
if (gespeicherterZustand && !gespeicherterZustand.ausruestung) {
  zustand.ausruestung.pc = ["schulNotebook", "gebrauchtesNotebook", "studiNotebook", "gamingLaptop"]
    .indexOf(gespeicherterZustand.laptopStufe) + 1;
  zustand.ausruestung.unterrichtsstoff = ["folien", "skripte", "fachbuecher", "onlineKurse"]
    .indexOf(gespeicherterZustand.lehrmittelStufe) + 1;
  zustand.ausruestung.accessoires = gespeicherterZustand.equipment?.monitor ? 3 : 1;
}
if (gespeicherterZustand && gespeicherterZustand.willkommensShopAbgeschlossen === undefined) {
  zustand.willkommensShopAbgeschlossen = true;
}
if (zustand.aktiverBoost && !zustand.aktiverBoost.multiplikator) {
  zustand.aktiverBoost = null;
}
if (
  gespeicherterZustand
  && zustand.semester === 1
  && !zustand.semesterLaeuft
  && zustand.ausgewaehlteKurse.length === 0
  && zustand.willkommensShopAbgeschlossen
) {
  zustand.willkommensShopAbgeschlossen = false;
}
zustand.spielGestartet = hatSpielstand;
zustand.semesterLaeuft = Boolean(gespeicherterZustand?.semesterLaeuft);
if (!gespeicherterZustand) {
  zustand.geld = startguthaben;
}

const wissensPunkte = document.getElementById("wissens-punkte");
const geld = document.getElementById("geld");
const semesterAnzeige = document.getElementById("semester");
const pruefungsziel = document.getElementById("pruefungsziel");
const countdown = document.getElementById("countdown");
const fortschrittsbalken = document.querySelector(".fortschrittsbalken");
const fortschritt = document.getElementById("fortschritt");
const pruefungsMeldung = document.getElementById("pruefungs-meldung");
const passivText = document.getElementById("passiv-text");
const lernenKnopf = document.getElementById("lernen-knopf");
const jobbenKnopf = document.getElementById("jobben-knopf");
const bibliothekKaufen = document.getElementById("bibliothek-kaufen");
const lerngruppenraumKaufen = document.getElementById("lerngruppenraum-kaufen");
const cafeKaufen = document.getElementById("cafe-kaufen");
const hoersaalKaufen = document.getElementById("hoersaal-kaufen");
const bibliothekTab = document.getElementById("tab-bibliothek");
const wgTab = document.getElementById("tab-wg");
const wgRaum = document.getElementById("raum-wg");
const bibliothekRaum = document.getElementById("raum-bibliothek");
const lerngruppenraumTab = document.getElementById("tab-lerngruppenraum");
const cafeTab = document.getElementById("tab-cafe");
const hoersaalTab = document.getElementById("tab-hoersaal");
const lerngruppenraumRaum = document.getElementById("raum-lerngruppenraum");
const cafeRaum = document.getElementById("raum-cafe");
const hoersaalRaum = document.getElementById("raum-hoersaal");
const meldung = document.getElementById("meldung");
const boostCountdown = document.getElementById("boost-countdown");
const boostsTab = document.getElementById("tab-boosts");
const equipmentTab = document.getElementById("tab-equipment");
const boostsPanel = document.getElementById("shop-boosts");
const equipmentPanel = document.getElementById("shop-equipment");
const ausruestungsKarten = document.getElementById("ausruestungs-karten");
const resetKnopf = document.getElementById("reset-knopf");
const planungOverlay = document.getElementById("planung-overlay");
const planungTitel = document.getElementById("planung-titel");
const planungGeld = document.getElementById("planung-geld");
const fachKarten = document.getElementById("fach-karten");
const planungWissen = document.getElementById("planung-wissen");
const planungEcts = document.getElementById("planung-ects");
const planungGebuehr = document.getElementById("planung-gebuehr");
const planungFehlermeldung = document.getElementById("planung-fehlermeldung");
const semesterStartenKnopf = document.getElementById("semester-starten-knopf");
const jobbenPlanungKnopf = document.getElementById("jobben-planung-knopf");
const lernenErtrag = document.getElementById("lernen-ertrag");
const jobbenErtrag = document.getElementById("jobben-ertrag");
const darkmodeKnopf = document.getElementById("darkmode-knopf");

const semesterDauer = 300;
const boostDaten = {
  kaffee: { name: "Kaffee", preis: 25, dauer: 20, multiplikator: 1.5 },
  clubMate: { name: "Club-Mate", preis: 50, dauer: 30, multiplikator: 3 },
  energyDrink: { name: "Energy Drink", preis: 100, dauer: 60, multiplikator: 5 }
};
const ausruestungsDaten = {
  pc: {
    name: "PC", symbol: "💻", wirkung: "Wissen pro Klick",
    stufen: [
      { name: "Schul-Notebook", preis: 0, effekt: 0 },
      { name: "Gebrauchtes Notebook", preis: 250, effekt: 25 },
      { name: "Studi-Notebook", preis: 500, effekt: 60 },
      { name: "Gaming-Laptop", preis: 900, effekt: 120 }
    ]
  },
  tisch: {
    name: "Tisch", symbol: "🪑", wirkung: "Wissen pro Klick",
    stufen: [
      { name: "Küchentisch", preis: 0, effekt: 0 },
      { name: "Einfacher Schreibtisch", preis: 80, effekt: 5 },
      { name: "Höhenverstellbarer Tisch", preis: 250, effekt: 12 },
      { name: "Profi-Arbeitsplatz", preis: 600, effekt: 25 }
    ]
  },
  musikanlage: {
    name: "Musikanlage", symbol: "🎧", wirkung: "Boost-Dauer",
    stufen: [
      { name: "Keine (Stille)", preis: 0, effekt: 0 },
      { name: "Billige Kopfhörer", preis: 60, effekt: 10 },
      { name: "Gute Lautsprecher", preis: 200, effekt: 25 },
      { name: "Noise-Cancelling + Hi-Fi", preis: 500, effekt: 50 }
    ]
  },
  unterrichtsstoff: {
    name: "Unterrichtsstoff", symbol: "📚", wirkung: "Wissen pro Klick",
    stufen: [
      { name: "Nur Folien", preis: 0, effekt: 0 },
      { name: "Skripte", preis: 100, effekt: 1 },
      { name: "Fachbücher-Set", preis: 250, effekt: 2 },
      { name: "Online-Kurse Premium", preis: 450, effekt: 4 }
    ]
  },
  accessoires: {
    name: "Accessoires", symbol: "🖥️", wirkung: "CHF pro Klick",
    stufen: [
      { name: "Kein Zubehör", preis: 0, effekt: 0 },
      { name: "Monitor", preis: 120, effekt: 1 },
      { name: "2. Monitor", preis: 300, effekt: 2 },
      { name: "Curved-Bildschirm", preis: 700, effekt: 4 }
    ]
  }
};
const ausruestungsKategorien = Object.keys(ausruestungsDaten);
let willkommensAuswahl = { ...grundausstattung };
const semesterGebuehr = 1000;
const wiederholungsGebuehr = 500;
const faecherProSemester = [
  [
    { name: "Musterlogik", wahlpflicht: true, wissen: 180, ects: 8 },
    { name: "Digitale Welten", wahlpflicht: true, wissen: 140, ects: 4 },
    { name: "Zahlen und Zufall", wahlpflicht: true, wissen: 120, ects: 3 },
    { name: "Ideenwerkstatt", wahlpflicht: true, wissen: 160, ects: 5 },
    { name: "Datenfantasie", wahlpflicht: true, wissen: 130, ects: 3 },
    { name: "Team und Gesellschaft", wahlpflicht: true, wissen: 80, ects: 4 },
    { name: "Sprachlabor", wahlfach: true, wissen: 70, ects: 3 },
    { name: "Projektatelier", wahlfach: true, wissen: 60, ects: 3 },
    { name: "Kreatives Denken", wahlfach: true, wissen: 110, ects: 2 },
    { name: "Medien und Wirkung", wahlfach: true, wissen: 100, ects: 2 },
    { name: "Alltagsforschung", wahlfach: true, wissen: 130, ects: 2 },
    { name: "Lernmethoden", wahlfach: true, wissen: 90, ects: 2 }
  ],
  [
    { name: "Logik der Systeme", wahlpflicht: true, wissen: 220, ects: 8 },
    { name: "Verborgene Muster", wahlpflicht: true, wissen: 190, ects: 3 },
    { name: "Statistik der Möglichkeiten", wahlpflicht: true, wissen: 180, ects: 3 },
    { name: "Klang und Struktur", wahlpflicht: true, wissen: 260, ects: 6 },
    { name: "Programmierte Ideen", wahlpflicht: true, wissen: 230, ects: 3 },
    { name: "Bilder und Bedeutung", wahlpflicht: true, wissen: 150, ects: 2 },
    { name: "Fremde Sprachen", wahlfach: true, wissen: 90, ects: 3 },
    { name: "Datenküche", wahlfach: true, wissen: 210, ects: 2 },
    { name: "Räume im Kopf", wahlfach: true, wissen: 170, ects: 2 },
    { name: "Entscheidungen und Folgen", wahlfach: true, wissen: 240, ects: 2 },
    { name: "Farben der Zukunft", wahlfach: true, wissen: 140, ects: 2 },
    { name: "Offenes Projekt II", wahlfach: true, wissen: 120, ects: 1 }
  ],
  [
    { name: "Komplexe Muster", wahlpflicht: true, wissen: 280, ects: 4 },
    { name: "Datenströme und Deutung", wahlpflicht: true, wissen: 330, ects: 7 },
    { name: "Kräfte im Alltag", wahlpflicht: true, wissen: 220, ects: 3 },
    { name: "Dreidimensionale Ideen", wahlpflicht: true, wissen: 260, ects: 3 },
    { name: "Interaktive Geschichten", wahlpflicht: true, wissen: 300, ects: 5 },
    { name: "Zukunft und Verantwortung", wahlpflicht: true, wissen: 180, ects: 2 },
    { name: "Praktische Experimente", wahlfach: true, wissen: 250, ects: 5 },
    { name: "Freies Forschungsfeld", wahlfach: true, wissen: 120, ects: 1 },
    { name: "Sprache und Kultur III", wahlfach: true, wissen: 100, ects: 3 },
    { name: "Licht und Bewegung", wahlfach: true, wissen: 290, ects: 5 },
    { name: "Qualität von Wissen", wahlfach: true, wissen: 200, ects: 2 },
    { name: "Bauen mit Gedanken", wahlfach: true, wissen: 240, ects: 2 }
  ],
  [
    { name: "Weltmodelle", wahlpflicht: true, wissen: 360, ects: 5 },
    { name: "Bilder sehen lernen", wahlpflicht: true, wissen: 380, ects: 4 },
    { name: "Regeln der digitalen Welt", wahlpflicht: true, wissen: 180, ects: 2 },
    { name: "Virtuelle Formen", wahlpflicht: true, wissen: 270, ects: 3 },
    { name: "Programmierte Räume", wahlpflicht: true, wissen: 320, ects: 3 },
    { name: "Austausch von Ideen", wahlpflicht: true, wissen: 250, ects: 3 },
    { name: "Projekte bewegen", wahlfach: true, wissen: 200, ects: 3 },
    { name: "Eigenes Profil", wahlfach: true, wissen: 430, ects: 6 },
    { name: "Fliegende Perspektiven", wahlfach: true, wissen: 300, ects: 2 },
    { name: "Digitale Zwillinge", wahlfach: true, wissen: 290, ects: 2 },
    { name: "Bilder aus der Ferne", wahlfach: true, wissen: 340, ects: 2 },
    { name: "Netze und Verbindungen", wahlfach: true, wissen: 310, ects: 2 }
  ],
  [
    { name: "Fernblick und Nähe", wahlpflicht: true, wissen: 430, ects: 4 },
    { name: "Vertiefungsprofil", wahlpflicht: true, wissen: 620, ects: 9 },
    { name: "Gesetze der Zukunft", wahlpflicht: true, wissen: 200, ects: 2 },
    { name: "Künstliche Gedanken", wahlpflicht: true, wissen: 520, ects: 3 },
    { name: "Projekte leiten II", wahlpflicht: true, wissen: 300, ects: 4 },
    { name: "Forschung im Feld", wahlpflicht: true, wissen: 400, ects: 5 },
    { name: "Freies Forschungsfeld II", wahlfach: true, wissen: 180, ects: 2 },
    { name: "Digitale Fantasien", wahlfach: true, wissen: 350, ects: 3 },
    { name: "Zeit und Veränderung", wahlfach: true, wissen: 390, ects: 2 },
    { name: "Wissensnetzwerke", wahlfach: true, wissen: 410, ects: 2 },
    { name: "Angewandte Bilder", wahlfach: true, wissen: 360, ects: 2 },
    { name: "Portfolio der Möglichkeiten", wahlfach: true, wissen: 230, ects: 2 }
  ],
  [
    { name: "Die grosse Abschlussidee", wahlpflicht: true, wissen: 900, ects: 12 },
    { name: "Projekte leiten III", wahlpflicht: true, wissen: 300, ects: 2 },
    { name: "Eigenes Profil III", wahlpflicht: true, wissen: 700, ects: 6 },
    { name: "Möglichkeiten gestalten", wahlpflicht: true, wissen: 450, ects: 4 },
    { name: "Komplexe Fantasien", wahlpflicht: true, wissen: 420, ects: 4 },
    { name: "Fernblick-Projekt", wahlpflicht: true, wissen: 480, ects: 4 },
    { name: "Praxisprojekt Zukunft", wahlfach: true, wissen: 650, ects: 5 },
    { name: "Abschlusskolloquium", wahlfach: true, wissen: 560, ects: 3 },
    { name: "Offenes Wissensprojekt", wahlfach: true, wissen: 390, ects: 2 },
    { name: "Unternehmertum und Ideen", wahlfach: true, wissen: 300, ects: 2 },
    { name: "Start ins Berufsleben", wahlfach: true, wissen: 240, ects: 2 },
    { name: "Wissen veröffentlichen", wahlfach: true, wissen: 330, ects: 2 }
  ]
];

function formatierteZeit(sekunden) {
  const minuten = Math.floor(sekunden / 60);
  const restSekunden = sekunden % 60;
  return `${String(minuten).padStart(2, "0")}:${String(restSekunden).padStart(2, "0")}`;
}

function formatierteZahl(wert) {
  return String(Number(wert.toFixed(2)));
}

function semesterMultiplikator() {
  return Math.pow(1.5, zustand.semester - 1);
}

function preisFuerAusrüstung(stufe) {
  return stufe.preis * semesterMultiplikator();
}

function aktualisiereStartboni() {
  zustand.pcWissensBonus = ausruestungsDaten.pc.stufen[zustand.ausruestung.pc - 1].effekt / 100;
  zustand.pcGeldBonus = 0;
  zustand.lehrmittelBonus = ausruestungsDaten.unterrichtsstoff.stufen[zustand.ausruestung.unterrichtsstoff - 1].effekt;
}

function raumWissensBonus() {
  let bonus = 0;
  if (zustand.bibliothekFreigeschaltet) bonus += 0.2;
  if (zustand.lerngruppenraumFreigeschaltet) bonus += 0.3;
  if (zustand.hoersaalFreigeschaltet) bonus += 0.5;
  return bonus;
}

function raumGeldBonus() {
  return zustand.cafeFreigeschaltet ? 0.5 : 0;
}

function boostMultiplikator() {
  return zustand.aktiverBoost ? zustand.aktiverBoost.multiplikator : 1;
}

function aktuellerWissensProKlick() {
  const unterrichtsstoff = ausruestungsDaten.unterrichtsstoff.stufen[zustand.ausruestung.unterrichtsstoff - 1].effekt;
  const pcBonus = ausruestungsDaten.pc.stufen[zustand.ausruestung.pc - 1].effekt / 100;
  const tischBonus = ausruestungsDaten.tisch.stufen[zustand.ausruestung.tisch - 1].effekt / 100;
  return (1 + unterrichtsstoff) * (1 + pcBonus + tischBonus + raumWissensBonus()) * boostMultiplikator();
}

function aktuellesGeldProKlick() {
  const accessoires = ausruestungsDaten.accessoires.stufen[zustand.ausruestung.accessoires - 1].effekt;
  return (1 + accessoires) * (1 + raumGeldBonus());
}

function effektAnzeige(kategorie, effekt) {
  if (kategorie === "musikanlage") return `+${effekt} % Boost-Dauer`;
  if (kategorie === "unterrichtsstoff") return `+${effekt} Wissen pro Klick`;
  if (kategorie === "accessoires") return `+${effekt} CHF pro Klick`;
  return `+${effekt} % Wissen pro Klick`;
}

function zeigeStufenShop() {
  ausruestungsKarten.innerHTML = ausruestungsKategorien.map(function (kategorie) {
    const daten = ausruestungsDaten[kategorie];
    const aktuelleStufe = zustand.ausruestung[kategorie];
    const aktuelleDaten = daten.stufen[aktuelleStufe - 1];
    const naechsteDaten = daten.stufen[aktuelleStufe];
    const upgradeGesperrt = zustand.semester === 1 && aktuelleStufe >= 2 && naechsteDaten;
    const differenzpreis = naechsteDaten
      ? preisFuerAusrüstung(naechsteDaten) - preisFuerAusrüstung(aktuelleDaten)
      : 0;
    const buttonText = upgradeGesperrt
      ? "Ab Semester 2 verfügbar"
      : naechsteDaten ? `${formatierteZahl(differenzpreis)} CHF` : "Maximale Stufe erreicht";
    const effektText = naechsteDaten
      ? `${naechsteDaten.name}: ${effektAnzeige(kategorie, naechsteDaten.effekt)}`
      : `Aktuell: ${aktuelleDaten.name}`;
    return `
      <article class="ausruestungs-karte">
        <div class="ausruestungs-kopf">
          <div class="artikel-symbol">${daten.symbol}</div>
          <h3>${daten.name}</h3>
        </div>
        <p class="ausruestungs-stufe">Stufe ${aktuelleStufe} / 4</p>
        <div class="stufenbalken" aria-label="Stufe ${aktuelleStufe} von 4">
          ${daten.stufen.map(function (_, index) {
            return `<span class="stufen-segment${index < aktuelleStufe ? " gefuellt" : ""}"></span>`;
          }).join("")}
        </div>
        <div class="artikel-info"><p>${effektText}</p></div>
        <button class="kaufen-knopf ausruestung-kaufen" data-kategorie="${kategorie}" ${!naechsteDaten || upgradeGesperrt || zustand.geld < differenzpreis ? "disabled" : ""}>${buttonText}</button>
      </article>
    `;
  }).join("");

  ausruestungsKarten.querySelectorAll(".ausruestung-kaufen").forEach(function (knopf) {
    knopf.addEventListener("click", function () {
      kaufeAusrüstung(knopf.dataset.kategorie);
    });
  });
}

function aktuelleSemesterGebuehr() {
  const grundgebuehr = zustand.wiederholung ? wiederholungsGebuehr : semesterGebuehr;
  return grundgebuehr * semesterMultiplikator();
}

function aktualisierePlanung() {
  const ausgewaehlteKarten = document.querySelectorAll(".fach-karte.gewaehlt");
  const ausgewaehlteWahlpflicht = document.querySelectorAll(".fach-karte.gewaehlt[data-kategorie='wahlpflicht']");
  let wissen = 0;
  let ects = 0;

  ausgewaehlteKarten.forEach(function (karte) {
    wissen += Number(karte.dataset.wissen);
    ects += Number(karte.dataset.ects);
  });

  const gebuehr = aktuelleSemesterGebuehr();
  const fehlendesGeld = Math.max(0, gebuehr - zustand.geld);
  const wissensziel = zustand.wiederholung
    ? zustand.pruefungsSchwelle
    : zustand.pruefungsSchwelle + wissen;
  planungGeld.textContent = `${formatierteZahl(zustand.geld)} CHF`;
  planungWissen.textContent = formatierteZahl(wissensziel);
  planungEcts.textContent = ects;
  planungGebuehr.textContent = `${formatierteZahl(gebuehr)} CHF`;
  semesterStartenKnopf.disabled = ausgewaehlteKarten.length < 6
    || ausgewaehlteKarten.length > 9
    || ausgewaehlteWahlpflicht.length < 4
    || fehlendesGeld > 0;

  if (fehlendesGeld > 0) {
    planungFehlermeldung.textContent = `Es fehlen ${formatierteZahl(fehlendesGeld)} CHF, geh jobben`;
  } else if (ausgewaehlteWahlpflicht.length < 4) {
    planungFehlermeldung.textContent = `Wähle noch ${4 - ausgewaehlteWahlpflicht.length} Wahlpflichtfächer.`;
  } else if (ausgewaehlteKarten.length < 6) {
    planungFehlermeldung.textContent = `Wähle noch ${6 - ausgewaehlteKarten.length} Fächer.`;
  } else {
    planungFehlermeldung.textContent = "";
  }

  document.querySelectorAll(".fach-karte").forEach(function (karte) {
    karte.disabled = !karte.classList.contains("gewaehlt") && ausgewaehlteKarten.length >= 9;
  });
}

function oeffnePlanungsfenster() {
  const semesterIndex = zustand.semester - 1;
  const faecher = faecherProSemester[semesterIndex];
  let standardAuswahl = 0;
  planungTitel.textContent = `Semester ${zustand.semester} planen`;
  fachKarten.innerHTML = "";

  faecher.forEach(function (fach, index) {
    const karte = document.createElement("button");
    karte.className = "fach-karte";
    karte.dataset.index = index;
    karte.dataset.wissen = fach.wissen * semesterMultiplikator();
    karte.dataset.ects = fach.ects;
    karte.dataset.kategorie = fach.pflicht ? "pflicht" : fach.wahlpflicht ? "wahlpflicht" : "wahlfach";
    karte.type = "button";
    karte.innerHTML = `
      <span class="fach-typ">${fach.pflicht ? "Pflichtfach" : fach.wahlpflicht ? "Wahlpflichtfach" : "Wahlfach"}</span>
      <strong>${fach.name}</strong>
      <small>${formatierteZahl(fach.wissen * semesterMultiplikator())} Wissen · ${fach.ects} ECTS</small>
    `;

    if (fach.wahlpflicht && standardAuswahl < 6) {
      karte.classList.add("gewaehlt");
      standardAuswahl += 1;
    }

    karte.addEventListener("click", function () {
      karte.classList.toggle("gewaehlt");
      aktualisierePlanung();
    });

    fachKarten.appendChild(karte);
  });

  planungOverlay.hidden = false;
  aktualisierePlanung();
}

function willkommensAusgabenBerechnen() {
  return ausruestungsKategorien.reduce(function (summe, kategorie) {
    const stufe = willkommensAuswahl[kategorie];
    return summe + ausruestungsDaten[kategorie].stufen[stufe - 1].preis * 0.75;
  }, 0);
}

function zeigeWillkommensShop() {
  const ausgaben = willkommensAusgabenBerechnen();
  const gesamtpreis = ausruestungsKategorien.reduce(function (summe, kategorie) {
    const stufe = willkommensAuswahl[kategorie];
    return summe + ausruestungsDaten[kategorie].stufen[stufe - 1].preis;
  }, 0);
  const gesparterRabatt = gesamtpreis - ausgaben;

  willkommenBudget.textContent = `${formatierteZahl(zustand.geld - ausgaben)} CHF`;
  willkommenAusgaben.textContent = `${formatierteZahl(ausgaben)} CHF`;
  willkommenRabatt.textContent = `${formatierteZahl(gesparterRabatt)} CHF`;
  willkommenFehlermeldung.textContent = "";
  willkommenKategorien.innerHTML = ausruestungsKategorien.map(function (kategorie) {
    const daten = ausruestungsDaten[kategorie];
    const gewaehlteStufe = willkommensAuswahl[kategorie];
    return `
      <section class="willkommens-kategorie">
        <h2>${daten.symbol} ${daten.name}</h2>
        <div class="willkommens-stufen">
          ${daten.stufen.map(function (stufe, index) {
            const stufenNummer = index + 1;
            const rabattPreis = stufe.preis * 0.75;
            const klassen = [
              "willkommens-stufe",
              stufenNummer === gewaehlteStufe ? "gewaehlt" : "",
              stufenNummer < gewaehlteStufe ? "tiefer" : "",
              zustand.semester === 1 && stufenNummer > 2 ? "gesperrt" : ""
            ].join(" ");
            const wirkung = stufe.effekt === 0 ? "Kein Bonus" : effektAnzeige(kategorie, stufe.effekt);
            return `
              <button class="${klassen}" data-kategorie="${kategorie}" data-stufe="${stufenNummer}" type="button" ${zustand.semester === 1 && stufenNummer > 2 ? "disabled" : ""}>
                <strong>Stufe ${stufenNummer}</strong>
                <span>${stufe.name}</span>
                <em>${wirkung}</em>
                <small>${stufe.preis === 0 ? "0 CHF" : `<s>${formatierteZahl(stufe.preis)} CHF</s> ${formatierteZahl(rabattPreis)} CHF`}</small>
              </button>
            `;
          }).join("")}
        </div>
      </section>
    `;
  }).join("");

  willkommenKategorien.querySelectorAll(".willkommens-stufe").forEach(function (knopf) {
    knopf.addEventListener("click", function () {
      const kategorie = knopf.dataset.kategorie;
      const neueStufe = Number(knopf.dataset.stufe);
      const alteStufe = willkommensAuswahl[kategorie];
      willkommensAuswahl[kategorie] = neueStufe;
      if (willkommensAusgabenBerechnen() > zustand.geld) {
        willkommensAuswahl[kategorie] = alteStufe;
        willkommenFehlermeldung.textContent = "Diese Auswahl überschreitet dein verfügbares Budget.";
        return;
      }
      zeigeWillkommensShop();
    });
  });
  startOverlay.hidden = false;
}

function starteSemester() {
  const ausgewaehlteKarten = [...document.querySelectorAll(".fach-karte.gewaehlt")];
  const gebuehr = aktuelleSemesterGebuehr();

  if (ausgewaehlteKarten.length < 6 || ausgewaehlteKarten.length > 9 || zustand.geld < gebuehr) {
    return;
  }

  zustand.geld -= gebuehr;
  const wissenDiesesSemesters = ausgewaehlteKarten.reduce(function (summe, karte) {
    return summe + Number(karte.dataset.wissen);
  }, 0);
  if (!zustand.wiederholung) {
    zustand.pruefungsSchwelle += wissenDiesesSemesters;
  }
  zustand.semesterEcts = ausgewaehlteKarten.reduce(function (summe, karte) {
    return summe + Number(karte.dataset.ects);
  }, 0);
  zustand.ausgewaehlteKurse = ausgewaehlteKarten.map(function (karte) {
    return Number(karte.dataset.index);
  });
  zustand.verbleibendeSekunden = semesterDauer;
  if (zustand.semester === 1 && !zustand.willkommensShopAbgeschlossen) {
    planungOverlay.hidden = true;
    willkommensAuswahl = { ...grundausstattung };
    zeigeWillkommensShop();
    return;
  }
  zustand.semesterLaeuft = true;
  planungOverlay.hidden = true;
  planungFehlermeldung.textContent = "";
  zeigeZustand();
  speichereZustand();
}

willkommenStartKnopf.addEventListener("click", function () {
  const ausgaben = willkommensAusgabenBerechnen();
  if (ausgaben > zustand.geld) {
    willkommenFehlermeldung.textContent = "Diese Auswahl überschreitet dein verfügbares Budget.";
    return;
  }

  zustand.ausruestung = { ...willkommensAuswahl };
  zustand.geld -= ausgaben;
  zustand.willkommensShopAbgeschlossen = true;
  zustand.spielGestartet = true;
  zustand.semesterLaeuft = true;
  startOverlay.hidden = true;
  zeigeZustand();
  speichereZustand();
  zeigeMeldung("Willkommen! Dein erstes Semester beginnt.");
});

function speichereZustand() {
  localStorage.setItem("campusIdleZustand", JSON.stringify(zustand));
}

function aktualisiereDarkmodeKnopf() {
  const darkmodeAktiv = document.body.classList.contains("darkmodus");
  darkmodeKnopf.setAttribute("aria-pressed", String(darkmodeAktiv));
  darkmodeKnopf.textContent = darkmodeAktiv ? "☀️ Hellmodus" : "🌙 Darkmode";
}

darkmodeKnopf.addEventListener("click", function () {
  const darkmodeAktiv = document.body.classList.toggle("darkmodus");
  localStorage.setItem("campusIdleDarkmode", darkmodeAktiv ? "aktiv" : "inaktiv");
  aktualisiereDarkmodeKnopf();
});

if (gespeicherterZustand) {
  startOverlay.hidden = true;
  if (!zustand.studiumAbgeschlossen && !zustand.semesterLaeuft) {
    oeffnePlanungsfenster();
  }
} else {
  oeffnePlanungsfenster();
}

function zeigeZustand() {
  aktualisiereStartboni();
  wissensPunkte.textContent = Math.floor(zustand.wissen);
  geld.textContent = `${formatierteZahl(zustand.geld)} CHF`;
  const schwelle = zustand.pruefungsSchwelle;
  const vergangeneSekunden = semesterDauer - zustand.verbleibendeSekunden;
  const prozent = (vergangeneSekunden / semesterDauer) * 100;
  semesterAnzeige.textContent = `Semester ${zustand.semester} von 6`;
  pruefungsziel.textContent = `${schwelle} Wissen`;
  countdown.textContent = zustand.studiumAbgeschlossen ? "Fertig" : formatierteZeit(zustand.verbleibendeSekunden);
  fortschritt.style.width = `${zustand.studiumAbgeschlossen ? 100 : prozent}%`;
  fortschrittsbalken.setAttribute("aria-valuenow", vergangeneSekunden);
  passivText.textContent = `+${formatierteZahl(aktuellerWissensProKlick())} Wissen pro Klick · +${formatierteZahl(aktuellesGeldProKlick())} CHF pro Klick`;
  lernenErtrag.textContent = `+${formatierteZahl(aktuellerWissensProKlick())} Wissen pro Klick`;
  jobbenErtrag.textContent = `+${formatierteZahl(aktuellesGeldProKlick())} CHF pro Klick`;
  jobbenPlanungKnopf.textContent = `💼 Jobben (+${formatierteZahl(aktuellesGeldProKlick())} CHF)`;
  bibliothekKaufen.disabled = zustand.bibliothekFreigeschaltet || zustand.geld < 150;
  lerngruppenraumKaufen.disabled = zustand.lerngruppenraumFreigeschaltet || zustand.geld < 300;
  cafeKaufen.disabled = zustand.cafeFreigeschaltet || zustand.geld < 500;
  hoersaalKaufen.disabled = zustand.hoersaalFreigeschaltet || zustand.geld < 800;
  boostCountdown.textContent = zustand.aktiverBoost
    ? `${zustand.aktiverBoost.name}: noch ${formatierteZeit(zustand.aktiverBoost.verbleibendeSekunden)}`
    : "";

  if (zustand.bibliothekFreigeschaltet) {
    bibliothekTab.disabled = false;
    bibliothekTab.classList.remove("gesperrt");
    bibliothekKaufen.textContent = "Freigeschaltet";
  }
  if (zustand.lerngruppenraumFreigeschaltet) {
    lerngruppenraumTab.disabled = false;
    lerngruppenraumTab.classList.remove("gesperrt");
    lerngruppenraumKaufen.textContent = "Freigeschaltet";
  }
  if (zustand.cafeFreigeschaltet) {
    cafeTab.disabled = false;
    cafeTab.classList.remove("gesperrt");
    cafeKaufen.textContent = "Freigeschaltet";
  }
  if (zustand.hoersaalFreigeschaltet) {
    hoersaalTab.disabled = false;
    hoersaalTab.classList.remove("gesperrt");
    hoersaalKaufen.textContent = "Freigeschaltet";
  }

  document.querySelectorAll(".boost-kaufen").forEach(function (knopf) {
    const boost = boostDaten[knopf.dataset.boost];
    knopf.disabled = Boolean(zustand.aktiverBoost) || zustand.geld < boost.preis;
  });

  zeigeStufenShop();
}

function pruefeSemester() {
  const schwelle = zustand.pruefungsSchwelle;

  if (zustand.wissen >= schwelle) {
    zustand.gesamtEcts += zustand.semesterEcts;
    if (zustand.semester < 6) {
      zustand.semester += 1;
      zustand.semesterLaeuft = false;
      zustand.wiederholung = false;
      pruefungsMeldung.textContent = `Prüfung bestanden! Willkommen im Semester ${zustand.semester}.`;
      oeffnePlanungsfenster();
    } else {
      if (zustand.gesamtEcts >= 180) {
        zustand.studiumAbgeschlossen = true;
        zustand.semesterLaeuft = false;
        pruefungsMeldung.textContent = "Bachelorstudium abgeschlossen! Glückwunsch!";
      } else {
        zustand.semesterLaeuft = false;
        zustand.wiederholung = true;
        pruefungsMeldung.textContent = `Es fehlen noch ${180 - zustand.gesamtEcts} ECTS.`;
        oeffnePlanungsfenster();
      }
    }
  } else {
    zustand.semesterLaeuft = false;
    zustand.wiederholung = true;
    pruefungsMeldung.textContent = `Prüfung nicht bestanden. Du wiederholst Semester ${zustand.semester}.`;
    oeffnePlanungsfenster();
  }

  if (!zustand.studiumAbgeschlossen) {
    zustand.verbleibendeSekunden = semesterDauer;
  }
  zeigeZustand();
  aktualisiereDarkmodeKnopf();
  speichereZustand();
}

function zeigeMeldung(text) {
  meldung.textContent = text;
  window.setTimeout(function () {
    meldung.textContent = "";
  }, 2500);
}

function kaufeBoost(boostName) {
  const boost = boostDaten[boostName];

  if (zustand.aktiverBoost || zustand.geld < boost.preis) {
    return;
  }

  zustand.geld -= boost.preis;
  zustand.aktiverBoost = {
    name: boost.name,
    multiplikator: boost.multiplikator,
    verbleibendeSekunden: boost.dauer * (1 + ausruestungsDaten.musikanlage.stufen[zustand.ausruestung.musikanlage - 1].effekt / 100)
  };
  zeigeZustand();
  speichereZustand();
  zeigeMeldung(`${boost.name} ist aktiv!`);
}

function kaufeAusrüstung(kategorie) {
  const daten = ausruestungsDaten[kategorie];
  const aktuelleStufe = zustand.ausruestung[kategorie];
  const aktuelleDaten = daten.stufen[aktuelleStufe - 1];
  const naechsteDaten = daten.stufen[aktuelleStufe];

  if (!naechsteDaten || (zustand.semester === 1 && aktuelleStufe >= 2)) {
    return;
  }

  const differenzpreis = preisFuerAusrüstung(naechsteDaten) - preisFuerAusrüstung(aktuelleDaten);
  if (zustand.geld < differenzpreis) {
    return;
  }

  zustand.geld -= differenzpreis;
  zustand.ausruestung[kategorie] += 1;
  zeigeZustand();
  speichereZustand();
  zeigeMeldung(`${naechsteDaten.name} ist jetzt deine aktuelle Stufe.`);
}

lernenKnopf.addEventListener("click", function () {
  zustand.wissen += aktuellerWissensProKlick();
  zeigeZustand();
  speichereZustand();
});

function jobben() {
  zustand.geld += aktuellesGeldProKlick();
  zeigeZustand();
  aktualisierePlanung();
  speichereZustand();
}

jobbenKnopf.addEventListener("click", jobben);
jobbenPlanungKnopf.addEventListener("click", jobben);

function kaufeRaum(eigenschaft, preis, name) {
  if (zustand[eigenschaft]) {
    return;
  }

  if (zustand.geld < preis) {
    zeigeMeldung(`Du brauchst noch mehr Geld für den ${name}.`);
    return;
  }

  zustand.geld -= preis;
  zustand[eigenschaft] = true;
  zeigeZustand();
  speichereZustand();
  zeigeMeldung(`${name} ist jetzt freigeschaltet!`);
}

bibliothekKaufen.addEventListener("click", function () {
  kaufeRaum("bibliothekFreigeschaltet", 150, "Bibliothek");
});

lerngruppenraumKaufen.addEventListener("click", function () {
  kaufeRaum("lerngruppenraumFreigeschaltet", 300, "Lerngruppen-Raum");
});

cafeKaufen.addEventListener("click", function () {
  kaufeRaum("cafeFreigeschaltet", 500, "Café");
});

hoersaalKaufen.addEventListener("click", function () {
  kaufeRaum("hoersaalFreigeschaltet", 800, "Hörsaal");
});

function zeigeRaum(raum, tab) {
  wgRaum.hidden = raum !== wgRaum;
  bibliothekRaum.hidden = raum !== bibliothekRaum;
  lerngruppenraumRaum.hidden = raum !== lerngruppenraumRaum;
  cafeRaum.hidden = raum !== cafeRaum;
  hoersaalRaum.hidden = raum !== hoersaalRaum;
  wgTab.classList.toggle("aktiv", tab === wgTab);
  bibliothekTab.classList.toggle("aktiv", tab === bibliothekTab);
  lerngruppenraumTab.classList.toggle("aktiv", tab === lerngruppenraumTab);
  cafeTab.classList.toggle("aktiv", tab === cafeTab);
  hoersaalTab.classList.toggle("aktiv", tab === hoersaalTab);
  wgTab.setAttribute("aria-selected", tab === wgTab);
  bibliothekTab.setAttribute("aria-selected", tab === bibliothekTab);
  lerngruppenraumTab.setAttribute("aria-selected", tab === lerngruppenraumTab);
  cafeTab.setAttribute("aria-selected", tab === cafeTab);
  hoersaalTab.setAttribute("aria-selected", tab === hoersaalTab);
}

wgTab.addEventListener("click", function () {
  zeigeRaum(wgRaum, wgTab);
});

bibliothekTab.addEventListener("click", function () {
  if (zustand.bibliothekFreigeschaltet) {
    zeigeRaum(bibliothekRaum, bibliothekTab);
  }
});

lerngruppenraumTab.addEventListener("click", function () {
  if (zustand.lerngruppenraumFreigeschaltet) {
    zeigeRaum(lerngruppenraumRaum, lerngruppenraumTab);
  }
});

cafeTab.addEventListener("click", function () {
  if (zustand.cafeFreigeschaltet) {
    zeigeRaum(cafeRaum, cafeTab);
  }
});

hoersaalTab.addEventListener("click", function () {
  if (zustand.hoersaalFreigeschaltet) {
    zeigeRaum(hoersaalRaum, hoersaalTab);
  }
});

function zeigeShopKategorie(panel, tab) {
  boostsPanel.hidden = panel !== boostsPanel;
  equipmentPanel.hidden = panel !== equipmentPanel;
  boostsTab.classList.toggle("aktiv", tab === boostsTab);
  equipmentTab.classList.toggle("aktiv", tab === equipmentTab);
  boostsTab.setAttribute("aria-selected", tab === boostsTab);
  equipmentTab.setAttribute("aria-selected", tab === equipmentTab);
}

boostsTab.addEventListener("click", function () {
  zeigeShopKategorie(boostsPanel, boostsTab);
});

equipmentTab.addEventListener("click", function () {
  zeigeShopKategorie(equipmentPanel, equipmentTab);
});

document.querySelectorAll(".boost-kaufen").forEach(function (knopf) {
  knopf.addEventListener("click", function () {
    kaufeBoost(knopf.dataset.boost);
  });
});

function setzeSpielstandZurueck() {
  localStorage.removeItem("campusIdleZustand");
  zustand.wissen = 0;
  zustand.geld = 0;
  zustand.bibliothekFreigeschaltet = false;
  zustand.lerngruppenraumFreigeschaltet = false;
  zustand.cafeFreigeschaltet = false;
  zustand.hoersaalFreigeschaltet = false;
  zustand.semester = 1;
  zustand.verbleibendeSekunden = semesterDauer;
  zustand.studiumAbgeschlossen = false;
  zustand.ausruestung = { ...grundausstattung };
  zustand.aktiverBoost = null;
  zustand.spielGestartet = false;
  zustand.pcWissensBonus = 0;
  zustand.pcGeldBonus = 0;
  zustand.lehrmittelBonus = 0;
  zustand.semesterLaeuft = false;
  zustand.pruefungsSchwelle = 0;
  zustand.semesterEcts = 0;
  zustand.gesamtEcts = 0;
  zustand.wiederholung = false;
  zustand.ausgewaehlteKurse = [];
  zustand.geld = startguthaben;
  zustand.willkommensShopAbgeschlossen = false;
  startOverlay.hidden = true;
  planungOverlay.hidden = true;
  zeigeZustand();
  oeffnePlanungsfenster();
}

resetKnopf.addEventListener("click", setzeSpielstandZurueck);
semesterStartenKnopf.addEventListener("click", starteSemester);

// Jede Sekunde laufen nur der Semester-Timer und aktive Boosts weiter.
window.setInterval(function () {
  if (!zustand.spielGestartet || !zustand.semesterLaeuft) {
    return;
  }

  if (zustand.aktiverBoost) {
    zustand.aktiverBoost.verbleibendeSekunden -= 1;
    if (zustand.aktiverBoost.verbleibendeSekunden <= 0) {
      zustand.aktiverBoost = null;
    }
  }
  if (!zustand.studiumAbgeschlossen) {
    zustand.verbleibendeSekunden -= 1;
  }

  if (!zustand.studiumAbgeschlossen && zustand.verbleibendeSekunden === 0) {
    pruefeSemester();
  } else {
    zeigeZustand();
    speichereZustand();
  }
}, 1000);

zeigeZustand();
