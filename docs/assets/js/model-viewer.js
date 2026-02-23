
import * as THREE from 'https://cdn.skypack.dev/three@0.150.1/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.150.1/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.150.1/examples/jsm/controls/OrbitControls.js';

async function initModelViewer() {
    const container = document.getElementById('model-3d-viewport');
    if (!container) return;

    // Create a loading overlay
    const loaderOverlay = document.createElement('div');
    loaderOverlay.className = 'model-loader-overlay';
    loaderOverlay.innerHTML = `
        <div class="loader-content">
            <div class="loader-spinner"></div>
            <div class="loader-text">Initialisation du Noyau GLB...</div>
            <div class="loader-progress">0%</div>
            <div class="loader-warning">Note: Chargement du modèle haute fidélité (80MB+). Merci de patienter.</div>
        </div>
    `;
    container.appendChild(loaderOverlay);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(2, 2, 5); // GLB scales are usually smaller than OBJ

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;
    controls.enableZoom = false;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    // GLTF Loading
    const loader = new GLTFLoader();
    
    loader.load('assets/models/breaker/breaker.glb', (gltf) => {
        const model = gltf.scene;
        
        // Center the object
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);
        
        // Adjust scale to fit viewport automatically
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.5 / maxDim; // Adjusted for GLB camera distance
        model.scale.set(scale, scale, scale);
        
        scene.add(model);
        
        // Fade out loader
        loaderOverlay.style.opacity = '0';
        setTimeout(() => loaderOverlay.remove(), 500);
        
    }, (xhr) => {
        if (xhr.lengthComputable) {
            const percentComplete = Math.round((xhr.loaded / xhr.total) * 100);
            const progressText = document.querySelector('.loader-progress');
            if (progressText) progressText.innerText = percentComplete + '%';
        }
    }, (error) => {
        console.error('Error loading GLB:', error);
        const loaderText = document.querySelector('.loader-text');
        if (loaderText) loaderText.innerHTML = '<span style="color: #ff3333">Erreur de chargement du modèle GLB</span>';
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', initModelViewer);
