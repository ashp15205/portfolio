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
/* ===============================
   PROJECT STRIP - ZERO GLITCH VERSION
================================ */

const strip = document.querySelector('.projects-strip');
const originalPanels = document.querySelectorAll('.project-panel');

if (strip && originalPanels.length) {
  const originalHTML = strip.innerHTML;
  const cloneBefore = strip.cloneNode(false);
  const cloneAfter = strip.cloneNode(false);

  originalPanels.forEach(panel => {
    cloneBefore.appendChild(panel.cloneNode(true));
    cloneAfter.appendChild(panel.cloneNode(true));
  });

  strip.innerHTML = cloneBefore.innerHTML + originalHTML + cloneAfter.innerHTML;

  const allPanels = document.querySelectorAll('.project-panel');
  const totalPanels = originalPanels.length;
  
  let scrollSpeed = 2.6; // Slower = smoother
  let isPaused = false;
  let userScrolling = false;
  let scrollTimeout;
  let animationId;
  let lastScrollLeft = 0;
  let isResetting = false; // Prevent updates during reset

  const getPanelWidth = () => allPanels[0].offsetWidth + 25; // Match your gap

  // Smooth boundary reset with NO visible jump
  function checkBoundaries() {
    if (isResetting) return;
    
    const panelWidth = getPanelWidth();
    const singleSetWidth = panelWidth * totalPanels;
    const scrollPos = strip.scrollLeft;
    
    // Reset when entering clone zones (with larger buffer to prevent flicker)
    if (scrollPos >= singleSetWidth * 2 - panelWidth * 2) {
      isResetting = true;
      const offset = scrollPos - (singleSetWidth * 2);
      strip.scrollLeft = singleSetWidth + offset;
      lastScrollLeft = strip.scrollLeft;
      requestAnimationFrame(() => {
        isResetting = false;
      });
    } else if (scrollPos <= panelWidth * 2) {
      isResetting = true;
      const offset = scrollPos;
      strip.scrollLeft = singleSetWidth + offset;
      lastScrollLeft = strip.scrollLeft;
      requestAnimationFrame(() => {
        isResetting = false;
      });
    }
  }

  // Unified update function with performance optimization
  function updatePanels() {
    if (isResetting) return; // Skip updates during reset
    
    const rect = strip.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    allPanels.forEach(panel => {
      const pRect = panel.getBoundingClientRect();
      const panelCenter = pRect.left + pRect.width / 2;
      const dist = (panelCenter - centerX) / rect.width;

      // Smooth easing for rotation
      const rotate = dist * -40;
      const scale = Math.max(0.75, 1.05 - Math.abs(dist) * 0.25);
      const opacity = Math.max(0.3, 1 - Math.abs(dist) * 0.5);
      const translateY = Math.abs(dist) * 18;

      // Use translate3d for hardware acceleration
      panel.style.transform = 
        `translate3d(0, ${translateY}px, 0) rotateY(${rotate}deg) scale(${scale})`;
      panel.style.opacity = opacity;
    });
  }

  // Auto-scroll with frame-perfect timing
  function autoScroll() {
    if (!isPaused && !userScrolling && !isResetting) {
      strip.scrollLeft += scrollSpeed;
      
      // Batch updates to prevent reflow
      if (Math.abs(strip.scrollLeft - lastScrollLeft) > 0.5) {
        checkBoundaries();
        updatePanels();
        lastScrollLeft = strip.scrollLeft;
      }
    }
    animationId = requestAnimationFrame(autoScroll);
  }

  // Throttled scroll handler to prevent lag
  let scrollRAF = null;
  strip.addEventListener('scroll', () => {
    const currentScroll = strip.scrollLeft;
    
    // Detect user scroll (large sudden changes)
    if (Math.abs(currentScroll - lastScrollLeft) > scrollSpeed * 3) {
      userScrolling = true;
      clearTimeout(scrollTimeout);
      
      scrollTimeout = setTimeout(() => {
        userScrolling = false;
        lastScrollLeft = currentScroll;
      }, 250);
    }
    
    // Throttle updates using RAF
    if (scrollRAF === null) {
      scrollRAF = requestAnimationFrame(() => {
        if (!isResetting) {
          checkBoundaries();
          updatePanels();
        }
        scrollRAF = null;
      });
    }
  }, { passive: true });

  // Pause on hover
  strip.addEventListener('mouseenter', () => {
    isPaused = true;
  });

  strip.addEventListener('mouseleave', () => {
    isPaused = false;
  });

  // Debounced resize handler
  let resizeRAF = null;
  window.addEventListener('resize', () => {
    if (resizeRAF) cancelAnimationFrame(resizeRAF);
    
    resizeRAF = requestAnimationFrame(() => {
      isResetting = true;
      const panelWidth = getPanelWidth();
      strip.scrollLeft = panelWidth * totalPanels;
      lastScrollLeft = strip.scrollLeft;
      updatePanels();
      
      setTimeout(() => {
        isResetting = false;
      }, 50);
    });
  });

  // Proper initialization sequence
  function initialize() {
    const panelWidth = getPanelWidth();
    strip.scrollLeft = panelWidth * totalPanels;
    lastScrollLeft = strip.scrollLeft;
    
    requestAnimationFrame(() => {
      updatePanels();
      
      requestAnimationFrame(() => {
        autoScroll();
      });
    });
  }

  // Wait for layout to settle before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    requestAnimationFrame(initialize);
  }
}
