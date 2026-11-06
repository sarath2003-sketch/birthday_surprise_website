/* ==========================================================================
   HAPPY BIRTHDAY SHAFI - 3D INTERACTIVE CELEBRATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ================= 1. DYNAMIC BIRTHDAY PHOTOS =================
  const PHOTOS = [
    { 
      url: 'assets/photos/photo1.jpg', 
      title: 'Delicious Birthday Cake & Glowing Wishes 🎂 — Shafi',
      badge: '🎂 Birthday Cake'
    },
    { 
      url: 'assets/photos/photo2.jpg', 
      title: 'Celebration Balloons & Radiant Smiles 🎈 — Shafi',
      badge: '🎈 Celebration'
    },
    { 
      url: 'assets/photos/photo3.jpg', 
      title: 'A Special Birthday Gift for My Favorite Person 🎁 — Shafi',
      badge: '🎁 Special Gift'
    },
    { 
      url: 'assets/photos/photo4.jpg', 
      title: 'Sweet Birthday Cupcake & Warm Memories 🧁 — Shafi',
      badge: '🧁 Sweet Treat'
    },
    { 
      url: 'assets/photos/photo5.jpg', 
      title: 'Sparkles, Confetti & Unforgettable Joy 🎉 — Shafi',
      badge: '🎉 Joyful Cheer'
    },
    { 
      url: 'assets/photos/photo6.jpg', 
      title: 'Fresh Birthday Flowers & Endless Prayers 🌸 — Shafi',
      badge: '🌸 Pure Blessings'
    }
  ];

  let currentGalleryIndex = 0;

  // ================= 2. BACKGROUND CANVASES & CELESTIAL PARTICLES =================
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
    constructor(x, y, isBurst = false) {
      this.x = x || Math.random() * width;
      this.y = y || Math.random() * height;
      this.isBurst = isBurst;
      this.size = isBurst ? Math.random() * 8 + 5 : Math.random() * 2.5 + 1;
      this.speedX = (Math.random() - 0.5) * (isBurst ? 5 : 0.6);
      this.speedY = isBurst ? (Math.random() - 0.5) * 5 : -Math.random() * 0.7 - 0.2;
      this.alpha = isBurst ? 1 : Math.random() * 0.7 + 0.3;
      this.decay = isBurst ? Math.random() * 0.018 + 0.012 : 0;
      this.color = isBurst 
        ? ['#ffd166', '#ffb703', '#ffffff', '#00f2fe', '#a7f3d0', '#ff758c'][Math.floor(Math.random() * 6)]
        : ['#ffffff', '#ffd166', '#a7f3d0'][Math.floor(Math.random() * 3)];
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.isBurst) {
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
      bgCtx.shadowBlur = this.isBurst ? 10 : 3;

      if (this.isBurst) {
        // Draw 5-pointed sparkling Islamic star
        bgCtx.translate(this.x, this.y);
        bgCtx.beginPath();
        const spikes = 5;
        const outerRadius = this.size;
        const innerRadius = this.size * 0.45;
        let rot = Math.PI / 2 * 3;
        let x = 0;
        let y = 0;
        const step = Math.PI / spikes;

        bgCtx.moveTo(0, -outerRadius);
        for (let i = 0; i < spikes; i++) {
          x = Math.cos(rot) * outerRadius;
          y = Math.sin(rot) * outerRadius;
          bgCtx.lineTo(x, y);
          rot += step;

          x = Math.cos(rot) * innerRadius;
          y = Math.sin(rot) * innerRadius;
          bgCtx.lineTo(x, y);
          rot += step;
        }
        bgCtx.lineTo(0, -outerRadius);
        bgCtx.closePath();
        bgCtx.fill();
      } else {
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bgCtx.fill();
      }

      bgCtx.restore();
    }
  }

  for (let i = 0; i < 65; i++) {
    particles.push(new Particle());
  }

  function triggerSparkleExplosion(originX, originY) {
    for (let i = 0; i < 45; i++) {
      particles.push(new Particle(originX, originY, true));
    }
  }

  function animateBg() {
    bgCtx.clearRect(0, 0, width, height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].isBurst && particles[i].alpha <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(animateBg);
  }
  animateBg();

  // Floating Flower Petals Generator
  const petalsContainer = document.getElementById('petals-container');
  if (petalsContainer) {
    for (let i = 0; i < 14; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      petal.style.left = `${Math.random() * 100}vw`;
      petal.style.animationDuration = `${Math.random() * 5 + 6}s`;
      petal.style.animationDelay = `${Math.random() * 6}s`;
      petalsContainer.appendChild(petal);
    }
  }

  // ================= 3. INSTANT & ROBUST SCREEN NAVIGATION =================
  function switchScreen(fromId, toId) {
    const fromScreen = document.getElementById(fromId);
    const toScreen = document.getElementById(toId);
    if (!toScreen) return;

    // Reset inline overrides on all screens
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.style.opacity = '';
      s.style.transform = '';
    });

    if (fromScreen) {
      fromScreen.classList.remove('active');
    }

    toScreen.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ================= 4. SCREEN 1: START BUTTON & SHOOTING STAR =================
  const startBtn = document.getElementById('start-btn');
  const flyingArrow = document.getElementById('flying-arrow');
  const glowingHeart = document.getElementById('glowing-heart');

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startAudio();

      const crescentRect = glowingHeart.getBoundingClientRect();
      const btnRect = startBtn.getBoundingClientRect();

      flyingArrow.style.left = `${btnRect.left + btnRect.width / 2 - 15}px`;
      flyingArrow.style.top = `${btnRect.top}px`;
      flyingArrow.style.opacity = '1';
      flyingArrow.style.transition = 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)';

      setTimeout(() => {
        flyingArrow.style.top = `${crescentRect.top + crescentRect.height / 2 - 15}px`;
        flyingArrow.style.left = `${crescentRect.left + crescentRect.width / 2 - 15}px`;
        flyingArrow.style.transform = 'scale(1.4)';
      }, 30);

      setTimeout(() => {
        flyingArrow.style.opacity = '0';
        triggerSparkleExplosion(
          crescentRect.left + crescentRect.width / 2, 
          crescentRect.top + crescentRect.height / 2
        );

        setTimeout(() => {
          switchScreen('screen-1', 'screen-2');
          startTypingAnimation();
        }, 300);
      }, 550);
    });
  }

  // ================= 5. SCREEN 2: TYPING ANIMATION =================
  const typingTextEl = document.getElementById('typing-text');
  const toWishBtn = document.getElementById('to-wish-btn');
  const surpriseCard = document.getElementById('surprise-box-card');
  const fullText = "🌸 Happy Birthday, dear Shafi! 🌸\n\nToday is a truly blessed and special day.\nI pray that your life is filled with beautiful smiles,\nlasting peace, and boundless happiness.";

  let typingDone = false;
  function finishScreen2Typing() {
    if (typingDone) return;
    typingDone = true;
    typingTextEl.innerHTML = fullText.replace(/\n/g, '<br>');
    if (toWishBtn) toWishBtn.classList.add('pulse-btn');
  }

  if (surpriseCard) {
    surpriseCard.addEventListener('click', finishScreen2Typing);
  }

  function startTypingAnimation() {
    typingDone = false;
    typingTextEl.innerHTML = '';
    const textChars = Array.from(fullText);
    let index = 0;

    function typeNextChar() {
      if (typingDone) return;
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
        setTimeout(typeNextChar, 16);
      } else {
        finishScreen2Typing();
      }
    }
    setTimeout(typeNextChar, 100);
  }

  if (toWishBtn) {
    toWishBtn.addEventListener('click', () => {
      switchScreen('screen-2', 'screen-3');
    });
  }

  // ================= 6. SCREEN 3: WISH CARD =================
  const toFavsBtn = document.getElementById('to-favs-btn');
  if (toFavsBtn) {
    toFavsBtn.addEventListener('click', () => {
      switchScreen('screen-3', 'screen-4');
    });
  }

  // ================= 7. SCREEN 4: FAVOURITES =================
  const favCards = document.querySelectorAll('.fav-card');
  favCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      const rect = card.getBoundingClientRect();
      triggerSparkleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  const toGiftBtn = document.getElementById('to-gift-btn');
  if (toGiftBtn) {
    toGiftBtn.addEventListener('click', () => {
      switchScreen('screen-4', 'screen-5');
    });
  }

  // ================= 8. SCREEN 5: 3D GIFT BOX UNBOXING =================
  const giftBoxTrigger = document.getElementById('gift-box-trigger');
  const giftBox = document.getElementById('gift-box');
  let giftOpened = false;

  if (giftBoxTrigger) {
    giftBoxTrigger.addEventListener('click', () => {
      if (giftOpened) {
        switchScreen('screen-5', 'screen-6');
        return;
      }
      giftOpened = true;

      giftBox.classList.add('shaking');

      setTimeout(() => {
        giftBox.classList.remove('shaking');
        giftBox.classList.add('opened');

        const rect = giftBox.getBoundingClientRect();
        triggerSparkleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
        triggerConfettiBurst();

        setTimeout(() => {
          switchScreen('screen-5', 'screen-6');
          updateFeaturedGallery(0);
        }, 1600);
      }, 700);
    });
  }

  const directToGalleryBtn = document.getElementById('direct-to-gallery-btn');
  if (directToGalleryBtn) {
    directToGalleryBtn.addEventListener('click', () => {
      switchScreen('screen-5', 'screen-6');
      updateFeaturedGallery(0);
    });
  }

  // ================= 9. SCREEN 6: CLEAN BIRTHDAY GALLERY =================
  const featuredImg = document.getElementById('gallery-featured-img');
  const featuredBadge = document.getElementById('gallery-badge');
  const featuredCaption = document.getElementById('gallery-caption');
  const galleryPrevBtn = document.getElementById('gallery-prev-btn');
  const galleryNextBtn = document.getElementById('gallery-next-btn');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const thumbs = document.querySelectorAll('.bphoto-thumb');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');

  function updateFeaturedGallery(index) {
    currentGalleryIndex = (index + PHOTOS.length) % PHOTOS.length;
    const photo = PHOTOS[currentGalleryIndex];

    if (featuredImg) {
      featuredImg.style.opacity = '0';
      setTimeout(() => {
        featuredImg.src = photo.url;
        featuredBadge.textContent = photo.badge;
        featuredCaption.textContent = photo.title;
        featuredImg.style.opacity = '1';
      }, 150);
    }

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentGalleryIndex);
    });

    thumbs.forEach((th, idx) => {
      th.classList.toggle('active', idx === currentGalleryIndex);
    });
  }

  if (galleryPrevBtn) {
    galleryPrevBtn.addEventListener('click', () => {
      updateFeaturedGallery(currentGalleryIndex - 1);
    });
  }

  if (galleryNextBtn) {
    galleryNextBtn.addEventListener('click', () => {
      updateFeaturedGallery(currentGalleryIndex + 1);
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateFeaturedGallery(idx);
    });
  });

  thumbs.forEach((th, idx) => {
    th.addEventListener('click', () => {
      updateFeaturedGallery(idx);
      const rect = th.getBoundingClientRect();
      triggerSparkleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
  });

  // Lightbox view for featured image on tap
  const featuredImgWrap = document.getElementById('featured-img-wrap');
  if (featuredImgWrap) {
    featuredImgWrap.addEventListener('click', () => {
      const photo = PHOTOS[currentGalleryIndex];
      lightboxImg.src = photo.url;
      lightboxCaption.textContent = photo.title;
      lightboxModal.classList.add('active');
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

  const toNoteBtn = document.getElementById('to-note-btn');
  if (toNoteBtn) {
    toNoteBtn.addEventListener('click', () => {
      switchScreen('screen-6', 'screen-7');
      startNoteTyping();
    });
  }

  // ================= 10. SCREEN 7: PERSONAL LETTER FOR SHAFI =================
  const noteTypingTextEl = document.getElementById('note-typing-text');
  const toSurpriseBtn = document.getElementById('to-surprise-btn');
  const noteCard = document.getElementById('note-box-card');

  const noteFullText = "Dear Shafi,\n\nSome people enter our lives and become our absolute favorite part of every day. You are truly my most favorite person in this entire world.\n\nOn your birthday, I pray that Allah (SWT) showers His infinite blessings upon you — granting you good health, tranquility in your heart (Sakina), and success in everything you pursue.\n\nMay your days always be lit with guidance and happiness. Keep that radiant, beautiful smile glowing always.\n\nHappy Birthday once again to my favorite person, Shafi! 🌸🌙✨";

  let noteDone = false;
  function finishNoteTyping() {
    if (noteDone) return;
    noteDone = true;
    noteTypingTextEl.innerHTML = noteFullText.replace(/\n/g, '<br>');
    if (toSurpriseBtn) toSurpriseBtn.classList.add('pulse-btn');
  }

  if (noteCard) {
    noteCard.addEventListener('click', finishNoteTyping);
  }

  function startNoteTyping() {
    noteDone = false;
    noteTypingTextEl.innerHTML = '';
    const noteChars = Array.from(noteFullText);
    let index = 0;

    function typeNextChar() {
      if (noteDone) return;
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
        setTimeout(typeNextChar, 14);
      } else {
        finishNoteTyping();
      }
    }
    setTimeout(typeNextChar, 100);
  }

  if (toSurpriseBtn) {
    toSurpriseBtn.addEventListener('click', () => {
      switchScreen('screen-7', 'screen-7b');
    });
  }

  // ================= 11. SCREEN 7B: TINY SURPRISES =================
  const tinyCards = document.querySelectorAll('.tiny-card');
  tinyCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('revealed');
      const wish = card.getAttribute('data-wish');
      const msgEl = card.querySelector('.tiny-hidden-msg');
      if (card.classList.contains('revealed')) {
        msgEl.textContent = wish;
        const rect = card.getBoundingClientRect();
        triggerSparkleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      } else {
        msgEl.textContent = 'Tap to reveal ✨';
      }
    });
  });

  const toFinalBtn = document.getElementById('to-final-btn');
  if (toFinalBtn) {
    toFinalBtn.addEventListener('click', () => {
      switchScreen('screen-7b', 'screen-8');
      startFireworks();
    });
  }

  // ================= 12. SCREEN 8: CAKE & CANDLE BLOW INTERACTION =================
  const finaleCakeBtn = document.getElementById('finale-cake-btn');
  if (finaleCakeBtn) {
    finaleCakeBtn.addEventListener('click', () => {
      const rect = finaleCakeBtn.getBoundingClientRect();
      triggerSparkleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      triggerConfettiBurst();
      finaleCakeBtn.style.transform = 'scale(1.25) rotate(10deg)';
      setTimeout(() => {
        finaleCakeBtn.style.transform = '';
      }, 400);
    });
  }

  const candleBox = document.getElementById('candle-box');
  const candleIcon = document.getElementById('candle-icon');
  const wishMadeMsg = document.getElementById('wish-made-msg');
  let candleBlown = false;

  if (candleBox) {
    candleBox.addEventListener('click', () => {
      if (candleBlown) return;
      candleBlown = true;
      candleIcon.classList.remove('lit');
      candleIcon.classList.add('blown');
      candleIcon.textContent = '💨 🕯️';
      wishMadeMsg.style.display = 'block';

      const rect = candleBox.getBoundingClientRect();
      triggerSparkleExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      triggerConfettiBurst();
    });
  }

  // ================= 13. SCREEN 8: GRAND CELEBRATION FIREWORKS =================
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
  const replayBtn = document.getElementById('replay-btn');
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      fwRunning = false;
      fwCtx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
      glowingHeart.style.transform = 'scale(1)';
      giftOpened = false;
      giftBox.classList.remove('opened');
      candleBlown = false;
      if (candleIcon) {
        candleIcon.classList.remove('blown');
        candleIcon.classList.add('lit');
        candleIcon.textContent = '🕯️';
      }
      if (wishMadeMsg) wishMadeMsg.style.display = 'none';
      switchScreen('screen-8', 'screen-1');
    });
  }

  // ================= 14. CONTINUOUS AUDIO ENGINE & FALLBACK =================
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
