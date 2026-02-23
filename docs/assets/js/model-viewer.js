
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
            <div class="loader-text">Initialisation du Noyau 3D...</div>
            <div class="loader-progress">0%</div>
            <div class="loader-warning">Modèle haute fidélité (84MB). Initialisation du rendu PBR...</div>
        </div>
    `;
    container.appendChild(loaderOverlay);

    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.0; // Dynamic exposure boost
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    controls.enableZoom = false;
    controls.enablePan = false;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Boosted Ambient
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainLight.position.set(5, 10, 7.5);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x00ffa3, 2);
    backLight.position.set(-5, 5, -5);
    scene.add(backLight);

    // Follow light
    const followLight = new THREE.PointLight(0xffffff, 1.5);
    scene.add(followLight);

    // GLTF Loading
    const loader = new GLTFLoader();
    
    loader.load('assets/models/breaker/breaker.glb', (gltf) => {
        const model = gltf.scene;
        
        // Auto-fit and center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Reset position to center
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);
        
        // Adjust scale
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.5 / maxDim; 
        model.scale.set(scale, scale, scale);

        // Ensure materials are visible even without textures
        model.traverse((child) => {
            if (child.isMesh) {
                child.material.side = THREE.DoubleSide;
                // If it looks too dark, we boost the material
                if (child.material.emissive) {
                    child.material.emissiveIntensity = 0.5;
                }
            }
        });
        
        scene.add(model);
        
        // Final camera setup
        controls.target.set(0, 0, 0);
        camera.position.set(3, 1, 4);
        
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
        if (loaderText) loaderText.innerHTML = '<span style="color: #ff3333">Erreur Critique : Modèle Introuvable</span>';
    });

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        followLight.position.copy(camera.position);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

document.addEventListener('DOMContentLoaded', initModelViewer);
