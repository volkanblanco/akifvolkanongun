import * as dat from "lil-gui";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const introduction = document.querySelector(".introduction");

/*
 _   _       _ _               _____                         
| | | |     | | |             |  _  |                        
| | | | ___ | | | ____ _ _ __ | | | |_ __   __ _ _   _ _ __  
| | | |/ _ \| | |/ / _` | '_ \| | | | '_ \ / _` | | | | '_ \ 
\ \_/ / (_) | |   < (_| | | | \ \_/ / | | | (_| | |_| | | | |
 \___/ \___/|_|_|\_\__,_|_| |_|\___/|_| |_|\__, |\__,_|_| |_|
                                            __/ |            
                                           |___/             
*/

/**
 * Base
 */
const gui = new dat.GUI({
  width: 400,
});
gui.close();
gui.hide();

if (window.location.hash === "#debug") {
  gui.show();
}

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Fonts Variables
let akiftext;
let volkantext;
let onguntext;
let title1text;
let title2text;

let mixer;
let isAvatarLoaded = false;
let avatar;
let isRotating = false;

const animationActions = [];
let activeAction;
let lastAction;

let isAnimating = false;
let isStanding = false;
let isWalking = false;
let isSkillsVisible = false;
let isCreditsVisible = false;

let isWalkingAnimationStarted = false;
let interactible = [];

let html5;
let css3;
let javascript;
let react;
let typescript;
let nodejs;
let threejs;

let skillsButton;
let creditsButton;

const fontLoader = new FontLoader();

const colors = {
  ButtonTextColor: "#fdc689",
  StudioBgMatColor: "#afbffd",
  AkifTextColor: "#969696",
  VolkanOngunTextColor: "#969696",
  TitleTextColor: "#88a0bf",
  SkillsButtonColor: "#b0e3fc",
  SkillsTextColor: "#86cafd",
  CreditsButtonColor: "#b0e3fc",
  CreditsTextColor: "#86cafd",
};

