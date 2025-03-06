let socialTime = 0;
let webTime = 0;
let socialTimer = null;
let webTimer = null;

const socialNetworks = ["facebook.com", "instagram.com", "twitter.com", "linkedin.com"];

function startTimer(timer, updateFunction) {
    if (!timer) {
        return setInterval(updateFunction, 1000);
    }
    return timer;
}

function stopTimer(timer) {
    if (timer) {
        clearInterval(timer);
        return null;
    }
    return timer;
}

function updateSocialTime() {
    socialTime++;
    const socialTimeElement = document.getElementById("social-time");
    if (socialTimeElement) {
        socialTimeElement.textContent = new Date(socialTime * 1000).toISOString().substr(11, 8);
    }
}

function updateWebTime() {
    webTime++;
    const webTimeElement = document.getElementById("internet-time");
    if (webTimeElement) {
        webTimeElement.textContent = new Date(webTime * 1000).toISOString().substr(11, 8);
    }
}

function checkActiveTab() {
    const currentURL = window.location.href;
    const referrer = document.referrer;

    const isSocial = socialNetworks.some((social) => currentURL.includes(social) || referrer.includes(social));
    const isWhatsAppOrTelegram = currentURL.includes("whatsapp.com") || referrer.includes("whatsapp.com") ||
                                  currentURL.includes("telegram.org") || referrer.includes("telegram.org");

    if (isSocial && !isWhatsAppOrTelegram) {
        socialTimer = startTimer(socialTimer, updateSocialTime);
        webTimer = stopTimer(webTimer);
    } else {
        webTimer = startTimer(webTimer, updateWebTime);
        socialTimer = stopTimer(socialTimer);
    }
}

document.addEventListener("visibilitychange", checkActiveTab);
window.addEventListener("load", checkActiveTab);

document.getElementById("send-report").addEventListener("click", async () => {
    const socialTimeElement = document.getElementById("social-time");
    const webTimeElement = document.getElementById("internet-time");

    if (!socialTimeElement || !webTimeElement) {
        console.error("Errore: elementi non trovati.");
        return;
    }

    const socialTime = socialTimeElement.textContent;
    const webTime = webTimeElement.textContent;

    emailjs.send("service_v8cqbdi", "template_vt8tycd", {
        social_time: socialTime,
        web_time: webTime,
        to_email: "emanuele.zuffranieri@gmail.com"
    }).then(response => {
        alert("Report inviato con successo!");
    }, error => {
        console.error("Errore:", error);
        alert("Errore nell'invio del report.");
    });
});

// Funzione per aggiornare la curiosità ogni 10 minuti
const curiosities = [
    "Spegnere il telefono prima di andare a letto riduce lo stress! Meno notifiche, meno ansia.",
    "Passare meno tempo sui Social aumenta la felicità. Meno confronto con gli altri, più soddisfazione personale.",
    "Disconnettersi dai dispositivi elettronici aumenta la produttività.",
    "Mettere da parte il telefono promuove l'attività fisica."
];

function updateCuriosity() {
    const curiosityElement = document.getElementById("daily-curiosity");
    if (curiosityElement) {
        const randomIndex = Math.floor(Math.random() * curiosities.length);
        curiosityElement.textContent = curiosities[randomIndex];
    }
}
updateCuriosity();
setInterval(updateCuriosity, 600000);

document.addEventListener("DOMContentLoaded", () => {
    const dailyChallenges = [
        "Scrivi una pagina di diario sulla tua giornata di oggi.",
        "Leggi 20 pagine di un libro che hai in sospeso.",
        "Fai 20 minuti di attività fisica all’aperto.",
        "Organizza una serata giochi da tavolo!"
    ];
    
    function selectDailyChallenge() {
        const challengeElement = document.getElementById("daily-challenge");
        if (challengeElement) {
            const randomIndex = Math.floor(Math.random() * dailyChallenges.length);
            challengeElement.textContent = dailyChallenges[randomIndex];
        }
    }

    function completeChallenge() {
        const badgeContainer = document.getElementById("badges");
        if (badgeContainer) {
            const newBadge = document.createElement("p");
            newBadge.textContent = "🎖️ Medaglia guadagnata!";
            badgeContainer.appendChild(newBadge);
            selectDailyChallenge();
        }
    }

    selectDailyChallenge();
    const completeButton = document.getElementById("complete-challenge");
    if (completeButton) {
        completeButton.addEventListener("click", completeChallenge);
    }
});
