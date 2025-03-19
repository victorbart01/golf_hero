// Variables pour le parcours
let currentCourse = 0;
const courses = [
    {
        name: "Parcours simple",
        description: "Un parcours simple pour commencer",
        par: 2
    },
    {
        name: "Parcours avec obstacles",
        description: "Un parcours avec des murs et des pentes",
        par: 3
    },
    {
        name: "Parcours aquatique",
        description: "Un parcours avec de l'eau",
        par: 4
    }
];

// Création du parcours
function createCourse() {
    // Nettoyage du parcours précédent si nécessaire
    clearCourse();
    
    // Création du sol (green)
    createGreen();
    
    // Création du trou
    createHole();
    
    // Ajout des obstacles selon le parcours actuel
    addObstaclesForCourse(currentCourse);
}

// Nettoyage du parcours précédent
function clearCourse() {
    // Supprimer tous les obstacles précédents
    for (let i = obstacles.length - 1; i >= 0; i--) {
        const obstacle = obstacles[i];
        scene.remove(obstacle.mesh);
        world.removeBody(obstacle.body);
    }
    obstacles = [];
    
    // Supprimer le trou précédent s'il existe
    if (hole) {
        scene.remove(hole);
        world.removeBody(holeBody);
    }
}

// Création du sol (green)
function createGreen() {
    // Création de la géométrie Three.js pour le green
    const greenSize = { x: 20, y: 0.1, z: 20 };
    const greenGeometry = new THREE.BoxGeometry(greenSize.x, greenSize.y, greenSize.z);
    const greenMaterial = new THREE.MeshStandardMaterial({ color: 0x4CAF50 }); // Vert
    const green = new THREE.Mesh(greenGeometry, greenMaterial);
    green.position.set(0, -0.05, 0); // Légèrement sous le niveau 0
    green.receiveShadow = true;
    scene.add(green);
    
    // Les bords du green (pour éviter que la balle ne tombe)
    addObstacle(new THREE.Vector3(0, 0.3, greenSize.z/2 + 0.3), new THREE.Vector3(greenSize.x + 2, 0.6, 0.6), 'box');
    addObstacle(new THREE.Vector3(0, 0.3, -greenSize.z/2 - 0.3), new THREE.Vector3(greenSize.x + 2, 0.6, 0.6), 'box');
    addObstacle(new THREE.Vector3(greenSize.x/2 + 0.3, 0.3, 0), new THREE.Vector3(0.6, 0.6, greenSize.z), 'box');
    addObstacle(new THREE.Vector3(-greenSize.x/2 - 0.3, 0.3, 0), new THREE.Vector3(0.6, 0.6, greenSize.z), 'box');
}

// Création du trou
function createHole() {
    // Position du trou selon le parcours
    let holePosition;
    switch (currentCourse) {
        case 0:
            holePosition = new THREE.Vector3(5, 0, 0);
            break;
        case 1:
            holePosition = new THREE.Vector3(0, 0, 5);
            break;
        case 2:
            holePosition = new THREE.Vector3(-5, 0, -5);
            break;
        default:
            holePosition = new THREE.Vector3(5, 0, 0);
    }
    
    // Création de la géométrie Three.js pour le trou
    const holeGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32);
    const holeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    hole = new THREE.Mesh(holeGeometry, holeMaterial);
    hole.position.copy(holePosition);
    hole.position.y = -0.01; // Légèrement sous le niveau du sol
    scene.add(hole);
    
    // Création du drapeau
    const flagPoleGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
    const flagPole = new THREE.Mesh(flagPoleGeometry, new THREE.MeshStandardMaterial({ color: 0xCCCCCC }));
    flagPole.position.copy(holePosition);
    flagPole.position.y = 0.5; // Moitié de la hauteur du poteau
    scene.add(flagPole);
    
    const flagGeometry = new THREE.PlaneGeometry(0.4, 0.3);
    const flagMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
    const flag = new THREE.Mesh(flagGeometry, flagMaterial);
    flag.position.copy(holePosition);
    flag.position.y = 0.85;
    flag.position.x += 0.2;
    flag.rotation.y = Math.PI / 2;
    scene.add(flag);
    
    // Corps physique pour détecter quand la balle entre dans le trou
    const holeShape = new CANNON.Cylinder(0.3, 0.3, 0.1, 8);
    holeBody = new CANNON.Body({
        mass: 0,
        shape: holeShape,
        position: new CANNON.Vec3(holePosition.x, holePosition.y, holePosition.z),
        isTrigger: true
    });
    
    // Événement pour détecter quand la balle entre dans le trou
    holeBody.addEventListener('collide', function(e) {
        if (e.body === ballBody) {
            // La balle est entrée dans le trou
            holeIn();
        }
    });
    
    world.addBody(holeBody);
}

// Fonction appelée quand la balle entre dans le trou
function holeIn() {
    // Animation ou effet visuel pour indiquer que la balle est entrée
    
    // Passer au parcours suivant ou au joueur suivant
    if (currentPlayer + 1 < players.length) {
        // Passer au joueur suivant
        gameState = 'next-player';
        setTimeout(nextPlayer, 1500);
    } else {
        // Tous les joueurs ont joué, passer au parcours suivant
        currentPlayer = 0;
        currentCourse = (currentCourse + 1) % courses.length;
        gameState = 'aiming';
        createCourse();
        resetBall();
        updateUI();
    }
}

// Ajout des obstacles selon le parcours actuel
function addObstaclesForCourse(courseIndex) {
    switch (courseIndex) {
        case 0:
            // Parcours simple - pas d'obstacles spéciaux
            break;
            
        case 1:
            // Parcours avec obstacles - murs et pentes
            addObstacle(new THREE.Vector3(3, 0.3, 2), new THREE.Vector3(0.3, 0.6, 4), 'box');
            addObstacle(new THREE.Vector3(-2, 0.3, -3), new THREE.Vector3(4, 0.6, 0.3), 'box');
            addObstacle(new THREE.Vector3(-4, 0.1, 0), new THREE.Vector3(2, 0.2, 4), 'slope');
            break;
            
        case 2:
            // Parcours aquatique - obstacles d'eau
            addObstacle(new THREE.Vector3(0, -0.1, 0), new THREE.Vector3(3, 0.2, 3), 'water');
            addObstacle(new THREE.Vector3(-3, 0.3, 3), new THREE.Vector3(0.3, 0.6, 6), 'box');
            break;
    }
} 