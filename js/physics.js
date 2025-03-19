// Variables pour la physique
let world;
let ballBody, holeBody;
let groundBody;
let obstacles = [];
const timeStep = 1 / 60;

// Initialisation de la physique
function initPhysics() {
    // Vérifier si CANNON est disponible
    const CANNON = window.CANNON;
    if (!CANNON) {
        console.error('Cannon.js n\'est pas chargé correctement');
        return;
    }

    try {
        // Création du monde physique
        world = new CANNON.World({
            gravity: new CANNON.Vec3(0, -9.82, 0) // Gravité terrestre
        });
        
        // Réduction de la dormance (pour que les petits objets ne s'endorment pas trop vite)
        if (world.allowSleep !== undefined) {
            world.allowSleep = true;
            world.sleepTimeLimit = 1.0;
            world.sleepSpeedLimit = 0.1;
        }
        
        // Ajout du sol
        const groundShape = new CANNON.Plane();
        groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC || 0, // Utiliser 0 si STATIC n'est pas défini
            shape: groundShape,
            material: new CANNON.Material('ground')
        });
        
        // Corriger la rotation du sol - Utiliser un quaternion directement
        // Rotation de -90 degrés (π/2) autour de l'axe X
        groundBody.quaternion.x = -Math.sin(Math.PI / 4); // sin(θ/2)
        groundBody.quaternion.y = 0;
        groundBody.quaternion.z = 0;
        groundBody.quaternion.w = Math.cos(Math.PI / 4); // cos(θ/2)
        
        world.addBody(groundBody);
        
        // Afficher un message de debug
        const debug = document.getElementById('debug');
        if (debug) {
            debug.innerHTML += "<br><br>Monde physique initialisé ✓";
        }
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la physique:", error);
        const debug = document.getElementById('debug');
        if (debug) {
            debug.innerHTML += "<br><br>Erreur d'initialisation physique: " + error.message;
        }
    }
}

// Création de la balle de golf
function createBall() {
    // Vérifier si CANNON est disponible
    const CANNON = window.CANNON;
    if (!CANNON || !world) return;

    // Création de la géométrie Three.js
    const ballGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.castShadow = true;
    ball.receiveShadow = true;
    scene.add(ball);
    
    // Création du corps physique
    const ballShape = new CANNON.Sphere(0.2);
    ballBody = new CANNON.Body({
        mass: 1, // 1 kg
        shape: ballShape,
        material: new CANNON.Material('ball'),
        position: new CANNON.Vec3(0, 0.2, 0),
        linearDamping: 0.5, // Amortissement pour simuler la friction
        angularDamping: 0.5
    });
    world.addBody(ballBody);
    
    // Création du contact entre la balle et le sol
    const ballGroundContact = new CANNON.ContactMaterial(
        ballBody.material,
        groundBody.material,
        {
            friction: 0.2,
            restitution: 0.7 // Rebond
        }
    );
    world.addContactMaterial(ballGroundContact);
    
    // Afficher un message de debug
    const debug = document.getElementById('debug');
    if (debug) {
        debug.innerHTML += "<br>Balle créée ✓";
    }
}

// Frappe de la balle
function hitBall(power) {
    if (!ballBody) return;
    
    // Direction basée sur la caméra
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0; // Pour que la balle reste à peu près sur le sol
    direction.normalize();
    
    // Application de la force à la balle
    const force = new CANNON.Vec3(
        direction.x * power * 4,
        1 * power * 0.5, // Légère force vers le haut
        direction.z * power * 4
    );
    
    ballBody.applyImpulse(force, ballBody.position);
    
    // Mise à jour du score dans le jeu
    players[currentPlayer].score++;
    updateUI();
}

