# Prompt-Log

> **Ihr KI-Journal.** Halten Sie hier **jeden** KI-Einsatz fest – kurz, aber ehrlich.
> Das Prompt-Log ist Teil der Bewertung. Am wichtigsten ist die letzte Zeile:
> **Was habe ich selbst geprüft, geändert oder verworfen?**
>
> **Modus:** Browser-Chat · Ask · Inline-Chat · Agent · Cloud-Agent
>
> Diese Datei schreiben Sie selbst – nicht die KI.

## Vorlage (kopieren für jeden neuen Eintrag)

```
### #N · Tag X
Ziel:      Was wollte ich erreichen?
Modus:     Welcher KI-Modus / welches Werkzeug?
Prompt:    (kurz, oder die wichtigste Zeile)
Ergebnis:  Was kam heraus – brauchbar?
Korrektur: Was habe ich geprüft, geändert, verworfen?
```

---

## Einträge

## Einträge

### #1 · Tag 1
Ziel:      Passende Projektidee für eine kleine Webseite finden (3 Nachmittage, keine Programmiererfahrung).
Modus:     Browser-Chat (Claude)
Prompt:    "Ich muss in einem Wahlfach eine Webseite mittels AI coden und suche Ideen." Danach eingegrenzt auf Spiele, Design und "Idle-Spiel Thema Studium für PC".
Ergebnis:  Ideenlisten und ein Konzept für ein Idle-Spiel mit Räumen und Shop. Brauchbar.
Korrektur: Aus vielen Ideen das Idle-Spiel gewählt, weil es kreativ ist und zu meinem Alltag passt. Häufige Ideen wie Wordle, Snake und Memory verworfen.

### #2 · Tag 1
Ziel:      Spielablauf festlegen: zwei Buttons (Lernen, Jobben), Bachelor mit Prüfungen, Startfenster, Semesterplanung mit Gebühr.
Modus:     Browser-Chat (Claude), danach Agent (VS Code Copilot)
Prompt:    "Zwei Buttons, mit Geld Räume und Boosts kaufen, Prüfungen mit nötigen Wissenspunkten. Vor jedem Semester Stundenplan wählen, Semestergebühr, ohne Bonusgeld."
Ergebnis:  Konzept mit Fächertabellen, Gebühren und fertigen Prompts. Prompt 1–3 im Agent ausgeführt, das Grundspiel lief.
Korrektur: Bonusgeld bewusst gestrichen, damit Geld nur durch Jobben kommt. Fächerwerte sind Startwerte und müssen durch Testspielen angepasst werden.

### #3 · Tag 1
Ziel:      Shop mit 5 Kategorien (PC, Tisch, Musikanlage, Unterrichtsstoff, Accessoires) mit je 4 Stufen und Fortschrittsbalken, dazu ein Willkommensshop im 1. Semester.
Modus:     Browser-Chat (Claude, inkl. grafischer Entwurf), Agent (VS Code Copilot)
Prompt:    "Baue den Shop-Reiter 'Ausrüstung' um: 5 Kategorien, 4 Stufen, Balken 1–4. Danach: erst Semesterplanung, dann einmaliger Willkommensshop mit 25 % Rabatt und 1750 CHF Startguthaben."
Ergebnis:  Shop und Willkommensfenster umgesetzt. Der Agent fragte die Preistabellen nach, weil sie im Prompt fehlten.
Korrektur: Tabellen selbst nachgeliefert. Entwurf des Fensters als Vorlage für das Design genommen. Kauf, Balken, Speicherung und Reset getestet.

### #4 · Tag 1
Ziel:      Spiel auf reines Klick-Spiel umstellen (kein passives Einkommen), Timer 5 Minuten.
Modus:     Browser-Chat (Claude), Agent (VS Code Copilot)
Prompt:    "Keine automatischen Einnahmen mehr. Wissen pro Klick = (1 + Unterrichtsstoff) × (1 + PC + Tisch + Raumbonus) × Boost. Timer 300 Sekunden, startet erst nach 'Semester starten'."
Ergebnis:  Neue Klickformeln, Raumboni, Wert pro Klick auf den Buttons, Timer nur im aktiven Semester.
Korrektur: Selbst getestet, dass sich ohne Klicken nichts verändert und der Timer erst nach dem Start läuft.

