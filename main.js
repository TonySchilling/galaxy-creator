import './style.css'

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { Scene, Engine } from 'babylonjs';




const planets = []
const stars = []
const moons = []
const suns = []
const turningx = []
const turningz = []
const galaxies = []
const turningObjects = []

function addTurning(object,x,y,z) {
  object.userData.turningX=x;
  object.userData.turningY=y;
  object.userData.turningZ=z;

  turningObjects.push(object);
}


const planetsNum = document.getElementById('planets-slider');
const planetsText = document.getElementById('planets-number');
planetsNum.addEventListener('input', () => {
  planetsText.textContent = planetsNum.value;
})

const starsNum = document.getElementById('stars-slider');
const starsText = document.getElementById('stars-number');
starsNum.addEventListener('input', () => {
  starsText.textContent = starsNum.value;
})

const sunsNum = document.getElementById('suns-slider');
const sunsText = document.getElementById('suns-number');
sunsNum.addEventListener('input', () => {
  sunsText.textContent = sunsNum.value;
})


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
camera.position.setZ(10);
const controls = new OrbitControls(camera, renderer.domElement);
// Composer Stuff
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.6,
  0.5,
  0.03
);
// arguments: size, intensity, radius, which pixels
composer.addPass(bloomPass);

// const geometry = new THREE.TorusGeometry( 10, 3, 16, 100);
// const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true});
// const material = new THREE.MeshStandardMaterial( {color: 0xFF6347});
// const torus = new THREE.Mesh(geometry, material);


// const pointLight = new THREE.PointLight(0xffffff)
// pointLight.position.set(0,0,0);
// pointLight.intensity = .5;
// scene.add(pointLight);

// const ambientLight = new THREE.AmbientLight(0xffffff);
// ambientLight.intensity = .01;
// scene.add(ambientLight);
// const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper);
// const gridHelper = new THREE.GridHelper();
// scene.add(gridHelper);

// const spaceTexture = new THREE.TextureLoader().load('images/Space_8k.jpg');
// scene.background = spaceTexture;

const loader = new RGBELoader();
loader.load('./images/spaceHdrTest.hdr', function(texture) {
  
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;

});

function getRandom() {
  const multiplier = 50
  const loc = (Math.random() - 0.5)*multiplier

  if (Math.abs(loc) < 5) {
    return loc*5;
  } else {
    return loc;
  }
}

function getRandom2(multiplier) {
  // const multiplier = 30
  const num = (Math.random() - 0.5)*multiplier
  return num;

}

// Generate a random color with brighter and more varied values
function generateRandomColor() {
  const r = Math.random() * 0.6 + 0.4; // Random value between 0.4 and 1.0
  const g = Math.random() * 0.6 + 0.4;
  const b = Math.random() * 0.6 + 0.4;
  return new THREE.Color(r, g, b);
}



const moonTexture = new THREE.TextureLoader().load('images/materials/sulfur/sulphuric-rock_albedo.png');
const normalMap = new THREE.TextureLoader().load('images/materials/sulfur/sulphuric-rock_normal-ogl.png');
const roughness = new THREE.TextureLoader().load('images/materials/sulfur/sulphuric-rock_roughness.png');
const cloudTexture = new THREE.TextureLoader().load('images/clouds.png');

const imRepeat = 1
moonTexture.repeat.set(imRepeat,imRepeat);
moonTexture.wrapS = THREE.RepeatWrapping;
moonTexture.wrapT = THREE.RepeatWrapping;
normalMap.repeat.set(imRepeat,imRepeat);
normalMap.wrapS = THREE.RepeatWrapping;
normalMap.wrapT = THREE.RepeatWrapping;
roughness.repeat.set(imRepeat,imRepeat);
roughness.wrapS = THREE.RepeatWrapping;
roughness.wrapT = THREE.RepeatWrapping;
cloudTexture.repeat.set(imRepeat,imRepeat);
cloudTexture.wrapS = THREE.RepeatWrapping;
cloudTexture.wrapT = THREE.RepeatWrapping;


const planetLights = new THREE.TextureLoader().load('images/PlBig.png');
planetLights.repeat.set(1,1);
planetLights.wrapS = THREE.RepeatWrapping;
planetLights.wrapT = THREE.RepeatWrapping;

