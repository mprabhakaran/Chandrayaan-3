import * as THREE from 'three';
import {ARButton} from './ARButton.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

const text = ' Welcome to the journey of Chandraayan-3';
const textCnt = document.createElement('p')
console.log(textCnt);
let index = 0;
function typeText(){
    if(index <text.length){
        textCnt.innerHTML +=text.charAt(index);
        index++;
        setTimeout(typeText,50);
    }
}
typeText();

document.getElementById('welcome').appendChild(textCnt);

const date = document.createElement('p');
date.innerHTML = '14 JULY,2023'
document.getElementById('text-container').appendChild(date);

const venue = document.createElement('p');
venue.innerHTML = 'Satis Dhawan Space Centre,Sriharikota';
document.getElementById('location').appendChild(venue);

let scene,camera,renderer,light,earth,moon,vikramlander,landButton,ambientLight,upButton

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(70,window.innerWidth/window.innerHeight,0.1,1000);
camera.position.z = 5;

renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
document.body.appendChild(renderer.domElement);
renderer.xr.enabled = true;

//resize
window.addEventListener('resize',()=>{
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
})

//light
light = new THREE.DirectionalLight(0xffffff,1.5);
light.position.set(5,7,6);
scene.add(light);

ambientLight = new THREE.AmbientLight(0xffffff,1);

//earthObject
const earthGeometry = new THREE.SphereGeometry(1.3,32,32);
const earthMaterial = new THREE.MeshStandardMaterial({
    map:new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'),
})
earth = new THREE.Mesh(earthGeometry,earthMaterial);
scene.add(earth);

const moonGeometry = new THREE.SphereGeometry(0.3,32,32);
const moonMaterial = new THREE.MeshStandardMaterial({
    map:new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/moon_1024.jpg'),
})
moon = new THREE.Mesh(moonGeometry,moonMaterial);
moon.position.set(1.5,1.5,0);
scene.add(moon);


//stary Background

const starGeometry = new THREE.BufferGeometry();
const starcount = 1000;
const starVertices = [];
for(let i=0;i<starcount;i++){
    const x = (Math.random()-0.5)*200;
    const y = (Math.random()-0.5)*200;
    const z = (Math.random()-0.5)*200;
    starVertices.push(x,y,z);
}
starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices,3));
const starmaterial = new THREE.PointsMaterial({map:new THREE.TextureLoader().load('./star_01.png')});
const stars = new THREE.Points(starGeometry,starmaterial);
scene.add(stars);

//vikramLander
const modelLoader = new GLTFLoader();
modelLoader.load('./lander.glb',(glb)=>{
    const scale = 0.2;
    vikramlander = glb.scene;
    vikramlander.scale.x = scale;
    vikramlander.scale.y = scale;
    vikramlander.scale.z = scale;
    vikramlander.position.set(0,1.5,-1)
    
})


const cubeGeo = new THREE.BoxGeometry(1.2,0.05,1.2);
const cubeMat = new THREE.MeshStandardMaterial({map:new THREE.TextureLoader().load('./landtexture.png')});
const cube = new THREE.Mesh(cubeGeo,cubeMat);
cube.position.set(0,-1.1,-1);

const planeGeo = new THREE.PlaneGeometry(1,1,1);
const planeMat = new THREE.MeshStandardMaterial({map:new THREE.TextureLoader().load('./message.png')});
const plane = new THREE.Mesh(planeGeo,planeMat);
plane.position.set(0.05,0,-1.5);






//ARButton
const arButton = ARButton.createButton(renderer,{
    requireFeatures:['hit-test'],
    optionalFeatures:['dom-overlay'],
    domOverlay:{
        root: document.body
    }
});

arButton.style.backgroundColor = '#000';
arButton.style.fontSize = '16px'
arButton.style.color ='#fff'
arButton.style.padding = '10px 20px';
arButton.style.borderRadius ='5px';

document.getElementById('ar-button-container').appendChild(arButton);

function addLandButton(){
    landButton = document.createElement('button');
    landButton.innerHTML = 'LAND';
    landButton.style.position = 'absolute';
    landButton.style.left = '50%';
    landButton.style.bottom = '45px'
    landButton.style.transform = 'translateX(-50%)';
    landButton.style.backgroundColor = '#000';
    landButton.style.color = '#fff';
    landButton.style.fontSize = '16px';
    landButton.style.padding = '10px 20px'
    landButton.style.borderRadius = '5px';
    landButton.style.height ='80px'
    landButton.style.zIndex = '1000';
    document.getElementById('overlay-container').appendChild(landButton);

    
    landButton.addEventListener('click',()=>{
        
        if(vikramlander.position.y > cube.position.y + 0.1){
            vikramlander.position.y -=0.05;
        }
        else{
            scene.add(plane)
        }
        

    })
    
}

/*function upArrow(){
    upButton = document.createElement('button');
    upButton.innerHTML = 'LIFT'
    upButton.style.position = 'absolute';
    upButton.style.backgroundColor='#000';
    upButton.style.color = '#fff';
    upButton.style.fontSize = '18px';
    upButton.style.padding = '10px 20px';
    upButton.style.textAlign ='center';
    upButton.style.borderRadius = '5px';
    upButton.style.zIndex = '1000';
    upButton.style.left = '50%';
    upButton.style.transform = 'translateX(-50%)';
    upButton.style.bottom = '90px'
    document.getElementById('overlay-container').appendChild(upButton);

    upButton.addEventListener('click',()=>{
        vikramlander.position.y += 0.05;
    })


}*/


arButton.addEventListener('click',()=>{
    scene.remove(earth);
    scene.remove(moon);
    scene.remove(stars);
    renderer.setClearAlpha(0);
    scene.add(vikramlander);
    scene.add(ambientLight)
    scene.add(cube);
    addLandButton();
    //upArrow();
    document.getElementById('ar-button-container').removeChild(arButton);
    document.getElementById('text-container').removeChild(date);
    document.getElementById('location').removeChild(venue);
    document.getElementById('welcome').removeChild(textCnt);
    

   
})

renderer.setAnimationLoop(animate)



/*function landing(){
    if(landerLanding){
        if(vikramlander.position.y >= 0.01){
            vikramlander.position.y -= 0.01;
        }
        else{
            landerLanding = false;
        }
    }
}*/

function animate(){
    earth.rotation.y += 0.01;
    stars.rotation.y += 0.001;
    //landing();
    
    renderer.render(scene,camera);
}


