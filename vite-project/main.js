// Import necessary Three.js modules
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // Import OrbitControls

// Set up the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // White background

// Set up the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-3, 5, 0);

// Set up the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadow maps
document.body.appendChild(renderer.domElement);

// Create a plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 }); // Light gray shadow
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Rotate plane to be horizontal
plane.position.y = -1; // Position plane below the electrodes
plane.receiveShadow = true; // Allow plane to receive shadows
scene.add(plane);

// Create material for MnO2OH electrode
const mnO2OHMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff }); // Use MeshStandardMaterial for better shading
mnO2OHMaterial.castShadow = true; // Allow MnO2OH to cast shadows

// Create geometry for MnO2OH electrode (swapped length and width)
const mnO2OHGeometry = new THREE.BoxGeometry(1, 0.1, 2.5);
const mnO2OHPlate = new THREE.Mesh(mnO2OHGeometry, mnO2OHMaterial);
mnO2OHPlate.position.set(0, 0, -2.5); // Position slightly inside the box along the Z-axis
mnO2OHPlate.rotation.x = Math.PI / 2; // Rotate the plate to face vertically
mnO2OHPlate.castShadow = true; // Allow MnO2OH plate to cast shadows
scene.add(mnO2OHPlate);

// Create material for Fe2O3OH electrode
const fe2O3OHMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Use MeshStandardMaterial for better shading
fe2O3OHMaterial.castShadow = true; // Allow Fe2O3OH to cast shadows

// Create geometry for Fe2O3OH electrode (swapped length and width)
const fe2O3OHGeometry = new THREE.BoxGeometry(1, 0.1, 2.5);
const fe2O3OHPlate = new THREE.Mesh(fe2O3OHGeometry, fe2O3OHMaterial);
fe2O3OHPlate.position.set(0, 0, 2.5); // Position slightly inside the box along the Z-axis
fe2O3OHPlate.rotation.x = Math.PI / 2; // Rotate the plate to face vertically
fe2O3OHPlate.castShadow = true; // Allow Fe2O3OH plate to cast shadows
scene.add(fe2O3OHPlate);

// Create a transparent glass box (swapped length and width)
const boxGeometry = new THREE.BoxGeometry(2.5, 3.5, 6); // Dimensions of the glass box
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xaaaaaa,
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide,
  roughness: 0.1,
  metalness: 0.1,
});
const glassBox = new THREE.Mesh(boxGeometry, boxMaterial);
glassBox.position.set(0, 0, 0); // Center the glass box
glassBox.castShadow = false;
glassBox.receiveShadow = false;
scene.add(glassBox);

// Create pinkish electrolyte liquid with swapped length and width
const liquidGeometry = new THREE.BoxGeometry(1.8, 2.8, 4.8); // Slightly smaller than the glass box to fit inside
const liquidMaterial = new THREE.MeshStandardMaterial({
  color: 0xff69b4, // Pink color
  transparent: true, // Enable transparency
  opacity: 1, // Set opacity to a value between 0 and 1
  side: THREE.DoubleSide,
  roughness: 0.2,
  metalness: 0.1,
  blending: THREE.NormalBlending, // Ensure correct blending
});
const electrolyteLiquid = new THREE.Mesh(liquidGeometry, liquidMaterial);
electrolyteLiquid.position.set(0, 0, 0); // Center the liquid inside the glass box
electrolyteLiquid.receiveShadow = false;
scene.add(electrolyteLiquid);

/**
 * Creates a metallic connector.
 *
 * @param {number} radius - The radius of the connector.
 * @param {number} height - The height of the connector.
 * @param {THREE.Color} color - The color of the connector.
 * @returns {THREE.Mesh} - The created connector mesh.
 */
function createConnector(radius, height, color) {
  const geometry = new THREE.CylinderGeometry(radius, radius, height, 32);
  const material = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.3,
    metalness: 1, // Make it look metallic
  });
  const connector = new THREE.Mesh(geometry, material);
  return connector;
}

/**
 * Creates an end connector.
 *
 * @param {number} radius - The radius of the end connector.
 * @param {THREE.Color} color - The color of the end connector.
 * @returns {THREE.Mesh} - The created end connector mesh.
 */
// function createEndConnector(radius, color) {
//   const geometry = new THREE.SphereGeometry(radius, 32, 32);
//   const material = new THREE.MeshStandardMaterial({
//     color: color,
//     metalness: 1, // Metallic appearance
//     roughness: 0.5,
//   });
//   const endConnector = new THREE.Mesh(geometry, material);
//   return endConnector;
// }

