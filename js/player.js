// Fonctions de gestion des joueurs

// Ajout d'un nouveau joueur
function addPlayer(name) {
    players.push({
        name: name,
        score: 0,
        totalScore: 0,
        courseScores: Array(courses.length).fill(0)
    });
    
    updatePlayerList();
}

// Suppression d'un joueur
function removePlayer(index) {
    if (index >= 0 && index < players.length && players.length > 1) {
        players.splice(index, 1);
        if (currentPlayer >= players.length) {
            currentPlayer = 0;
        }
        updatePlayerList();
        updateUI();
    }
}

// Mise à jour de la liste des joueurs dans l'interface
function updatePlayerList() {
    // Cette fonction pourrait être utilisée pour afficher une liste complète des joueurs
    // et de leurs scores dans une interface plus élaborée
}

// Enregistrer le score du joueur actuel pour le parcours en cours
function recordScore() {
    const player = players[currentPlayer];
    player.courseScores[currentCourse] = player.score;
    player.totalScore += player.score;
    
    // Réinitialiser le score pour le prochain parcours
    player.score = 0;
}

// Calcul du score total pour un joueur
function calculateTotalScore(playerIndex) {
    const player = players[playerIndex];
    let total = 0;
    
    for (let i = 0; i < player.courseScores.length; i++) {
        total += player.courseScores[i];
    }
    
    return total;
}

// Affichage du score final
function showFinalScores() {
    // Trier les joueurs par score total (du plus petit au plus grand)
    const sortedPlayers = [...players].sort((a, b) => calculateTotalScore(players.indexOf(a)) - calculateTotalScore(players.indexOf(b)));
    
    // Afficher les scores dans une boîte de dialogue ou un élément HTML
    let scoreText = "Scores finaux:\n";
    
    sortedPlayers.forEach((player, index) => {
        scoreText += `${index + 1}. ${player.name}: ${calculateTotalScore(players.indexOf(player))} coups\n`;
    });
    
    alert(scoreText);
}

// Réinitialisation des scores pour une nouvelle partie
function resetScores() {
    players.forEach(player => {
        player.score = 0;
        player.totalScore = 0;
        player.courseScores = Array(courses.length).fill(0);
    });
    
    currentPlayer = 0;
    currentCourse = 0;
    updateUI();
}

// Fonction pour gérer la fin d'un parcours
function endCourse() {
    // Enregistrer les scores de tous les joueurs
    players.forEach((player, index) => {
        const currentPlayerBackup = currentPlayer;
        currentPlayer = index;
        recordScore();
        currentPlayer = currentPlayerBackup;
    });
    
    // Si c'était le dernier parcours, afficher les scores finaux
    if (currentCourse === courses.length - 1) {
        setTimeout(showFinalScores, 1000);
    }
    
    // Passer au parcours suivant
    currentCourse = (currentCourse + 1) % courses.length;
    currentPlayer = 0;
    createCourse();
    resetBall();
    updateUI();
}

// Affichage d'informations sur le parcours actuel
function showCourseInfo() {
    const course = courses[currentCourse];
    
    // Mettre à jour un élément HTML avec les informations du parcours
    const courseInfoElement = document.getElementById('course-info');
    if (courseInfoElement) {
        courseInfoElement.textContent = `Parcours: ${course.name} (Par: ${course.par})`;
    }
} 