### #5 · Tag 1
Ziel:      Layout, Balancing und Darkmode: Räume aus dem Shop nehmen, Kaufbutton direkt in der Raumkarte, Darkmode-Button, Kosten pro Semester um 50 % steigern, im 1. Semester nur Stufe 2 kaufbar.
Modus:     Agent (VS Code Copilot)
Prompt:    "Die Räume sollen nicht im Shop aufgelistet sein. Mach einen Button für den Darkmode. Erhöhe die Kosten pro Semester um 50 %. Im ersten Semester nur Stufe 2 kaufbar." (teils mit Screenshot)
Ergebnis:  Alles umgesetzt. Bei der 50-%-Steigerung fragte der Agent nach, was gemeint ist, weil mein Prompt unklar war. Ich wählte Gebühr, Wissen und Upgrade-Preise.
Korrektur: Anzeige und Funktionen im Browser kontrolliert. Mit Screenshot gezeigt, welchen Bereich ich entfernen will. Werte beim Durchspielen noch zu prüfen.

### #6 · Tag 1
Ziel:      Fehler beheben: Club-Mate erhöhte auch das Jobben, und der Willkommensshop erschien im 1. Semester nicht mehr.
Modus:     Agent (VS Code Copilot)
Prompt:    "Ich habe Club-Mate gekauft und nun ist Lernen + Jobben mehr geworden." und "Beim ersten Semester kommt das Fenster mit dem Kaufen der Items nicht mehr."
Ergebnis:  Boost wirkt nur noch auf Lernen. Beim Shop lag die Ursache im Reset, der den Shop fälschlich als abgeschlossen speicherte. Der Agent korrigierte zuerst die falsche Stelle, bemerkte das selbst und besserte nach.
Korrektur: Beide Fehler selbst beim Spielen entdeckt und gemeldet. Danach erneut getestet: Club-Mate und der Ablauf "Reset → Fächer wählen → Semester starten → Willkommensshop".

### #7 · Tag 1
Ziel:      Fiktive Fächer statt Fächer eines echten Studiengangs (Geomatik). Jedes Fach ist Wahlpflichtfach oder Wahlfach. Die Wissenspunkte steigen pro Semester, die ECTS bleiben ungefähr gleich. Die Fächerwahl lässt sich auf derselben Seite vor dem Semesterstart anpassen.
Modus:     Agent (VS Code Copilot)
Prompt:    "Ich möchte die Fächer nicht spezifisch auf den Studiengang Geomatik erstellen, sondern fiktive nehmen. Erstelle zufällig die Fächer und vergib das Attribut Wahlpflichtfach oder Wahlfach. Die Wissenspunkte sollen pro Semester immer mehr werden, die ECTS ungefähr gleich bleiben. Die Auswahl beim Semesterstart soll auf der gleichen Seite noch angepasst werden können, bevor man das Semester startet."
Ergebnis:  Neue fiktive Fächer pro Semester mit Typ (Wahlpflichtfach/Wahlfach), steigendem Wissensbedarf und ähnlichen ECTS. Die Auswahl ist im Planungsfenster bis zum Klick auf "Semester starten" änderbar. [Anpassen: Was hat der Agent wirklich umgesetzt?]
Korrektur: [Anpassen: z. B. Fachnamen und Werte kontrolliert, ECTS pro Semester nachgerechnet, Änderung der Auswahl vor dem Start getestet.]

### #8 · Tag 1
Ziel:      Fehler bei der Fächerwahl beheben und das benötigte Wissen kumulativ aufbauen.
Modus:     Agent (VS Code Copilot)
Prompt:    "Wenn ich neun Fächer angewählt habe und eines wieder abwähle, kann ich kein neues anwählen. Passe das an. Das benötigte Wissen soll jedes Semester bei der letzten benötigten Zahl starten, und die neuen Wissenspunkte werden dazuaddiert."
Ergebnis:  Das Abwählen gibt wieder einen Platz frei, sodass ein anderes Fach angewählt werden kann. Die Prüfungsschwelle beginnt im neuen Semester beim Wert des Vorsemesters, die Wissensbedarfe der gewählten Fächer kommen dazu. [Anpassen: Was hat der Agent wirklich umgesetzt?]
Korrektur: Fehler selbst beim Spielen entdeckt. [Anpassen: z. B. nach der Korrektur mit 9 Fächern an- und abgewählt, Schwellen über mehrere Semester geprüft, Balancing kontrolliert.]