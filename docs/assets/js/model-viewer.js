
import * as THREE from 'https://esm.sh/three@0.150.1';
import { GLTFLoader } from 'https://esm.sh/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.150.1/examples/jsm/controls/OrbitControls.js';

async function initModelViewer() {
    const container = document.getElementById('model-3d-viewport');
    if (!container) return;

    const loaderOverlay = document.createElement('div');
    loaderOverlay.className = 'model-loader-overlay';
    loaderOverlay.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">Démarrage du Moteur...</div>
            <div class="loader-progress">0%</div>
            <div id="debug-log" style="font-size: 10px; color: #666; margin-top: 10px;">Initialisation des modules...</div>
        </div>
    `;
    container.appendChild(loaderOverlay);

    const log = (msg) => {
        console.log(msg);
        const logEl = document.getElementById('debug-log');
        if (logEl) logEl.innerText = msg;
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0;
    container.appendChild(renderer.domElement);

    // Placeholder Cube (Diagnostic)
    const testBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0x00ffa3, wireframe: true })
    );
    scene.add(testBox);
    log("Three.js OK. Chargement du modèle GLB...");

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;

    // Intense Lights
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(10, 10, 10);
    scene.add(sun);

    // GLTF Loading
    const loader = new GLTFLoader();
    const modelPath = 'assets/models/breaker/breaker.glb?v=' + Date.now();

    loader.load(modelPath, (gltf) => {
        log("Modèle reçu ! Finalisation...");
        scene.remove(testBox); 
        
        const model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4.5 / maxDim; // Slightly larger
        model.scale.set(scale, scale, scale);

        model.traverse((child) => {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
                if (child.material.map) child.material.map.anisotropy = 16;
            }
        });
        
        scene.add(model);
        log("Affichage OK");
        
        loaderOverlay.style.opacity = '0';
        setTimeout(() => loaderOverlay.remove(), 500);
        
    }, (xhr) => {
        if (xhr.lengthComputable) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            const prog = document.querySelector('.loader-progress');
            if (prog) prog.innerText = percent + '%';
        }
    }, (error) => {
        log("ERREUR CHARGEMENT : " + error.message);
        console.error(error);
        
        // Show something even if model fails
        testBox.material.color.setHex(0xff3333);
        testBox.material.wireframe = false;
    });

    function animate() {
        requestAnimationFrame(animate);
        if (testBox) testBox.rotation.y += 0.01;
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

document.addEventListener('DOMContentLoaded', initModelViewer);
