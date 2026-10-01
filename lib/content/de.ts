import type { ContentPack } from "../localize";

/**
 * German content pack (formal "Sie"). Written for blind and low-vision users of screen readers:
 * no gender stars, no colons or slashes inside words; neutral plural forms where possible.
 *
 * TERMINOLOGY DECISIONS (for reviewer)
 * - MTU: "medizinische Tastuntersuchende (MTU)" on first mention; afterwards "MTU" is treated as
 *   feminine ("die MTU", "eine MTU"), as in "die Rolle der MTU".
 * - examiner(s): "Untersuchende" (plural), "die untersuchende Person" (singular).
 * - patient: "Patientin oder Patient" / "Patientinnen und Patienten"; sometimes "die Person" in choices.
 * - consent: "Einwilligung" (medical term). Withdrawn = "zurückgezogen". Permission to start/continue =
 *   "Erlaubnis" (everyday wording), deliberately distinct from "Einwilligung".
 * - landmark: "Orientierungspunkt" (not "Tastmarke"). "Starting landmark" = "Startpunkt".
 * - escalation: "Eskalation" / "eskalieren" (kept as the established term), "Eskalationsablauf" for the process.
 * - clinician: "klinische Fachperson" (neutral, not necessarily a doctor).
 * - findings: "Befunde"; notes: "Notizen"; documentation: "Dokumentation".
 * - pressure levels: "leicht, mittel, tief"; pace: "Tempo"; pattern: "Untersuchungsmuster".
 * - clock-face: "Zifferblatt" reference, with "zwei Uhr" wording kept; units spelled out ("Zentimeter").
 * - quality review: "Qualitätsprüfung"; second opinion: "Zweitmeinung".
 * - transcript segment: "Abschnitt"; PDF page: "Seite"; text-lesson section: "Kapitel" (to keep it distinct from "Abschnitt").
 * - pass mark: "70 Prozent" (digits, as in the source rule); "ten questions" = "zehn Fragen".
 * - Braille: "Braillezeile" for refreshable display; "BRF-Datei" kept.
 */

