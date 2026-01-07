/* =======================
   METEOR CURSOR (SAFE)
======================= */

const meteors = document.querySelectorAll(".meteor");
if (meteors.length) {
  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;

  const meteorPositions = Array.from({ length: meteors.length }, () => ({
    x: mouseX,
    y: mouseY
  }));

  window.addEventListener("mousemove", e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateMeteors() {
    meteorPositions[0].x += (mouseX - meteorPositions[0].x) * 0.25;
    meteorPositions[0].y += (mouseY - meteorPositions[0].y) * 0.25;

    for (let i = 1; i < meteorPositions.length; i++) {
      meteorPositions[i].x += (meteorPositions[i - 1].x - meteorPositions[i].x) * 0.25;
      meteorPositions[i].y += (meteorPositions[i - 1].y - meteorPositions[i].y) * 0.25;
    }

    meteors.forEach((m, i) => {
      m.style.transform = `translate(${meteorPositions[i].x}px, ${meteorPositions[i].y}px)`;
      m.style.opacity = `${1 - i * 0.08}`;
    });

    requestAnimationFrame(animateMeteors);
  }

  animateMeteors();
}

/* =======================
   MAGNETIC BUTTONS (SAFE)
======================= */

document.querySelectorAll(".magnetic").forEach(el => {
  el.addEventListener("mousemove", e => {
    const r = el.getBoundingClientRect();
    el.style.transform =
      `translate(${(e.clientX - r.left - r.width / 2) * 0.35}px,
                 ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "translate(0,0)";
  });
});

/* =======================
   LENIS (GUARDED)
======================= */

if (window.Lenis) {
  const lenis = new Lenis({
    duration: 1.2,
    easing: t => 1 - Math.pow(2, -10 * t)
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* =======================
   GSAP + SCROLLTRIGGER
======================= */

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  gsap.utils.toArray(".section").forEach(sec => {
  gsap.from(sec, {
    opacity: 0,
    y: 60,
    duration: 0.8,
    ease: "power3.out",
    scrollTrigger: {
      trigger: sec,
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });
});


  gsap.timeline({ delay: 0.3 })
    .from(".hero-text h1", { y: 40, opacity: 0 })
    .from(".hero-text .location", { y: 20, opacity: 0 }, "-=0.4")
    .from(".hero-text h2", { y: 20, opacity: 0 }, "-=0.3")
    .from(".actions > *", { y: 20, opacity: 0, stagger: 0.15 }, "-=0.3")
    .from(".code-editor", { y: 60, opacity: 0, scale: 0.95 }, "-=0.6");
}

/* =======================
   NAV INDICATOR (SAFE)
======================= */

const sections = [...document.querySelectorAll("section")];
const navLinks = [...document.querySelectorAll(".navbar a")];
const indicator = document.querySelector(".nav-indicator");
const navbar = document.querySelector(".navbar");

if (indicator && navbar) {
  function getRect(link) {
    const r = link.getBoundingClientRect();
    const n = navbar.getBoundingClientRect();
    return { x: r.left - n.left -19, w: r.width - 36 };
  }

  function updateIndicator() {
    const y = scrollY + innerHeight / 2;
    let i = sections.findIndex(
      (s, idx) =>
        y >= s.offsetTop &&
        y < (sections[idx + 1]?.offsetTop || Infinity)
    );
    i = Math.max(i, 0);

    const from = getRect(navLinks[i]);
    indicator.style.transform = `translateX(${from.x}px)`;
    indicator.style.width = `${from.w}px`;
    indicator.style.opacity = 1;

    navLinks.forEach((l, idx) => l.classList.toggle("active", idx === i));
  }

  addEventListener("scroll", updateIndicator);
  addEventListener("resize", updateIndicator);
  updateIndicator();
}

/* =======================
   THREE.JS (SAFE)
======================= */

if (window.THREE) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(innerWidth, innerHeight);
  renderer.domElement.style.position = "fixed";
  renderer.domElement.style.zIndex = "-2";
  document.body.appendChild(renderer.domElement);

  const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.5, 1),
    new THREE.MeshStandardMaterial({ wireframe: true, opacity: 0.08, transparent: true })
  );
  scene.add(mesh);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  function animate() {
    mesh.rotation.x += 0.001;
    mesh.rotation.y += 0.0015;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();
}

/* =======================
   TYPEWRITER (FINAL)
======================= */

const roles = ["Frontend Developer", "UI Designer", "Competitive Coder"];
const typing = document.getElementById("typing");

if (typing) {
  let i = 0, j = 0, del = false;

  function type() {
    const word = roles[i];
    typing.textContent = del ? word.slice(0, --j) : word.slice(0, ++j);

    if (!del && j === word.length) setTimeout(() => del = true, 1200);
    if (del && j === 0) { del = false; i = (i + 1) % roles.length; }

    setTimeout(type, del ? 60 : 90);
  }
  type();
}

/* ===============================
   CURSOR REACTIVE CODE EDITOR (SAFE)
================================ */

const editor = document.querySelector(".code-editor");

/*
  Enable cursor glow ONLY if this is a real code editor.
  If it contains coding-stats, disable the effect.
*/
if (editor && !editor.querySelector(".coding-stats")) {
  editor.addEventListener("mousemove", (e) => {
    const rect = editor.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    editor.style.background = `
      radial-gradient(
        600px at ${x}px ${y}px,
        rgba(111,186,255,0.25),
        rgba(10,18,40,0.85)
      )
    `;
  });

  editor.addEventListener("mouseleave", () => {
    editor.style.background = "rgba(10,18,40,0.75)";
  });
}

const audioPlayer = document.getElementById("audioPlayer");
const bgMusic = document.getElementById("bgMusic");

bgMusic.volume = 0.4;
let isPlaying = false;

/* play on first user interaction */
function startMusicOnce() {
  bgMusic.play().then(() => {
    audioPlayer.classList.add("playing");
    isPlaying = true;
  }).catch(() => {
    // autoplay blocked (rare case)
  });

  window.removeEventListener("click", startMusicOnce);
  window.removeEventListener("scroll", startMusicOnce);
  window.removeEventListener("keydown", startMusicOnce);
}

/* attach once */
window.addEventListener("click", startMusicOnce, { once: true });
window.addEventListener("scroll", startMusicOnce, { once: true });
window.addEventListener("keydown", startMusicOnce, { once: true });

/* manual toggle */
audioPlayer.addEventListener("click", () => {
  if (!isPlaying) {
    bgMusic.play();
    audioPlayer.classList.add("playing");
  } else {
    bgMusic.pause();
    audioPlayer.classList.remove("playing");
  }
  isPlaying = !isPlaying;
});

document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');

  if (href && !href.startsWith('#')) {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  }
});

/* ===============================
   EMAILJS CONTACT FORM
================================ */

const contactForm = document.getElementById("contact-form");
const statusMsg = document.getElementById("form-status");

if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    emailjs.sendForm(
      "service_dl80ck6",
      "template_p22lqo8",
      this
    ).then(
      () => {
        statusMsg.style.display = "block";
        statusMsg.textContent = "Message sent successfully 🚀";
        contactForm.reset();
      },
      (error) => {
        statusMsg.style.display = "block";
        statusMsg.style.color = "#ff6b8a";
        statusMsg.textContent = "Something went wrong. Try again.";
        console.error(error);
      }
    );
  });
}
/* =====================================================
   PROJECT STRIP — BLINK-FREE INFINITE LOOP
===================================================== */

const strip = document.querySelector(".projects-strip");
const panels = Array.from(strip?.children || []);

if (strip && panels.length) {
  const GAP = 25;
  const SPEED = 0.6;

  // Clone once: before + after
  panels.forEach(p => strip.appendChild(p.cloneNode(true)));
  panels.forEach(p => strip.insertBefore(p.cloneNode(true), strip.firstChild));

  const total = panels.length;
  let panelWidth = panels[0].offsetWidth + GAP;
  let baseOffset = panelWidth * total;

  strip.scrollLeft = baseOffset;

  let paused = false;

  function updateTransforms() {
    const center = strip.offsetWidth / 2;

    for (const panel of strip.children) {
      const x = panel.offsetLeft - strip.scrollLeft + panelWidth / 2;
      const dist = (x - center) / strip.offsetWidth;

      const rotate = dist * -30;
      const scale = 1 - Math.min(Math.abs(dist) * 0.3, 0.25);
      const translateY = Math.abs(dist) * 14;
      const opacity = 1 - Math.min(Math.abs(dist) * 0.6, 0.5);

      panel.style.transform =
        `translate3d(0, ${translateY}px, 0) rotateY(${rotate}deg) scale(${scale})`;
      panel.style.opacity = opacity;
    }
  }

  function loop() {
    if (!paused) {
      strip.scrollLeft += SPEED;

      // 🔑 INVISIBLE RECENTER — NO BLINK
      if (strip.scrollLeft >= baseOffset * 2) {
        strip.scrollLeft -= baseOffset;
      } else if (strip.scrollLeft <= 0) {
        strip.scrollLeft += baseOffset;
      }
    }

    updateTransforms();
    requestAnimationFrame(loop);
  }

  strip.addEventListener("mouseenter", () => paused = true);
  strip.addEventListener("mouseleave", () => paused = false);

  window.addEventListener("resize", () => {
    panelWidth = panels[0].offsetWidth + GAP;
    baseOffset = panelWidth * total;
    strip.scrollLeft = baseOffset;
  });

  requestAnimationFrame(loop);
}

