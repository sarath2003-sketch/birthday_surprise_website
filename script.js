/* ==========================================================================
   3D BIRTHDAY SURPRISE WEBSITE - CINEMATIC LOGIC & CONTINUOUS AUDIO
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. DYNAMIC PHOTO CONFIGURATION =================
  const PHOTOS = [
    { url: 'assets/photos/photo1.jpg', caption: 'Shining Smile ✨' },
    { url: 'assets/photos/photo2.jpg', caption: 'Beautiful Moment 💗' },
    { url: 'assets/photos/photo3.jpg', caption: 'Special Day 🌸' },
    { url: 'assets/photos/photo4.jpg', caption: 'Wonderful Memories ✨' },
    { url: 'assets/photos/photo5.jpg', caption: 'Sweet Surprise 💖' }
  ];

  // State Trackers
  let currentPIndex = 0;
  let currentSliderIndex = 0;
  let currentOrbitIndex = 0;

  // ================= 2. BACKGROUND 3D CANVASES & FLOATING PETALS =================
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  const ambientGlowEl = document.getElementById('ambient-glow');
  let particles = [];
  let width, height;

  function resizeBgCanvas() {
    width = bgCanvas.width = window.innerWidth;
    height = bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  class Particle {
    constructor(x, y, isHeart = false) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.isHeart = isHeart;
      this.size = isHeart ? Math.random() * 12 + 8 : Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * (isHeart ? 4 : 0.8);
      this.speedY = isHeart ? (Math.random() - 0.5) * 4 : -Math.random() * 0.8 - 0.2;
      this.alpha = isHeart ? 1 : Math.random() * 0.7 + 0.3;
      this.decay = isHeart ? Math.random() * 0.015 + 0.01 : 0;
      this.color = isHeart 
        ? ['#ff416c', '#ff2a85', '#00f2fe', '#ffb703'][Math.floor(Math.random() * 4)]
        : '#ffffff';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.isHeart) {
        this.alpha -= this.decay;
      } else {
        if (this.y < 0) this.y = height;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
      }
    }

    draw() {
      bgCtx.save();
      bgCtx.globalAlpha = Math.max(0, this.alpha);
      bgCtx.fillStyle = this.color;
      bgCtx.shadowColor = this.color;
      bgCtx.shadowBlur = this.isHeart ? 12 : 4;

      if (this.isHeart) {
        bgCtx.beginPath();
        const topCurveHeight = this.size * 0.3;
        bgCtx.moveTo(this.x, this.y + topCurveHeight);
        bgCtx.bezierCurveTo(
          this.x, this.y, 
          this.x - this.size / 2, this.y, 
          this.x - this.size / 2, this.y + topCurveHeight
        );
        bgCtx.bezierCurveTo(
          this.x - this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
          this.x, this.y + this.size, 
          this.x, this.y + this.size
        );
        bgCtx.bezierCurveTo(
          this.x, this.y + this.size, 
          this.x + this.size / 2, this.y + (this.size + topCurveHeight) / 2, 
          this.x + this.size / 2, this.y + topCurveHeight
        );
        bgCtx.bezierCurveTo(
          this.x + this.size / 2, this.y, 
          this.x, this.y, 
          this.x, this.y + topCurveHeight
        );
        bgCtx.fill();
      } else {
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bgCtx.fill();
      }

      bgCtx.restore();
    }
  }

  for (let i = 0; i < 70; i++) {
    particles.push(new Particle());
  }

  function triggerHeartExplosion(originX, originY) {
    for (let i = 0; i < 55; i++) {
      particles.push(new Particle(originX, originY, true));
    }
  }

  function animateBg() {
    bgCtx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].isHeart && particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateBg);
  }
  animateBg();

  // Floating Flower Petals Generator
  const petalsContainer = document.getElementById('petals-container');
  for (let i = 0; i < 16; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}vw`;
    petal.style.animationDuration = `${Math.random() * 5 + 6}s`;
    petal.style.animationDelay = `${Math.random() * 6}s`;
    petalsContainer.appendChild(petal);
  }

  // ================= 3. SCREEN NAVIGATION MANAGER =================
  function switchScreen(fromId, toId) {
    const fromScreen = document.getElementById(fromId);
    const toScreen = document.getElementById(toId);

    if (fromScreen) {
      fromScreen.style.opacity = '0';
      fromScreen.style.transform = 'scale(0.95) translateY(-20px)';
      setTimeout(() => {
        fromScreen.classList.remove('active');
        if (toScreen) {
          toScreen.classList.add('active');
          setTimeout(() => {
            toScreen.style.opacity = '1';
            toScreen.style.transform = 'scale(1) translateY(0)';
          }, 50);
        }
      }, 500);
    }
  }

  // Touch Swipe Listener Utility for Mobile
  function addSwipeListener(element, onSwipeLeft, onSwipeRight) {
    let startX = 0;
    let startY = 0;

    element.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].screenX;
      startY = e.changedTouches[0].screenY;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
      const endX = e.changedTouches[0].screenX;
      const endY = e.changedTouches[0].screenY;
      const diffX = endX - startX;
      const diffY = endY - startY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) {
          if (onSwipeLeft) onSwipeLeft();
        } else {
          if (onSwipeRight) onSwipeRight();
        }
      }
    }, { passive: true });
  }

  // ================= 4. SCREEN 1: HEART HIT & EXPLOSION =================
  const startBtn = document.getElementById('start-btn');
  const flyingArrow = document.getElementById('flying-arrow');
  const glowingHeart = document.getElementById('glowing-heart');

  startBtn.addEventListener('click', () => {
    startAudio();

    const heartRect = glowingHeart.getBoundingClientRect();
    const btnRect = startBtn.getBoundingClientRect();

    flyingArrow.style.left = `${btnRect.left + btnRect.width / 2 - 15}px`;
    flyingArrow.style.top = `${btnRect.top}px`;
    flyingArrow.style.opacity = '1';
    flyingArrow.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';

    setTimeout(() => {
      flyingArrow.style.top = `${heartRect.top + heartRect.height / 2 - 15}px`;
      flyingArrow.style.left = `${heartRect.left + heartRect.width / 2 - 15}px`;
      flyingArrow.style.transform = 'scale(1.4)';
    }, 50);

    setTimeout(() => {
      flyingArrow.style.opacity = '0';
      glowingHeart.style.transform = 'scale(0)';
      triggerHeartExplosion(
        heartRect.left + heartRect.width / 2, 
        heartRect.top + heartRect.height / 2
      );

      setTimeout(() => {
        switchScreen('screen-1', 'screen-2');
        startTypingAnimation();
      }, 700);
    }, 650);
  });

  // ================= 5. SCREEN 2: TYPING ANIMATION =================
  const typingTextEl = document.getElementById('typing-text');
  const toWishBtn = document.getElementById('to-wish-btn');
  const fullText = "💖 Happy Birthday! 💖\nToday is your special day.\nI hope this day brings you beautiful smiles,\nwonderful memories and lots of happiness.";

  function startTypingAnimation() {
    typingTextEl.innerHTML = '';
    const textChars = Array.from(fullText);
    let index = 0;

    function typeNextChar() {
      if (index < textChars.length) {
        const char = textChars[index];
        if (char === '\n') {
          typingTextEl.appendChild(document.createElement('br'));
        } else {
          const span = document.createElement('span');
          span.textContent = char;
          typingTextEl.appendChild(span);
        }
        index++;
        setTimeout(typeNextChar, 40);
      } else {
        toWishBtn.style.display = 'inline-flex';
        toWishBtn.classList.add('pulse-btn');
      }
    }
    setTimeout(typeNextChar, 300);
  }

  toWishBtn.addEventListener('click', () => {
    switchScreen('screen-2', 'screen-3');
  });

  // ================= 6. SCREEN 3 & 4: WISH CARD & FAVOURITES =================
  document.getElementById('to-favs-btn').addEventListener('click', () => {
    switchScreen('screen-3', 'screen-4');
  });

  const favCards = document.querySelectorAll('.fav-card');
  favCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const rect = card.getBoundingClientRect();
      triggerHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  document.getElementById('to-gift-btn').addEventListener('click', () => {
    switchScreen('screen-4', 'screen-5');
  });

  // ================= 7. SCREEN 5: 3D GIFT BOX UNBOXING =================
  const giftBoxTrigger = document.getElementById('gift-box-trigger');
  const giftBox = document.getElementById('gift-box');
  const emergingPhoto = document.getElementById('emerging-photo');

  let giftOpened = false;

  giftBoxTrigger.addEventListener('click', () => {
    if (giftOpened) return;
    giftOpened = true;

    emergingPhoto.src = PHOTOS[0].url;
    giftBox.classList.add('shaking');

    setTimeout(() => {
      giftBox.classList.remove('shaking');
      giftBox.classList.add('opened');

      const rect = giftBox.getBoundingClientRect();
      triggerHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      triggerConfettiBurst();

      setTimeout(() => {
        switchScreen('screen-5', 'screen-6a');
        initTopDownStage();
      }, 2200);
    }, 800);
  });

  // ================= 8. PHOTO STYLE 1: TOP-DOWN REVEAL =================
  const topdownStage = document.getElementById('topdown-stage');

  function initTopDownStage() {
    topdownStage.innerHTML = '';
    PHOTOS.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'falling-card';

      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.caption;
      card.appendChild(img);

      topdownStage.appendChild(card);

      setTimeout(() => {
        card.classList.add('appeared');
        const rect = card.getBoundingClientRect();
        triggerHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }, (idx + 1) * 700);
    });
  }

  document.getElementById('to-style2-btn').addEventListener('click', () => {
    switchScreen('screen-6a', 'screen-6b');
    initPerspectiveStage();
  });

  // ================= 9. PHOTO STYLE 2: 3 LARGE PHOTOS (3D PERSPECTIVE) =================
  const pImgLeft = document.getElementById('p-img-left');
  const pImgCenter = document.getElementById('p-img-center');
  const pImgRight = document.getElementById('p-img-right');
  const pCaptionCenter = document.getElementById('p-caption-center');
  const perspectiveStage = document.getElementById('perspective-stage');

  function initPerspectiveStage() {
    renderPerspectivePhotos();
  }

  function renderPerspectivePhotos() {
    const total = PHOTOS.length;
    const leftIdx = (currentPIndex - 1 + total) % total;
    const centerIdx = currentPIndex;
    const rightIdx = (currentPIndex + 1) % total;

    pImgLeft.src = PHOTOS[leftIdx].url;
    pImgCenter.src = PHOTOS[centerIdx].url;
    pImgRight.src = PHOTOS[rightIdx].url;
    pCaptionCenter.textContent = PHOTOS[centerIdx].caption;
  }

  function nextPerspective() {
    currentPIndex = (currentPIndex + 1) % PHOTOS.length;
    renderPerspectivePhotos();
  }

  function prevPerspective() {
    currentPIndex = (currentPIndex - 1 + PHOTOS.length) % PHOTOS.length;
    renderPerspectivePhotos();
  }

  document.getElementById('p-next-btn').addEventListener('click', nextPerspective);
  document.getElementById('p-prev-btn').addEventListener('click', prevPerspective);
  addSwipeListener(perspectiveStage, nextPerspective, prevPerspective);

  document.getElementById('to-style3-btn').addEventListener('click', () => {
    switchScreen('screen-6b', 'screen-6c');
    initSliderStage();
  });

  // ================= 10. PHOTO STYLE 3: SIDE CARD SLIDER =================
  const sliderImg = document.getElementById('slider-img');
  const sliderCaption = document.getElementById('slider-caption');
  const sliderCard = document.getElementById('slider-card');
  const sliderLightFlash = document.getElementById('slider-light-flash');
  const sliderArrowTrail = document.getElementById('slider-arrow-trail');
  const sliderStage = document.getElementById('slider-stage');

  function initSliderStage() {
    renderSliderPhoto();
  }

  function renderSliderPhoto(direction = 'next') {
    sliderLightFlash.style.opacity = '0.8';
    setTimeout(() => { sliderLightFlash.style.opacity = '0'; }, 300);

    sliderArrowTrail.style.left = direction === 'next' ? '10%' : '80%';
    sliderArrowTrail.style.top = '40%';
    sliderArrowTrail.style.opacity = '1';
    sliderArrowTrail.style.transition = 'all 0.5s ease';

    setTimeout(() => {
      sliderArrowTrail.style.left = direction === 'next' ? '80%' : '10%';
      sliderArrowTrail.style.opacity = '0';
    }, 50);

    sliderCard.style.transform = direction === 'next' ? 'translateX(60px) rotateY(-15deg)' : 'translateX(-60px) rotateY(15deg)';
    sliderCard.style.opacity = '0.4';

    setTimeout(() => {
      sliderImg.src = PHOTOS[currentSliderIndex].url;
      sliderCaption.textContent = PHOTOS[currentSliderIndex].caption;
      sliderCard.style.transform = 'translateX(0) rotateY(0deg)';
      sliderCard.style.opacity = '1';
    }, 250);
  }

  function nextSlider() {
    currentSliderIndex = (currentSliderIndex + 1) % PHOTOS.length;
    renderSliderPhoto('next');
  }

  function prevSlider() {
    currentSliderIndex = (currentSliderIndex - 1 + PHOTOS.length) % PHOTOS.length;
    renderSliderPhoto('prev');
  }

  document.getElementById('slider-next-btn').addEventListener('click', nextSlider);
  document.getElementById('slider-prev-btn').addEventListener('click', prevSlider);
  addSwipeListener(sliderStage, nextSlider, prevSlider);

  document.getElementById('to-style4-btn').addEventListener('click', () => {
    switchScreen('screen-6c', 'screen-6d');
    initOrbitStage();
  });

  // ================= 11. PHOTO STYLE 4: 3D ORBIT CAROUSEL =================
  const orbitTrack = document.getElementById('orbit-track');
  const orbitCenterImg = document.getElementById('orbit-center-img');
  const orbitCenterCaption = document.getElementById('orbit-center-caption');

  function initOrbitStage() {
    renderOrbitItems();
    renderOrbitCenter();
  }

  function renderOrbitCenter() {
    orbitCenterImg.src = PHOTOS[currentOrbitIndex].url;
    orbitCenterCaption.textContent = PHOTOS[currentOrbitIndex].caption;
  }

  function renderOrbitItems() {
    orbitTrack.innerHTML = '';
    const radius = 120;
    const total = PHOTOS.length;

    PHOTOS.forEach((photo, idx) => {
      const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const item = document.createElement('div');
      item.className = `orbit-item ${idx === currentOrbitIndex ? 'active' : ''}`;
      item.style.transform = `translate(${x}px, ${y}px)`;

      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.caption;

      item.appendChild(img);

      item.addEventListener('click', () => {
        currentOrbitIndex = idx;
        renderOrbitCenter();
        updateOrbitItemsActive();
      });

      orbitTrack.appendChild(item);
    });
  }

  function updateOrbitItemsActive() {
    const items = orbitTrack.querySelectorAll('.orbit-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentOrbitIndex);
    });
  }

  function nextOrbit() {
    currentOrbitIndex = (currentOrbitIndex + 1) % PHOTOS.length;
    renderOrbitCenter();
    updateOrbitItemsActive();
  }

  function prevOrbit() {
    currentOrbitIndex = (currentOrbitIndex - 1 + PHOTOS.length) % PHOTOS.length;
    renderOrbitCenter();
    updateOrbitItemsActive();
  }

  document.getElementById('orbit-next-btn').addEventListener('click', nextOrbit);
  document.getElementById('orbit-prev-btn').addEventListener('click', prevOrbit);

  document.getElementById('to-style5-btn').addEventListener('click', () => {
    switchScreen('screen-6d', 'screen-6e');
    initPhotoWallGrid();
  });

  // ================= 12. PHOTO STYLE 5: STAGGERED PHOTO WALL =================
  const photoWallGrid = document.getElementById('photo-wall-grid');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  function initPhotoWallGrid() {
    photoWallGrid.innerHTML = '';
    PHOTOS.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'wall-card';

      card.innerHTML = `
        <img src="${photo.url}" alt="${photo.caption}" />
        <div class="wall-card-body">
          <p class="wall-card-title">${photo.caption}</p>
        </div>
      `;

      card.addEventListener('click', () => {
        lightboxImg.src = photo.url;
        lightboxCaption.textContent = photo.caption;
        lightboxModal.classList.add('active');
      });

      photoWallGrid.appendChild(card);

      setTimeout(() => {
        card.classList.add('settled');
      }, (idx + 1) * 200);
    });
  }

  document.getElementById('lightbox-close').addEventListener('click', () => {
    lightboxModal.classList.remove('active');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) {
      lightboxModal.classList.remove('active');
    }
  });

  document.getElementById('to-note-btn').addEventListener('click', () => {
    switchScreen('screen-6e', 'screen-7');
    startNoteTyping();
  });

  // ================= 13. SCREEN 7: PERSONAL NOTE =================
  const noteTypingTextEl = document.getElementById('note-typing-text');
  const toSurpriseBtn = document.getElementById('to-surprise-btn');

  const noteFullText = "Some people become special not because of how long we have known them, but because of the happiness, comfort and beautiful memories they bring into our lives.\n\nOn your birthday, I simply wish that your days ahead are filled with peaceful moments, genuine smiles, good people and countless reasons to be happy.\n\nKeep shining in your own way, keep smiling, and may this year bring you many beautiful memories that stay close to your heart. Happy Birthday! ✨";

  function startNoteTyping() {
    noteTypingTextEl.innerHTML = '';
    const noteChars = Array.from(noteFullText);
    let index = 0;

    function typeNextChar() {
      if (index < noteChars.length) {
        const char = noteChars[index];
        if (char === '\n') {
          noteTypingTextEl.appendChild(document.createElement('br'));
        } else {
          const span = document.createElement('span');
          span.textContent = char;
          noteTypingTextEl.appendChild(span);
        }
        index++;
        setTimeout(typeNextChar, 30);
      } else {
        toSurpriseBtn.style.display = 'inline-flex';
        toSurpriseBtn.classList.add('pulse-btn');
      }
    }
    setTimeout(typeNextChar, 300);
  }

  toSurpriseBtn.addEventListener('click', () => {
    switchScreen('screen-7', 'screen-7b');
  });

  // ================= 14. SCREEN 7B: TINY SURPRISES =================
  const tinyCards = document.querySelectorAll('.tiny-card');
  tinyCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('revealed');
      const wish = card.getAttribute('data-wish');
      const msgEl = card.querySelector('.tiny-hidden-msg');
      if (card.classList.contains('revealed')) {
        msgEl.textContent = wish;
        const rect = card.getBoundingClientRect();
        triggerHeartExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else {
        msgEl.textContent = 'Tap to reveal ✨';
      }
    });
  });

  document.getElementById('to-final-btn').addEventListener('click', () => {
    switchScreen('screen-7b', 'screen-8');
    startFireworks();
  });

  // ================= 15. SCREEN 8: GRAND CELEBRATION FIREWORKS =================
  const fireworksCanvas = document.getElementById('fireworks-canvas');
  const fwCtx = fireworksCanvas.getContext('2d');
  let fireworks = [];
  let fwRunning = false;

  function resizeFwCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeFwCanvas);
  resizeFwCanvas();

  class Firework {
    constructor() {
      this.x = Math.random() * fireworksCanvas.width;
      this.y = fireworksCanvas.height;
      this.targetY = Math.random() * (fireworksCanvas.height * 0.5);
      this.speed = Math.random() * 4 + 7;
      this.particles = [];
      this.exploded = false;
      this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
    }

    update() {
      if (!this.exploded) {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.exploded = true;
          for (let i = 0; i < 45; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 5 + 1;
            this.particles.push({
              x: this.x,
              y: this.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: 1,
              decay: Math.random() * 0.02 + 0.015,
              color: this.color
            });
          }
        }
      } else {
        for (let i = this.particles.length - 1; i >= 0; i--) {
          const p = this.particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05;
          p.alpha -= p.decay;
          if (p.alpha <= 0) {
            this.particles.splice(i, 1);
          }
        }
      }
    }

    draw() {
      if (!this.exploded) {
        fwCtx.save();
        fwCtx.fillStyle = this.color;
        fwCtx.beginPath();
        fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        fwCtx.fill();
        fwCtx.restore();
      } else {
        this.particles.forEach(p => {
          fwCtx.save();
          fwCtx.globalAlpha = p.alpha;
          fwCtx.fillStyle = p.color;
          fwCtx.shadowColor = p.color;
          fwCtx.shadowBlur = 8;
          fwCtx.beginPath();
          fwCtx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
          fwCtx.fill();
          fwCtx.restore();
        });
      }
    }
  }

  function triggerConfettiBurst() {
    for (let i = 0; i < 5; i++) {
      fireworks.push(new Firework());
    }
  }

  function startFireworks() {
    fwRunning = true;
    function animateFw() {
      if (!fwRunning) return;
      fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

      if (Math.random() < 0.08) {
        fireworks.push(new Firework());
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded && fireworks[i].particles.length === 0) {
          fireworks.splice(i, 1);
        }
      }
      requestAnimationFrame(animateFw);
    }
    animateFw();
  }

  // Replay Journey
  document.getElementById('replay-btn').addEventListener('click', () => {
    fwRunning = false;
    fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    glowingHeart.style.transform = 'scale(1)';
    giftOpened = false;
    giftBox.classList.remove('opened');
    currentPIndex = 0;
    currentSliderIndex = 0;
    currentOrbitIndex = 0;
    switchScreen('screen-8', 'screen-1');
  });

  // ================= 16. CONTINUOUS AUDIO ENGINE & MULTI-PATH AUTO-DETECTION =================
  const audioPlayer = document.getElementById('audio-player');
  const musicToggleBtn = document.getElementById('music-toggle');
  const musicTextEl = musicToggleBtn.querySelector('.music-text');

  let audioCtx = null;
  let isPlaying = false;
  let synthTimer = null;
  let customAudioAvailable = true;

  if (audioPlayer) {
    audioPlayer.volume = 0.85;
    audioPlayer.loop = true;

    audioPlayer.addEventListener('error', () => {
      customAudioAvailable = false;
    });
  }

  function initAudioSynth() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  function playSynthNote(freq, duration, type = 'sine', delay = 0) {
    if (!audioCtx) return;
    setTimeout(() => {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {
        console.error('Audio Synth Error:', e);
      }
    }, delay);
  }

  const yaenEndralNotes = [
    { freq: 293.66, dur: 0.6 }, { freq: 329.63, dur: 0.6 }, { freq: 369.99, dur: 1.0 },
    { freq: 440.00, dur: 0.8 }, { freq: 493.88, dur: 1.2 }, { freq: 440.00, dur: 0.8 },
    { freq: 369.99, dur: 0.6 }, { freq: 329.63, dur: 0.6 }, { freq: 293.66, dur: 1.2 },
    { freq: 220.00, dur: 0.8 }, { freq: 246.94, dur: 1.0 }, { freq: 293.66, dur: 1.4 }
  ];

  function startSynthMelodyLoop() {
    let noteIdx = 0;

    function playNextNote() {
      if (!isPlaying || customAudioAvailable) return;

      const note = yaenEndralNotes[noteIdx];
      playSynthNote(note.freq, note.dur, 'triangle');

      if (noteIdx % 3 === 0) {
        playSynthNote(note.freq / 2, 2.0, 'sine');
      }

      noteIdx = (noteIdx + 1) % yaenEndralNotes.length;
      synthTimer = setTimeout(playNextNote, note.dur * 650);
    }

    playNextNote();
  }

  function startAudio() {
    if (isPlaying) return;
    isPlaying = true;
    musicToggleBtn.classList.add('playing');
    musicTextEl.textContent = 'Pause';
    if (ambientGlowEl) ambientGlowEl.classList.add('music-sync');

    if (audioPlayer && customAudioAvailable) {
      const playPromise = audioPlayer.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio element play error, using synth fallback:', err);
          customAudioAvailable = false;
          initAudioSynth();
          if (audioCtx.state === 'suspended') audioCtx.resume();
          startSynthMelodyLoop();
        });
      }
    } else {
      initAudioSynth();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      startSynthMelodyLoop();
    }
  }

  function stopAudio() {
    isPlaying = false;
    musicToggleBtn.classList.remove('playing');
    musicTextEl.textContent = 'Music';
    if (ambientGlowEl) ambientGlowEl.classList.remove('music-sync');

    if (audioPlayer) {
      audioPlayer.pause();
    }
    if (synthTimer) {
      clearTimeout(synthTimer);
    }
  }

  musicToggleBtn.addEventListener('click', () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  });

});