// Create metallic connectors for electrodes
//(radius, height, color)
const mnO2OHConnector = createConnector(0.1, 1.2, 0x999999); // Gray metallic color
mnO2OHConnector.position.set(0, 1.25, -2.5); // Position it for MnO2OH plate
mnO2OHConnector.rotation.z = Math.PI; // Rotate to align with the z-axis
scene.add(mnO2OHConnector);

const fe2O3OHConnector = createConnector(0.1, 1.2, 0x999999); // Gray metallic color
fe2O3OHConnector.position.set(0, 1.25, 2.5); // Position it for Fe2O3OH plate
fe2O3OHConnector.rotation.z = Math.PI; // Rotate to align with the z-axis
scene.add(fe2O3OHConnector);

// Create a point light for the LED
const ledLightclr = new THREE.PointLight(0xffff00, 1, 10);
ledLightclr.position.set(0, 0, 0); // Position light at the center of the LED bulb
scene.add(ledLightclr);

// Function to create an LED bulb
function createLED(color, bulbRadius, baseHeight) {
  // Create the bulb part of the LED
  const bulbGeometry = new THREE.SphereGeometry(bulbRadius, 32, 32);
  const bulbMaterial = new THREE.MeshStandardMaterial({
    color: color,
    emissive: color, // Make it emit light
    emissiveIntensity: 0.5,
  });
  const bulbMesh = new THREE.Mesh(bulbGeometry, bulbMaterial);

  // Create the base of the LED
  const baseGeometry = new THREE.CylinderGeometry(
    bulbRadius / 2,
    bulbRadius / 2,
    baseHeight,
    32
  );
  const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  baseMesh.position.y = -bulbRadius - baseHeight / 2; // Position base below the bulb

  // Combine the bulb and base
  const ledGroup = new THREE.Group();
  ledGroup.add(bulbMesh);
  ledGroup.add(baseMesh);

  // Add a point light to simulate LED glow
  const pointLight = new THREE.PointLight(color, 1, 10);
  pointLight.position.set(0, 0, 0); // Position light at the center of the bulb
  ledGroup.add(pointLight);

  // Return both the LED group and the point light
  return { ledGroup, pointLight };
}

// Create LED bulb with yellow color
const { ledGroup: ledBulb, pointLight: ledLight } = createLED(
  0xffff00,
  0.2,
  0.1
);
ledBulb.position.set(0, 2.25, 0); // Position it between the connectors
scene.add(ledBulb);
// // Adjust the LED bulb position if needed
// const ledBulb = createLED(0xffff00, 0.2, 0.1);
// ledBulb.position.set(0, 2, 0); // Position it between the connectors
// scene.add(ledBulb);

// Function to create a coiled wire
function createCoiledWire(color, radius, length, frequency, segments) {
  // Create a sinusoidal curve for the coiled wire
  const path = new THREE.CatmullRomCurve3(
    Array.from({ length: segments }, (_, i) => {
      const t = i / (segments - 1);
      const x = length * t - length / 2;
      const y = Math.sin(2 * Math.PI * frequency * t) * radius;
      const z = 0;
      return new THREE.Vector3(x, y, z);
    })
  );

  // Create a tube geometry along the path
  const tubeGeometry = new THREE.TubeGeometry(path, segments, radius, 8, false);
  const tubeMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 1, // Metallic appearance
    roughness: 0.5,
  });
  const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial);

  return tubeMesh;
}

// Function to create end connectors
function createEndConnector(color, radius) {
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: color,
    metalness: 1, // Metallic appearance
    roughness: 0.5,
  });
  const connector = new THREE.Mesh(sphereGeometry, sphereMaterial);
  return connector;
}

// Create blue coiled wire for MnO2OH connector
const blueCoiledWire = createCoiledWire(0x0000ff, 0.025, 1.5, 5, 1000); // Shorter length for better fit
blueCoiledWire.position.set(0, 1.25, -2.5); // Position it at MnO2OH connector
blueCoiledWire.rotation.z = Math.PI / 2; // Rotate 90 degrees along the z-axis
scene.add(blueCoiledWire);

// Create red coiled wire for Fe2O3OH connector
const redCoiledWire = createCoiledWire(0xff0000, 0.025, 1.5, 5, 1000); // Shorter length for better fit
redCoiledWire.position.set(0, 1.25, 2.5); // Position it at Fe2O3OH connector
redCoiledWire.rotation.z = Math.PI / 2; // Rotate 90 degrees along the z-axis
scene.add(redCoiledWire);

