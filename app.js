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
    document.getElementById("social-time").textContent = new Date(socialTime * 1000).toISOString().substr(11, 8);
}

function updateWebTime() {
    webTime++;
    document.getElementById("internet-time").textContent = new Date(webTime * 1000).toISOString().substr(11, 8);
}

function checkActiveTab() {
    try {
        if (!window.location || !window.location.href) {
            console.error("Errore: window.location.href è undefined");
            return;
        }

        let currentURL = window.location.href || "";
        let referrer = document.referrer || "";

        console.log("URL attuale:", currentURL);
        console.log("Referrer:", referrer);

        const isSocial = socialNetworks.some(social => currentURL.includes(social) || referrer.includes(social));
        const isWhatsAppOrTelegram = currentURL.includes("whatsapp.com") || referrer.includes("whatsapp.com") ||
                                      currentURL.includes("telegram.org") || referrer.includes("telegram.org");

        if (isSocial && !isWhatsAppOrTelegram) {
            console.log("Social rilevato, avvio timer...");
            socialTimer = startTimer(socialTimer, updateSocialTime);
            webTimer = stopTimer(webTimer);
        } else {
            console.log("Navigazione normale, avvio timer web...");
            webTimer = startTimer(webTimer, updateWebTime);
            socialTimer = stopTimer(socialTimer);
        }
    } catch (error) {
        console.error("Errore in checkActiveTab:", error);
    }
}

// Avvia il controllo quando la pagina si carica
document.addEventListener("visibilitychange", checkActiveTab);
window.addEventListener("load", checkActiveTab);

// 📌 INVIO REPORT VIA EMAILJS
document.getElementById("send-report").addEventListener("click", async () => {
    const socialTime = document.getElementById("social-time").textContent;
    const webTime = document.getElementById("internet-time").textContent;

    try {
        const response = await emailjs.send("TUO_SERVICE_ID", "TUO_TEMPLATE_ID", {
            social_time: socialTime,
            web_time: webTime,
            to_email: "emanuele.zuffranieri@gmail.com",
        });

        alert("Report inviato con successo!");
    } catch (error) {
        console.error("Errore nell'invio del report:", error);
        alert("Errore nell'invio del report.");
    }
});

// 🔹 Lista curiosità
const curiosities = [
    "Spegnere il telefono prima di andare a letto riduce lo stress!",
    "Passare meno tempo sui Social aumenta la felicità.",
    "Disconnettersi dai dispositivi elettronici aumenta la produttività.",
    "Mettere da parte il telefono promuove l'attività fisica."
];

function updateCuriosity() {
    const randomIndex = Math.floor(Math.random() * curiosities.length);
    document.getElementById("daily-curiosity").textContent = curiosities[randomIndex];
}
updateCuriosity();
setInterval(updateCuriosity, 600000);

// 🔹 Lista sfide giornaliere
document.addEventListener("DOMContentLoaded", () => {
    const dailyChallenges = [
        "Scrivi una pagina di diario sulla tua giornata di oggi.",
        "Leggi 20 pagine di un libro che hai in sospeso.",
        "Fai 20 minuti di attività fisica all’aperto.",
        "Organizza una serata giochi da tavolo!"
    ];
    
    function selectDailyChallenge() {
        const randomIndex = Math.floor(Math.random() * dailyChallenges.length);
        document.getElementById("daily-challenge").textContent = dailyChallenges[randomIndex];
    }

    function completeChallenge() {
        const badgeContainer = document.getElementById("badges");
        const newBadge = document.createElement("p");
        newBadge.textContent = "🎖️ Medaglia guadagnata!";
        badgeContainer.appendChild(newBadge);
        selectDailyChallenge();
    }

    selectDailyChallenge();
    const completeButton = document.getElementById("complete-challenge");
    if (completeButton) {
        completeButton.addEventListener("click", completeChallenge);
    }
});
