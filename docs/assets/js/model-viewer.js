
import * as THREE from 'https://cdn.skypack.dev/three@0.150.1/build/three.module.js';
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.150.1/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.skypack.dev/three@0.150.1/examples/jsm/loaders/MTLLoader.js';
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
            <div class="loader-warning">Note: Le modèle est volumineux (100MB+), le chargement peut prendre un moment.</div>
        </div>
    `;
    container.appendChild(loaderOverlay);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(200, 200, 400);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 4.0;
    controls.enableZoom = false;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00ffa3, 0.8);
    dirLight.position.set(100, 100, 100);
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xff6600, 0.5);
    dirLight2.position.set(-100, -100, 100);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x00ffa3, 1, 300);
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    // Model Loading
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('assets/models/breaker/');
    
    try {
        const materials = await new Promise((resolve, reject) => {
            mtlLoader.load('material.mtl', resolve, undefined, reject);
        });
        
        materials.preload();
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('assets/models/breaker/');
        
        objLoader.load('breaker.obj', (object) => {
            // Center the object
            const box = new THREE.Box3().setFromObject(object);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            object.position.x += (object.position.x - center.x);
            object.position.y += (object.position.y - center.y);
            object.position.z += (object.position.z - center.z);
            
            // Adjust scale to fit viewport
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 200 / maxDim;
            object.scale.set(scale, scale, scale);
            
            scene.add(object);
            
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
            console.error('Error loading OBJ:', error);
            const loaderText = document.querySelector('.loader-text');
            if (loaderText) loaderText.innerHTML = '<span style="color: #ff3333">Erreur de chargement du modèle</span>';
        });

    } catch (e) {
        console.error('Error loading MTL:', e);
    }

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
