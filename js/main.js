// Configuration de base de Three.js
let scene, camera, renderer;
// Variables pour le jeu
let ball, hole, course, currentPlayer = 0;
let players = [{name: 'Joueur 1', score: 0}, {name: 'Joueur 2', score: 0}];
let isAiming = false;
let isPowerAdjusting = false;
let power = 0;
let maxPower = 20;
let gameState = 'aiming'; // 'aiming', 'powering', 'rolling', 'next-player'
let controls;

// Initialisation de Three.js
function init() {
    // Création de la scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Couleur du ciel

    // Configuration de la caméra
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    // Configuration du renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Ajout des contrôles de caméra
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
    } else if (window.OrbitControls) {
        controls = new window.OrbitControls(camera, renderer.domElement);
    } else {
        console.error("OrbitControls n'est pas disponible");
    }
    
    if (controls) {
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 30;
        controls.maxPolarAngle = Math.PI / 2.2;
    }

    // Ajout de lumière
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Initialisation des événements
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', onMouseDown, false);
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('mouseup', onMouseUp, false);
    document.addEventListener('touchstart', onTouchStart, false);
    document.addEventListener('touchmove', onTouchMove, false);
    document.addEventListener('touchend', onTouchEnd, false);

    // Initialisation de la physique
    initPhysics();
    
    // Création du parcours
    createCourse();
    
    // Création de la balle
    createBall();
    
    // Mise à jour de l'interface
    updateUI();
    
    // Lancement de la boucle d'animation
    animate();
}

// Gestion du redimensionnement de la fenêtre
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Logique de contrôle pour frapper la balle
function onMouseDown(event) {
    if (gameState === 'aiming') {
        isAiming = true;
        gameState = 'powering';
        document.getElementById('power-meter').style.display = 'block';
    }
}

function onMouseMove(event) {
    // Logique pour ajuster la direction et la puissance
}

function onMouseUp(event) {
    if (gameState === 'powering') {
        hitBall(power);
        power = 0;
        document.getElementById('power-fill').style.width = '0%';
        document.getElementById('power-meter').style.display = 'none';
        gameState = 'rolling';
        isPowerAdjusting = false;
    }
}

// Fonctions équivalentes pour les appareils tactiles
function onTouchStart(event) {
    // Implémentation similaire à onMouseDown
    if (gameState === 'aiming') {
        isAiming = true;
        gameState = 'powering';
        document.getElementById('power-meter').style.display = 'block';
    }
}

function onTouchMove(event) {
    // Implémentation similaire à onMouseMove
}

function onTouchEnd(event) {
    // Implémentation similaire à onMouseUp
    if (gameState === 'powering') {
        hitBall(power);
        power = 0;
        document.getElementById('power-fill').style.width = '0%';
        document.getElementById('power-meter').style.display = 'none';
        gameState = 'rolling';
        isPowerAdjusting = false;
    }
}

// Mise à jour de l'interface utilisateur
function updateUI() {
    document.getElementById('score').textContent = `Coups: ${players[currentPlayer].score}`;
    document.getElementById('player').textContent = players[currentPlayer].name;
}

// Fonction pour frapper la balle
function hitBall(power) {
    // Cette fonction sera implémentée dans physics.js
    // Elle appliquera une force à la balle basée sur la direction et la puissance
    players[currentPlayer].score++;
    updateUI();
}

// Vérification si la balle est entrée dans le trou
function checkHole() {
    // Cette fonction sera implémentée plus tard
    // Elle vérifiera si la balle est proche du trou
}

// Fonction pour passer au joueur suivant
function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % players.length;
    gameState = 'aiming';
    updateUI();
    // Réinitialiser la position de la balle pour le nouveau joueur
}

// Boucle d'animation principale
function animate() {
    requestAnimationFrame(animate);
    
    // Mise à jour des contrôles si disponibles
    if (controls) controls.update();
    
    // Mise à jour de la physique
    updatePhysics();
    
    // Si la balle roule, vérifier si elle s'est arrêtée
    if (gameState === 'rolling') {
        if (isBallStopped()) {
            checkHole();
            gameState = 'next-player';
            setTimeout(nextPlayer, 1500); // Délai avant de passer au joueur suivant
        }
    }
    
    // Si en train d'ajuster la puissance
    if (gameState === 'powering') {
        power = (power + 0.5) % maxPower;
        document.getElementById('power-fill').style.width = (power / maxPower * 100) + '%';
    }
    
    renderer.render(scene, camera);
}

// Fonction pour vérifier si la balle s'est arrêtée
function isBallStopped() {
    // Cette fonction sera implémentée dans physics.js
    // Elle vérifiera si la vitesse de la balle est proche de zéro
    return true; // Temporairement toujours vrai
}

// Lancer l'initialisation quand la page est chargée
window.onload = init; 