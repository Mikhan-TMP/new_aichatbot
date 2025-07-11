'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {  useFBX, Text, useGLTF } from '@react-three/drei'
import { BVHLoader } from 'three/examples/jsm/loaders/BVHLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


import * as THREE from 'three';
import { backendUrl } from "@/config";


export default function AvatarFBX({ bvhQueue = [] }: { bvhQueue?: string[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const clock = new THREE.Clock();
  const mountRef = useRef<HTMLDivElement>(null);
  const [bvhLoaded, setBvhLoaded] = useState(false);
  const [bvhPlaying, setBvhPlaying] = useState(true);
  const [mixer, setMixer] = useState<THREE.AnimationMixer | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const bvhClipActionRef = useRef<THREE.AnimationAction | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const avatarRef = useRef<THREE.Group | null>(null);


  useEffect(() => {
    let scene = new THREE.Scene();
    sceneRef.current = scene;
    let camera = new THREE.PerspectiveCamera(50, 1, 1, 100);
    camera.position.z = 10;
    camera.position.y = 5;
    camera.position.z = 20;
    camera.lookAt(0, 0, 0);
    const gltfLoader = new GLTFLoader();


    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const mount = mountRef.current!;
    const resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);
    // return () => resizeObserver.disconnect();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Use soft shadows
    renderer.setPixelRatio(window.devicePixelRatio);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Add lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    let dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(1, 1, 1);
    scene.add(dirLight);

    // Create avatar
    const avatar = createBVHAvatar();
    avatarRef.current = avatar;
    // avatar.scale.set(5, 5, 5); // Scale avatar to double size
    avatar.position.set(0, -6, 0); // Adjust position to be on
    scene.add(avatar);

    // AVATAR BUT GLB FILE NOT MANUAL CREATION 
    // gltfLoader.load('/models/michelle_the_teenage_girl.glb', (gltf) => {
    //   const model = gltf.scene;
    //   model.scale.set(3, 3, 3);
    //   model.position.set(0, -6, 0);
      

    //   model.traverse((obj) => {
    //     if (obj instanceof THREE.Mesh) {
    //       obj.castShadow = true;
    //       obj.receiveShadow = true;
    //     }
    //   });

    //   scene.add(model);
    // });

    // Skeleton helper
    const skeletonHelper = new THREE.SkeletonHelper(avatar);
    scene.add(skeletonHelper);

    // Mount renderer
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }

    

    dirLight.castShadow = true;
    avatar.traverse(obj => {
      if (obj instanceof THREE.Mesh) obj.castShadow = true;
    });

    
    // Animation loop
    const clock = new THREE.Clock();
    let frameId: number;
    function animate() {
      frameId = requestAnimationFrame(animate);
      if (mixerRef.current && bvhPlaying) {
        mixerRef.current.update(clock.getDelta());
      }
      renderer.render(scene, camera);
    }
    animate();

    let controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    // controls.minDistance = 5;
    // controls.maxDistance = 20;

    // ADD GRID HELPER
    // const gridHelper = new THREE.GridHelper(100, 100);
    // gridHelper.position.y = -1; // Adjust position to avoid z-fighting
    // scene.add(gridHelper);

    //ADD AVATAR NAME
    const loader = new FontLoader();
    loader.load('fonts/helvetiker_regular.typeface.json', (font) => {
      console.log('Font loaded');
      const textGeometry = new TextGeometry('Bianca Vinas', {
        font: font,
        size: 0.51,
        depth: 0.1,
        curveSegments: 12,
      });
      // Center the geometry
      textGeometry.computeBoundingBox();
      const centerOffset = -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x);
      textGeometry.translate(centerOffset, 0, 0);

      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textMesh.position.set(0, 1.5, 0); 
      textMesh.castShadow = true;
      scene.add(textMesh);
    });

    // ADD TREE MODEL
    gltfLoader.load('/environment/tree.glb', (gltf) => {
      const tree = gltf.scene;
      tree.position.set(10, -7.3, -10); // Adjust position (Y to match ground)
      tree.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
      scene.add(tree);
    }, undefined, (error) => {
      console.error('Error loading tree model:', error);
    });

    //add texture
    const textureLoader = new THREE.TextureLoader();
    const grassTexture = textureLoader.load('/environment/grass.jpg');
    grassTexture.wrapS = THREE.RepeatWrapping;
    grassTexture.wrapT = THREE.RepeatWrapping;
    grassTexture.repeat.set(25, 25); // Controls how often the texture repeats

    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshStandardMaterial({ map: grassTexture });

    const ground = new THREE.Mesh(planeGeometry, planeMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -7.3;
    ground.receiveShadow = true;
    scene.add(ground);

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      controls.dispose();
    };
  }, []);


  /*  Effect to load BVH data.
  This effect checks if bvhRaw is provided. If it is, it parses and applies
  the BVH data directly. If not, it fetches a default BVH file from the server.
  The BVH data is parsed and applied to the avatar using the parseAndApplyBVH function.
  */
  useEffect(() => {
      if (bvhQueue.length > 0 && bvhQueue[currentIdx]) {
          console.log("Playing BVH index:", currentIdx, "Prompt:", bvhQueue[currentIdx]?.slice(0, 100));
          parseAndApplyBVH(bvhQueue[currentIdx]);
      }
      // eslint-disable-next-line
  }, [bvhQueue, currentIdx]);
  
  /*
  Function to create a BVH avatar with bones and meshes.
  This function constructs a humanoid skeleton with bones for hips, legs, spine, neck, head, and hands.
  Each bone is represented by a THREE.Bone object, and meshes are added to visualize the bones.
  The avatar is scaled up for better visibility.
  */
  function createBVHAvatar() {
      // Create each bone
      const hips = new THREE.Bone();
      hips.name = "Hips";
      hips.position.set(-0.001795, -0.223333, 0.028219);
      addMeshToBone(hips, 'sphere', 0.08, 0x888888);

      // Left leg
      const leftUpLeg = new THREE.Bone();
      leftUpLeg.name = "LeftUpLeg";
      leftUpLeg.position.set(0.069520, -0.091406, -0.006815);
      hips.add(leftUpLeg);
      addMeshToBone(leftUpLeg, 'cylinder', 0.05, 0x00ff88);

      const leftLeg = new THREE.Bone();
      leftLeg.name = "LeftLeg";
      leftLeg.position.set(0.034277, -0.375199, -0.004496);
      leftUpLeg.add(leftLeg);
      addMeshToBone(leftLeg, 'cylinder', 0.05, 0x00ff88);

      const leftFoot = new THREE.Bone();
      leftFoot.name = "LeftFoot";
      leftFoot.position.set(-0.013596, -0.397961, -0.043693);
      leftLeg.add(leftFoot);
      addMeshToBone(leftFoot, 'cylinder', 0.05, 0x00ff88);

      const leftToe = new THREE.Bone();
      leftToe.name = "LeftToe";
      leftToe.position.set(0.026358, -0.055791, 0.119288);
      leftFoot.add(leftToe);
      addMeshToBone(leftToe, 'sphere', 0.05, 0x00ff88);

      // Right leg
      const rightUpLeg = new THREE.Bone();
      rightUpLeg.name = "RightUpLeg";
      rightUpLeg.position.set(-0.067670, -0.090522, -0.004320);
      hips.add(rightUpLeg);
      addMeshToBone(rightUpLeg, 'cylinder', 0.05, 0x00ff88);

      const rightLeg = new THREE.Bone();
      rightLeg.name = "RightLeg";
      rightLeg.position.set(-0.038290, -0.382569, -0.008850);
      rightUpLeg.add(rightLeg);
      addMeshToBone(rightLeg, 'cylinder', 0.05, 0x00ff88);

      const rightFoot = new THREE.Bone();
      rightFoot.name = "RightFoot";
      rightFoot.position.set(0.015774, -0.398415, -0.042312);
      rightLeg.add(rightFoot);
      addMeshToBone(rightFoot, 'cylinder', 0.05, 0x00ff88);

      const rightToe = new THREE.Bone();
      rightToe.name = "RightToe";
      rightToe.position.set(-0.025372, -0.048144, 0.123348);
      rightFoot.add(rightToe);
      addMeshToBone(rightToe, 'sphere', 0.05, 0x00ff88);

      // Spine
      const spine = new THREE.Bone();
      spine.name = "Spine";
      spine.position.set(-0.002533, 0.108963, -0.026696);
      hips.add(spine);
      addMeshToBone(spine, 'cylinder', 0.05, 0x00ff88);

      const spine1 = new THREE.Bone();
      spine1.name = "Spine1";
      spine1.position.set(0.005487, 0.135180, 0.001092);
      spine.add(spine1);
      addMeshToBone(spine1, 'cylinder', 0.05, 0x00ff88);

      const spine2 = new THREE.Bone();
      spine2.name = "Spine2";
      spine2.position.set(0.001457, 0.052922, 0.025425);
      spine1.add(spine2);
      addMeshToBone(spine2, 'cylinder', 0.05, 0x00ff88);

      // Neck/Head
      const neck = new THREE.Bone();
      neck.name = "Neck";
      neck.position.set(-0.002778, 0.213870, -0.042857);
      spine2.add(neck);
      addMeshToBone(neck, 'sphere', 0.05, 0x00ff88);

      const head = new THREE.Bone();
      head.name = "Head";
      head.position.set(0.005152, 0.064970, 0.051349);
      neck.add(head);

      // Add head mesh
      const headMesh = new THREE.Mesh(
          new THREE.SphereGeometry(0.12, 16, 16),
          new THREE.MeshLambertMaterial({ color: 0xffcc00 })
      );
      head.add(headMesh);
      headMesh.position.set(0, 0, 0);

      // Left arm
      const leftShoulder = new THREE.Bone();
      leftShoulder.name = "LeftShoulder";
      leftShoulder.position.set(0.078845, 0.121749, -0.034090);
      spine2.add(leftShoulder);
      addMeshToBone(leftShoulder, 'cylinder', 0.05, 0x00ff88);

      const leftArm = new THREE.Bone();
      leftArm.name = "LeftArm";
      leftArm.position.set(0.090977, 0.030469, -0.008868);
      leftShoulder.add(leftArm);
      addMeshToBone(leftArm, 'cylinder', 0.05, 0x00ff88);

      const leftForeArm = new THREE.Bone();
      leftForeArm.name = "LeftForeArm";
      leftForeArm.position.set(0.259612, -0.012772, -0.027456);
      leftArm.add(leftForeArm);
      addMeshToBone(leftForeArm, 'cylinder', 0.05, 0x00ff88);

      const leftHand = new THREE.Bone();
      leftHand.name = "LeftHand";
      leftHand.position.set(0.249234, 0.008986, -0.001171);
      leftForeArm.add(leftHand);
      addMeshToBone(leftHand, 'sphere', 0.05, 0x00ff88);

      // Right arm
      const rightShoulder = new THREE.Bone();
      rightShoulder.name = "RightShoulder";
      rightShoulder.position.set(-0.081759, 0.118833, -0.038615);
      spine2.add(rightShoulder);
      addMeshToBone(rightShoulder, 'cylinder', 0.05, 0x00ff88);

      const rightArm = new THREE.Bone();
      rightArm.name = "RightArm";
      rightArm.position.set(-0.096012, 0.032551, -0.009143);
      rightShoulder.add(rightArm);
      addMeshToBone(rightArm, 'cylinder', 0.05, 0x00ff88);

      const rightForeArm = new THREE.Bone();
      rightForeArm.name = "RightForeArm";
      rightForeArm.position.set(-0.253742, -0.013329, -0.021401);
      rightArm.add(rightForeArm);
      addMeshToBone(rightForeArm, 'cylinder', 0.05, 0x00ff88);

      const rightHand = new THREE.Bone();
      rightHand.name = "RightHand";
      rightHand.position.set(-0.255298, 0.007772, -0.005559);
      rightForeArm.add(rightHand);
      addMeshToBone(rightHand, 'sphere', 0.05, 0x00ff88);

      // Group together
      const avatarGroup = new THREE.Group();
      avatarGroup.add(hips);
      avatarGroup.scale.set(5, 5, 5); // Scale avatar to double size

      // Collect all bones in array (in BVH hierarchy order)
      const bones: THREE.Bone[] = [];
      function traverseBones(bone: THREE.Bone) {
        bones.push(bone);
        for (let i = 0; i < bone.children.length; i++) {
          if (bone.children[i] instanceof THREE.Bone) {
            traverseBones(bone.children[i] as THREE.Bone);
          }
        }
      }
      traverseBones(hips);

      // Create and connect Skeleton
      const skeleton = new THREE.Skeleton(bones);
      // @ts-ignore
      avatarGroup.skeleton = skeleton;

      return avatarGroup;
  }

  /*  Function to add a mesh to a bone.
  This function creates a mesh based on the specified
  type (sphere or cylinder), size, and color, and adds it to the given bone.
  The mesh is positioned at the bone's origin.
  */
  function addMeshToBone(bone: THREE.Bone, type: string, size: number, color: number) {
    let mesh;
    if (type === 'sphere') {
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 16, 16),
        new THREE.MeshLambertMaterial({ color })
      );
    } else if (type === 'cylinder') {
      mesh = new THREE.Mesh(
        new THREE.CylinderGeometry(size, size, size * 3, 8),
        new THREE.MeshLambertMaterial({ color })
      );
    }
    if (mesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      bone.add(mesh);
      mesh.position.set(0, 0, 0);
    }
  }

  /*  Function to parse BVH data and apply it to the avatar.
  This function uses the BVHLoader to parse the BVH text,
  adjusts the avatar's position based on the BVH root bone,
  and plays the animation using an AnimationMixer.
  It also handles stopping any previous animations and clearing the mixer.
  */
  function parseAndApplyBVH(bvhText: string) {
    if (!bvhText || typeof bvhText !== "string" || !bvhText.trim().startsWith("HIERARCHY")) {
      console.warn("Invalid BVH data, skipping animation.");
      return;
    }
    const scene = sceneRef.current;
    const avatar = avatarRef.current;
    if (!scene || !avatar) return;

    if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current.uncacheRoot(avatar);
        mixerRef.current = null;
    }

    const loader = new BVHLoader();
    const result = loader.parse(bvhText) as unknown as { skeleton: THREE.Skeleton, clip: THREE.AnimationClip };
    const avatarRoot = avatar.children[0];
    const bvhRoot = result.skeleton.bones[0];

    const yDiff = avatarRoot.position.y - bvhRoot.position.y;
    avatar.position.y -= yDiff * avatar.scale.y;

    const bvhClip = result.clip;

    const newMixer = new THREE.AnimationMixer(avatar);
    setMixer(newMixer);
    mixerRef.current = newMixer;
    const action = newMixer.clipAction(bvhClip, avatar);
    action.reset(); // <-- Add this line
    bvhClipActionRef.current = action;
    action.play();

    setBvhLoaded(true);
    setBvhPlaying(true);
  }

  // useFrame(() => {
  //   if (mixerRef.current && bvhPlaying) {
  //     mixerRef.current.update(clock.getDelta());
  //     const time = mixerRef.current.time.toFixed(2);
  //     // console.log(`Mixer time: ${time}`);
  //   }
  // });

  // Effect to handle BVH mixer finished event
  useEffect(() => {
      if (!mixer) return;
      const onFinished = () => {
          if (currentIdx < bvhQueue.length - 1) {
              setCurrentIdx(idx => idx + 1);
          }
      };
      mixer.addEventListener('finished', onFinished);
      return () => {
          mixer.removeEventListener('finished', onFinished);
      };
  }, [mixer, currentIdx, bvhQueue.length]);

  // Effect to ensure bvhPlaying is set to true when currentIdx changes
  useEffect(() => {
    if (bvhQueue.length > 0 && bvhQueue[currentIdx]) {
        setBvhPlaying(true);
    }
}, [currentIdx, bvhQueue.length]);

  // Effect to load default wave motion if no motions are provided
  useEffect(() => {
    // If there are no motions, play the default wave BVH
    if ((!bvhQueue || bvhQueue.length === 0) && avatarRef.current) {
      fetch('/motions/wave.bvh')
        .then(res => res.text())
        .then(bvhText => {
          parseAndApplyBVH(bvhText);
        });
    }
  }, [bvhQueue]);

  return (
      <div ref={mountRef} className='w-full h-full m-0 m-auto flex justify-center items-center align-center' >
        <div>
        </div>
      </div>
  );
}