// Vérification si la balle s'est arrêtée
function isBallStopped() {
    if (!ballBody) return true;
    
    const velocity = ballBody.velocity;
    const angularVelocity = ballBody.angularVelocity;
    
    // Vérifier si la vitesse linéaire et angulaire est proche de zéro
    const linearThreshold = 0.05;
    const angularThreshold = 0.05;
    
    const isStopped = 
        Math.abs(velocity.x) < linearThreshold &&
        Math.abs(velocity.y) < linearThreshold &&
        Math.abs(velocity.z) < linearThreshold &&
        Math.abs(angularVelocity.x) < angularThreshold &&
        Math.abs(angularVelocity.y) < angularThreshold &&
        Math.abs(angularVelocity.z) < angularThreshold;
    
    return isStopped;
}

// Mise à jour de la physique
function updatePhysics() {
    if (!world) return;
    
    world.step(timeStep);
    
    // Mise à jour de la position de la balle dans Three.js
    if (ball && ballBody) {
        ball.position.copy(ballBody.position);
        ball.quaternion.copy(ballBody.quaternion);
    }
}

// Ajout d'un obstacle
function addObstacle(position, size, type = 'box') {
    const CANNON = window.CANNON;
    if (!CANNON || !world) return;
    
    // Création de la géométrie Three.js
    let geometry, material, mesh;
    let shape, body;
    
    switch (type) {
        case 'box':
            geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            material = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Couleur bois
            mesh = new THREE.Mesh(geometry, material);
            
            shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
            body = new CANNON.Body({
                mass: 0, // Statique
                shape: shape,
                position: new CANNON.Vec3(position.x, position.y, position.z)
            });
            break;
            
        case 'slope':
            // Pour une pente, nous utilisons un BoxGeometry incliné
            geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            material = new THREE.MeshStandardMaterial({ color: 0x7CFC00 }); // Vert clair
            mesh = new THREE.Mesh(geometry, material);
            mesh.rotation.x = -Math.PI / 12; // 15 degrés de rotation
            
            // Pour la physique, nous utilisons un corps avec une rotation
            shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
            body = new CANNON.Body({
                mass: 0,
                shape: shape,
                position: new CANNON.Vec3(position.x, position.y, position.z)
            });
            
            // Utiliser un quaternion directement pour une rotation de -15 degrés autour de l'axe X
            const angle = -Math.PI / 12;
            body.quaternion.x = Math.sin(angle/2);
            body.quaternion.y = 0;
            body.quaternion.z = 0;
            body.quaternion.w = Math.cos(angle/2);
            break;
            
        case 'water':
            // L'eau est juste visuelle, pas de physique réelle
            geometry = new THREE.BoxGeometry(size.x, size.y, size.z);
            material = new THREE.MeshStandardMaterial({ 
                color: 0x0000FF,
                transparent: true,
                opacity: 0.6
            });
            mesh = new THREE.Mesh(geometry, material);
            
            // Mais nous ajoutons un box invisible pour les collisions
            shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));
            body = new CANNON.Body({
                mass: 0,
                shape: shape,
                position: new CANNON.Vec3(position.x, position.y, position.z),
                collisionResponse: true,
                isTrigger: true // C'est un déclencheur, pas un objet solide
            });
            
            // Événement pour détecter quand la balle tombe dans l'eau
            body.addEventListener('collide', function(e) {
                if (e.body === ballBody) {
                    // Replacer la balle à sa position précédente
                    resetBall();
                }
            });
            break;
    }
    
    mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    
    if (body) {
        world.addBody(body);
        obstacles.push({ mesh, body, type });
    }
    
    return { mesh, body };
}

// Réinitialiser la position de la balle (après être tombée dans l'eau par exemple)
function resetBall() {
    // Réinitialiser la position et la vitesse de la balle
    ballBody.position.set(0, 0.2, 0);
    ballBody.velocity.set(0, 0, 0);
    ballBody.angularVelocity.set(0, 0, 0);
    
    // Pénalité d'un coup
    players[currentPlayer].score++;
    updateUI();
} 