fontLoader.load("helvetiker_regular.typeface.json", (font) => {
  // Material
  const material = new THREE.MeshStandardMaterial({ color: "#969696" });
  const purpleMaterial = new THREE.MeshStandardMaterial({ color: "#88a0bf" });

  // Text
  let akifGeometry = new TextGeometry("Akif", {
    font: font,
    size: 0.32,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  gui.addColor(colors, "AkifTextColor").onChange((e) => {
    material.color.set(e);
  });

  akifGeometry.center()

  akiftext = new THREE.Mesh(akifGeometry, material);
  akiftext.castShadow = true;
  scene.add(akiftext);

  let volkanGeometry = new TextGeometry("Volkan", {
    font: font,
    size: 0.32,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  gui.addColor(colors, "VolkanOngunTextColor").onChange((e) => {
    material.color.set(e);
  });

  volkanGeometry.center();

  volkantext = new THREE.Mesh(volkanGeometry, material);
  volkantext.castShadow = true;
  scene.add(volkantext);

  const ongunGeometry = new TextGeometry("Ongun", {
    font: font,
    size: 0.32,
    height: 0.1,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  ongunGeometry.center();

  onguntext = new THREE.Mesh(ongunGeometry, material);
  onguntext.castShadow = true;
  scene.add(onguntext);

  // Title1Text
  const title1Geometry = new TextGeometry("Web Application", {
    font: font,
    size: 0.25,
    height: 0.05,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  title1Geometry.center();

  title1text = new THREE.Mesh(title1Geometry, purpleMaterial);
  title1text.castShadow = true;
  scene.add(title1text);

  // Title2Text
  const title2Geometry = new TextGeometry("Engineer", {
    font: font,
    size: 0.25,
    height: 0.05,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  });

  title2Geometry.center();

  title2text = new THREE.Mesh(title2Geometry, purpleMaterial);
  title2text.castShadow = true;
  scene.add(title2text);

  akiftext.position.set(1.18, 1.68, 5);
  volkantext.position.set(2.47, 1.67, 5);
  onguntext.position.set(1.42, 1.13, 5);
  title1text.position.set(2.04, 0.63, 5);
  title2text.position.set(1.45, 0.22, 5);

  gui.addColor(colors, "TitleTextColor").onChange((e) => {
    purpleMaterial.color.set(e);
  });

  gui.add(akiftext.position, "x", 0, 5, 0.01).name("akiftext x");
  gui.add(akiftext.position, "y", 0, 5, 0.01).name("akiftext y");
  gui.add(akiftext.position, "z", -2, 5, 0.01).name("akiftext z");

  gui.add(volkantext.position, "x", 0, 5, 0.01).name("volkantext x");
  gui.add(volkantext.position, "y", 0, 5, 0.01).name("volkantext y");
  gui.add(volkantext.position, "z", -2, 5, 0.01).name("volkantext z");

  gui.add(onguntext.position, "x", 0, 5, 0.01).name("onguntext x");
  gui.add(onguntext.position, "y", 0, 5, 0.01).name("onguntext y");
  gui.add(onguntext.position, "z", -2, 5, 0.01).name("onguntext z");

  gui.add(title1text.position, "x", 0, 5, 0.01).name("web app x");
  gui.add(title1text.position, "y", 0, 5, 0.01).name("web app y");
  gui.add(title1text.position, "z", -2, 5, 0.01).name("web app z");

  gui.add(title2text.position, "x", 0, 5, 0.01).name("engineer x");
  gui.add(title2text.position, "y", 0, 5, 0.01).name("engineer y");
  gui.add(title2text.position, "z", -2, 5, 0.01).name("engineer z");
});

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader();

// GLTF loader
const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);

const fbxloader = new FBXLoader();

const studioBGMat = new THREE.MeshStandardMaterial({ color: "#afbffd" });

gui.addColor(colors, "StudioBgMatColor").onChange(function (e) {
  studioBGMat.color.set(e);
});

const skillsButtonMat = new THREE.MeshStandardMaterial({ color: "#c4eafd" });
const skillsTextMat = new THREE.MeshStandardMaterial({ color: "#86cafd" });

const creditsButtonMat = new THREE.MeshStandardMaterial({ color: "#c4eafd" });
const creditsTextMat = new THREE.MeshStandardMaterial({ color: "#86cafd" });

gui.addColor(colors, "SkillsButtonColor").onChange((e) => {
  skillsButtonMat.color.set(e);
});

gui.addColor(colors, "SkillsTextColor").onChange((e) => {
  skillsTextMat.color.set(e);
});

gui.addColor(colors, "CreditsButtonColor").onChange((e) => {
  creditsButtonMat.color.set(e);
});

gui.addColor(colors, "CreditsTextColor").onChange((e) => {
  creditsTextMat.color.set(e);
});

fbxloader.load(
  "studio-background.fbx",
  (obj) => {
    const mesh = obj.children[0];
    mesh.material = studioBGMat;
    mesh.receiveShadow = true;
    mesh.scale.x = 125;

    scene.add(mesh);
  },
  (xhr) => {
    // console.log((xhr.loaded / xhr.total) * 100 + '% studio bg loaded')
  },
  (error) => {
    // console.log(error)
  }
);

const raycaster = new THREE.Raycaster();

loadingManager.onStart = (url, item, total) => {
  // console.log(url, item, total)
};

const progressBar = document.getElementById("progress-bar");

loadingManager.onProgress = (url, loaded, total) => {
  //console.log(url, loaded, total)
  progressBar.value = (loaded / total) * 100;
};

const progressBarContainer = document.querySelector(".progress-bar-container");

loadingManager.onLoad = () => {
  new TWEEN.Tween(progressBarContainer.style).to({ opacity: 0 }, 1000).start();

  new TWEEN.Tween(akiftext.position)
          .to({z: 0}, 500)
          .start()
          .easing(TWEEN.Easing.Quartic.Out)
          .onComplete(()=>{
            new TWEEN.Tween(volkantext.position)
              .to({z: 0}, 500)
              .start()
              .easing(TWEEN.Easing.Quartic.Out)
              .onComplete(()=>{
                new TWEEN.Tween(onguntext.position)
                         .to({z: 0}, 500)
                         .easing(TWEEN.Easing.Quartic.Out)
                         .start()
                        .onComplete(()=>{
                          new TWEEN.Tween(title1text.position)
                                  .to({z: 0}, 500)
                                  .easing(TWEEN.Easing.Quartic.Out)
                                  .start()
                                  .onComplete(()=>{
                                    new TWEEN.Tween(title2text.position)
                                            .to({z: 0}, 500)
                                            .easing(TWEEN.Easing.Quartic.Out)
                                            .start()
                                  })
                        })
              })
  })

  new TWEEN.Tween(avatar.position)
    .to({ x: 0 }, 2500)
    .onComplete(() => {
      avatar.position.y = -0.01;

      activeAction.fadeOut(0.5);
      activeAction = animationActions[1]; // hand waving
      activeAction.fadeIn(0.5);
      activeAction.play();

      isStanding = true;

      mixer.addEventListener("finished", (e) => {
        activeAction.reset();
        activeAction.fadeOut(0.5);
        activeAction = animationActions[3]; // Standing
        activeAction.fadeIn(0.5);
        activeAction.play();
        isStanding = true;

        new TWEEN.Tween(skillsButton.position)
          .to({ x: 2.9, y: 0.25, z: 0 }, 1000)
          .easing(TWEEN.Easing.Quintic.Out)
          .onComplete(() => {
            // console.log("skills button slide complete")
          })
          .start();
      });

      new TWEEN.Tween(avatar.rotation)
        .to({ y: 0 }, 300)
        .onComplete(() => {
          isAvatarLoaded = true;
        })
        .onUpdate(() => {
          avatar.position.y = -0.01;
        })
        .start();
    })
    .onStart(() => {
      isAnimating = true;
      activeAction = animationActions[0]; // running
      lastAction = animationActions[0];
      activeAction.play();
    })
    .onUpdate(() => {
      avatar.rotation.y = 1.57;
      avatar.position.y = -0.01;
    })
    .start();
};

// loadingManager.onError = (url) => {
//     console.error(`got a problem loading ${url}`)
// }

gltfLoader.load("SkillsButton.glb", (gltf) => {
  const model = gltf.scene;

  model.traverse(function (child) {
    child.castShadow = true;

    if (child.isMesh && child.name === "SkillsButtonBody") {
      child.material = skillsButtonMat;
    } else {
      child.material = skillsTextMat;
    }
  });

  skillsButton = model;

  interactible.push(skillsButton);

  model.scale.set(40, 40, 40);
  model.position.set(23, 0.15, -0.5);

  scene.add(model);

  gui.add(model.position, "x", -25, 25, 0.01).name("SkillsButton x");
  gui.add(model.position, "y", 0, 5, 0.01).name("SkillsButton y");
  gui.add(model.position, "z", 0, 5, 0.01).name("SkillsButton z");
});

gltfLoader.load("CreditsButton.glb", (gltf) => {
  const model = gltf.scene;

  model.traverse(function (child) {
    child.castShadow = true;

    if (child.isMesh && child.name === "CreditsButtonBody") {
      child.material = creditsButtonMat;
    } else {
      child.material = creditsTextMat;
    }
  });

  creditsButton = model;

  interactible.push(creditsButton);

  model.scale.set(40, 40, 40);
  model.position.set(23, 0.26, -0.5);

  scene.add(model);

  gui.add(model.position, "x", -25, 25, 0.01).name("CreditsButton x");
  gui.add(model.position, "y", 0, 5, 0.01).name("CreditsButton y");
  gui.add(model.position, "z", 0, 5, 0.01).name("CreditsButton z");
});

gltfLoader.load("volkan-avatar.glb", (gltf) => {
  avatar = gltf.scene;
  mixer = new THREE.AnimationMixer(avatar);

  avatar.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  avatar.position.set(-4.5, -0.01, 0);
  scene.add(avatar);

  gltfLoader.load("volkan-avatar-running-skeleton-animation.glb", (gltf) => {
    const clips = gltf.animations;
    const clip = THREE.AnimationClip.findByName(clips, "Running");
    const action = mixer.clipAction(clip);
    animationActions.push(action);

    gltfLoader.load(
      "volkan-avatar-handwaving-skeleton-animation.glb",
      (gltf) => {
        const clips = gltf.animations;
        const clip = THREE.AnimationClip.findByName(clips, "HandWaving");
        const action = mixer.clipAction(clip);
        action.loop = THREE.LoopOnce;
        animationActions.push(action);

        gltfLoader.load(
          "volkan-avatar-walking-skeleton-animation.glb",
          (gltf) => {
            const clips = gltf.animations;
            const clip = THREE.AnimationClip.findByName(clips, "Walking");
            const action = mixer.clipAction(clip);
            animationActions.push(action);

            gltfLoader.load(
              "volkan-avatar-standing-skeleton-animation.glb",
              (gltf) => {
                const clips = gltf.animations;
                const clip = THREE.AnimationClip.findByName(clips, "Standing");
                const action = mixer.clipAction(clip);
                animationActions.push(action);
              }
            );
          }
        );
      }
    );
  });
});

gltfLoader.load("HTML5.glb", (gltf) => {
  const html5DebugGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
  const html5DebugMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: 0x00ff00,
  });

  html5 = new THREE.Mesh(html5DebugGeometry, html5DebugMaterial);
  const model = gltf.scene;
  model.scale.set(10, 10, 10);

  html5.name = "html5";
  html5.add(model);
  scene.add(html5);

  html5.position.set(25, 1.66, -0.21);

  // scene.add( new THREE.BoxHelper(html5, 0xFF0000) )

  html5.traverse(function (child) {
    if (child.isMesh && child.name !== "html5") {
      child.castShadow = true;
    }
  });

  interactible.push(html5);

  gui.add(html5.position, "x", -15, 15, 0.01).name("html5 x");
  gui.add(html5.position, "y", -15, 15, 0.01).name("html5 y");
  gui.add(html5.position, "z", -15, 15, 0.01).name("html5 z");
});

gltfLoader.load("CSS3.glb", (gltf) => {
  const css3DebugGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
  const css3DebugMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: 0x00ff00,
  });

  css3 = new THREE.Mesh(css3DebugGeometry, css3DebugMaterial);
  css3.name = "css3";
  css3.position.set(25, 1.66, -0.21);

  const model = gltf.scene;
  model.scale.set(10, 10, 10);
  css3.add(model);
  model.position.set(-0.78, 0, 0);
  scene.add(css3);

  // scene.add( new THREE.BoxHelper(css3, 0xFF0000) )

  css3.traverse(function (child) {
    if (child.isMesh && child.name !== "css3") {
      child.castShadow = true;
    }
  });

  interactible.push(css3);

  gui.add(css3.position, "x", -15, 15, 0.01).name("css3 x");
  gui.add(css3.position, "y", -15, 15, 0.01).name("css3 y");
  gui.add(css3.position, "z", -15, 15, 0.01).name("css3 z");
});

gltfLoader.load("JAVASCRIPT.glb", (gltf) => {
  const javascriptDebugGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
  const javascriptDebugMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: 0x00ff00,
  });

  javascript = new THREE.Mesh(javascriptDebugGeometry, javascriptDebugMaterial);
  javascript.name = "javascript";

  const model = gltf.scene;
  javascript.add(model);
  model.scale.set(10, 10, 10);
  model.position.set(-1.48, 0, 0);
  scene.add(javascript);

  javascript.position.set(25, 1.66, -0.21);

  // scene.add( new THREE.BoxHelper(javascript, 0xFF0000) )

  javascript.traverse(function (child) {
    if (child.isMesh && child.name !== "javascript") {
      child.castShadow = true;
    }
  });

  interactible.push(javascript);

  gui.add(javascript.position, "x", -15, 15, 0.01).name("javascript x");
  gui.add(javascript.position, "y", -15, 15, 0.01).name("javascript y");
  gui.add(javascript.position, "z", -15, 15, 0.01).name("javascript z");
});

gltfLoader.load("REACT.glb", (gltf) => {
  const reactDebugGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
  const reactDebugMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: 0x00ff00,
  });

  react = new THREE.Mesh(reactDebugGeometry, reactDebugMaterial);
  react.name = "react";

  const model = gltf.scene;
  react.add(model);
  model.scale.set(10, 10, 10);
  scene.add(react);
  model.position.set(-2.35, 0, 0);

  react.position.set(25, 1.66, -0.21);

  const reactMaterial = new THREE.MeshStandardMaterial({ color: "#00d0d0" });

  react.traverse(function (child) {
    if (child.isMesh && child.name !== "react") {
      child.castShadow = true;
      if (child.name === "react") return;
      child.material = reactMaterial;
    }
  });

  // scene.add( new THREE.BoxHelper(react, 0xFF0000) )

  interactible.push(react);

  gui.add(react.position, "x", -15, 15, 0.01).name("react x");
  gui.add(react.position, "y", -15, 15, 0.01).name("react y");
  gui.add(react.position, "z", -15, 15, 0.01).name("react z");
});