// Create red coiled wire for Fe2O3OH connector
const redCoiledWireHori = createCoiledWire(0xff0000, 0.025, 2.5, 5, 1000); // Shorter length for better fit
redCoiledWireHori.position.set(0, 2, 1.25); // Position it at Fe2O3OH connector
redCoiledWireHori.rotation.y = Math.PI / 2; // Rotate 90 degrees along the z-axis
scene.add(redCoiledWireHori);
// Create blue coiled wire for Fe2O3OH connector
const blueCoiledWireHori = createCoiledWire(0x0000ff, 0.025, 2.5, 5, 1000); // Shorter length for better fit
blueCoiledWireHori.position.set(0, 2, -1.25); // Position it at Fe2O3OH connector
blueCoiledWireHori.rotation.y = Math.PI / 2; // Rotate 90 degrees along the z-axis
scene.add(blueCoiledWireHori);

// // Create end connectors
const blueEndConnector = createEndConnector(0x999999, 0.05);
blueEndConnector.position.set(0, 2, -2.5); // Position it at the end of the blue wire
scene.add(blueEndConnector);

const redEndConnector = createEndConnector(0x999999, 0.05);
redEndConnector.position.set(0, 2, 2.5); // Position it at the end of the red wire
scene.add(redEndConnector);

// Function to create a push button model
function createPushButton() {
  const buttonGroup = new THREE.Group();

  // Create the base of the push button
  const baseGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 32);
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa, // Light gray for plastic
    roughness: 0.3,
    metalness: 0.1,
  });
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
  baseMesh.position.set(0, 0.025, 0); // Position base at the origin
  buttonGroup.add(baseMesh);

  // Create the button head
  const buttonHeadGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.15, 32);
  const buttonHeadMaterial = new THREE.MeshStandardMaterial({
    color: 0xff0000, // Medium gray for the button head
    roughness: 0.4,
    metalness: 0.2,
  });
  const buttonHeadMesh = new THREE.Mesh(buttonHeadGeometry, buttonHeadMaterial);
  buttonHeadMesh.position.set(0, 0.055, 0); // Position button head above the base
  buttonGroup.add(buttonHeadMesh);

  return buttonGroup;
}

// Create and position the push button
const pushButton = createPushButton();
pushButton.position.set(0, 2, -1); // Position it between the LED and blue coiled wire
scene.add(pushButton);

// Adjust the positions of other elements if needed
ledBulb.position.set(0, 2.25, 0);
blueCoiledWireHori.position.set(0, 2, -1.25);

// Create a raycaster and a vector to store the mouse position
// Create a raycaster and a vector to store the mouse position
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// Initialize LED color state
let ledColorState = "yellow"; // Initial color

// Listen for mouse click events
window.addEventListener("click", (event) => {
  // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster with the new mouse position
  raycaster.setFromCamera(mouse, camera);

  // Update matrices of the objects to ensure accurate raycasting
  pushButton.updateMatrixWorld();

  // Check for intersections
  const intersects = raycaster.intersectObjects([pushButton]);

  // If the ray intersects with the push button, trigger the press event
  if (intersects.length > 0) {
    onPushButtonPress();
  }
});

// Function to handle push button press
// Update the onPushButtonPress function
// Function to handle push button press
function onPushButtonPress() {
  console.log("Push button pressed!");

  // Toggle LED color and apply glowing effect based on the current state
  if (ledColorState === "yellow") {
    // Change LED color to green and apply glowing effect
    ledBulb.children.forEach((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.geometry instanceof THREE.SphereGeometry
      ) {
        child.material.color.set(0xff0000); // Green
        child.material.emissive.set(0xff0000); // Apply green glow
        child.material.emissiveIntensity = 1.5; // Increase emissive intensity for glowing effect
      }
    });
    ledLight.color.set(0xff0000); // Set LED light color to green
    ledLight.intensity = 10; // Increase intensity for glowing effect
    ledColorState = "green"; // Update state
  } else {
    // Change LED color to yellow and apply glowing effect
    ledBulb.children.forEach((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.geometry instanceof THREE.SphereGeometry
      ) {
        child.material.color.set(0xffff00); // Yellow
        // child.material.emissiveIntensity = 1.5; // Increase emissive intensity for glowing effect
      }
    });
    ledLight.color.set(0xffff00); // Set LED light color to yellow
    //ledLight.intensity = 2; // Increase intensity for glowing effect
    ledColorState = "yellow"; // Update state
  }

  // Start moving bubbles
  animateBubbles = true;
}

// Function to create a small transparent bubble
function createBubble(color) {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32); // Radius of 0.2
  const material = new THREE.MeshStandardMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    roughness: 0.1,
    metalness: 0.1,
  });
  return new THREE.Mesh(geometry, material);
}

