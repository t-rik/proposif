function checkActiveSession() {
    fetch('/voting-sessions/check-active-session')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                if (data.sessionType === "jury") {
                    document.querySelector('.container').innerHTML = `
              <p class="info">Une session de vote de jury est active, voulez-vous entrer ?</p>
              <button class="btn" onclick="window.location.href='/voting-sessions/current-proposition'">Entrer</button>
              <button class="btn" onclick="history.back()">Retour</button>`;
                } else if (data.sessionType === "user") {
                    document.querySelector('.container').innerHTML = `
              <p class="info">Une session de vote globale a été trouvée.</p>
              <button class="btn" onclick="window.location.href='/voting-sessions/global-vote'">Démarrer</button>
              <button class="btn" onclick="history.back()">Retour</button>`;
                }
            } else {
                document.querySelector('.container').innerHTML = `
            <p class="info">Aucune session active n'a été trouvée.</p>
            <button class="btn" onclick="history.back()">Retour</button>`;
            }
        })
        .catch(error => console.error('Error fetching session status:', error));
}

setInterval(checkActiveSession, 5000);

checkActiveSession();