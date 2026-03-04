'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * ProceduralGroundBackground
 * A WebGL 2D background featuring topographic neon lines and sand-ripple movement.
 * Optimized for performance using fragment shaders.
 * @param contained - when true, fills the parent container (absolute); when false, fixed full viewport
 */
type ProceduralGroundBackgroundProps = {
  contained?: boolean;
  className?: string;
};

const ProceduralGroundBackground: React.FC<ProceduralGroundBackgroundProps> = ({
  contained = false,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      uniform float u_time;
      uniform vec2 u_resolution;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                   mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        
        float depth = 1.0 / (uv.y + 1.15);
        vec2 gridUv = vec2(uv.x * depth, depth + u_time * 0.15);
        
        float n = noise(gridUv * 3.5);
        float ripples = sin(gridUv.y * 18.0 + n * 8.0 + u_time * 0.5);
        float topoLine = smoothstep(0.03, 0.0, abs(ripples));
        
        vec3 baseColor = vec3(0.04, 0.03, 0.12);
        vec3 accentColor = vec3(0.1, 0.3, 0.8);
        vec3 neonColor = vec3(0.6, 0.2, 1.0);
        
        vec3 finalColor = mix(baseColor, accentColor, n * 0.6);
        finalColor += topoLine * neonColor * depth * 0.4;
        
        float fade = smoothstep(0.1, -1.0, uv.y);
        finalColor *= (1.0 - length(uv) * 0.45) * (1.0 - fade);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vsSource));
    gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fsSource));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttrib = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttrib);
    gl.vertexAttribPointer(posAttrib, 2, gl.FLOAT, false, 0, 0);

    const timeLoc = gl.getUniformLocation(program, 'u_time');
    const resLoc = gl.getUniformLocation(program, 'u_resolution');

    let animationFrameId: number;

    const getSize = () => {
      if (contained && containerRef.current) {
        const el = containerRef.current;
        return { w: el.clientWidth, h: el.clientHeight };
      }
      return { w: window.innerWidth, h: window.innerHeight };
    };

    const render = (time: number) => {
      const { w: width, h: height } = getSize();
      if (width > 0 && height > 0) {
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
          gl.viewport(0, 0, width, height);
        }
        gl.uniform1f(timeLoc, time * 0.001);
        gl.uniform2f(resLoc, width, height);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    let ro: ResizeObserver | undefined;
    if (contained && containerRef.current) {
      ro = new ResizeObserver(() => {});
      ro.observe(containerRef.current);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro?.disconnect();
    };
  }, [contained]);

  if (contained) {
    return (
      <div
        ref={containerRef}
        className={cn('absolute inset-0 w-full h-full -z-10', className)}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block touch-none"
          style={{ filter: 'contrast(1.1) brightness(0.9)' }}
        />
      </div>
    );
  }

  return (
    <div className={cn('fixed inset-0 w-full h-full bg-zinc-950 -z-10', className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block touch-none"
        style={{ filter: 'contrast(1.1) brightness(0.9)' }}
      />
    </div>
  );
};

export default ProceduralGroundBackground;