gltfLoader.load("TYPESCRIPT.glb", (gltf) => {
  const typescriptDebugGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
  const typescriptDebugMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: 0x00ff00,
  });

  typescript = new THREE.Mesh(typescriptDebugGeometry, typescriptDebugMaterial);
  typescript.name = "typescript";

  const model = gltf.scene;
  model.scale.set(10, 10, 10);

  typescript.add(model);
  scene.add(typescript);

  typescript.position.set(25, 0.58, -0.21);
  model.position.set(-3.25, 0, 0);

  typescript.traverse(function (child) {
    if (child.isMesh && child.name !== "typescript") {
      child.castShadow = true;
    }
  });

  interactible.push(typescript);

  // scene.add( new THREE.BoxHelper(typescript, 0xFF0000) )

  gui.add(typescript.position, "x", -15, 15, 0.01).name("typescript x");
  gui.add(typescript.position, "y", -15, 15, 0.01).name("typescript y");
  gui.add(typescript.position, "z", -15, 15, 0.01).name("typescript z");
});

gltfLoader.load("NODEJS.glb", (gltf) => {
  const nodejsDebugGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
  const nodejsDebugMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: 0x00ff00,
  });

  nodejs = new THREE.Mesh(nodejsDebugGeometry, nodejsDebugMaterial);
  nodejs.name = "nodejs";

  const model = gltf.scene;
  nodejs.add(model);
  scene.add(nodejs);
  model.scale.set(10, 10, 10);

  nodejs.position.set(25, 0.58, -0.21);
  model.position.set(-4.37, 0, 0);

  nodejs.traverse(function (child) {
    if (child.isMesh && child.name !== "nodejs") {
      child.castShadow = true;
    }
  });

  interactible.push(nodejs);

  // scene.add( new THREE.BoxHelper(nodejs, 0xFF0000) )

  gui.add(nodejs.position, "x", -15, 15, 0.01).name("nodejs x");
  gui.add(nodejs.position, "y", -15, 15, 0.01).name("nodejs y");
  gui.add(nodejs.position, "z", -15, 15, 0.01).name("nodejs z");
});

