import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

import wheellie from '../img/wheellie.jpg';
import kolya from '../img/kolya.jpg';
import felix from '../img/felix.jpg';

import posx from '../img/posx.jpg';
import negx from '../img/negx.jpg';
import posy from '../img/posy.jpg';
import negy from '../img/negy.jpg';
import posz from '../img/posz.jpg';
import negz from '../img/negz.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();


const boxGeometry = new THREE.BoxGeometry();
const boxMaterial = new THREE.MeshStandardMaterial({
	color: 0xff0000,
	wireframe: false
});
const box = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(box);

const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
	color: 0xFFFFFF,
	side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
	color: 0x0000FF,
	wireframe: false              
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
sphere.castShadow = true;

sphere.position.set(-10, 10, 0);

const gui = new dat.GUI();

const sphereOptions = 
{
	sphereColor: '#ffeaff',
	sphereWireframe: false,
	sphereSpeed: 0.01
};

const boxOptions =
{
	boxColor: "#000000",
	boxWireframe: false
};

const sLightOptions =
{
	angle: 0.1,
	penumbra: 0,
	intensity: 1
}

gui.add(boxOptions, 'boxWireframe').onChange(function(e){
	box.material.wireframe = e;
});

gui.addColor(boxOptions, 'boxColor').onChange(function(e){
	box.material.color.set(e);
});

gui.addColor(sphereOptions, 'sphereColor').onChange(function(e){
	sphere.material.color.set(e);
});

gui.add(sphereOptions, 'sphereWireframe').onChange(function(e){
	sphere.material.wireframe = e;
});

gui.add(sphereOptions, 'sphereSpeed', 0, 0.1);

gui.add(sLightOptions, 'angle', 0, 1);
gui.add(sLightOptions, 'penumbra', 0, 1);
gui.add(sLightOptions, 'intensity', 0, 1);

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dLightShadowHelper);

const spotLight = new THREE.SpotLight(0xFFFFFF);
scene.add(spotLight);
spotLight.position.set(-100, 100, 0);
spotLight.castShadow = true;
spotLight.angle = 0.2;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// scene.fog = new THREE.Fog(0xFFFFFF, 0, 300);
scene.fog = new THREE.FogExp2(0xFFFFFF, 0.01);

// renderer.setClearColor(0xFFEA00);

const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(wheellie);

const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
	posx,
	negx,
	posy,
	negy,
	posz,
	negz
]);

const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
	color: 0xFFFFFF,
	map: textureLoader.load(kolya)
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);

const sphere2Geometry = new THREE.SphereGeometry(15);
const sphere2Material = new THREE.MeshBasicMaterial({
	color: 0xFFFFFF,
	map: textureLoader.load(felix)
});
const sphere2 = new THREE.Mesh(sphere2Geometry, sphere2Material);
scene.add(sphere2);
sphere2.position.set(0, 100, 0);

const sphere2Options = 
{
	sphere2Speed: 0.01
};

let step = 0;

function animate(time)
{
	box.rotation.x = time / 1000;
	box.rotation.y = time / 1000;

	step += sphereOptions.sphereSpeed;
	sphere.position.y = 10 * Math.abs(Math.sin(step));

	step += sphere2Options.sphere2Speed;
	sphere2.rotation.x = time / 10000;
	sphere2.rotation.y = time / 500;
	sphere2.position.y = 40 * Math.sin(step);
	sphere2.position.x = 40 * Math.sin(step);
	sphere2.position.z = 40 * Math.cos(step);

	spotLight.angle = sLightOptions.angle;
	spotLight.penumbra = sLightOptions.penumbra;
	spotLight.intensity = sLightOptions.intensity;
	sLightHelper.update();


	renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);


