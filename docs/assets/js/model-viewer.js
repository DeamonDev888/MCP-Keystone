
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
            <div class="loader-text">Synchronisation du Flux 3D...</div>
            <div class="loader-progress">0%</div>
        </div>
    `;
    container.appendChild(loaderOverlay);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(3, 1.5, 6); 

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.target.set(0, 0, 0);

    // High-End Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0x00ffa3, 2);
    topLight.position.set(5, 10, 5);
    scene.add(topLight);

    const sideLight = new THREE.DirectionalLight(0xff6600, 1.5);
    sideLight.position.set(-5, 0, 5);
    scene.add(sideLight);

    // Dynamic Rim Light
    const pointLight = new THREE.PointLight(0xffffff, 2, 50);
    scene.add(pointLight);

    // GLTF Loading
    const loader = new GLTFLoader();
    const modelPath = 'assets/models/breaker/breaker.glb';

    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;
        
        // Auto-fit and center
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        model.position.x -= center.x;
        model.position.y -= (center.y + 0.5); // Lowered the object even more as requested
        model.position.z -= center.z;
        
        // Scale boost for better presence
        const maxDim = Math.max(size.x, size.y, size.z);
        const isMobile = window.innerWidth < 768;
        const scale = (isMobile ? 6.5 : 5.8) / maxDim; 
        model.scale.set(scale, scale, scale);

        model.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.metalness = 0.8;
                    child.material.roughness = 0.2;
                }
            }
        });
        
        scene.add(model);
        
        // Clear loader
        loaderOverlay.style.opacity = '0';
        setTimeout(() => loaderOverlay.remove(), 500);
        
    }, (xhr) => {
        if (xhr.lengthComputable) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            const prog = document.querySelector('.loader-progress');
            if (prog) prog.innerText = percent + '%';
        }
    }, (error) => {
        console.error('Error:', error);
    });

    function animate() {
        requestAnimationFrame(animate);
        pointLight.position.copy(camera.position); // Follow light
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
