// src/components/RobotSimulation.tsx

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

// --- Component Props Arayüzü ---
interface RobotSimulationProps {
  leftShoulderAngle: number;
  rightShoulderAngle: number;
  leftArmAngle: number;
  animationCommand: string | null;
  onAnimationsLoaded: (names: string[]) => void;
}
// -----------------------------------------

// --- Component Tanımı ---
const RobotSimulation: React.FC<RobotSimulationProps> = ({
  leftShoulderAngle,
  rightShoulderAngle,
  leftArmAngle,
  animationCommand,
  onAnimationsLoaded,
}) => {
    // --- Ref Tanımlamaları ---
    const mountRef = useRef<HTMLDivElement>(null);
    const modelRef = useRef<THREE.Group | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const hdriTextureRef = useRef<THREE.Texture | null>(null);
    const leftShoulderBoneRef = useRef<THREE.Bone | null>(null);
    const rightShoulderBoneRef = useRef<THREE.Bone | null>(null);
    const leftArmBoneRef = useRef<THREE.Bone | null>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);
    const actionsRef = useRef<Record<string, THREE.AnimationAction>>({});
    const clockRef = useRef(new THREE.Clock());
    // --------------------------------------------

    // --- Sahne Kurulum Effect (Sadece mount/unmount) ---
    useEffect(() => {
        const currentMountNode = mountRef.current;
        if (!currentMountNode || sceneRef.current) { return; }

        const width = currentMountNode.clientWidth;
        const height = currentMountNode.clientHeight;

        const scene = sceneRef.current = new THREE.Scene();
        // Arka plan HDRI yüklendikten sonra ayarlanacak.

        const camera = cameraRef.current = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 4, 10);
        camera.lookAt(0, 2, 0);

        const renderer = rendererRef.current = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        currentMountNode.innerHTML = '';
        currentMountNode.appendChild(renderer.domElement);

        const controls = controlsRef.current = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 1;
        controls.maxDistance = 30;
        controls.target.set(0, 1, 0);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
        directionalLight.position.set(5, 10, 7.5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.bias = -0.0005;
        scene.add(directionalLight);

        // --- Yer Düzlemi ---
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshLambertMaterial({
            color: 0x777777, // HDRI arka plana göre rengi ayarla
            side: THREE.DoubleSide,
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        // <<<--- YER DÜZLEMİ POZİSYONU GÜNCELLENDİ --->>>
        ground.position.y = -0.1; // Biraz aşağı alındı
        // <<<--------------------------------------->>>
        ground.receiveShadow = true;
        scene.add(ground);

        // --- Çevre Haritası (HDRI) Yükleme ---
        const rgbeLoader = new RGBELoader();
        // <<<--- HDRI YOLU GÜNCELLENDİ --->>>
        const hdriPath = '/environments/hilly_terrain_01_4k.hdr';
        // <<<---------------------------->>>
        console.log(`>>> RobotSimulation: HDRI yükleniyor: ${hdriPath}`);
        rgbeLoader.load(hdriPath, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;    // ARKA PLANI HDRI YAP
            scene.environment = texture;   // Yansımalar ve ortam ışığı için
            hdriTextureRef.current = texture;
            console.log("HDRI yüklendi ve sahneye uygulandı.");
        }, undefined, (error) => {
             console.error(`HDRI hatası (${hdriPath}):`, error);
        });

        // --- Model Yükleme ---
        const loader = new GLTFLoader();
        const modelPath = '/models/scene.gltf'; // <<<--- KENDİ MODEL YOLUNU KONTROL ET
        loader.load(modelPath, (gltf) => {
            console.log("Model yüklendi.");
            const loadedModel = modelRef.current = gltf.scene;
            // <<<--- KENDİ MODEL AYARLARINI GİR --->>>
            loadedModel.scale.set(0.04, 0.04, 0.04); // Senin ölçeğin
            loadedModel.position.y = 1;           // Senin yüksekliğin
            scene.add(loadedModel);

            const bonesFound = { L_shoulder: false, R_shoulder: false, L_arm: false };
            loadedModel.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) { child.castShadow = true; child.receiveShadow = true; }
                if (child instanceof THREE.Bone) {
                    switch (child.name) {
                        case 'L_shoulder_015': leftShoulderBoneRef.current = child; bonesFound.L_shoulder = true; console.log("Sol Omuz ('L_shoulder_015') bulundu."); break;
                        case 'R_shoulder_031': rightShoulderBoneRef.current = child; bonesFound.R_shoulder = true; console.log("Sağ Omuz ('R_shoulder_031') bulundu."); break;
                        case 'L_arm_019': leftArmBoneRef.current = child; bonesFound.L_arm = true; console.log("Sol Kol/Dirsek ('L_arm_019') bulundu."); break;
                    }
                }
            });
            if (!bonesFound.L_shoulder) console.warn("UYARI: 'L_shoulder_015' bulunamadı!");
            if (!bonesFound.R_shoulder) console.warn("UYARI: 'R_shoulder_031' bulunamadı!");
            if (!bonesFound.L_arm) console.warn("UYARI: 'L_arm_019' bulunamadı!");

            // Animasyonları Kurulum
            if (gltf.animations && gltf.animations.length) {
                console.log(`Modelde ${gltf.animations.length} adet animasyon bulundu.`);
                mixerRef.current = new THREE.AnimationMixer(loadedModel);
                const animNames: string[] = [];
                gltf.animations.forEach((clip, index) => {
                    const actionName = clip.name || `anim_${index}`;
                    const action = mixerRef.current!.clipAction(clip);
                    actionsRef.current[actionName] = action;
                    animNames.push(actionName);
                    console.log(`Animasyon klibi bulundu ve eylem oluşturuldu: ${actionName}`);
                });
                onAnimationsLoaded(animNames);
            } else {
                console.log("Modelde animasyon bulunamadı.");
                onAnimationsLoaded([]);
            }

        }, undefined, (error) => { console.error(`Model hatası (${modelPath}):`, error); });

        const animate = () => {
            animationFrameIdRef.current = requestAnimationFrame(animate);
            const deltaTime = clockRef.current.getDelta();
            if(controlsRef.current) controlsRef.current.update();
            if (mixerRef.current) mixerRef.current.update(deltaTime);
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        const handleResize = () => {
             if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
             const newWidth = mountRef.current.clientWidth; const newHeight = currentMountNode.clientHeight;
             cameraRef.current.aspect = newWidth / newHeight;
             cameraRef.current.updateProjectionMatrix();
             rendererRef.current.setSize(newWidth, newHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => { /* ... (Temizleme kodu bir önceki mesajdaki gibi) ... */ };
    }, [onAnimationsLoaded]);


    // --- KEMİK KONTROL EFFECT'LERİ ---
    useEffect(() => { if (leftShoulderBoneRef.current) { leftShoulderBoneRef.current.rotation.y = leftShoulderAngle; }}, [leftShoulderAngle]);
    useEffect(() => { if (rightShoulderBoneRef.current) { rightShoulderBoneRef.current.rotation.y = rightShoulderAngle; }}, [rightShoulderAngle]);
    useEffect(() => { if (leftArmBoneRef.current) { leftArmBoneRef.current.rotation.x = leftArmAngle; }}, [leftArmAngle]);

    // --- ANİMASYON KOMUT EFFECT'İ ---
    useEffect(() => {
        if (!animationCommand || !mixerRef.current || Object.keys(actionsRef.current).length === 0) return;
        const currentActions = actionsRef.current;
        if (animationCommand === "STOP_ALL") {
            Object.values(currentActions).forEach(action => action.stop()); return;
        }
        const actionToPlay = currentActions[animationCommand];
        if (actionToPlay) {
            Object.values(currentActions).forEach(action => { if (action !== actionToPlay) action.fadeOut(0.5); });
            actionToPlay.reset().fadeIn(0.5).play();
        } else { console.warn(`Animasyon bulunamadı: ${animationCommand}`); }
    }, [animationCommand]);

    return (
      <div
          ref={mountRef}
          style={{
              width: '100%',
              height: '100%', // <<<--- YÜKSEKLİĞİ %100 YAP
              cursor: 'grab',
              display: 'block', // Canvas'ın blok element gibi davranmasını sağla
           }}
      />
  );
};

export default RobotSimulation;