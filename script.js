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
  window.lenisObj = lenis;

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

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("href");
    if (window.lenisObj) {
      window.lenisObj.scrollTo(targetId, { offset: -80 });
    } else {
      document.querySelector(targetId).scrollIntoView({ behavior: "smooth" });
    }
  });
});

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

    if (navLinks[i]) {
      const from = getRect(navLinks[i]);
      indicator.style.transform = `translateX(${from.x}px)`;
      indicator.style.width = `${from.w}px`;
      indicator.style.opacity = 1;
    }

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

const roles = ["Full-Stack Developer", "UI Designer", "Competitive Coder"];
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


/* ===============================
   PROJECTS SLIDER LOGIC (REMOVED)
================================ */

/* ===============================
   FORMSPREE SUBMIT HANDLER
================================ */

const form = document.querySelector(".contact-form");
const status = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    status.style.display = "none";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        form.reset();
        status.style.display = "block";

        // Optional auto-hide
        setTimeout(() => {
          status.style.display = "none";
        }, 5000);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (err) {
      alert("Network error. Please try again later.");
    }
  });
}

const audioPlayer = document.getElementById("audioPlayer");
const bgMusic = document.getElementById("bgMusic");

/* PAGE LOAD → EXPANDED */
window.addEventListener("load", () => {
  audioPlayer.classList.add("expanded");
});

/* CLICK → PLAY / PAUSE */
audioPlayer.addEventListener("click", (e) => {
  e.stopPropagation();

  // Remove initial expanded once user interacts
  audioPlayer.classList.remove("expanded");

  if (bgMusic.paused) {
    bgMusic.play();
    audioPlayer.classList.add("playing");
    audioPlayer.classList.remove("paused");
  } else {
    bgMusic.pause();
    audioPlayer.classList.remove("playing");
    audioPlayer.classList.add("paused");
  }
});
/* ===== CREATIVE PREMIUM BOOT LOADER ===== */
const loader = document.getElementById("preloader");
const loaderFill = document.getElementById("loader-bar-fill");
const loaderCount = document.getElementById("loader-count");
const loaderPhrase = document.getElementById("loader-phrase");

const phrases = [
  "Awakening the pixels...",
  "Brewing the coffee...",
  "Aligning the divs...",
  "Preparing the magic...",
  "Almost there..."
];

let progress = 0;
let phraseIndex = 0;

const phraseInterval = setInterval(() => {
  if (loaderPhrase) {
    loaderPhrase.style.opacity = 0;
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      loaderPhrase.textContent = phrases[phraseIndex];
      loaderPhrase.style.opacity = 1;
    }, 300);
  }
}, 1400);

const bootInterval = setInterval(() => {
  progress += Math.random() * 6 + 2; 
  if (progress > 100) progress = 100;
  
  if (loaderFill) loaderFill.style.width = progress + "%";
  if (loaderCount) loaderCount.textContent = Math.floor(progress);

  if (progress === 100) {
    clearInterval(bootInterval);
    clearInterval(phraseInterval);
    
    if (loaderPhrase) {
      loaderPhrase.style.opacity = 0;
      setTimeout(() => {
        loaderPhrase.textContent = "Welcome.";
        loaderPhrase.style.opacity = 1;
      }, 300);
    }
    
    setTimeout(() => {
      if (loader) loader.classList.add("hidden");
    }, 1000); // give time to read "Welcome."
  }
}, 80);
