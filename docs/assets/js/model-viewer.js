
import * as THREE from 'https://cdn.skypack.dev/three@0.150.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.150.1/examples/jsm/controls/OrbitControls.js';

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
            <div id="debug-log" style="font-size: 10px; color: #666; margin-top: 10px;"></div>
        </div>
    `;
    container.appendChild(loaderOverlay);

    const log = (msg) => {
        console.log(msg);
        document.getElementById('debug-log').innerText = msg;
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 2000);
    camera.position.set(5, 5, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0;
    container.appendChild(renderer.domElement);

    // Placeholder Cube (To test if Three.js is working)
    const testBox = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true })
    );
    scene.add(testBox);
    log("Moteur OK. Chargement du modèle...");

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Intense Lights
    scene.add(new THREE.AmbientLight(0xffffff, 2));
    const sun = new THREE.DirectionalLight(0xffffff, 3);
    sun.position.set(10, 10, 10);
    scene.add(sun);

    // GLTF Loading
    const loader = new GLTFLoader();
    // Path correction for GitHub Pages subfolders
    const modelPath = 'assets/models/breaker/breaker.glb?v=' + Date.now();

    loader.load(modelPath, (gltf) => {
        log("Modèle reçu ! Finalisation...");
        scene.remove(testBox); // Remove the red cube
        
        const model = gltf.scene;
        
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x -= center.x;
        model.position.y -= center.y;
        model.position.z -= center.z;
        
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 4 / maxDim;
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
            document.querySelector('.loader-progress').innerText = percent + '%';
            if(percent === 100) log("Traitement des données...");
        }
    }, (error) => {
        log("ERREUR : " + error.message);
        console.error(error);
    });

    function animate() {
        requestAnimationFrame(animate);
        testBox.rotation.y += 0.01;
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
