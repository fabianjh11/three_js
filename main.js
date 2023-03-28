import './style.css'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.x = 10;
camera.position.y = 10;
camera.position.z = 10;

renderer.render(scene, camera);

const pointLight = new THREE.PointLight(0xffffff55);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

const geometryB = new THREE.SphereGeometry(1);
const materialB = new THREE.MeshStandardMaterial({color: 0x0000ffcc});

function addBubble(){
  const bubble = new THREE.Mesh(geometryB, materialB);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(150));

  bubble.position.set(x, y, z);
  scene.add(bubble);
  return bubble;
}

const spaceTexture = new THREE.TextureLoader().load('/static/ocean.jpg');
scene.background = spaceTexture;

let bubbleCount = 0;
const maxB = 35;
const bubbles = Array(maxB).fill(0);
let bubble;

const picTexture = new THREE.TextureLoader().load('/static/Yo.jfif');
const picture = new THREE.Mesh(
  new THREE.BoxGeometry(12, 12, 12),
  new THREE.MeshBasicMaterial({map: picTexture})
);
picture.position.x = 10;
picture.position.y = -5;
picture.position.z = -22;
scene.add(picture);

const earthTexture = new THREE.TextureLoader().load('/static/earth.png');
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({map: earthTexture})
);
scene.add(earth);

//earth.position.x = 3;
//earth.position.y = 53;
//earth.position.z = 66;

earth.position.x = 0;
earth.position.y = 63;
earth.position.z = 73;

let t = document.body.getBoundingClientRect().top;
function moveCamera() {
  t = document.body.getBoundingClientRect().top;

  picture.rotation.y += 0.05;
  picture.rotation.z += 0.05;

  camera.position.z = t * -0.05 + 10;
  camera.position.x = t * -0.002 + 10;
  camera.position.y = t * -0.04 + 10;
  camera.rotation.y = t * -2;
  console.log(camera.position.x + ' ' + camera.position.y + ' ' + camera.position.z);
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.x += 0.0001;
  earth.rotation.y += 0.01;

  if(bubbles[bubbleCount] === 0){
    bubble = addBubble();
    bubbles[bubbleCount] = bubble;
  }
  bubbleCount += 1;
  for(let i = 0; i < maxB; i++){
    if(bubbles[i] !== 0){
      bubbles[i].position.y += 1;
      if(bubbles[i].position.y > 150){
        scene.remove(bubbles[i]);
        bubbles[i] = 0;
      }
    }
  }
  if(bubbleCount >= maxB){
    bubbleCount = 0;
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