gltfLoader.load("THREEJS.glb", (gltf) => {
  const threejsDebugGeometry = new THREE.BoxGeometry(0.6, 0.9, 0.2);
  const threejsDebugMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0,
    color: 0x00ff00,
  });

  threejs = new THREE.Mesh(threejsDebugGeometry, threejsDebugMaterial);
  threejs.name = "threejs";

  const model = gltf.scene;
  model.scale.set(10, 10, 10);
  threejs.add(model);
  scene.add(threejs);

  threejs.position.set(25, 0.58, -0.21);
  model.position.set(-5.46, 0, 0);

  threejs.traverse(function (child) {
    if (child.isMesh && child.name !== "threejs") {
      child.castShadow = true;
    }
  });

  interactible.push(threejs);

  // scene.add( new THREE.BoxHelper(threejs, 0xFF0000) )

  gui.add(threejs.position, "x", -15, 15, 0.01).name("threejs x");
  gui.add(threejs.position, "y", -15, 15, 0.01).name("threejs y");
  gui.add(threejs.position, "z", -15, 15, 0.01).name("threejs z");
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1.3;
camera.position.y = 1;
camera.position.z = 4;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const directionalLight = new THREE.DirectionalLight("#FFFFFF", 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 4096;
directionalLight.shadow.mapSize.height = 4096;
directionalLight.position.set(-10, 20, 10);
directionalLight.shadow.camera.top = 10;
directionalLight.shadow.camera.bottom = -10;
directionalLight.shadow.camera.left = -10;
directionalLight.shadow.camera.right = 10;
scene.add(directionalLight);

// const helper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(helper)

gui
  .addColor(directionalLight, "color")
  .name("Directional Light Color")
  .onChange((e) => {
    directionalLight.color = e;
  });

gui
  .add(directionalLight.position, "x")
  .min(-20)
  .max(20)
  .step(0.01)
  .name("Directional Light position x")
  .onChange((e) => {
    directionalLight.position.x = e;
  });

gui
  .add(directionalLight.position, "y")
  .min(-20)
  .max(20)
  .step(0.01)
  .name("Directional Light position y")
  .onChange((e) => {
    directionalLight.position.y = e;
  });

gui
  .add(directionalLight.position, "z")
  .min(-20)
  .max(20)
  .step(0.01)
  .name("Directional Light position z")
  .onChange((e) => {
    directionalLight.position.z = e;
  });

const ambientLight = new THREE.AmbientLight("#FFF799", 0.5);
scene.add(ambientLight);

let skillsButtonBg;
let skillsButtonText;
let hoveredOnSkillsButton = false;

let creditsButtonBg;
let creditsButtonText;
let hoveredOnCreditsButton = false;

let hoveredOnHtml = false;
let isHtmlAnimating = false;

let hoveredOnCss = false;
let isCssAnimating = false;

let hoveredOnJavascript = false;
let isJavascriptAnimating = false;

let hoveredOnReact = false;
let isReactAnimating = false;

let hoveredOnTypescript = false;
let isTypescriptAnimating = false;

let hoveredOnNodejs = false;
let isNodejsAnimating = false;

let hoveredOnThreejs = false;
let isThreejsAnimating = false;

let firstScreenCompleted = false;
let secondScreenCompleted = false;

document.addEventListener("mousemove", onDocumentMouseMove, false);

document.addEventListener("click", onDocumentMouseClick, false);

function onDocumentMouseMove(event) {
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(interactible);

  if (intersects.length > 0) {
    for (let i = 0; i < intersects.length; i++) {
      const child = intersects[i];

      document.querySelector("body").style.cursor = "pointer";

      if (child.object.name === "SkillsButtonBody") {
        if (hoveredOnCreditsButton) return;

        skillsButtonText = skillsButton.children[0].children[0];
        skillsButtonBg = skillsButton.children[0].children[1];
        skillsButtonBg.material.color.set("#90c5e0");
        skillsButtonText.material.color.set("#69a8d8");
        hoveredOnSkillsButton = true;
      } else if (child.object.name === "CreditsButtonBody") {
        if (hoveredOnSkillsButton) return;

        creditsButtonText = creditsButton.children[0].children[0];
        creditsButtonBg = creditsButton.children[0].children[1];
        creditsButtonBg.material.color.set("#90c5e0");
        creditsButtonText.material.color.set("#69a8d8");
        hoveredOnCreditsButton = true;
      }

      if (child.object.name === "html5" && !hoveredOnHtml) {
        if (isHtmlAnimating && !isWalkingAnimationStarted) return;

        new TWEEN.Tween(html5.rotation)
          .to({ y: 6.28 }, 1500)
          .onStart(() => {
            isHtmlAnimating = true;
          })
          .onComplete(() => {
            // console.log("turned 360")
            hoveredOnHtml = true;
            isHtmlAnimating = false;

            setTimeout(() => {
              new TWEEN.Tween(html5.rotation)
                .to({ y: 0.0001 }, 1500)
                .onComplete(() => {
                  // console.log("turned -360")
                  hoveredOnHtml = false;
                  isHtmlAnimating = false;
                })
                .onStart(() => {
                  isHtmlAnimating = true;
                })
                .start();
            }, 500);
          })
          .start();
      }

      if (child.object.name === "css3" && !hoveredOnCss) {
        if (isCssAnimating && !isWalkingAnimationStarted) return;

        new TWEEN.Tween(css3.rotation)
          .to({ y: 6.28 }, 1500)
          .onStart(() => {
            isCssAnimating = true;
          })
          .onComplete(() => {
            // console.log("turned 360")
            hoveredOnCss = true;
            isCssAnimating = false;

            setTimeout(() => {
              new TWEEN.Tween(css3.rotation)
                .to({ y: 0.0001 }, 1500)
                .onComplete(() => {
                  // console.log("turned -360")
                  hoveredOnCss = false;
                  isCssAnimating = false;
                })
                .onStart(() => {
                  isCssAnimating = true;
                })
                .start();
            }, 500);
          })
          .start();
      }

      if (child.object.name === "javascript" && !hoveredOnJavascript) {
        if (isJavascriptAnimating && !isWalkingAnimationStarted) return;

        new TWEEN.Tween(javascript.rotation)
          .to({ y: 6.28 }, 1500)
          .onStart(() => {
            isJavascriptAnimating = true;
          })
          .onComplete(() => {
            // console.log("turned 360")
            hoveredOnJavascript = true;
            isJavascriptAnimating = false;

            setTimeout(() => {
              new TWEEN.Tween(javascript.rotation)
                .to({ y: 0.0001 }, 1500)
                .onComplete(() => {
                  // console.log("turned -360")
                  hoveredOnJavascript = false;
                  isJavascriptAnimating = false;
                })
                .onStart(() => {
                  isJavascriptAnimating = true;
                })
                .start();
            }, 500);
          })
          .start();
      }

      if (child.object.name === "react" && !hoveredOnReact) {
        if (isReactAnimating && !isWalkingAnimationStarted) return;

        new TWEEN.Tween(react.rotation)
          .to({ y: 6.28 }, 1500)
          .onStart(() => {
            isReactAnimating = true;
          })
          .onComplete(() => {
            // console.log("turned 360")
            hoveredOnReact = true;
            isReactAnimating = false;

            setTimeout(() => {
              new TWEEN.Tween(react.rotation)
                .to({ y: 0.0001 }, 1500)
                .onComplete(() => {
                  // console.log("turned -360")
                  hoveredOnReact = false;
                  isReactAnimating = false;
                })
                .onStart(() => {
                  isReactAnimating = true;
                })
                .start();
            }, 500);
          })
          .start();
      }

      if (child.object.name === "typescript" && !hoveredOnTypescript) {
        if (isTypescriptAnimating && !isWalkingAnimationStarted) return;

        new TWEEN.Tween(typescript.rotation)
          .to({ y: 6.28 }, 1500)
          .onStart(() => {
            isTypescriptAnimating = true;
          })
          .onComplete(() => {
            // console.log("turned 360")
            hoveredOnTypescript = true;
            isTypescriptAnimating = false;

            setTimeout(() => {
              new TWEEN.Tween(typescript.rotation)
                .to({ y: 0.0001 }, 1500)
                .onComplete(() => {
                  // console.log("turned -360")
                  hoveredOnTypescript = false;
                  isTypescriptAnimating = false;
                })
                .onStart(() => {
                  isTypescriptAnimating = true;
                })
                .start();
            }, 500);
          })
          .start();
      }

      if (child.object.name === "nodejs" && !hoveredOnNodejs) {
        if (isNodejsAnimating && !isWalkingAnimationStarted) return;

        new TWEEN.Tween(nodejs.rotation)
          .to({ y: 6.28 }, 1500)
          .onStart(() => {
            isNodejsAnimating = true;
          })
          .onComplete(() => {
            // console.log("turned 360")
            hoveredOnNodejs = true;
            isNodejsAnimating = false;

            setTimeout(() => {
              new TWEEN.Tween(nodejs.rotation)
                .to({ y: 0.0001 }, 1500)
                .onComplete(() => {
                  // console.log("turned -360")
                  hoveredOnNodejs = false;
                  isNodejsAnimating = false;
                })
                .onStart(() => {
                  isNodejsAnimating = true;
                })
                .start();
            }, 500);
          })
          .start();
      }

      if (child.object.name === "threejs" && !hoveredOnThreejs) {
        if (isThreejsAnimating && !isWalkingAnimationStarted) return;

        new TWEEN.Tween(threejs.rotation)
          .to({ y: 6.28 }, 1500)
          .onStart(() => {
            isThreejsAnimating = true;
          })
          .onComplete(() => {
            // console.log("turned 360")
            hoveredOnThreejs = true;
            isThreejsAnimating = false;

            setTimeout(() => {
              new TWEEN.Tween(threejs.rotation)
                .to({ y: 0.0001 }, 1500)
                .onComplete(() => {
                  // console.log("turned -360")
                  hoveredOnThreejs = false;
                  isThreejsAnimating = false;
                })
                .onStart(() => {
                  isThreejsAnimating = true;
                })
                .start();
            }, 500);
          })
          .start();
      }
    }
  } else {
    skillsButtonBg?.material.color.set("#b0e3fc");
    skillsButtonText?.material.color.set("#86cafd");

    creditsButtonBg?.material.color.set("#b0e3fc");
    creditsButtonText?.material.color.set("#86cafd");

    hoveredOnSkillsButton = false;
    hoveredOnCreditsButton = false;

    document.querySelector("body").style.cursor = "default";
  }
}

function onDocumentMouseClick(event) {
  const mouse = {
    x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
  };

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(interactible, true);

  if (intersects.length > 0) {
    if (
      skillsButton.children[0].name === "SkillsButton" &&
      hoveredOnSkillsButton &&
      !firstScreenCompleted
    ) {
      if (isWalkingAnimationStarted) return;

      isWalkingAnimationStarted = true;

      // console.log("Skills Button Clicked")

      new TWEEN.Tween(akiftext.position)
        .to({ z: -0.5 }, 300)
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
        .onComplete(() => {
          new TWEEN.Tween(volkantext.position)
          .to({ z: -0.5 }, 300)
          .easing(TWEEN.Easing.Cubic.Out)
          .start()
          .onComplete(() => {
            new TWEEN.Tween(onguntext.position)
              .to({ z: -0.5 }, 300)
              .easing(TWEEN.Easing.Cubic.Out)
              .start()
              .onComplete(() => {
                new TWEEN.Tween(title1text.position)
                  .to({ z: -0.5 }, 300)
                  .easing(TWEEN.Easing.Cubic.Out)
                  .start()
                  .onComplete(() => {
                    new TWEEN.Tween(title2text.position)
                      .to({ z: -0.5 }, 300)
                      //.easing(TWEEN.Easing.Cubic.Out)
                      .start()
                      .onComplete(() => {
                        new TWEEN.Tween(skillsButton.position)
                          .to({ z: -0.5 }, 300)
                          .onComplete(() => {
                            new TWEEN.Tween(avatar.children[0].rotation)
                              .to({ y: Math.PI / 2 }, 350)
                              .onComplete(() => {
                                // console.log('rotation complete')

                                new TWEEN.Tween(camera.position)
                                  .to({ x: 6 }, 3500)
                                  .start()
                                  .onUpdate(() => {
                                    // console.log('moving camera')
                                  });

                                new TWEEN.Tween(avatar.children[0].position)
                                  .to({ x: 4 }, 3500)
                                  .start()
                                  .onComplete(() => {
                                    // console.log('walking complete')

                                    setAction(animationActions[3]);

                                    new TWEEN.Tween(avatar.children[0].rotation)
                                      .to({ y: -0.005 }, 350)
                                      .onComplete(() => {
                                        // console.log("rotation complete")

                                        isStanding = true;
                                        isWalking = false;
                                        isSkillsVisible = true;

                                        new TWEEN.Tween(html5.position)
                                          .to({ x: 4.96 }, 350)
                                          .easing(TWEEN.Easing.Quintic.Out)
                                          .start()
                                          .onComplete(() => {
                                            new TWEEN.Tween(css3.position)
                                              .to({ x: 5.94 }, 350)
                                              .easing(TWEEN.Easing.Quintic.Out)
                                              .start()
                                              .onComplete(() => {
                                                new TWEEN.Tween(
                                                  javascript.position
                                                )
                                                  .to({ x: 6.99 }, 350)
                                                  .easing(
                                                    TWEEN.Easing.Quintic.Out
                                                  )
                                                  .start()
                                                  .onComplete(() => {
                                                    new TWEEN.Tween(
                                                      react.position
                                                    )
                                                      .to({ x: 8.16 }, 350)
                                                      .easing(
                                                        TWEEN.Easing.Quintic.Out
                                                      )
                                                      .start()
                                                      .onComplete(() => {
                                                        new TWEEN.Tween(
                                                          typescript.position
                                                        )
                                                          .to({ x: 4.96 }, 350)
                                                          .easing(
                                                            TWEEN.Easing.Quintic
                                                              .Out
                                                          )
                                                          .start()
                                                          .onComplete(() => {
                                                            new TWEEN.Tween(
                                                              nodejs.position
                                                            )
                                                              .to(
                                                                { x: 5.97 },
                                                                350
                                                              )
                                                              .easing(
                                                                TWEEN.Easing
                                                                  .Quintic.Out
                                                              )
                                                              .start()
                                                              .onComplete(() => {
                                                                new TWEEN.Tween(
                                                                  threejs.position
                                                                )
                                                                  .to(
                                                                    { x: 6.99 },
                                                                    350
                                                                  )
                                                                  .easing(
                                                                    TWEEN.Easing
                                                                      .Quintic.Out
                                                                  )
                                                                  .start()
                                                                  .onComplete(
                                                                    () => {
                                                                      // console.log('text animations complete')

                                                                      new TWEEN.Tween(
                                                                        creditsButton.position
                                                                      )
                                                                        .to(
                                                                          {
                                                                            x: 8.35,
                                                                          },
                                                                          250
                                                                        )
                                                                        .easing(
                                                                          TWEEN
                                                                            .Easing
                                                                            .Quintic
                                                                            .Out
                                                                        )
                                                                        .start()
                                                                        .onComplete(
                                                                          () => {
                                                                            // console.log('credits button complete')

                                                                            isWalkingAnimationStarted = false;
                                                                            firstScreenCompleted = true;
                                                                          });
                                                                    });
                                                              });
                                                          });
                                                      });
                                                  });
                                              });
                                          });
                                      })
                                      .start();
                                  });
                              })
                              .onUpdate(() => {
                                isWalking = true;
                                setAction(animationActions[2]);
                              })
                              .start();
                          })
                          .start();
                      });
                  });
              });
          });
        })
    }

    if (
      creditsButton.children[0].name === "CreditsButton" &&
      hoveredOnCreditsButton &&
      !isCreditsVisible &&
      !secondScreenCompleted
    ) {
      if (isWalkingAnimationStarted) return;

      isWalkingAnimationStarted = true;

      // console.log("Skills Button Clicked")

      new TWEEN.Tween(avatar.children[0].rotation)
        .to({ y: Math.PI / 2 }, 350)
        .onComplete(() => {
          // console.log('rotation complete')

          new TWEEN.Tween(camera.position)
            .to({ x: 12 }, 3500)
            .start()
            .onUpdate(() => {
              // console.log('moving camera')
            });

          new TWEEN.Tween(avatar.children[0].position)
            .to({ x: 10 }, 3500)
            .start()
            .onComplete(() => {
              // console.log('walking complete')

              setAction(animationActions[3]);

              new TWEEN.Tween(avatar.children[0].rotation)
                .to({ y: -0.005 }, 350)
                .onComplete(() => {
                  // console.log("rotation complete")

                  isStanding = true;
                  isWalking = false;
                  isCreditsVisible = true;
                  secondScreenCompleted = true;

                  introduction.classList.add("animated");

                  if(navigator.userAgent.match(/Android|iPhone|iPad/i)){
                    if (window.matchMedia("(orientation: portrait)").matches) {
                      introduction.classList.add("mobile");
                      introduction.classList.add("portrait");
                    }

                    if (window.matchMedia("(orientation: landscape)").matches) {
                       introduction.classList.add("mobile");
                       introduction.classList.add("landscape");
                    }
                  }

                  setTimeout(() => {
                    introduction.firstElementChild.style.opacity = 1;
                  }, 1000);
                })
                .start();
            });
        })
        .onUpdate(() => {
          isWalking = true;
          setAction(animationActions[2]);
        })
        .start();
    }
  }
}

window.addEventListener("orientationchange", function() {

  if(navigator.userAgent.match(/Android|iPhone/i) || iPadOS()){
    if(window.orientation === 0){
      introduction.classList.add("portrait")
      introduction.classList.remove('landscape')

      document.querySelector('.portrait-landscape').classList.remove('hide')
      document.querySelector('.webgl').classList.remove('hide')
      document.querySelector('.webgl').style.opacity = 0

    } else if((window.orientation < 0 || window.orientation > 0)) {
      
      document.querySelector('.portrait-landscape').classList.add('hide')
      document.querySelector('.webgl').style.opacity = 1

      if(isCreditsVisible){
        introduction.classList.add("landscape")
        introduction.classList.remove('portrait')
      };
    } else if (window.orientation === -180 || window.orientation === 180){
      introduction.classList.add("portrait")
      introduction.classList.remove('landscape')

      document.querySelector('.portrait-landscape').classList.remove('hide')
      document.querySelector('.webgl').classList.remove('hide')
      document.querySelector('.webgl').style.opacity = 0
    }
  }

}, false);

function iPadOS() {
    return [
            'iPad Simulator',
            'iPad',
        ].includes(navigator.platform)
        // iPad on iOS 13 detection
        ||
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
}

window.addEventListener('load', ()=>{
  if(navigator.userAgent.match(/Android|iPhone/i) || iPadOS()){
    if(window.orientation === 0){
      document.querySelector('.portrait-landscape').style.opacity = 1
      document.querySelector('.webgl').style.opacity = 0
    } else if((window.orientation < 0 || window.orientation > 0)) {
      document.querySelector('.portrait-landscape').style.opacity = 1
      document.querySelector('.webgl').style.opacity = 0
    }
  } else{
    new TWEEN.Tween(document.querySelector(".webgl").style)
      .to({ opacity: 1 }, 1000)
      .start();
  }

  if((window.orientation < 0 || window.orientation > 0)){
    document.querySelector('.portrait-landscape').classList.add('hide')
    document.querySelector('.webgl').style.opacity = 1
  }
})

/**
 * Animate
 */
const clock = new THREE.Clock();

const setAction = (toAction) => {
  if (toAction != activeAction) {
    lastAction = activeAction;
    activeAction = toAction;
    lastAction.fadeOut(0.2);
    activeAction.reset();
    activeAction.fadeIn(0.2);
    activeAction.play();
  }
};

const tick = () => {
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  if (isAnimating) {
    mixer.update(clock.getDelta());
  }

  if (isAvatarLoaded) {
    avatar.position.set(0, -0.01, 0);
  }

  TWEEN.update();

  // Render
  renderer.render(scene, camera);
};

tick();

// this website couldn't be developed without the help of
// steve, apple, giizem
// sean bradleys threejs with typescript tutorial
