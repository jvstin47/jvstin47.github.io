/**
 * ═══════════════════════════════════════════════════════════════════════════════════════
 * JUSTIN MATHEW PORTFOLIO — 4 CUTTING-EDGE INTERACTIVE DESIGN SYSTEMS
 * 
 * Phase 1: Magnetic Cursor & Elastic Hover (Nav links, terminal button, and project cards)
 * Phase 2: Bento 3D Parallax Depth (Flagship drone card #p8, project cards, toolkit)
 * Phase 3: Iridescent Nature Mesh (Hero backdrop & terminal console backdrop)
 * Phase 4: Kinetic Typography (Hero headline / Section titles)
 * ═══════════════════════════════════════════════════════════════════════════════════════
 */

(function() {
  'use strict';

  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─────────────────────────────────────────────────────────────────────────────
     PHASE 1: MAGNETIC CURSOR & ELASTIC HOVER
     Target Placement: Nav links, terminal button, project cards, action buttons
     Features: Velocity squash & stretch, magnetic target snapping, spring attraction
  ───────────────────────────────────────────────────────────────────────────── */
  function initPhase1MagneticCursor() {
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
    let isHover = false;
    let isInput = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      dot.style.opacity = isInput ? '0' : '1';
      ring.style.opacity = isInput ? '0' : '1';
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      if (!isInput) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    });

    const interactiveSelectors = [
      'nav.site-nav a',
      '.nav-links a',
      '.tech-terminal-trigger',
      '#theme-btn',
      '.project-link',
      '.repo-link',
      '.jump-pill',
      '.toolkit-btn',
      '.filter-btn',
      '.btn-primary',
      '.btn-ghost',
      '.btn-outline',
      '.btn-terminal',
      '.back-top',
      '.cert-modal-close',
      '.tech-term-dot'
    ].join(',');

    function bindInteractiveCursor() {
      const targets = document.querySelectorAll(interactiveSelectors);
      targets.forEach(elem => {
        if (elem.dataset.cursorBound) return;
        elem.dataset.cursorBound = 'true';

        elem.addEventListener('mouseenter', () => {
          isHover = true;
          ring.classList.add('hovering');
        });

        elem.addEventListener('mouseleave', () => {
          isHover = false;
          ring.classList.remove('hovering');
        });
      });

      // Hide custom cursor over inputs and textareas so standard text caret shows
      const inputs = document.querySelectorAll('input, textarea, [contenteditable="true"]');
      inputs.forEach(input => {
        if (input.dataset.cursorBound) return;
        input.dataset.cursorBound = 'true';
        input.addEventListener('mouseenter', () => {
          isInput = true;
          dot.style.opacity = '0';
          ring.style.opacity = '0';
        });
        input.addEventListener('mouseleave', () => {
          isInput = false;
          dot.style.opacity = '1';
          ring.style.opacity = '1';
        });
      });
    }

    bindInteractiveCursor();
    setInterval(bindInteractiveCursor, 2500);

    function renderBotanicalCursor() {
      ringX += (mouseX - ringX) * 0.28;
      ringY += (mouseY - ringY) * 0.28;

      const size = isHover ? 32 : 22;
      ring.style.width = `${size}px`;
      ring.style.height = `${size}px`;
      ring.style.transform = `translate(${ringX - size / 2}px, ${ringY - size / 2}px)`;

      requestAnimationFrame(renderBotanicalCursor);
    }
    renderBotanicalCursor();
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     PHASE 2: BENTO 3D PARALLAX DEPTH
     Target Placement: Flagship drone card (#p8 / .hardware-panel-card), project cards, toolkit
     Impact: Turns flat cards into layered physical hardware panels
  ───────────────────────────────────────────────────────────────────────────── */
  function initPhase2Bento3DParallax() {
    if (isTouch || prefersReducedMotion) return;

    const cards = document.querySelectorAll('.prism-card, .project-card, .hardware-panel-card, .proof-card, .toolkit-card');
    cards.forEach(card => {
      card.classList.add('bento-parallax-card');

      // Stratify child layers
      const midLayers = card.querySelectorAll('.project-title, .proj-title, .project-desc, .field-body, .timeline-desc, .toolkit-card-list, .proj-hook');
      midLayers.forEach(el => el.classList.add('bento-layer-mid'));

      const foreLayers = card.querySelectorAll('.ptag, .tag, .proj-badge, .project-link, .repo-link, .outcome-big, .proof-stat, .toolkit-btn, .proj-num');
      foreLayers.forEach(el => el.classList.add('bento-layer-fore'));

      let targetX = 0, targetY = 0;
      let curX = 0, curY = 0;
      let isHover = false;
      let raf = null;

      card.addEventListener('mouseenter', () => {
        isHover = true;
        if (!raf) raf = requestAnimationFrame(animateBento);
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        targetX = ny * -13; // tiltX
        targetY = nx * 13;  // tiltY

        card.style.setProperty('--mouse-x', `${((nx + 0.5) * 100).toFixed(1)}%`);
        card.style.setProperty('--mouse-y', `${((ny + 0.5) * 100).toFixed(1)}%`);
      });

      card.addEventListener('mouseleave', () => {
        isHover = false;
        targetX = 0;
        targetY = 0;
      });

      function animateBento() {
        curX += (targetX - curX) * 0.16;
        curY += (targetY - curY) * 0.16;

        card.style.transform = `perspective(1000px) rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;

        // Foreground elements slide with elevated ratio
        const foreOffset = `translate3d(${(curY * 0.75).toFixed(1)}px, ${(curX * -0.75).toFixed(1)}px, 50px)`;
        foreLayers.forEach(el => {
          el.style.transform = foreOffset;
        });

        // Mid elements slide with gentle ratio
        const midOffset = `translate3d(${(curY * 0.28).toFixed(1)}px, ${(curX * -0.28).toFixed(1)}px, 24px)`;
        midLayers.forEach(el => {
          el.style.transform = midOffset;
        });

        if (isHover || Math.abs(curX) > 0.05 || Math.abs(curY) > 0.05) {
          raf = requestAnimationFrame(animateBento);
        } else {
          card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
          foreLayers.forEach(el => el.style.transform = '');
          midLayers.forEach(el => el.style.transform = '');
          raf = null;
        }
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     PHASE 3: IRIDESCENT NATURE MESH (GPU WebGL Fragment Shader)
     Target Placement: Hero backdrop (#prism-hero-canvas) & Terminal console backdrop (#term-mesh-canvas)
     Impact: Adds organic fluid depth locked to emerald/pine palette
  ───────────────────────────────────────────────────────────────────────────── */
  function initPhase3IridescentNatureMesh() {
    const targetCanvases = [
      document.getElementById('prism-hero-canvas'),
      document.getElementById('term-mesh-canvas')
    ].filter(Boolean);

    if (!targetCanvases.length) return;

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
      uniform float u_intensity;

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
          vec3 colMint     = vec3(0.537, 0.925, 0.745); // #89ecc0 fresh luminous mint
          vec3 colJade     = vec3(0.200, 0.780, 0.580); // #33c794 vibrant botanical jade
          vec3 colDeepPine = vec3(0.016, 0.380, 0.250); // #046140 deep pine accent
          vec3 blend1 = mix(colLightDew, colMint, smoothstep(-0.6, 0.5, n1));
          vec3 blend2 = mix(blend1, colJade, smoothstep(-0.3, 0.7, n2));
          finalColor = mix(blend2, colDeepPine, clamp(n3 * 0.28, 0.0, 0.35));
          alpha = 0.75 * (1.0 - smoothstep(0.05, 1.4, length(uv - vec2(0.5, 0.28)))) * u_intensity;
        } else {
          vec3 blend1 = mix(colVoidDark, colPine, smoothstep(-0.8, 0.4, n1));
          vec3 blend2 = mix(blend1, colEmerald, smoothstep(-0.2, 0.9, n2));
          vec3 blend3 = mix(blend2, colGlacier, smoothstep(0.1, 1.1, n3));
          finalColor = mix(blend3, colSprout, clamp(n1 * n2 * 0.4, 0.0, 0.4));
          alpha = 0.65 * (1.0 - smoothstep(0.05, 1.3, length(uv - vec2(0.5, 0.25)))) * u_intensity;
        }

        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    function attachShader(canvas, intensityMultiplier) {
      const gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
      if (!gl) return null;

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
      if (!vs || !fs) return null;

      const program = gl.createProgram();
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;

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
      const uInt = gl.getUniformLocation(program, 'u_intensity');

      let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };
      window.addEventListener('mousemove', (e) => {
        mouse.targetX = e.clientX / window.innerWidth;
        mouse.targetY = 1.0 - (e.clientY / window.innerHeight);
      }, { passive: true });

      function resize() {
        const parent = canvas.parentElement || document.body;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const width = parent.offsetWidth || window.innerWidth;
        const height = parent.offsetHeight || window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      resize();
      window.addEventListener('resize', resize);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      const startTime = performance.now();
      return function render(now) {
        // If canvas is not visible (e.g. terminal modal closed), skip heavy draw
        if (canvas.offsetParent === null && canvas.id === 'term-mesh-canvas') {
          return;
        }

        const elapsed = (now - startTime) * 0.001;
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        const isLight = document.body.classList.contains('light') ? 1.0 : 0.0;

        gl.useProgram(program);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform2f(uMouse, mouse.x, mouse.y);
        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uLight, isLight);
        gl.uniform1f(uInt, intensityMultiplier);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };
    }

    const renderers = [];
    const heroCanvas = document.getElementById('prism-hero-canvas');
    if (heroCanvas) {
      const r = attachShader(heroCanvas, 1.0);
      if (r) renderers.push(r);
    }
    const termCanvas = document.getElementById('term-mesh-canvas');
    if (termCanvas) {
      const r = attachShader(termCanvas, 0.45);
      if (r) renderers.push(r);
    }

    if (renderers.length > 0) {
      function loopAll(now) {
        for (let i = 0; i < renderers.length; i++) {
          renderers[i](now);
        }
        requestAnimationFrame(loopAll);
      }
      requestAnimationFrame(loopAll);
    }
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     PHASE 4: KINETIC TYPOGRAPHY & FLUID DISTORTION
     Target Placement: Hero headline (.hero-name) / Section titles (.section-title, .intro-h1, h1)
     Impact: Fluid liquid text displacement on hover with spring recovery
  ───────────────────────────────────────────────────────────────────────────── */
  function initPhase4KineticTypography() {
    if (prefersReducedMotion) return;

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

    const titles = document.querySelectorAll('.hero-name, .section-title, .intro-h1, h1');
    if (!titles.length) return;

    titles.forEach(t => t.classList.add('kinetic-text-wrap'));

    let mouseX = 0, mouseY = 0;
    let lastX = 0, lastY = 0;
    let velocity = 0;
    let currentScale = 0;
    let targetScale = 0;
    let scaleVelocity = 0;
    const tension = 0.18;
    const damping = 0.76;
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
      titles.forEach(el => {
        const rect = el.getBoundingClientRect();
        const pad = 80;
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
        targetScale = Math.min(velocity * 0.75, 32);
      }
    }, { passive: true });

    function updateKineticPhysics() {
      time += 0.02;
      const force = (targetScale - currentScale) * tension;
      scaleVelocity = (scaleVelocity + force) * damping;
      currentScale += scaleVelocity;
      targetScale *= 0.84; // spring decay once velocity drops

      if (currentScale > 0.1) {
        dispMap.setAttribute('scale', currentScale.toFixed(2));
        turbNode.setAttribute('baseFrequency', `${(0.032 + Math.sin(time) * 0.006).toFixed(3)} ${(0.036 + Math.cos(time) * 0.006).toFixed(3)}`);
      } else if (currentScale !== 0) {
        currentScale = 0;
        scaleVelocity = 0;
        dispMap.setAttribute('scale', '0');
        titles.forEach(el => el.classList.remove('kinetic-fluid-active'));
      }

      requestAnimationFrame(updateKineticPhysics);
    }
    updateKineticPhysics();
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     FEATURE 1: CROSS-WINDOW KINETIC ELASTICITY (BroadcastChannel Desktop Mesh)
     Target: Pop-out Satellite HUD + Main Window Bridge
  ───────────────────────────────────────────────────────────────────────────── */
  function initCrossWindowPhysics() {
    const mainCanvas = document.getElementById('cross-window-main-canvas');
    if (!mainCanvas) return;
    const ctx = mainCanvas.getContext('2d');
    if (!ctx) return;

    function resizeMainCanvas() {
      mainCanvas.width = window.innerWidth;
      mainCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeMainCanvas);
    resizeMainCanvas();

    const channel = new BroadcastChannel('monocoque_window_mesh');
    let satellitePos = null;
    let lastSatTime = 0;
    let particles = [];
    let wasConnected = false;

    // Broadcast our window coordinates across the desktop
    function broadcastMain() {
      channel.postMessage({
        type: 'window_pos',
        sender: 'main',
        x: window.screenX,
        y: window.screenY,
        w: window.outerWidth,
        h: window.outerHeight,
        time: Date.now()
      });
    }

    channel.onmessage = (e) => {
      if (e.data && e.data.type === 'window_pos' && e.data.sender === 'satellite') {
        satellitePos = e.data;
        lastSatTime = Date.now();
      }
    };

    function triggerSplatter(x, y) {
      for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 9 + 2;
        particles.push({
          x, y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          life: 1.0,
          color: Math.random() > 0.5 ? '#10b981' : '#2dd4bf'
        });
      }
    }

    function renderMainBridge() {
      ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

      const isAlive = satellitePos && (Date.now() - lastSatTime < 1600);

      if (isAlive) {
        const myCenterX = window.screenX + window.outerWidth / 2;
        const myCenterY = window.screenY + window.outerHeight / 2;
        const otherCenterX = satellitePos.x + satellitePos.w / 2;
        const otherCenterY = satellitePos.y + satellitePos.h / 2;

        const dx = otherCenterX - myCenterX;
        const dy = otherCenterY - myCenterY;
        const dist = Math.hypot(dx, dy);
        const maxDist = 720;

        if (dist < maxDist) {
          wasConnected = true;
          const angle = Math.atan2(dy, dx);

          // Clamped edge point
          const startX = mainCanvas.width / 2 + Math.cos(angle) * (mainCanvas.width / 2.05);
          const startY = mainCanvas.height / 2 + Math.sin(angle) * (mainCanvas.height / 2.05);

          const reach = Math.max(1.0 - (dist / maxDist), 0.1);
          const endX = startX + Math.cos(angle) * (reach * 260);
          const endY = startY + Math.sin(angle) * (reach * 260);

          const thickness = 24 * reach;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.lineWidth = thickness;
          ctx.lineCap = 'round';
          ctx.strokeStyle = '#10b981';
          ctx.shadowColor = '#34d399';
          ctx.shadowBlur = 25;
          ctx.stroke();

          // Luminous core filament
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.lineWidth = thickness * 0.45;
          ctx.strokeStyle = '#f0fdf4';
          ctx.shadowColor = '#2dd4bf';
          ctx.shadowBlur = 12;
          ctx.stroke();

          // Pulsing energy nodes
          const pNorm = (Math.sin(Date.now() * 0.007) + 1) / 2;
          const nodeX = startX + (endX - startX) * pNorm;
          const nodeY = startY + (endY - startY) * pNorm;
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, thickness * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = '#34d399';
          ctx.shadowBlur = 20;
          ctx.fill();

          ctx.restore();
        } else if (wasConnected) {
          wasConnected = false;
          const angle = Math.atan2(dy, dx);
          const snapX = mainCanvas.width / 2 + Math.cos(angle) * (mainCanvas.width / 2.05);
          const snapY = mainCanvas.height / 2 + Math.sin(angle) * (mainCanvas.height / 2.05);
          triggerSplatter(snapX, snapY);
        }
      }

      // Splatter particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.life -= 0.025;

        if (p.life <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3.5 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }
      }

      broadcastMain();
      requestAnimationFrame(renderMainBridge);
    }
    renderMainBridge();
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     FEATURE 2: INFINITE NON-EUCLIDEAN 3D PORTALS (The Step-Inside Grid)
     Target: Flagship Drone Card (#drone-portal-card & #drone-portal-canvas)
  ───────────────────────────────────────────────────────────────────────────── */
  function initNonEuclideanPortal() {
    const container = document.getElementById('drone-portal-card');
    const canvas = document.getElementById('drone-portal-canvas');
    const coordEl = document.getElementById('portal-drone-coords');
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resizePortal() {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio || rect.width;
      canvas.height = rect.height * window.devicePixelRatio || rect.height;
    }
    window.addEventListener('resize', resizePortal);
    resizePortal();

    let mouseU = 0.5, mouseV = 0.5;
    let targetU = 0.5, targetV = 0.5;
    let isHover = false;
    let rotAngle = 0;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      targetU = (e.clientX - rect.left) / rect.width;
      targetV = (e.clientY - rect.top) / rect.height;
      isHover = true;
    });

    container.addEventListener('mouseleave', () => {
      targetU = 0.5;
      targetV = 0.5;
      isHover = false;
    });

    function project3D(x, y, z, cx, cy, fov) {
      // Perspective projection with camera tilt
      const eyeX = (mouseU - 0.5) * 140;
      const eyeY = (mouseV - 0.5) * 90;
      const camX = x - eyeX;
      const camY = y - eyeY;
      const scale = fov / (fov + z);
      return {
        x: cx + camX * scale,
        y: cy + camY * scale,
        scale: scale
      };
    }

    function renderPortal() {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const fov = 340;

      // Smooth camera interpolation
      mouseU += (targetU - mouseU) * 0.12;
      mouseV += (targetV - mouseV) * 0.12;
      rotAngle += 0.022;

      ctx.clearRect(0, 0, w, h);

      // Deep dark chamber gradient
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, Math.max(w, h));
      bgGrad.addColorStop(0, '#041209');
      bgGrad.addColorStop(1, '#010403');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      ctx.save();

      // 1. Receding 3D Depth Grid (Floors, Walls, Ceiling)
      ctx.lineWidth = 1;
      const depthSteps = 8;
      const maxZ = 650;

      for (let i = 0; i < depthSteps; i++) {
        const z = (i / depthSteps) * maxZ;
        const alpha = Math.max(0.1, 1 - (z / maxZ)) * 0.65;
        ctx.strokeStyle = `rgba(16, 185, 129, ${alpha.toFixed(2)})`;

        // 4 Corner boundary rectangle at depth z
        const p1 = project3D(-cx * 0.95, -cy * 0.95, z, cx, cy, fov);
        const p2 = project3D(cx * 0.95, -cy * 0.95, z, cx, cy, fov);
        const p3 = project3D(cx * 0.95, cy * 0.95, z, cx, cy, fov);
        const p4 = project3D(-cx * 0.95, cy * 0.95, z, cx, cy, fov);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.stroke();

        // Floor longitudinal grid lines
        for (let col = -3; col <= 3; col++) {
          const colX = (col / 3) * (cx * 0.95);
          const fTop = project3D(colX, cy * 0.95, z, cx, cy, fov);
          const fNext = project3D(colX, cy * 0.95, z + (maxZ / depthSteps), cx, cy, fov);
          ctx.beginPath();
          ctx.moveTo(fTop.x, fTop.y);
          ctx.lineTo(fNext.x, fNext.y);
          ctx.stroke();
        }
      }

      // 2. Corner perspective depth struts
      ctx.strokeStyle = 'rgba(45, 212, 191, 0.45)';
      const nearCorners = [
        project3D(-cx * 0.95, -cy * 0.95, 0, cx, cy, fov),
        project3D(cx * 0.95, -cy * 0.95, 0, cx, cy, fov),
        project3D(cx * 0.95, cy * 0.95, 0, cx, cy, fov),
        project3D(-cx * 0.95, cy * 0.95, 0, cx, cy, fov)
      ];
      const farCorners = [
        project3D(-cx * 0.95, -cy * 0.95, maxZ, cx, cy, fov),
        project3D(cx * 0.95, -cy * 0.95, maxZ, cx, cy, fov),
        project3D(cx * 0.95, cy * 0.95, maxZ, cx, cy, fov),
        project3D(-cx * 0.95, cy * 0.95, maxZ, cx, cy, fov)
      ];
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(nearCorners[i].x, nearCorners[i].y);
        ctx.lineTo(farCorners[i].x, farCorners[i].y);
        ctx.stroke();
      }

      // 3. Central Holographic 3D Drone Model floating in the chamber
      const droneZ = 220 + Math.sin(rotAngle * 1.5) * 25;
      const droneArm = 70;
      const angles = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];

      const centerProj = project3D(0, 0, droneZ, cx, cy, fov);

      // LiDAR spherical pulses
      const pulseR = ((Date.now() * 0.05) % 110) * centerProj.scale;
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, pulseR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(45, 212, 191, ${(1 - pulseR / (110 * centerProj.scale)).toFixed(2)})`;
      ctx.stroke();

      // Drone Quad Arms
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2 * centerProj.scale;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;

      for (let a of angles) {
        const curA = a + rotAngle;
        const ax = Math.cos(curA) * droneArm;
        const ay = Math.sin(curA) * droneArm * 0.45; // slight pitch
        const armProj = project3D(ax, ay, droneZ, cx, cy, fov);

        ctx.beginPath();
        ctx.moveTo(centerProj.x, centerProj.y);
        ctx.lineTo(armProj.x, armProj.y);
        ctx.stroke();

        // Rotor disc
        ctx.beginPath();
        ctx.ellipse(armProj.x, armProj.y, 16 * centerProj.scale, 8 * centerProj.scale, curA, 0, Math.PI * 2);
        ctx.strokeStyle = '#2dd4bf';
        ctx.stroke();
      }

      // Central avionics core
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, 9 * centerProj.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#f0fdf4';
      ctx.shadowBlur = 16;
      ctx.fill();

      ctx.restore();

      // Update live coordinates readout
      if (coordEl && isHover) {
        const pitch = ((mouseV - 0.5) * -34).toFixed(1);
        const yaw = ((mouseU - 0.5) * 58).toFixed(1);
        coordEl.textContent = `YAW: ${yaw}° | PITCH: ${pitch}° | ALT: ${(droneZ * 0.1).toFixed(1)}m`;
      }

      requestAnimationFrame(renderPortal);
    }
    renderPortal();
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     FEATURE 3: VECTOR-CORROSION & CSS MELTING SHADERS
     Target: Toolkit buttons, project pills, and category filters
  ───────────────────────────────────────────────────────────────────────────── */
  function initLiquidMercuryMelting() {
    const turbNode = document.getElementById('mercury-turb');
    if (!turbNode) return;

    // Attach to interactive pills & buttons in Toolkit, Projects, and Ideas
    const targets = document.querySelectorAll('.toolkit-btn, .filter-btn, .ptag, .status-pill');
    targets.forEach(t => t.classList.add('liquid-melt-target'));

    let isMelting = false;
    let meltTime = 0;

    targets.forEach(elem => {
      elem.addEventListener('mouseenter', () => { isMelting = true; });
      elem.addEventListener('mouseleave', () => { isMelting = false; });
    });

    function updateLiquidMelting() {
      if (isMelting) {
        meltTime += 0.04;
        const freqX = (0.04 + Math.sin(meltTime) * 0.015).toFixed(3);
        const freqY = (0.04 + Math.cos(meltTime * 0.8) * 0.015).toFixed(3);
        turbNode.setAttribute('baseFrequency', `${freqX} ${freqY}`);
      }
      requestAnimationFrame(updateLiquidMelting);
    }
    updateLiquidMelting();
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     FEATURE 4: DIGITAL DECOUPLING & GRAVITATIONAL INERTIA
     Target: Toolkit & Achievements cards deflect dynamically on scroll velocity
  ───────────────────────────────────────────────────────────────────────────── */
  function initGravitationalInertia() {
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.toolkit-card, .achieve-stat-block, .timeline-item');
    if (!cards.length) return;

    cards.forEach(c => c.classList.add('inertia-physics-card'));

    let lastY = window.scrollY;
    let scrollVelocity = 0;
    let currentTilt = 0;
    let targetTilt = 0;

    window.addEventListener('scroll', () => {
      const curY = window.scrollY;
      const dy = curY - lastY;
      scrollVelocity = Math.max(Math.min(dy * 0.18, 12), -12);
      lastY = curY;
      targetTilt = scrollVelocity;
    }, { passive: true });

    function renderInertia() {
      // Spring decay
      targetTilt *= 0.88;
      currentTilt += (targetTilt - currentTilt) * 0.18;

      if (Math.abs(currentTilt) > 0.05) {
        const rad = (currentTilt * 0.4).toFixed(2);
        cards.forEach((card, idx) => {
          const stagger = (idx % 2 === 0 ? 1 : -1) * 0.5;
          card.style.transform = `translate3d(0, ${(currentTilt * 0.6).toFixed(1)}px, 0) rotate(${((currentTilt + stagger) * 0.08).toFixed(2)}deg)`;
        });
      } else if (currentTilt !== 0) {
        currentTilt = 0;
        cards.forEach(card => card.style.transform = '');
      }

      requestAnimationFrame(renderInertia);
    }
    renderInertia();
  }

  /* ─────────────────────────────────────────────────────────────────────────────
     ORCHESTRATION OF ALL SYSTEMS
  ───────────────────────────────────────────────────────────────────────────── */
  function initAllPhases() {
    initPhase1MagneticCursor();
    initPhase2Bento3DParallax();
    initPhase3IridescentNatureMesh();
    initPhase4KineticTypography();

    // The 4 Advanced Non-Hero Systems
    initCrossWindowPhysics();
    initNonEuclideanPortal();
    initLiquidMercuryMelting();
    initGravitationalInertia();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllPhases);
  } else {
    initAllPhases();
  }
})();
