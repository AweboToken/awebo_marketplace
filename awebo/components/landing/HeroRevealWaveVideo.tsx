"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import { useMemo, useRef, useState, Suspense } from "react";

const HERO_BG_VIDEO =
  "https://ik.imagekit.io/3bfeucft4/grok-video-04525375-d090-47c8-9fc9-6b58ab16d924%20(2).mp4";

const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uRevealRadius;
  uniform float uRevealSoftness;
  uniform float uPixelSize;
  uniform float uMouseActive;
  
  uniform float uWaveSpeed;
  uniform float uWaveFrequency;
  uniform float uWaveAmplitude;
  uniform float uMouseRadius;
  
  varying vec2 vUv;
  
  float bayer4x4(vec2 pos) {
    int x = int(mod(pos.x, 4.0));
    int y = int(mod(pos.y, 4.0));
    int index = x + y * 4;
    
    float pattern[16];
    pattern[0] = 0.0;    pattern[1] = 8.0;    pattern[2] = 2.0;    pattern[3] = 10.0;
    pattern[4] = 12.0;   pattern[5] = 4.0;    pattern[6] = 14.0;   pattern[7] = 6.0;
    pattern[8] = 3.0;    pattern[9] = 11.0;   pattern[10] = 1.0;   pattern[11] = 9.0;
    pattern[12] = 15.0;  pattern[13] = 7.0;   pattern[14] = 13.0;  pattern[15] = 5.0;
    
    for (int i = 0; i < 16; i++) {
        if (i == index) return pattern[i] / 16.0;
    }
    return 0.0;
  }
  
  void main() {
    vec2 uv = vUv;
    
    float time = uTime;
    float waveStrength = uWaveAmplitude * 0.1;
    
    float wave1 = sin(uv.y * uWaveFrequency + time * uWaveSpeed) * waveStrength;
    float wave2 = sin(uv.x * uWaveFrequency * 0.7 + time * uWaveSpeed * 0.8) * waveStrength * 0.5;
    
    vec2 distortedUv = uv;
    distortedUv.x += wave1;
    distortedUv.y += wave2;
    
    if (uMouseActive > 0.01) {
        vec2 mousePos = uMouse;
        float dist = distance(uv, mousePos);
        float mouseInfluence = smoothstep(uMouseRadius, 0.0, dist);
        
        float rippleFreq = uWaveFrequency * 5.0;
        float rippleSpeed = uWaveSpeed * 1.0;
        float rippleStrength = uWaveAmplitude * 0.05;
        
        float ripple = sin(dist * rippleFreq - time * rippleSpeed) * rippleStrength * mouseInfluence * uMouseActive;
        distortedUv.x += ripple;
        distortedUv.y += ripple;
    }
    
    vec4 color = texture2D(uTexture, distortedUv);
    
    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    vec2 pixelCoord = floor(gl_FragCoord.xy / uPixelSize);
    float dither = bayer4x4(pixelCoord);
    
    float quantized;
    float adjusted = gray + (dither - 0.5) * 0.5;
    if (adjusted < 0.33) {
        quantized = 0.0;
    } else if (adjusted < 0.66) {
        quantized = 0.5;
    } else {
        quantized = 1.0;
    }
    vec3 bwColor = vec3(quantized);
    
    float revealDist = distance(uv, uMouse);
    float innerRadius = uRevealRadius * (1.0 - uRevealSoftness);
    float outerRadius = uRevealRadius;
    float revealAmount = 1.0 - smoothstep(innerRadius, outerRadius, revealDist);
    revealAmount *= uMouseActive;
    
    vec3 finalColor = mix(bwColor, color.rgb, revealAmount);
    
    gl_FragColor = vec4(finalColor, color.a);
  }
