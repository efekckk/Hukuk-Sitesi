"use client";

import { useEffect, useRef } from "react";

/* ─── Shader sources ─── */

const VERT = /* glsl */ `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  v_uv.y = 1.0 - v_uv.y;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = /* glsl */ `
precision highp float;

uniform sampler2D u_dark;
uniform sampler2D u_bright;
uniform vec2  u_mouse;      // 0..1 normalized, negative when cursor off
uniform float u_imgAspect;  // source image width / height
uniform float u_cnvAspect;  // canvas width / height
uniform vec2  u_spotPx;     // spotlight ellipse radii in CSS px
uniform vec2  u_cnvPx;      // canvas size in CSS px

varying vec2 v_uv;

vec2 coverTop(vec2 uv) {
  if (u_cnvAspect > u_imgAspect) {
    uv.y *= u_imgAspect / u_cnvAspect;
  } else {
    float s = u_cnvAspect / u_imgAspect;
    uv.x = uv.x * s + (1.0 - s) * 0.5;
  }
  return uv;
}

void main() {
  vec2 uv = coverTop(v_uv);
  uv = clamp(uv, vec2(0.001), vec2(0.999));

  vec4 dk = texture2D(u_dark, uv);
  vec4 br = texture2D(u_bright, uv);

  if (u_mouse.x < 0.0) {
    gl_FragColor = dk;
    return;
  }

  vec2 sr = u_spotPx / u_cnvPx;
  vec2 df = (v_uv - u_mouse) / sr;
  float dist = length(df);

  float core = smoothstep(0.6, 0.0, dist);
  float soft = smoothstep(1.0, 0.6, dist) * 0.25;

  gl_FragColor = mix(dk, br, core + soft);
}`;

/* ─── WebGL helpers ─── */

function mkShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader compile:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function mkProgram(gl: WebGLRenderingContext) {
  const vs = mkShader(gl, gl.VERTEX_SHADER, VERT);
  const fs = mkShader(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const p = gl.createProgram()!;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error("Program link:", gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

function loadTex(
  gl: WebGLRenderingContext,
  url: string,
): Promise<{ tex: WebGLTexture; w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      resolve({ tex, w: img.naturalWidth, h: img.naturalHeight });
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
}

/* ─── Component ─── */

interface SpotlightCanvasProps {
  darkSrc: string;
  brightSrc: string;
  className?: string;
  mouseRef: { readonly current: { x: number; y: number } };
  spotlightSize?: [number, number];
}

export function DepthParallaxCanvas({
  darkSrc,
  brightSrc,
  className,
  mouseRef,
  spotlightSize = [450, 600],
}: SpotlightCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const smooth = useRef({ x: -1, y: -1 });
  const cfgRef = useRef({ spotlightSize });
  cfgRef.current = { spotlightSize };

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;

    const gl = cvs.getContext("webgl", { alpha: false, antialias: false });
    if (!gl) return;

    const prog = mkProgram(gl);
    if (!prog) return;

    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const loc = {
      dark: gl.getUniformLocation(prog, "u_dark"),
      bright: gl.getUniformLocation(prog, "u_bright"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      imgAspect: gl.getUniformLocation(prog, "u_imgAspect"),
      cnvAspect: gl.getUniformLocation(prog, "u_cnvAspect"),
      spotPx: gl.getUniformLocation(prog, "u_spotPx"),
      cnvPx: gl.getUniformLocation(prog, "u_cnvPx"),
    };

    let darkTex: WebGLTexture | null = null;
    let brightTex: WebGLTexture | null = null;
    let imgAspect = 16 / 9;
    let ready = false;

    Promise.all([loadTex(gl, darkSrc), loadTex(gl, brightSrc)]).then(([dk, br]) => {
      if (!dk || !br) return;
      darkTex = dk.tex;
      brightTex = br.tex;
      imgAspect = dk.w / dk.h;
      ready = true;
    });

    const resize = () => {
      const r = cvs.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio, 2);
      cvs.width = r.width * dpr;
      cvs.height = r.height * dpr;
      gl.viewport(0, 0, cvs.width, cvs.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      rafRef.current = requestAnimationFrame(render);
      if (!ready) return;

      const r = cvs.getBoundingClientRect();
      if (r.width === 0) return;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const lerp = 0.1;
      if (mx < 0) {
        smooth.current = { x: -1, y: -1 };
      } else {
        const tx = mx / r.width;
        const ty = my / r.height;
        if (smooth.current.x < 0) {
          smooth.current = { x: tx, y: ty };
        } else {
          smooth.current.x += (tx - smooth.current.x) * lerp;
          smooth.current.y += (ty - smooth.current.y) * lerp;
        }
      }

      const cfg = cfgRef.current;

      gl.uniform2f(loc.mouse, smooth.current.x, smooth.current.y);
      gl.uniform1f(loc.imgAspect, imgAspect);
      gl.uniform1f(loc.cnvAspect, r.width / r.height);
      gl.uniform2f(loc.spotPx, cfg.spotlightSize[0], cfg.spotlightSize[1]);
      gl.uniform2f(loc.cnvPx, r.width, r.height);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, darkTex);
      gl.uniform1i(loc.dark, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, brightTex);
      gl.uniform1i(loc.bright, 1);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [darkSrc, brightSrc, mouseRef]);

  return <canvas ref={canvasRef} className={className} />;
}