export const de: ContentPack = {
  courses: {
    c1: {
      title: "Einführung in die theoretische MTU-Ausbildung",
      description:
        "Verstehen Sie die Rolle medizinischer Tastuntersuchender (MTU), die Grundlagen der Tastuntersuchung und den respektvollen Umgang mit Patientinnen und Patienten.",
      outcome: "Sie können die MTU-Rolle, die Orientierungspunkte und die Praxis der Einwilligung erklären.",
    },
    c2: {
      title: "Angewandte Grundsätze der Tastuntersuchung",
      description:
        "Lernen Sie ein systematisches Untersuchungsmuster kennen, den Druck und das Tempo zu variieren und Befunde klar zu dokumentieren.",
      outcome: "Sie können ein einheitliches, dokumentiertes Vorgehen bei der Untersuchung beschreiben und anwenden.",
    },
    c3: {
      title: "Vorbereitung auf die Zertifizierung und Qualitätsstandards",
      description:
        "Wiederholen Sie Qualitätsstandards, Hygiene und den Umgang mit Eskalation, und erfahren Sie, was Sie in der Zertifizierungsprüfung erwartet.",
      outcome: "Sie sind bereit, die Zertifizierungsprüfung mit Zuversicht abzulegen.",
    },
  },

  lessons: {
    "l1-1": {
      title: "Zweck und Rolle der MTU",
      description: "Was medizinische Tastuntersuchende tun und warum die Methode wichtig ist.",
      summary:
        "Die MTU-Rolle verbindet einen fein geschulten Tastsinn mit strukturierter Technik und klarer Kommunikation. Qualität entsteht durch Beständigkeit, nicht durch Schnelligkeit.",
      transcriptPreview:
        "Willkommen zur ersten Lektion. In dieser Lektion beschreiben wir die MTU-Rolle und warum die Tastuntersuchung wertvoll ist …",
      segments: [
        "Willkommen zur ersten Lektion. In dieser Lektion beschreiben wir die Rolle medizinischer Tastuntersuchender, kurz MTU, und erklären, warum die Tastuntersuchung bei der Früherkennung wertvoll ist.",
        "Eine MTU arbeitet mit einer strukturierten Methode. Die Methode ist wichtig, weil sie Befunde wiederholbar macht. Zwei Untersuchende, die demselben Muster folgen, sollten denselben Bereich auf dieselbe Weise beschreiben.",
        "Patientinnen und Patienten vertrauen den Untersuchenden, weil der Ablauf ruhig, vorher erklärt und respektvoll ist. Bevor Sie beginnen, erklären Sie immer, was Sie tun werden, und bitten um Erlaubnis, fortzufahren.",
        "Zur Zusammenfassung: Die Rolle beruht auf drei Dingen. Einem geschulten Tastsinn, einer einheitlichen Methode und klarer Kommunikation. Die nächste Lektion behandelt die Orientierungspunkte genauer.",
      ],
      materials: [
        { title: "Überblick über die Rolle, eine Seite", description: "Eine Seite, mit Tags für Screenreader." },
        { title: "Überblick über die Rolle (Braille-fähig)", description: "BRF-Datei für Braillezeilen." },
      ],
    },
    "l1-2": {
      title: "Tastbare Orientierungspunkte, eine Lesehilfe",
      description:
        "Eine formatierte Textlektion, die Sie in Ihrem eigenen Tempo mit Ihrem Screenreader oder Ihrer Braillezeile lesen können.",
      summary:
        "Orientierungspunkte geben Ihnen einen festen Bezugsrahmen. Beginnen Sie immer am selben Orientierungspunkt und gehen Sie in derselben Reihenfolge vor, damit Ihre Notizen über die Zeit vergleichbar bleiben.",
      transcriptPreview:
        "Orientierungspunkte sind die festen Bezugspunkte, mit denen Sie beschreiben, wo sich etwas befindet …",
      sections: [
        {
          heading: "Warum Orientierungspunkte wichtig sind",
          paragraphs: [
            "Orientierungspunkte sind feste Bezugspunkte, mit denen Sie beschreiben, wo sich etwas befindet. Sie ermöglichen es anderen Untersuchenden, später genau denselben Bereich zu finden.",
            "Ohne einen gemeinsamen Bezugsrahmen kann eine Beschreibung wie „nahe am oberen Teil“ für verschiedene Menschen Unterschiedliches bedeuten.",
          ],
        },
        {
          heading: "Einen Startpunkt wählen",
          paragraphs: [
            "Beginnen Sie immer am selben Startpunkt. So entsteht eine Gewohnheit, und Gewohnheiten verringern die Gefahr, dass ein Bereich übersehen wird.",
            "Sagen Sie den Startpunkt laut, wenn Sie Ihre Notizen diktieren. Das hilft den Prüfenden, die Reihenfolge nachzuvollziehen, der Sie gefolgt sind.",
          ],
        },
        {
          heading: "Die Lage beschreiben",
          paragraphs: [
            "Beschreiben Sie die Lage mit einer Zifferblatt-Angabe zusammen mit dem Abstand zu einem Orientierungspunkt. Zum Beispiel: „zwei Uhr, drei Zentimeter vom Startpunkt entfernt“.",
            "Halten Sie Beschreibungen kurz und sachlich. Vermeiden Sie Wörter, die auf eine Schlussfolgerung hindeuten. Beschreiben Sie, was Sie fühlen, nicht, was Sie vermuten.",
          ],
        },
        {
          heading: "Ihr Verständnis prüfen",
          paragraphs: [
            "Wenn Sie fertig gelesen haben, markieren Sie die Lektion als abgeschlossen. Danach folgt eine kurze Übung mit zwei Fragen.",
          ],
        },
      ],
      materials: [
        { title: "Glossar der Orientierungspunkte", description: "Reiner Text, ein Begriff pro Zeile." },
        { title: "Glossar der Orientierungspunkte (Braille-fähig)", description: "BRF-Datei." },
      ],
    },
    "l1-3": {
      title: "Handbuch zu Kommunikation und Einwilligung",
      description: "Ein getaggtes PDF-Handbuch mit eingebautem Seitenleser, Seite für Seite.",
      summary:
        "Erklären Sie jeden Schritt, holen Sie die Einwilligung ein und achten Sie während der gesamten Untersuchung auf das Wohlbefinden. Die Einwilligung kann jederzeit zurückgezogen werden und muss sofort respektiert werden.",
      transcriptPreview:
        "Gute Kommunikation beginnt vor jedem körperlichen Kontakt. Stellen Sie sich vor und erklären Sie den Zweck …",
      pages: [
        {
          title: "Seite 1: Bevor Sie beginnen",
          paragraphs: [
            "Gute Kommunikation beginnt vor jedem körperlichen Kontakt. Stellen Sie sich vor, erklären Sie den Zweck der Untersuchung und beschreiben Sie in einfacher Sprache, was geschehen wird.",
            "Fragen Sie, ob die Patientin oder der Patient Fragen hat. Warten Sie die Antwort ab, bevor Sie weitermachen.",
          ],
        },
        {
          title: "Seite 2: Um die Einwilligung bitten",
          paragraphs: [
            "Bitten Sie deutlich um Erlaubnis, zu beginnen. Ein Ja muss freiwillig gegeben werden. Wenn die Person zögert, halten Sie inne und bieten Sie weitere Informationen an.",
            "Die Einwilligung gilt fortlaufend. Fragen Sie an passenden Stellen nach: „Ist das angenehm? Darf ich weitermachen?“",
          ],
        },
        {
          title: "Seite 3: Zurückziehen der Einwilligung und Privatsphäre",
          paragraphs: [
            "Wenn die Einwilligung zu irgendeinem Zeitpunkt zurückgezogen wird, hören Sie sofort auf, danken Sie der Person und fragen Sie, wie sie weiter vorgehen möchte.",
            "Behandeln Sie alle Befunde und persönlichen Angaben vertraulich. Geben Sie Informationen nur an Personen weiter, die an der Versorgung der Patientin oder des Patienten beteiligt sind.",
          ],
        },
        {
          title: "Seite 4: Das Gespräch abschließen",
          paragraphs: [
            "Fassen Sie zusammen, was Sie getan haben, erklären Sie, wann und wie die Ergebnisse mitgeteilt werden, und bedanken Sie sich bei der Person.",
            "Halten Sie fest, dass die Einwilligung erteilt wurde, und notieren Sie alle geäußerten Bedenken.",
          ],
        },
      ],
      materials: [
        { title: "Formulierungskarten zur Einwilligung", description: "Beispielformulierungen für häufige Situationen." },
      ],
    },
    "l2-1": {
      title: "Ein systematisches Untersuchungsmuster (Video mit Audiodeskription)",
      description: "Eine Vorführung mit vollständiger Audiodeskription und einem vollständigen Transkript.",
      summary:
        "Ein systematisches Muster deckt den gesamten Bereich einmal ab, ohne Lücken und ohne Überschneidung der Untersuchung, und wird jedes Mal in derselben Reihenfolge wiederholt.",
      transcriptPreview:
        "In dieser Vorführung geht die Trainerin oder der Trainer ein systematisches Muster vom Startpunkt aus durch …",
      audioDescription:
        "Audiodeskription: Eine Trainerin oder ein Trainer steht neben einer gepolsterten Untersuchungsliege und trägt ein schlichtes petrolfarbenes Oberteil. Auf der Liege liegt ein Übungsmodell. Die Person legt zwei Finger auf einen markierten Startpunkt am oberen Ende des Modells und bewegt sich dann in langsamen, gleichmäßigen, sich überlappenden senkrechten Linien von einer Seite zur anderen.",
      segments: [
        "In dieser Vorführung geht die Trainerin oder der Trainer ein systematisches Muster durch. Suchen Sie zuerst den Startpunkt und legen Sie Ihre Finger dort auf.",
        "Bewegen Sie sich in senkrechten Linien gleicher Länge. Jede Linie überlappt die vorherige ein wenig, damit kein Bereich übersprungen wird.",
        "Halten Sie Ihr Tempo gleichmäßig. Ein gleichmäßiges Tempo hilft Ihnen, Veränderungen der Beschaffenheit zu bemerken. Zählen Sie die Linien laut mit, wenn es Ihnen hilft, den Überblick zu behalten.",
        "Wenn Sie die letzte Linie erreicht haben, kehren Sie zum Startpunkt zurück und bestätigen Sie, dass der gesamte Bereich abgedeckt wurde, bevor Sie weitergehen.",
      ],
      materials: [
        { title: "Schrittliste des Musters", description: "Nummerierte Schritte passend zum Video." },
        { title: "Vollständiges Skript der Audiodeskription", description: "Getaggtes PDF." },
      ],
    },
    "l2-2": {
      title: "Druckstufen und Tempo",
      description: "Wie Sie den Druck kontrolliert verändern und dabei ein gleichmäßiges Tempo halten.",
      summary:
        "Wenden Sie an jeder Position nacheinander leichten, mittleren und tiefen Druck an. Halten Sie das Tempo gleichmäßig und die Druckwechsel bewusst.",
      transcriptPreview:
        "Der Druck ist eine der wichtigsten Größen bei der Tastuntersuchung. In dieser Lektion …",
      segments: [
        "Der Druck ist eine der wichtigsten Größen bei der Tastuntersuchung. In dieser Lektion beschreiben wir drei Stufen: leicht, mittel und tief.",
        "Beginnen Sie an jeder Position mit leichtem Druck, um die Oberfläche wahrzunehmen. Steigern Sie dann auf mittleren, danach auf tiefen Druck. Kehren Sie zu leichtem Druck zurück, bevor Sie zur nächsten Position wechseln.",
        "Halten Sie Ihr Tempo gleichmäßig. Zu große Eile verringert die Empfindlichkeit und kann der Patientin oder dem Patienten unangenehm sein. Wenn eine Person Unbehagen meldet, verringern Sie den Druck sofort.",
        "Üben Sie, den Druck fließend zu ändern, ohne plötzliche Sprünge. Fließende Übergänge helfen Ihnen, das, was Sie auf jeder Stufe fühlen, zu vergleichen.",
      ],
      materials: [
        { title: "Übersicht der Druckstufen", description: "Eine Seite, mit Tags für Screenreader." },
      ],
    },
    "l2-3": {
      title: "Befunde genau dokumentieren",
      description: "Wie Sie klare, sachliche Notizen schreiben, denen andere Untersuchende folgen können.",
      summary:
        "Halten Sie fest, was Sie gefühlt haben, wo und bei welchem Druck. Verwenden Sie einheitliche Begriffe, bleiben Sie bei den Fakten und unterschreiben und datieren Sie jede Notiz.",
      transcriptPreview:
        "Gute Dokumentation ist genau und sachlich. Halten Sie Lage, Größe, Beschaffenheit und Druckstufe fest …",
      sections: [
        {
          heading: "Was Sie festhalten",
          paragraphs: [
            "Halten Sie die Lage mit einer Zifferblatt-Angabe und dem Abstand zum Startpunkt fest, dazu die ungefähre Größe, die Beschaffenheit und die Druckstufe, bei der Sie es bemerkt haben.",
          ],
        },
        {
          heading: "Fakten verwenden, keine Schlussfolgerungen",
          paragraphs: [
            "Beschreiben Sie, was Sie gefühlt haben. Nennen Sie keine Diagnose. Die Deutung ist Aufgabe der prüfenden klinischen Fachperson.",
          ],
        },
        {
          heading: "Unterschreiben und datieren",
          paragraphs: [
            "Jede Notiz braucht Ihren Namen, das Datum und die Uhrzeit. Notizen ohne diese Angaben können für die Qualitätsprüfung nicht verwendet werden.",
          ],
        },
      ],
      materials: [
        { title: "Vorlage zur Dokumentation", description: "Vorlage als reiner Text." },
      ],
    },
    "l3-1": {
      title: "Qualitätsstandards und Hygiene",
      description: "Die Standards, an denen Ihre Arbeit gemessen wird, und die Hygieneabläufe.",
      summary:
        "Die Qualitätsstandards umfassen Methode, Kommunikation, Dokumentation und Hygiene. Die Prüfenden achten auf Beständigkeit in allen vier Bereichen.",
      transcriptPreview:
        "Ihre Arbeit wird an vier Qualitätsstandards gemessen: Methode, Kommunikation, Dokumentation und Hygiene …",
      segments: [
        "Ihre Arbeit wird an vier Qualitätsstandards gemessen: Methode, Kommunikation, Dokumentation und Hygiene.",
        "Zur Hygiene: Waschen Sie sich vor und nach jeder Untersuchung die Hände und halten Sie Ihren Arbeitsplatz frei und ordentlich, damit er für Sie berechenbar bleibt.",
        "Die Prüfenden achten auf Beständigkeit. Ein gutes Ergebnis ist eines, das andere Untersuchende anhand Ihrer Notizen wiederholen könnten.",
        "Wenn Sie bei etwas, das Sie fühlen, unsicher sind, raten Sie nicht. Folgen Sie dem Eskalationsablauf und bitten Sie um eine Zweitmeinung.",
      ],
      materials: [
        { title: "Checkliste der Qualitätsstandards", description: "Reiner Text." },
      ],
    },
    "l3-2": {
      title: "Checkliste für Dokumentation und Eskalation",
      description: "Eine getaggte PDF-Checkliste dazu, was Sie tun, wenn Sie unsicher sind.",
      summary:
        "Eskalieren Sie immer, wenn Sie unsicher sind. Eskalation ist ein Zeichen guter Praxis und niemals ein Versagen.",
      transcriptPreview:
        "Eskalation bedeutet, eine Kollegin, einen Kollegen oder eine klinische Fachperson zu bitten, Ihre Befunde zu prüfen …",
      pages: [
        {
          title: "Seite 1: Wann eskalieren",
          paragraphs: [
            "Eskalation bedeutet, eine Kollegin, einen Kollegen oder eine klinische Fachperson zu bitten, Ihre Befunde zu prüfen. Eskalieren Sie immer, wenn Sie unsicher sind oder wenn Ihre Notizen etwas beschreiben, das Sie nicht erklären können.",
          ],
        },
        {
          title: "Seite 2: Wie eskalieren",
          paragraphs: [
            "Vervollständigen Sie zuerst Ihre Notizen. Wenden Sie sich dann auf dem vereinbarten Weg an die zuständige klinische Fachperson und halten Sie fest, wann Sie das getan haben.",
          ],
        },
        {
          title: "Seite 3: Nach der Eskalation",
          paragraphs: [
            "Sagen Sie der Patientin oder dem Patienten in einfacher Sprache, was als Nächstes geschieht. Bewahren Sie eine Kopie Ihrer Notizen für die Qualitätsprüfung auf.",
          ],
        },
      ],
      materials: [
        { title: "Kontaktblatt zur Eskalation", description: "Platzhalterdokument." },
      ],
    },
    "l3-3": {
      title: "Ablauf der Prüfung: Was Sie erwartet",
      description: "Ein Rundgang mit Audiodeskription durch die Bildschirme der Zertifizierungsprüfung.",
      summary:
        "Die Prüfung hat zehn Fragen, eine pro Bildschirm. Sie speichern jede Antwort, können zurückgehen und alles prüfen, bevor Sie abgeben.",
      transcriptPreview:
        "Dieser Rundgang zeigt die Prüfung von Anfang bis Ende. Es gibt zehn Fragen, die einzeln angezeigt werden …",
      audioDescription:
        "Audiodeskription: Ein Tablet-Bildschirm zeigt eine einzelne Frage mit vier großen Antwortmöglichkeiten und darunter der Schaltfläche „Antwort speichern“. Eine Fortschrittszeile lautet „Frage 2 von 10“.",
      segments: [
        "Dieser Rundgang zeigt die Prüfung von Anfang bis Ende. Es gibt zehn Fragen, die einzeln angezeigt werden.",
        "Wählen Sie eine Antwort und wählen Sie dann „Antwort speichern“. Sie hören und sehen eine Bestätigung, danach erscheint die Schaltfläche „Nächste Frage“.",
        "Sie können jederzeit zu früheren Fragen zurückkehren. Ihre gespeicherten Antworten bleiben erhalten.",
        "Nach der letzten Frage listet ein Prüfbildschirm jede Antwort auf. Wenn Sie bereit sind, geben Sie die Prüfung ab. Zum Bestehen brauchen Sie 70 Prozent, und Sie dürfen es erneut versuchen.",
      ],
      materials: [
        { title: "Prüfungsleitfaden", description: "Zusammenfassung der Prüfungsregeln als reiner Text." },
      ],
    },
  },

  practice: {
    "p1-1-1": {
      text: "Warum arbeitet eine MTU mit einer strukturierten Methode?",
      choices: {
        a: "Sie macht Befunde zwischen Untersuchenden wiederholbar",
        b: "Sie macht die Untersuchung kürzer",
        c: "Sie macht das Gespräch mit der Patientin oder dem Patienten überflüssig",
        d: "Sie ersetzt die Dokumentation",
      },
      explanation:
        "Eine strukturierte Methode bedeutet: Zwei Untersuchende, die demselben Muster folgen, beschreiben denselben Bereich auf dieselbe Weise.",
      hint: "Überlegen Sie, was geschieht, wenn zwei Untersuchende demselben Muster folgen.",
      related: {
        label: "Abschnitt 2: Warum die Methode wichtig ist",
        excerpt: "Eine MTU arbeitet mit einer strukturierten Methode. Die Methode ist wichtig, weil sie Befunde wiederholbar macht.",
      },
    },
    "p1-1-2": {
      text: "Was sollten Sie tun, bevor Sie die Untersuchung beginnen?",
      choices: {
        a: "Leise beginnen, damit die Person sich nicht sorgt",
        b: "Erklären, was Sie tun werden, und um Erlaubnis bitten",
        c: "Abwarten, bis die Person zuerst Fragen stellt",
        d: "Die Unterlagen der Person laut vorlesen",
      },
      explanation:
        "Erst zu erklären und dann um Erlaubnis zu bitten schafft Vertrauen und respektiert die Entscheidung der Person.",
      hint: "Vertrauen entsteht, wenn der Ablauf vorher erklärt wird.",
      related: {
        label: "Abschnitt 3: Vertrauen und Erlaubnis",
        excerpt: "Bevor Sie beginnen, erklären Sie immer, was Sie tun werden, und bitten um Erlaubnis, fortzufahren.",
      },
    },
    "p1-2-1": {
      text: "Warum sollten Sie immer am selben Startpunkt beginnen?",
      choices: {
        a: "Es spart Zeit",
        b: "Es schafft eine Gewohnheit, die übersehene Bereiche verringert",
        c: "Es ist gesetzlich vorgeschrieben",
        d: "Es macht die Notizen kürzer",
      },
      explanation:
        "Ein fester Startpunkt schafft eine Gewohnheit, und Gewohnheiten verringern die Gefahr, dass ein Bereich übersehen wird.",
      hint: "Überlegen Sie, wovor eine beständige Gewohnheit schützt.",
      related: {
        label: "Kapitel: Einen Startpunkt wählen",
        excerpt: "Beginnen Sie immer am selben Startpunkt. So entsteht eine Gewohnheit, und Gewohnheiten verringern die Gefahr, dass ein Bereich übersehen wird.",
      },
    },
    "p1-2-2": {
      text: "Welche Beschreibung der Lage ist die klarste?",
      choices: {
        a: "Nahe am oberen Teil",
        b: "Irgendwo links",
        c: "Zwei Uhr, drei Zentimeter vom Startpunkt entfernt",
        d: "Dort, wo die Person hingezeigt hat",
      },
      explanation:
        "Eine Zifferblatt-Angabe samt Abstand zu einem Orientierungspunkt ist genau und wiederholbar.",
      hint: "Suchen Sie eine Beschreibung, die sowohl Richtung als auch Abstand enthält.",
      related: {
        label: "Kapitel: Die Lage beschreiben",
        excerpt: "Beschreiben Sie die Lage mit einer Zifferblatt-Angabe zusammen mit dem Abstand zu einem Orientierungspunkt.",
      },
    },
    "p1-3-1": {
      text: "Die Patientin oder der Patient zögert, als Sie um die Einwilligung bitten. Was ist die beste Reaktion?",
      choices: {
        a: "Fortfahren, da die Person nicht Nein gesagt hat",
        b: "Innehalten und weitere Informationen anbieten",
        c: "Den Termin sofort beenden",
        d: "Eine Kollegin oder einen Kollegen entscheiden lassen",
      },
      explanation:
        "Die Einwilligung muss freiwillig gegeben werden. Innehalten und Informationen anbieten gibt der Person Raum, sich zu entscheiden.",
      hint: "Die Einwilligung muss freiwillig sein. Was unterstützt eine freie Entscheidung?",
      related: {
        label: "Seite 2: Um die Einwilligung bitten",
        excerpt: "Wenn die Person zögert, halten Sie inne und bieten Sie weitere Informationen an.",
      },
    },
    "p1-3-2": {
      text: "Die Einwilligung wird während der Untersuchung zurückgezogen. Was tun Sie?",
      choices: {
        a: "Zuerst den aktuellen Schritt beenden",
        b: "Sofort aufhören und fragen, wie die Person weiter vorgehen möchte",
        c: "Es notieren und weitermachen",
        d: "Die Bitte um Einwilligung wiederholen",
      },
      explanation: "Das Zurückziehen der Einwilligung wird sofort respektiert.",
      hint: "Das Handbuch sagt, dass das Zurückziehen zu jedem Zeitpunkt gilt.",
      related: {
        label: "Seite 3: Zurückziehen der Einwilligung und Privatsphäre",
        excerpt: "Wenn die Einwilligung zu irgendeinem Zeitpunkt zurückgezogen wird, hören Sie sofort auf, danken Sie der Person und fragen Sie, wie sie weiter vorgehen möchte.",
      },
    },
    "p2-1-1": {
      text: "Warum sollte jede senkrechte Linie die vorherige ein wenig überlappen?",
      choices: {
        a: "Um mehr Zeit auf jedem Bereich zu verbringen",
        b: "Damit kein Bereich übersprungen wird",
        c: "Um weniger Druck zu benötigen",
        d: "Weil die Person es bevorzugt",
      },
      explanation: "Eine kleine Überlappung garantiert eine vollständige Abdeckung ohne Lücken.",
      hint: "Was würde eine Lücke zwischen den Linien für die Abdeckung bedeuten?",
      related: {
        label: "Abschnitt 2: Gleiche Linien mit Überlappung",
        excerpt: "Jede Linie überlappt die vorherige ein wenig, damit kein Bereich übersprungen wird.",
      },
    },
    "p2-1-2": {
      text: "Was tun Sie nach der letzten Linie?",
      choices: {
        a: "Sofort aufhören",
        b: "Zum Startpunkt zurückkehren und die vollständige Abdeckung bestätigen",
        c: "An einem anderen Orientierungspunkt erneut beginnen",
        d: "Die Patientin oder den Patienten um Bestätigung bitten",
      },
      explanation: "Die Rückkehr zum Start und die Bestätigung der Abdeckung schließen das Muster ab.",
      hint: "Das Muster wird geschlossen, indem man dorthin zurückgeht, wo es begonnen hat.",
      related: {
        label: "Abschnitt 4: Das Muster abschließen",
        excerpt: "Kehren Sie zum Startpunkt zurück und bestätigen Sie, dass der gesamte Bereich abgedeckt wurde.",
      },
    },
    "p2-2-1": {
      text: "In welcher Reihenfolge wenden Sie an jeder Position Druck an?",
      choices: {
        a: "Tief, mittel, leicht",
        b: "Leicht, mittel, tief, dann zurück zu leicht",
        c: "Nur mittel",
        d: "Wie es sich richtig anfühlt",
      },
      explanation: "Leicht, mittel, tief, dann zurück zu leicht, bevor Sie weitergehen.",
      hint: "Sie beginnen damit, die Oberfläche wahrzunehmen.",
      related: {
        label: "Abschnitt 2: Die Reihenfolge des Drucks",
        excerpt: "Beginnen Sie mit leichtem Druck, um die Oberfläche wahrzunehmen. Steigern Sie dann auf mittleren, danach auf tiefen Druck. Kehren Sie zu leichtem Druck zurück, bevor Sie zur nächsten Position wechseln.",
      },
    },
    "p2-2-2": {
      text: "Eine Patientin oder ein Patient meldet Unbehagen. Was sollten Sie tun?",
      choices: {
        a: "Den Druck sofort verringern",
        b: "Zuerst die Position beenden",
        c: "Das Tempo erhöhen",
        d: "Es ignorieren, wenn das Muster fast fertig ist",
      },
      explanation: "Das Wohlbefinden der Person hat Vorrang.",
      hint: "Das Wohlbefinden kommt vor dem Abschluss des Musters.",
      related: {
        label: "Abschnitt 3: Tempo und Wohlbefinden",
        excerpt: "Wenn eine Person Unbehagen meldet, verringern Sie den Druck sofort.",
      },
    },
    "p2-3-1": {
      text: "Welche Notiz ist angemessen?",
      choices: {
        a: "Wahrscheinlich eine harmlose Zyste",
        b: "Zwei Uhr, etwa zwei Zentimeter, fest, bei mittlerem Druck bemerkt",
        c: "Etwas Ungewöhnliches",
        d: "Sieht gut aus",
      },
      explanation:
        "Gute Notizen nennen Lage, Größe, Beschaffenheit und Druck, ohne eine Diagnose zu nennen.",
      hint: "Wählen Sie die Notiz mit Fakten, nicht mit Schlussfolgerungen.",
      related: {
        label: "Kapitel: Was Sie festhalten",
        excerpt: "Halten Sie die Lage fest, die ungefähre Größe, die Beschaffenheit und die Druckstufe, bei der Sie es bemerkt haben.",
      },
    },
    "p2-3-2": {
      text: "Warum braucht jede Notiz einen Namen, ein Datum und eine Uhrzeit?",
      choices: {
        a: "Für die Qualitätsprüfung",
        b: "Für die Abrechnung",
        c: "Nur für die Unterlagen der Patientin oder des Patienten",
        d: "Sie braucht sie nicht",
      },
      explanation: "Notizen ohne diese Angaben können für die Qualitätsprüfung nicht verwendet werden.",
      hint: "Überlegen Sie, wer die Notizen später liest.",
      related: {
        label: "Kapitel: Unterschreiben und datieren",
        excerpt: "Notizen ohne diese Angaben können für die Qualitätsprüfung nicht verwendet werden.",
      },
    },
    "p3-1-1": {
      text: "Welches ist einer der vier Qualitätsstandards?",
      choices: {
        a: "Schnelligkeit",
        b: "Hygiene",
        c: "Gerätekosten",
        d: "Dauer der Sitzung",
      },
      explanation: "Die vier Standards sind Methode, Kommunikation, Dokumentation und Hygiene.",
      hint: "Methode, Kommunikation, Dokumentation und noch einer.",
      related: {
        label: "Abschnitt 1: Die vier Standards",
        excerpt: "Ihre Arbeit wird an vier Qualitätsstandards gemessen: Methode, Kommunikation, Dokumentation und Hygiene.",
      },
    },
    "p3-1-2": {
      text: "Sie sind bei etwas, das Sie fühlen, unsicher. Was sollten Sie tun?",
      choices: {
        a: "Die beste Vermutung abgeben",
        b: "Dem Eskalationsablauf folgen und um eine Zweitmeinung bitten",
        c: "Es in den Notizen weglassen",
        d: "Wiederholen, bis es sich sicher anfühlt",
      },
      explanation: "Raten Sie niemals. Eskalieren Sie.",
      hint: "Die Lektion endet mit einer klaren Anweisung für Unsicherheit.",
      related: {
        label: "Abschnitt 4: Unsicherheit",
        excerpt: "Wenn Sie bei etwas, das Sie fühlen, unsicher sind, raten Sie nicht. Folgen Sie dem Eskalationsablauf und bitten Sie um eine Zweitmeinung.",
      },
    },
    "p3-2-1": {
      text: "Wann sollten Sie eskalieren?",
      choices: {
        a: "Nur, wenn Sie sich eines Problems sicher sind",
        b: "Immer, wenn Sie unsicher sind",
        c: "Nie ohne Erlaubnis der Patientin oder des Patienten",
        d: "Nur am Ende des Tages",
      },
      explanation: "Eskalation ist gute Praxis, wann immer Sie unsicher sind.",
      hint: "Auf der Seite steht, dass Eskalation niemals ein Versagen ist.",
      related: {
        label: "Seite 1: Wann eskalieren",
        excerpt: "Eskalieren Sie immer, wenn Sie unsicher sind oder wenn Ihre Notizen etwas beschreiben, das Sie nicht erklären können.",
      },
    },
    "p3-2-2": {
      text: "Was tun Sie, bevor Sie die klinische Fachperson kontaktieren?",
      choices: {
        a: "Ihre Notizen vervollständigen",
        b: "Einen Tag warten",
        c: "Die Entwurfsnotizen löschen",
        d: "Die Person bitten, zu gehen",
      },
      explanation:
        "Vervollständigen Sie zuerst Ihre Notizen, wenden Sie sich dann an die klinische Fachperson und halten Sie die Uhrzeit fest.",
      hint: "Ihre Notizen sind das, was die klinische Fachperson prüfen wird.",
      related: {
        label: "Seite 2: Wie eskalieren",
        excerpt: "Vervollständigen Sie zuerst Ihre Notizen. Wenden Sie sich dann auf dem vereinbarten Weg an die zuständige klinische Fachperson.",
      },
    },
    "p3-3-1": {
      text: "Wie viele Fragen werden auf jedem Prüfungsbildschirm angezeigt?",
      choices: {
        a: "Eine",
        b: "Zwei",
        c: "Fünf",
        d: "Alle zehn",
      },
      explanation: "Die Prüfung zeigt eine Frage pro Bildschirm.",
      hint: "Die Lektion sagt, dass die Fragen einzeln angezeigt werden.",
      related: {
        label: "Abschnitt 1: Aufbau der Prüfung",
        excerpt: "Es gibt zehn Fragen, die einzeln angezeigt werden.",
      },
    },
    "p3-3-2": {
      text: "Wie viel Prozent brauchen Sie zum Bestehen?",
      choices: {
        a: "50 Prozent",
        b: "60 Prozent",
        c: "70 Prozent",
        d: "100 Prozent",
      },
      explanation: "Die Bestehensgrenze liegt bei 70 Prozent, und Sie dürfen es erneut versuchen.",
      hint: "Es steht im letzten Abschnitt.",
      related: {
        label: "Abschnitt 4: Prüfung und Bestehensgrenze",
        excerpt: "Zum Bestehen brauchen Sie 70 Prozent, und Sie dürfen es erneut versuchen.",
      },
    },
  },

  exam: {
    e1: {
      text: "Was macht eine strukturierte Untersuchungsmethode wertvoll?",
      choices: {
        a: "Befunde werden zwischen Untersuchenden wiederholbar",
        b: "Sie verkürzt jeden Termin",
        c: "Sie macht Notizen überflüssig",
        d: "Sie vermeidet das Gespräch mit der Patientin oder dem Patienten",
      },
    },
    e2: {
      text: "Was sollten Sie tun, bevor Sie eine Untersuchung beginnen?",
      choices: {
        a: "Leise beginnen",
        b: "Erklären, was geschehen wird, und um Erlaubnis bitten",
        c: "Auf Fragen warten",
        d: "Notizen laut vorlesen",
      },
    },
    e3: {
      text: "Welche Beschreibung der Lage ist die genaueste?",
      choices: {
        a: "Nahe am oberen Ende",
        b: "Auf der linken Seite",
        c: "Zwei Uhr, drei Zentimeter vom Startpunkt entfernt",
        d: "Dort, wo es sich anders anfühlt",
      },
    },
    e4: {
      text: "Die Patientin oder der Patient zieht mitten in der Untersuchung die Einwilligung zurück. Was tun Sie?",
      choices: {
        a: "Sofort aufhören und fragen, wie die Person weiter vorgehen möchte",
        b: "Das Muster zu Ende führen",
        c: "Leicht weitermachen",
        d: "Die Person bitten, es sich noch einmal zu überlegen",
      },
    },
    e5: {
      text: "Warum sollten sich senkrechte Linien ein wenig überlappen?",
      choices: {
        a: "Um mehr Druck zu verwenden",
        b: "Um es der Person angenehm zu machen",
        c: "Damit kein Bereich übersprungen wird",
        d: "Um schneller zu werden",
      },
    },
    e6: {
      text: "In welcher Reihenfolge wird an jeder Position Druck angewendet?",
      choices: {
        a: "Tief, mittel, leicht",
        b: "Leicht, mittel, tief, zurück zu leicht",
        c: "Durchgehend mittel",
        d: "Zufällige Reihenfolge",
      },
    },
    e7: {
      text: "Eine Patientin oder ein Patient meldet Unbehagen. Was ist die richtige Reaktion?",
      choices: {
        a: "Den Druck sofort verringern",
        b: "Die Position beenden",
        c: "Schneller vorgehen",
        d: "Es ignorieren",
      },
    },
    e8: {
      text: "Welche Notiz ist akzeptabel?",
      choices: {
        a: "Wahrscheinlich nichts",
        b: "Zwei Uhr, etwa zwei Zentimeter, fest, bei mittlerem Druck bemerkt",
        c: "Ungewöhnlich",
        d: "Alles in Ordnung",
      },
    },
    e9: {
      text: "Sie sind bei etwas, das Sie fühlen, unsicher. Was tun Sie als Nächstes?",
      choices: {
        a: "Raten",
        b: "Es weglassen",
        c: "Dem Eskalationsablauf folgen",
        d: "Wiederholen, bis Sie sicher sind",
      },
    },
    e10: {
      text: "Welche sind die vier Qualitätsstandards?",
      choices: {
        a: "Methode, Kommunikation, Dokumentation, Hygiene",
        b: "Schnelligkeit, Kosten, Dauer, Umfang",
        c: "Methode, Schnelligkeit, Kosten, Hygiene",
        d: "Dokumentation, Dauer, Kosten, Umfang",
      },
    },
  },

  remediation: {
    title: "Audio-Wiederholung zu Einwilligung, Muster, Druck und Notizen",
    segments: [
      "Lassen Sie uns die wichtigsten Gedanken noch einmal in Ruhe ansehen. Sie haben bereits gezeigt, dass Sie vieles von diesem Stoff verstehen, und dies ist eine Gelegenheit, es zu festigen.",
      "Erstens: die Einwilligung. Erklären Sie immer, bitten Sie um Erlaubnis und hören Sie sofort auf, wenn die Erlaubnis zurückgezogen wird.",
      "Zweitens: die Methode. Verwenden Sie denselben Startpunkt, senkrechte Linien, die sich überlappen, und Druck in der Reihenfolge leicht, mittel, tief und dann wieder leicht.",
      "Drittens: die Notizen. Halten Sie Lage, Größe, Beschaffenheit und Druck fest. Verwenden Sie Fakten, keine Schlussfolgerungen. Wenn Sie unsicher sind, eskalieren Sie. Sie können die Prüfung erneut ablegen, wenn Sie bereit sind.",
    ],
    questions: {
      r1: {
        text: "Die Patientin oder der Patient meldet bei einer Position Unbehagen. Was ist die beste Handlung?",
        choices: {
          a: "Den Druck sofort verringern",
          b: "Zuerst die Position beenden",
          c: "Schneller vorgehen, um früher fertig zu sein",
        },
        explanation: "Das Wohlbefinden der Person hat immer Vorrang.",
        hint: "Das Wohlbefinden kommt vor dem Abschluss des Musters.",
        related: {
          label: "Wiederholungsabschnitt 2",
          excerpt: "Erklären Sie immer, bitten Sie um Erlaubnis und hören Sie sofort auf, wenn die Erlaubnis zurückgezogen wird.",
        },
      },
      r2: {
        text: "Welche Notiz entspricht guter Dokumentationspraxis?",
        choices: {
          a: "Sieht harmlos aus",
          b: "Zwei Uhr, etwa zwei Zentimeter, fest, bei mittlerem Druck bemerkt",
          c: "Nichts zu berichten, wahrscheinlich",
        },
        explanation: "Gute Notizen enthalten Lage, Größe, Beschaffenheit und Druck, aber keine Schlussfolgerungen.",
        hint: "Wählen Sie die Notiz mit Fakten, nicht mit Schlussfolgerungen.",
        related: {
          label: "Wiederholungsabschnitt 4",
          excerpt: "Halten Sie Lage, Größe, Beschaffenheit und Druck fest. Verwenden Sie Fakten, keine Schlussfolgerungen.",
        },
      },
    },
  },
};
