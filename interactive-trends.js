/**
 * ═══════════════════════════════════════════════════════════════════
 * JUSTIN MATHEW PORTFOLIO — 4 CUTTING-EDGE INTERACTIVE DESIGN SYSTEMS
 * 1. Kinetic Typography & Fluid Distortion (Spring Physics & Displacement)
 * 2. Magnetic Mouse-Jacking & Elastic Hover (Spring Damped Target Snapping)
 * 3. Iridescent Mesh Gradients (GPU WebGL Fragment Shader with Nature Palette)
 * 4. Bento Grid Parallax Depth (Layered 3D Multi-plane Transform)
 * ═══════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ──────────────────────────────────────────────────────────────
     SYSTEM 1: KINETIC TYPOGRAPHY & FLUID DISTORTION
     - Treats text like a liquid canvas
     - SVG turbulence + displacement driven by cursor velocity
     - Damped spring physics smoothly restores geometric crispness
  ────────────────────────────────────────────────────────────── */
  function initKineticTypography() {
    if (prefersReducedMotion) return;

    // Inject SVG filter definition if not present
    if (!document.getElementById('kinetic-fluid-filter')) {
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('style', 'position:absolute;width:0;height:0;pointer-events:none;');
      svg.setAttribute('aria-hidden', 'true');
      svg.innerHTML = `
        <defs>
          <filter id="kinetic-fluid-filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
            <feTurbulence id="kinetic-turb" type="fractalNoise" baseFrequency="0.035 0.035" numOctaves="2" result="noise" />
            <feDisplacementMap id="kinetic-disp" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      `;
      document.body.appendChild(svg);
    }

    const dispMap = document.getElementById('kinetic-disp');
    const turbNode = document.getElementById('kinetic-turb');
    if (!dispMap || !turbNode) return;

    const targets = document.querySelectorAll('.hero-name, .section-title, .intro-h1, h1');
    if (!targets.length) return;

    targets.forEach(t => t.classList.add('kinetic-text-wrap'));

    let mouseX = 0, mouseY = 0;
    let lastX = 0, lastY = 0;
    let velocity = 0;
    let currentScale = 0;
    let targetScale = 0;
    let scaleVelocity = 0;
    const tension = 0.16;
    const damping = 0.74;
    let isNear = false;
    let time = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      velocity = Math.min(Math.hypot(dx, dy), 50);
      lastX = mouseX;
      lastY = mouseY;

      isNear = false;
      targets.forEach(el => {
        const rect = el.getBoundingClientRect();
        const pad = 75;
        if (
          mouseX >= rect.left - pad &&
          mouseX <= rect.right + pad &&
          mouseY >= rect.top - pad &&
          mouseY <= rect.bottom + pad
        ) {
          isNear = true;
          el.classList.add('kinetic-fluid-active');
        } else {
          el.classList.remove('kinetic-fluid-active');
        }
      });

      if (isNear) {
        targetScale = Math.min(velocity * 0.7, 28);
      }
    }, { passive: true });

    function updatePhysics() {
      time += 0.02;
      const force = (targetScale - currentScale) * tension;
      scaleVelocity = (scaleVelocity + force) * damping;
      currentScale += scaleVelocity;
      targetScale *= 0.85;

      if (currentScale > 0.1) {
        dispMap.setAttribute('scale', currentScale.toFixed(2));
        turbNode.setAttribute('baseFrequency', `${(0.03 + Math.sin(time) * 0.005).toFixed(3)} ${(0.035 + Math.cos(time) * 0.005).toFixed(3)}`);
      } else if (currentScale !== 0) {
        currentScale = 0;
        scaleVelocity = 0;
        dispMap.setAttribute('scale', '0');
        targets.forEach(el => el.classList.remove('kinetic-fluid-active'));
      }

      requestAnimationFrame(updatePhysics);
    }
    updatePhysics();
  }

  /* ──────────────────────────────────────────────────────────────
     SYSTEM 2: MAGNETIC MOUSE-JACKING & ELASTIC HOVER
     - Custom precision cursor dot + elastic trailer ring
     - Magnetically attracts to interactive buttons/links
     - Snaps & conforms perimeter with spring physics
     - Physically translates button slightly toward cursor
  ────────────────────────────────────────────────────────────── */
  function initMagneticCursor() {
    if (isTouch || prefersReducedMotion) return;

    let cursorWrap = document.getElementById('mag-cursor');
    if (!cursorWrap) {
      cursorWrap = document.createElement('div');
      cursorWrap.id = 'mag-cursor';
      cursorWrap.className = 'mag-cursor';
      cursorWrap.innerHTML = `
        <div class="mag-cursor-dot" id="mag-dot"></div>
        <div class="mag-cursor-ring" id="mag-ring"></div>
      `;
      document.body.appendChild(cursorWrap);
    }

    const dot = document.getElementById('mag-dot');
    const ring = document.getElementById('mag-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let ringWidth = 32, ringHeight = 32;
    let ringRadius = '50%';
    let isSnapped = false;
    let activeElem = null;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    const interactiveSelectors = [
      'a', 'button', '.btn', '.nav-links a', '.project-link', 
      '.repo-link', '.jump-pill', '.toolkit-btn', '.filter-btn', 
      '.tech-terminal-trigger', '#theme-btn', '.back-top'
    ].join(',');

    function updateMagneticTargets() {
      const targets = document.querySelectorAll(interactiveSelectors);
      targets.forEach(elem => {
        if (elem.dataset.magAttached) return;
        elem.dataset.magAttached = 'true';
        elem.classList.add('mag-target');

        elem.addEventListener('mouseenter', () => {
          activeElem = elem;
          isSnapped = true;
          ring.classList.add('snapped');
        });

        elem.addEventListener('mouseleave', () => {
          if (activeElem === elem) {
            elem.style.transform = '';
            activeElem = null;
            isSnapped = false;
            ring.classList.remove('snapped');
          }
        });

        elem.addEventListener('mousemove', (e) => {
          if (elem !== activeElem) return;
          const rect = elem.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) * 0.28;
          const dy = (e.clientY - cy) * 0.28;
          elem.style.transform = `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px)`;
        });
      });
    }
    updateMagneticTargets();
    setInterval(updateMagneticTargets, 2500);

    function renderRing() {
      if (isSnapped && activeElem) {
        const rect = activeElem.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        ringX += (targetX - ringX) * 0.22;
        ringY += (targetY - ringY) * 0.22;
        ringWidth = rect.width + 12;
        ringHeight = rect.height + 10;
        const style = window.getComputedStyle(activeElem);
        ringRadius = style.borderRadius || '6px';
      } else {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        ringWidth = 32;
        ringHeight = 32;
        ringRadius = '50%';
      }

      ring.style.transform = `translate(${ringX - ringWidth / 2}px, ${ringY - ringHeight / 2}px)`;
      ring.style.width = `${ringWidth}px`;
      ring.style.height = `${ringHeight}px`;
      ring.style.borderRadius = ringRadius;

      requestAnimationFrame(renderRing);
    }
    renderRing();
  }

  /* ──────────────────────────────────────────────────────────────
     SYSTEM 3: IRIDESCENT MESH GRADIENTS (GPU WebGL Fragment Shader)
     - High-end biquadratic silk/mesh gradient simulation
     - GPU GLSL Simplex noise with time and mouse interactivity
     - Pure Nature palette (Dark void + emerald silk / Light morning dew)
  ────────────────────────────────────────────────────────────── */
  function initIridescentMesh() {
    const canvas = document.getElementById('prism-hero-canvas') || document.getElementById('iridescent-mesh-canvas');
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!gl) return;

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform vec2 u_resolution;
      uniform vec2 u_mouse;
      uniform float u_time;
      uniform float u_isLight;

      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ;
        m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        vec2 p = uv * 2.0 - 1.0;
        p.x *= u_resolution.x / u_resolution.y;

        vec2 mouseEffect = (u_mouse - 0.5) * 0.35;
        float t = u_time * 0.28;

        float n1 = snoise(p * 0.75 + vec2(t * 0.5, t * 0.3) + mouseEffect);
        float n2 = snoise(p * 1.25 - vec2(t * 0.4, -t * 0.6) + vec2(n1 * 0.5));
        float n3 = snoise(p * 2.0 + vec2(n2 * 0.7, t * 0.8));

        vec3 colVoidDark = vec3(0.012, 0.027, 0.020);   // #030705 Midnight Pine Void
        vec3 colPine     = vec3(0.016, 0.298, 0.216);   // #047857 Deep Forest
        vec3 colEmerald  = vec3(0.063, 0.725, 0.506);   // #10b981 Vivid Emerald Silk
        vec3 colGlacier  = vec3(0.176, 0.831, 0.749);   // #2dd4bf Mountain Glacier
        vec3 colSprout   = vec3(0.290, 0.871, 0.502);   // #4ade80 Sprout Aurora

        vec3 colLightBg  = vec3(0.969, 0.980, 0.973);   // #f7faf8 Crisp Alabaster
        vec3 colLightDew = vec3(0.820, 0.980, 0.898);   // #d1fae5 Morning Dew
        vec3 colLightSage= vec3(0.902, 0.965, 0.925);   // #e6f6ec Soft Jade
        vec3 colLightEm  = vec3(0.016, 0.471, 0.341);   // #047857 Forest Emerald

        vec3 finalColor;
        float alpha;

        if (u_isLight > 0.5) {
          vec3 blend1 = mix(colLightBg, colLightDew, smoothstep(-0.6, 0.6, n1));
          vec3 blend2 = mix(blend1, colLightSage, smoothstep(-0.4, 0.8, n2));
          finalColor = mix(blend2, colLightEm, clamp(n3 * 0.18, 0.0, 0.22));
          alpha = 0.45 * (1.0 - smoothstep(0.1, 1.25, length(uv - vec2(0.5, 0.3))));
        } else {
          vec3 blend1 = mix(colVoidDark, colPine, smoothstep(-0.8, 0.4, n1));
          vec3 blend2 = mix(blend1, colEmerald, smoothstep(-0.2, 0.9, n2));
          vec3 blend3 = mix(blend2, colGlacier, smoothstep(0.1, 1.1, n3));
          finalColor = mix(blend3, colSprout, clamp(n1 * n2 * 0.4, 0.0, 0.4));
          alpha = 0.65 * (1.0 - smoothstep(0.05, 1.3, length(uv - vec2(0.5, 0.25))));
        }

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    function createShader(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    gl.useProgram(program);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1
    ]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uLight = gl.getUniformLocation(program, 'u_isLight');

    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
    window.addEventListener('mousemove', (e) => {
      mouse.targetX = e.clientX / window.innerWidth;
      mouse.targetY = 1.0 - (e.clientY / window.innerHeight);
    }, { passive: true });

    function resize() {
      const parent = canvas.parentElement || document.body;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const startTime = performance.now();
    function render(now) {
      const elapsed = (now - startTime) * 0.001;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const isLight = document.body.classList.contains('light') ? 1.0 : 0.0;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uLight, isLight);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  /* ──────────────────────────────────────────────────────────────
     SYSTEM 4: BENTO GRID PARALLAX DEPTH
     - Multi-layer 3D transforms inspired by Apple Dashboard
     - Foreground elements (tags, badges, CTAs) float and slide 
       with higher parallax ratio than background
     - Silky spring damping on enter and leave
  ────────────────────────────────────────────────────────────── */
  function initBentoGridParallax() {
    if (isTouch || prefersReducedMotion) return;

    const cards = document.querySelectorAll('.prism-card, .project-card, .proof-card, .toolkit-card');
    cards.forEach(card => {
      card.classList.add('bento-parallax-card');

      const midLayers = card.querySelectorAll('.project-title, .proj-title, .project-desc, .field-body, .timeline-desc, .toolkit-card-list');
      midLayers.forEach(el => el.classList.add('bento-layer-mid'));

      const foreLayers = card.querySelectorAll('.ptag, .tag, .proj-badge, .project-link, .repo-link, .proof-stat, .toolkit-btn');
      foreLayers.forEach(el => el.classList.add('bento-layer-fore'));

      let targetX = 0, targetY = 0;
      let curX = 0, curY = 0;
      let isHover = false;
      let raf = null;

      card.addEventListener('mouseenter', () => {
        isHover = true;
        if (!raf) raf = requestAnimationFrame(animate);
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = ny * -13;
        targetY = nx * 13;

        card.style.setProperty('--mouse-x', `${((nx + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${((ny + 0.5) * 100).toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        isHover = false;
        targetX = 0;
        targetY = 0;
      });

      function animate() {
        curX += (targetX - curX) * 0.16;
        curY += (targetY - curY) * 0.16;

        card.style.transform = `perspective(1000px) rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;

        const foreOffset = `translate3d(${(curY * 0.65).toFixed(1)}px, ${(curX * -0.65).toFixed(1)}px, 42px)`;
        foreLayers.forEach(el => {
          el.style.transform = foreOffset;
        });

        const midOffset = `translate3d(${(curY * 0.25).toFixed(1)}px, ${(curX * -0.25).toFixed(1)}px, 20px)`;
        midLayers.forEach(el => {
          el.style.transform = midOffset;
        });

        if (isHover || Math.abs(curX) > 0.05 || Math.abs(curY) > 0.05) {
          raf = requestAnimationFrame(animate);
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
          foreLayers.forEach(el => el.style.transform = '');
          midLayers.forEach(el => el.style.transform = '');
          raf = null;
        }
      }
    });
  }

  /* ──────────────────────────────────────────────────────────────
     INITIALIZATION
  ────────────────────────────────────────────────────────────── */
  function initAll() {
    initKineticTypography();
    initMagneticCursor();
    initIridescentMesh();
    initBentoGridParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