function normalizedSphere(r) {
  // const r = 3;
  let g = new THREE.BoxGeometry(1, 1, 1, 10, 10, 10);
  let v = new THREE.Vector3(); // temp vector, for re-use
  for(let i = 0; i < g.attributes.position.count; i++){
    v.fromBufferAttribute(g.attributes.position, i);
    v.normalize().multiplyScalar(r); // or v.setLength(r); 
    g.attributes.position.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();

  // const material = new THREE.MeshStandardMaterial( {
  //   map: moonTexture,
  //   normalMap: normalMap,

  // })
  // let cube = new THREE.Mesh(g, material);
  // scene.add(cube);

  return g;
}


function addClouds(size, parent) {
  const cloudGeometry = new THREE.SphereGeometry(size,32,32);

  const cloudMaterial = new THREE.MeshStandardMaterial( {
    map: cloudTexture,
    transparent: true,
    side: THREE.DoubleSide,
    emissiveMap: cloudTexture,
    emissiveIntensity: 10,

  })

  const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
  parent.add(clouds);
  turningx.push(clouds);
  addTurning(clouds,.001,0,0);

}

function addMoon(planetSize, parent) {
  const moonMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff,
    map: moonTexture,
    normalMap: normalMap,

  })

  const moonSize = Math.random() * planetSize/3;
  const moonGeometry = new THREE.SphereGeometry(Math.max(moonSize,.15),32,32);
  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  const moonGroup = new THREE.Group();
  const moonRot = Math.random();
  moonGroup.rotation.set(moonRot,0,0);
  moonGroup.add(moon);
  addTurning(moonGroup,0,.005,0);
  parent.add(moonGroup);

  const distance = (Math.random() + 1) * 2 *planetSize;

  moon.position.set(distance,0,0);

}
function addPlanet(parent) {

  const planetGroup = new THREE.Group();

  const planetSize = Math.random()*2 +.5;
  const geometry = normalizedSphere(planetSize);
  const color = generateRandomColor()
  const material = new THREE.MeshStandardMaterial( {
    color: color,
    map: moonTexture,
    normalMap: normalMap,
  })

  if (Math.random() > .8) {
    material.emissiveMap = planetLights;
    material.emissive = new THREE.Color(1,1,1);
    material.emissiveIntensity = 1;
  }


  const planet = new THREE.Mesh(
    geometry,
    material,
  )

  const multiplier = 50
  planet.position.set(getRandom2(multiplier),getRandom2(multiplier),getRandom2(multiplier));

  planetGroup.add(planet);
  addClouds(planetSize+.01, planetGroup);

  addMoon(planetSize, planet);
  parent.add(planetGroup);
  planets.push(planetGroup);
  
  addTurning(planetGroup,0,((Math.random()-.5)/1000)+.001,0);
}

const sunTexture = new THREE.TextureLoader().load('images/materials/sun/sun1.jpg');
const sunNormal = new THREE.TextureLoader().load('images/materials/sun/ground_0017_normal_opengl_2k.jpg');
sunTexture.repeat.set(1,1);
sunTexture.wrapS = THREE.RepeatWrapping;
sunTexture.wrapT = THREE.RepeatWrapping;

const sunTexture2 = new THREE.TextureLoader().load('images/8k_sun.jpg');
sunTexture2.repeat.set(1,1);
sunTexture2.wrapS = THREE.RepeatWrapping;
sunTexture2.wrapT = THREE.RepeatWrapping;

