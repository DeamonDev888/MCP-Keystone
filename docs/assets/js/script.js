// MCP Keystone Website - Main JavaScript
// 🗝️ Le Disjoncteur Ultra-Intelligent Nouvelle Génération

// ===== PRELOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("loaded");
      setTimeout(() => {
        preloader.style.display = "none";
      }, 500);
    }
  }, 1500);
});

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");

if (canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 80;

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 107, 53, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
      particle.update();
      particle.draw();
    });

    // Draw connections between nearby particles
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 107, 53, ${0.15 * (1 - distance / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Resize handler
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// ===== SCROLL PROGRESS BAR =====
const scrollProgressBar = document.querySelector(".scroll-progress-bar");
if (scrollProgressBar) {
  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgressBar.style.width = scrollPercent + "%";
  });
}

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById("navbar");
if (navbar) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  // Load saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "☀️" : "🌙";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
}

// ===== COUNTDOWN TIMER =====
function updateCountdown() {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 7);
  targetDate.setHours(23, 59, 59);

  const now = new Date();
  const diff = targetDate - now;

  if (diff > 0) {
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== SMOOTH SCROLL FOR NAV LINKS =====
document.querySelectorAll(".nav-link, .btn[href^='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offsetTop = target.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }
  });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe elements for animation
document
  .querySelectorAll(
    ".feature-card, .product-card, .spec-card, .pricing-card, .faq-item, .viability-item"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(el);
  });

// ===== CART FUNCTIONALITY =====
let cartCount = 0;
const cartCountEl = document.querySelector(".cart-count");

function addToCart(productName = "Produit") {
  cartCount++;
  if (cartCountEl) {
    cartCountEl.textContent = cartCount;
    cartCountEl.style.transform = "scale(1.5)";
    setTimeout(() => {
      cartCountEl.style.transform = "scale(1)";
    }, 200);
  }
  localStorage.setItem("cartCount", cartCount);
  localStorage.setItem("lastAdded", productName);

  // Show notification
  showNotification(`✅ ${productName} ajouté au panier !`);
}

function removeFromCart() {
  if (cartCount > 0) {
    cartCount--;
    if (cartCountEl) {
      cartCountEl.textContent = cartCount;
    }
    localStorage.setItem("cartCount", cartCount);
  }
}

// Load cart from localStorage
const savedCart = localStorage.getItem("cartCount");
if (savedCart && cartCountEl) {
  cartCount = parseInt(savedCart);
  cartCountEl.textContent = cartCount;
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message) {
  // Remove existing notification if any
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  // Create notification element
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    background: linear-gradient(135deg, #00d4aa 0%, #6366f1 100%);
    color: white;
    padding: 15px 25px;
    border-radius: 12px;
    box-shadow: 0 5px 20px rgba(0, 212, 170, 0.4);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 500;
  `;

  // Add animation keyframes if not exists
  if (!document.querySelector("#notification-styles")) {
    const style = document.createElement("style");
    style.id = "notification-styles";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===== BUTTON CLICK HANDLERS =====
document.querySelectorAll(".buy-now-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    addToCart("MCP Keystone");
  });
});

document
  .querySelectorAll(".product-card .btn-primary, .pricing-card .btn-primary")
  .forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = btn.closest(".product-card, .pricing-card");
      const title = card?.querySelector("h3")?.textContent || "Produit";
      addToCart(title);
    });
  });

// ===== STATS COUNTER ANIMATION =====
function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Animate stats when hero section is visible
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const statNumbers = entry.target.querySelectorAll(".stat-number");
        statNumbers.forEach((stat) => {
          const text = stat.textContent;
          const match = text.match(/\d+/);
          if (match) {
            const finalValue = parseInt(match[0]);
            animateValue(stat, 0, finalValue, 2000);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  statsObserver.observe(heroStats);
}

// ===== FAQ ACCORDION (Optional Enhancement) =====
document.querySelectorAll(".faq-item").forEach((item) => {
  item.addEventListener("click", () => {
    // Toggle active class
    item.classList.toggle("active");

    // Animate height
    const p = item.querySelector("p");
    if (p) {
      if (item.classList.contains("active")) {
        p.style.maxHeight = p.scrollHeight + "px";
        p.style.opacity = "1";
      } else {
        p.style.maxHeight = "0";
        p.style.opacity = "0.7";
      }
    }
  });
});

// Add initial styles for FAQ
document.querySelectorAll(".faq-item p").forEach((p) => {
  p.style.maxHeight = "0";
  p.style.overflow = "hidden";
  p.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
});

// ===== DYNAMIC YEAR IN FOOTER =====
const yearElements = document.querySelectorAll(".footer-bottom");
yearElements.forEach((el) => {
  el.innerHTML = el.innerHTML.replace("2026", new Date().getFullYear());
});

// ===== PERFORMANCE: Debounce Resize Events =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedResize = debounce(() => {
  if (canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
}, 250);

window.addEventListener("resize", debouncedResize);

// ===== CONSOLE MESSAGE =====
console.log(`
🗝️ MCP Keystone - Le Disjoncteur Ultra-Intelligent
⚡ 10 Fonctionnalités GOD MODE
🧬 Vector DNA 4096D
🛡️ Sentinelle Anti-Arc
💰 Coût Production: 12$

Chargé avec succès! 🚀
`);

// ===== EXIT INTENT (Optional - For Marketing) =====
let exitIntentShown = false;
document.addEventListener("mouseout", (e) => {
  if (e.clientY < 0 && !exitIntentShown) {
    exitIntentShown = true;
    // You can add exit intent popup here
    // showExitIntentPopup();
  }
});

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.createElement("button");
scrollToTopBtn.innerHTML = "↑";
scrollToTopBtn.className = "scroll-to-top";
scrollToTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00d4aa 0%, #6366f1 100%);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
  box-shadow: 0 4px 20px rgba(0, 212, 170, 0.4);
`;

document.body.appendChild(scrollToTopBtn);

window.addEventListener("scroll", () => {
  if (window.scrollY > 500) {
    scrollToTopBtn.style.opacity = "1";
    scrollToTopBtn.style.visibility = "visible";
  } else {
    scrollToTopBtn.style.opacity = "0";
    scrollToTopBtn.style.visibility = "hidden";
  }
});

scrollToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== IMAGE LAZY LOADING =====
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ===== SERVICE WORKER REGISTRATION (For PWA) =====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    // navigator.serviceWorker.register("/sw.js")
    //   .then(reg => console.log("Service Worker registered"))
    //   .catch(err => console.log("Service Worker registration failed"));
  });
}
