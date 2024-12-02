import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js'

async function fetchSkyboxImages() {
    const url="https://capstone-final-vxga.onrender.com/get-skybox-images"
    const response = await fetch(url);

    if (response.ok) {
        return await response.json();
    } else {
        throw new Error('Failed to fetch skybox images: ${response.statusText}');
    }
}

async function init() {
    // Fetch dynamic image URLs
    const skyboxImages = await fetchSkyboxImages();

    // Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Enable VR
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    // Load textures for the skybox
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
        skyboxImages.right, // Positive X
        skyboxImages.left,  // Negative X
        skyboxImages.up,    // Positive Y
        skyboxImages.down,  // Negative Y
        skyboxImages.front, // Positive Z
        skyboxImages.back   // Negative Z
    ]);

    scene.background = texture; // Set the cubebox as the scene background

    // Animation loop
    function animate() {
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }

    animate();

    // Position the camera inside the cubebox
    camera.position.set(0, 0, 0);
}

init().catch(error => {
    console.error("Error initializing the skybox:", error);
});