// Create multiple bubbles
// Number of bubbles and their range
const numberOfMnO2Bubbles = 20; // Number of MnO2 bubbles
const numberOfFe2O3Bubbles = 20; // Number of Fe2O3 bubbles
// Function to create multiple bubbles within the bounds of the electrolyteLiquid
// Function to create multiple bubbles within the bounds of the electrolyteLiquid
function createMultipleBubbles(color, numberOfBubbles, liquidMesh) {
  const bubbles = [];
  const liquidBox = new THREE.Box3().setFromObject(liquidMesh); // Get the bounding box of the liquid

  // Get the dimensions of the liquid
  const liquidWidth = liquidBox.max.x - liquidBox.min.x;
  const liquidHeight = liquidBox.max.y - liquidBox.min.y;
  const liquidDepth = liquidBox.max.z - liquidBox.min.z;

  for (let i = 0; i < numberOfBubbles; i++) {
    const bubble = createBubble(color);

    // Random x, y, z positions within the bounds of the liquid
    const x = Math.random() * liquidWidth + liquidBox.min.x;
    const y = Math.random() * liquidHeight + liquidBox.min.y;
    const z = Math.random() * liquidDepth + liquidBox.min.z;

    bubble.position.set(x, y, z); // Set bubble position
    bubbles.push(bubble);
    scene.add(bubble); // Add bubble to the scene
  }

  return bubbles;
}

// Create and position bubbles within the electrolyteLiquid
const mnO2Bubbles = createMultipleBubbles(
  0x0000ff, // Blue bubbles for MnO2
  numberOfMnO2Bubbles,
  electrolyteLiquid // Bound bubbles within this object
);

const fe2O3Bubbles = createMultipleBubbles(
  0xff0000, // Red bubbles for Fe2O3
  numberOfFe2O3Bubbles,
  electrolyteLiquid // Bound bubbles within this object
);

// Function to create text sprite
function createTextSprite(message, color) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = "Bold 32px Arial";
  context.fillStyle = color;
  context.fillText(message, 0, 32);

  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1, 0.5, 1); // Scale the sprite to fit the text
  return sprite;
}

// Add reference axes
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Add a light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 7);
light.castShadow = true;
scene.add(light);

// Add an ambient light for overall illumination
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.zoomSpeed = 1.2;
controls.autoRotate = false; // Disable auto-rotate
controls.enablePan = true;

// Responsive design for window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Function to move bubbles towards their respective electrodes
function moveBubbles() {
  const distanceThreshold = 0.1; // Threshold distance to consider the bubble as "reached"

  // Move blue bubbles towards MnO2OH electrode
  mnO2Bubbles.forEach((bubble) => {
    const target = mnO2OHPlate.position;
    const direction = new THREE.Vector3()
      .subVectors(target, bubble.position)
      .normalize();
    const distance = bubble.position.distanceTo(target);

    if (distance > distanceThreshold) {
      bubble.position.add(direction.multiplyScalar(0.01)); // Move bubble towards the target
    } else {
      // Remove the bubble when it reaches the target
      scene.remove(bubble);
      bubble.geometry.dispose();
      bubble.material.dispose();
    }
  });

  // Move red bubbles towards Fe2O3OH electrode
  fe2O3Bubbles.forEach((bubble) => {
    const target = fe2O3OHPlate.position;
    const direction = new THREE.Vector3()
      .subVectors(target, bubble.position)
      .normalize();
    const distance = bubble.position.distanceTo(target);

    if (distance > distanceThreshold) {
      bubble.position.add(direction.multiplyScalar(0.01)); // Move bubble towards the target
    } else {
      // Remove the bubble when it reaches the target
      scene.remove(bubble);
      bubble.geometry.dispose();
      bubble.material.dispose();
    }
  });
}
// // Function to move bubbles towards the MnO2OH electrode
// function moveBubblesToElectrode(bubbles, targetPosition) {
//   const speed = 0.01; // Speed at which bubbles move towards the electrode

//   bubbles.forEach((bubble) => {
//     const direction = new THREE.Vector3()
//       .subVectors(targetPosition, bubble.position)
//       .normalize();
//     bubble.position.addScaledVector(direction, speed);
//   });
// }

// // Function to move bubbles towards the Fe2O3OH electrode
// function moveBubblesToElectrodeHori(bubbles, targetPosition) {
//   const speed = 0.01; // Speed at which bubbles move towards the electrode

//   bubbles.forEach((bubble) => {
//     const direction = new THREE.Vector3()
//       .subVectors(targetPosition, bubble.position)
//       .normalize();
//     bubble.position.addScaledVector(direction, speed);
//   });
// }

// Flag to control bubble animation
let animateBubbles = false;

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update(); // only required if controls.enableDamping = true or controls.autoRotate = true
  if (animateBubbles) {
    moveBubbles(); // Move bubbles if animation is enabled
  }
  //raycaster.updateMatrixWorld(); // Ensure raycaster is up-to-date

  // Rotate the scene slightly for better visualization
  //   glassBox.rotation.y += 0.01;
  //   mnO2OHPlate.rotation.y += 0.01;
  //   fe2O3OHPlate.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