function addSun(parent) {
  const sunSize = Math.max(Math.random()*10,3)
  console.log(sunSize);
  
  const sunGeometry = new THREE.SphereGeometry(sunSize,32,32);
  const sunOuterGeo1 = new THREE.SphereGeometry(sunSize+.02,32,32);
  const sunOuterGeo2 = new THREE.SphereGeometry(sunSize+.04,32,32);

  const roughness = new THREE.TextureLoader().load('images/materials/sun/ground_0017_roughness_2k.jpg');
  const emissive = new THREE.TextureLoader().load('images/materials/sun/ground_0017_emissive_2k.jpg');

  const sunMaterial = new THREE.MeshStandardMaterial( {
    // color: 0xffffff,
    map: sunTexture,
    normalMap: sunNormal,
    // transparent: true,
    // opacity: 0.5,
    emissiveMap: sunTexture,
    emissiveIntensity: 10
    
    // emissive: emissive,
    // emissiveIntensity: 2
  });

  const sunMaterial2 = new THREE.MeshStandardMaterial( {
    // color: 0xffffff,
    map: sunTexture,
    normalMap: sunNormal,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
    emissiveMap: sunTexture,
    emissiveIntensity: 20

  });

  const sunGroup = new THREE.Group;

  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sunGroup.add(sun);
  suns.push(sun);
  sun.position.set(0,0,0);

  const sunLight = new THREE.PointLight(0xffffff)
  sunLight.position.set(sun.position.x,sun.position.y,sun.position.z);
  sunLight.intensity = .5;
  sun.add(sunLight);
  const lightHelper = new THREE.PointLightHelper(sunLight);
  // sun.add(lightHelper);

  
  const sunOuter1 = new THREE.Mesh(sunOuterGeo1, sunMaterial2);
  sunOuter1.rotation.set(Math.random(),Math.random(),Math.random());
  sunGroup.add(sunOuter1);
  turningx.push(sunOuter1);
  addTurning(sunOuter1,.001,0,0);
  const sunOuter2 = new THREE.Mesh(sunOuterGeo2, sunMaterial2);
  sunOuter2.rotation.set(Math.random(),Math.random(),Math.random());
  sunGroup.add(sunOuter2);
  addTurning(sunOuter2,0,0,.001);
  turningz.push(sunOuter2);

  parent.add(sunGroup);
  addTurning(sunGroup,0,0,.001);


}

function addGalaxy(planetNum,galaxyPosition=null) {

  const galaxyGroup = new THREE.Group;

  for (let i=0; i < planetNum; i++) {
    addPlanet(galaxyGroup);

  }

  addSun(galaxyGroup);

  const offset = 100
  if (galaxyPosition===null){
    galaxyGroup.position.set((Math.random()-.5)*offset,(Math.random()-.5)*offset,(Math.random()-.5)*offset);

  } else {
    galaxyGroup.position.set(galaxyPosition[0],galaxyPosition[1],galaxyPosition[2]);

  }
  // galaxyGroup.position.set((Math.random()-.5)*offset,(Math.random()-.5)*offset,(Math.random()-.5)*offset);
  scene.add(galaxyGroup);
  galaxies.push(galaxyGroup);
  
  addTurning(galaxyGroup,(Math.random()-.5)/1000,(Math.random()-.5)/1000,(Math.random()-.5)/1000);

}


addGalaxy(5);
addGalaxy(5);
addGalaxy(10,[0,0,0]);



function addStar() {
  // const size = (Math.random() * (0.01 - 0.05) + 0.05)
  const size = Math.abs((Math.random() * .05));
  const geometry = new THREE.SphereGeometry(size, 12, 12);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 50});

  const star = new THREE.Mesh(geometry, material);

  star.position.set(getRandom(),getRandom(),getRandom());
  scene.add(star);
}



Array(400).fill().forEach(addStar);
// Array(10).fill().forEach(addPlanet);






let repeatIncrease = 1;

function randomRepeat() {
  const currentRepeat = sunTexture.repeat.x

  if (currentRepeat < 1) {
    repeatIncrease = 1

  }

  if (currentRepeat > 1.5) {
    repeatIncrease = -1

  }

  const newRepeat = currentRepeat + (repeatIncrease * .0005);
  sunTexture.repeat.set(newRepeat, newRepeat);

  
}

const gltfLoader = new GLTFLoader();


// gltfLoader.load('./assets/speeder.glb', (gltfScene) => {
//   const speeder = gltfScene.scene;
//   speeder.scale.set(.1,.1,.1);
//   speeder.position.y = -4;
//   scene.add(speeder);
//   console.log(speeder);

  
// });



function animate() {
  composer.render();
  requestAnimationFrame( animate );

  turningObjects.forEach(obj => {
    obj.rotation.x += obj.userData.turningX;
    obj.rotation.y += obj.userData.turningY;
    obj.rotation.z += obj.userData.turningZ;
  })

  // // moon.rotation.y += 0.001
  // planets.forEach(planet => {
  //   planet.rotation.y += 0.001;
  // });
  // moons.forEach(moon => {
  //   moon.rotation.y += 0.005;
  // });

  // suns.forEach(sun => {
  //   sun.rotation.y += 0.001;
  // });

  // turningx.forEach(obj => {
  //   obj.rotation.x += 0.001;
  // });

  // turningz.forEach(obj => {
  //   obj.rotation.z += 0.001;
  // });

  // randomRepeat()

  controls.update();
  // composer.render();
  // renderer.render(scene, camera);
}

animate();