`;

interface VideoPlaneProps {
  texture: THREE.VideoTexture;
  aspectRatio: number;
  revealRadius: number;
  revealSoftness: number;
  pixelSize: number;
  waveSpeed: number;
  waveFrequency: number;
  waveAmplitude: number;
  mouseRadius: number;
  isMouseInCanvas: boolean;
  /** Normalized 0–1 from hero section (when tracking from parent) */
  mouseX?: number;
  mouseY?: number;
}

function VideoPlane({
  texture,
  aspectRatio,
  revealRadius,
  revealSoftness,
  pixelSize,
  waveSpeed,
  waveFrequency,
  waveAmplitude,
  mouseRadius,
  isMouseInCanvas,
  mouseX,
  mouseY,
}: VideoPlaneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();
  const mouseActiveRef = useRef(0);
  const hasEnteredRef = useRef(false);
  const useExternalMouse = mouseX !== undefined && mouseY !== undefined;

  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-10, -10) },
      uRevealRadius: { value: revealRadius },
      uRevealSoftness: { value: revealSoftness },
      uPixelSize: { value: pixelSize },
      uMouseActive: { value: 0 },
      uWaveSpeed: { value: waveSpeed },
      uWaveFrequency: { value: waveFrequency },
      uWaveAmplitude: { value: waveAmplitude },
      uMouseRadius: { value: mouseRadius },
    }),
    [
      texture,
      revealRadius,
      revealSoftness,
      pixelSize,
      waveSpeed,
      waveFrequency,
      waveAmplitude,
      mouseRadius,
    ]
  );

  const scale = useMemo<[number, number, number]>(() => {
    if (aspectRatio > 1) {
      return [aspectRatio, 1, 1];
    } else {
      return [1, 1 / aspectRatio, 1];
    }
  }, [aspectRatio]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;

      if (isMouseInCanvas) {
        hasEnteredRef.current = true;
      }

      const targetActive = isMouseInCanvas ? 1 : 0;
      const easingSpeed = 0.08;
      mouseActiveRef.current +=
        (targetActive - mouseActiveRef.current) * easingSpeed;
      material.uniforms.uMouseActive.value = mouseActiveRef.current;

      if (hasEnteredRef.current) {
        if (useExternalMouse && mouseX !== undefined && mouseY !== undefined) {
          material.uniforms.uMouse.value.set(mouseX, 1 - mouseY);
        } else {
          material.uniforms.uMouse.value.set(
            (pointer.x + 1) / 2,
            (pointer.y + 1) / 2
          );
        }
      }
    }
  });

  return (
    <mesh ref={meshRef} scale={scale}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function HeroRevealWaveContent({
  isMouseInCanvas,
  mouseX,
  mouseY,
}: {
  isMouseInCanvas: boolean;
  mouseX?: number;
  mouseY?: number;
}) {
  const texture = useVideoTexture(HERO_BG_VIDEO, {
    muted: true,
    loop: true,
    playsInline: true,
    start: true,
  });

  const video = texture.image as HTMLVideoElement;
  const aspectRatio =
    video.videoWidth && video.videoHeight
      ? video.videoWidth / video.videoHeight
      : 16 / 9;

  return (
    <VideoPlane
      texture={texture}
      aspectRatio={aspectRatio}
      revealRadius={0.2}
      revealSoftness={0.5}
      pixelSize={3}
      waveSpeed={0.5}
      waveFrequency={3.0}
      waveAmplitude={0.2}
      mouseRadius={0.2}
      isMouseInCanvas={isMouseInCanvas}
      mouseX={mouseX}
      mouseY={mouseY}
    />
  );
}

interface HeroRevealWaveVideoProps {
  /** When provided, mouse is tracked over the whole hero; reveal works over content too */
  isMouseInCanvas?: boolean;
  mouseX?: number;
  mouseY?: number;
}

export default function HeroRevealWaveVideo({
  isMouseInCanvas: externalIsIn,
  mouseX: externalMouseX,
  mouseY: externalMouseY,
}: HeroRevealWaveVideoProps = {}) {
  const [localIn, setLocalIn] = useState(false);
  const useExternal =
    externalIsIn !== undefined &&
    externalMouseX !== undefined &&
    externalMouseY !== undefined;
  const isMouseInCanvas = useExternal ? (externalIsIn ?? false) : localIn;
  const mouseX = useExternal ? externalMouseX : undefined;
  const mouseY = useExternal ? externalMouseY : undefined;

  return (
    <div
      className="absolute inset-0 w-full h-full"
      onMouseEnter={() => setLocalIn(true)}
      onMouseLeave={() => setLocalIn(false)}
      aria-hidden
    >
      <Suspense
        fallback={
          <div className="absolute inset-0 bg-gray-900 min-w-full min-h-full" />
        }
      >
        <Canvas
          style={{
            width: "100%",
            height: "100%",
            display: "block",
          }}
          gl={{ antialias: false }}
          camera={{ position: [0, 0, 1] }}
        >
          <HeroRevealWaveContent
            isMouseInCanvas={isMouseInCanvas}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
