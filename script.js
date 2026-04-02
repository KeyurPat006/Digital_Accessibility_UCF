/* ============================================================
   UCF DIGITAL ACCESSIBILITY — script.js
   ============================================================ */

// ── NAVIGATION ──────────────────────────────────────────────
(function initNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('nav ul');
    if (!toggle || !navList) return;
  
    toggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.textContent = isOpen ? '✕' : '☰';
    });
  
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = '☰';
      }
    });
  
    // Mark active link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  })();
  
  // ── FADE-IN OBSERVER ────────────────────────────────────────
  (function initFadeIn() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
  
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
  })();
  
  // ── CONTACT FORM ─────────────────────────────────────────────
  (function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const formCard = form.parentElement;
      const successEl = document.getElementById('form-success');
  
      // Basic validation
      let valid = true;
      const required = form.querySelectorAll('[required]');
      required.forEach(input => {
        if (!input.value.trim()) {
          valid = false;
          input.style.borderColor = 'var(--error)';
          input.addEventListener('input', () => {
            input.style.borderColor = '';
          }, { once: true });
        }
      });
      if (!valid) return;
  
      // Simulate submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
  
      setTimeout(() => {
        form.style.display = 'none';
        if (successEl) successEl.classList.add('show');
      }, 900);
    });
  })();
  
  // ── ACCESSIBILITY GAME ───────────────────────────────────────
  const GAME_QUESTIONS = [
    {
      question: "Which button implementation is the most accessible?",
      context: "A developer is adding a 'Submit' button to a form. Which approach follows accessibility best practices?",
      options: [
        {
          title: "Option A",
          description: "<div onclick='submit()' style='color:gray'>Submit</div>",
          detail: "A clickable div with gray text and no semantic meaning"
        },
        {
          title: "Option B",
          description: "<button type='submit'>Submit</button>",
          detail: "A native HTML button with proper semantics and keyboard support"
        },
        {
          title: "Option C",
          description: "<a href='#' onclick='submit()'>Submit</a>",
          detail: "A link styled as a button with an onclick handler"
        }
      ],
      correctIndex: 1,
      explanation: "Native <button> elements are the most accessible choice. They are focusable by default, announced correctly by screen readers, and activated by both mouse and keyboard (Enter/Space). Avoid using divs or anchors as buttons unless you add all required ARIA roles and keyboard handlers."
    },
    {
      question: "Which image tag is correctly accessible?",
      context: "A website uses images to convey information. Which img tag follows WCAG 2.1 guidelines?",
      options: [
        {
          title: "Option A",
          description: "<img src='chart.png'>",
          detail: "An image with no alt attribute at all"
        },
        {
          title: "Option B",
          description: "<img src='chart.png' alt='image'>",
          detail: "An image with a generic, non-descriptive alt text"
        },
        {
          title: "Option C",
          description: "<img src='chart.png' alt='Bar chart showing Q4 sales growth of 32%'>",
          detail: "An image with a descriptive alt text conveying the content"
        }
      ],
      correctIndex: 2,
      explanation: "WCAG 1.1.1 requires all non-decorative images to have meaningful alt text. 'image' is not descriptive — it adds no value for screen reader users. A good alt text describes the purpose and content of the image, like what data a chart shows or what action an icon represents."
    },
    {
      question: "Which color combination meets WCAG AA contrast requirements?",
      context: "A designer is picking text and background colors. WCAG AA requires a contrast ratio of at least 4.5:1 for normal text.",
      options: [
        {
          title: "Option A",
          description: "Light gray (#AAAAAA) text on white (#FFFFFF) background",
          detail: "Contrast ratio approximately 2.32:1 — fails WCAG AA"
        },
        {
          title: "Option B",
          description: "Yellow (#FFD700) text on white (#FFFFFF) background",
          detail: "Contrast ratio approximately 1.57:1 — fails WCAG AA"
        },
        {
          title: "Option C",
          description: "Navy (#002C4B) text on white (#FFFFFF) background",
          detail: "Contrast ratio approximately 14.5:1 — passes WCAG AA and AAA"
        }
      ],
      correctIndex: 2,
      explanation: "WCAG Success Criterion 1.4.3 requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (AA). Navy on white achieves ~14.5:1, far exceeding the requirement. Low-contrast text is one of the most common accessibility failures, especially affecting users with low vision."
    },
    {
      question: "Which form input is the most accessible?",
      context: "A developer is building a sign-up form. Which implementation correctly associates a label with its input?",
      options: [
        {
          title: "Option A",
          description: "Email: <input type='text' placeholder='Enter email'>",
          detail: "Plain text next to an input with only placeholder text as a label"
        },
        {
          title: "Option B",
          description: "<label for='email'>Email</label><input id='email' type='email'>",
          detail: "A properly associated label linked to the input via for/id attributes"
        },
        {
          title: "Option C",
          description: "<input type='email' aria-label='email' placeholder='Email'>",
          detail: "An input with aria-label but no visible label on screen"
        }
      ],
      correctIndex: 1,
      explanation: "A visible <label> element linked via matching for and id attributes is the gold standard. It gives screen reader users a clear announcement, expands the click target to include the label text, and remains visible when the input is focused (unlike placeholder text, which disappears). aria-label works but lacks a visible cue."
    },
    {
      question: "Which heading structure is accessible?",
      context: "A developer is structuring a web page. Which heading hierarchy follows accessibility best practices?",
      options: [
        {
          title: "Option A",
          description: "H1 → H3 → H5 (skipping levels for visual styling)",
          detail: "Heading levels are skipped to achieve a desired font size"
        },
        {
          title: "Option B",
          description: "H1 → H2 → H3 (logical, nested hierarchy)",
          detail: "Headings follow a sequential order and represent document outline"
        },
        {
          title: "Option C",
          description: "Multiple H1s on a single page with no sub-headings",
          detail: "Several H1 elements repeat throughout the page without structure"
        }
      ],
      correctIndex: 1,
      explanation: "WCAG 1.3.1 and 2.4.6 require heading levels to reflect the document's actual structure. Screen reader users navigate by headings using keyboard shortcuts — skipping levels (H1 to H3) creates a confusing and incomplete outline. Use heading levels to show hierarchy, not to style text. Resize with CSS instead."
    },
    {
      question: "Which link text is accessible?",
      context: "A news site displays article links. Which anchor text best communicates destination and purpose to all users?",
      options: [
        {
          title: "Option A",
          description: "<a href='article.html'>Click here</a>",
          detail: "Generic text that conveys no information out of context"
        },
        {
          title: "Option B",
          description: "<a href='article.html'>Read more</a>",
          detail: "Slightly more descriptive but still vague when read in a list"
        },
        {
          title: "Option C",
          description: "<a href='article.html'>How WCAG 2.2 Changes Affect Form Design</a>",
          detail: "Descriptive text that communicates the destination clearly"
        }
      ],
      correctIndex: 2,
      explanation: "WCAG 2.4.4 (Link Purpose) requires link text to be understandable in context — ideally on its own. Screen reader users often pull up a list of all links on a page; 'Click here' or 'Read more' repeated multiple times is meaningless. Descriptive link text helps everyone, including users with cognitive disabilities."
    },
    {
      question: "Which video feature is required for accessibility?",
      context: "A developer is embedding a video tutorial on a website. Which feature is mandated by WCAG 1.2?",
      options: [
        {
          title: "Option A",
          description: "Autoplay with sound enabled on page load",
          detail: "Video starts automatically with audio as soon as the page loads"
        },
        {
          title: "Option B",
          description: "Captions (synchronized text of all spoken content)",
          detail: "Accurate, synchronized captions for all spoken dialogue and sounds"
        },
        {
          title: "Option C",
          description: "A high-resolution thumbnail image before play",
          detail: "A visually appealing preview image shown before the video starts"
        }
      ],
      correctIndex: 1,
      explanation: "WCAG 1.2.2 requires captions for all prerecorded video content. Captions benefit deaf and hard-of-hearing users, non-native speakers, and anyone watching in a noisy or quiet environment. Auto-play with sound is actually an accessibility violation (WCAG 1.4.2) as it can interfere with screen readers. Thumbnails, while good UX, are not a WCAG requirement."
    },
    {
      question: "Which keyboard navigation behavior is accessible?",
      context: "A developer built a custom dropdown menu. Which keyboard behavior follows WCAG 2.1.1?",
      options: [
        {
          title: "Option A",
          description: "Menu only opens and operates with a mouse click",
          detail: "The dropdown is completely inaccessible without a pointing device"
        },
        {
          title: "Option B",
          description: "Tab moves focus into the menu, Enter selects, Escape closes",
          detail: "Standard keyboard patterns allow full navigation without a mouse"
        },
        {
          title: "Option C",
          description: "Menu has tabIndex='-1' preventing any keyboard focus",
          detail: "Focus is deliberately removed from all menu items"
        }
      ],
      correctIndex: 1,
      explanation: "WCAG 2.1.1 requires that all functionality be operable via keyboard alone. Users with motor disabilities, power users, and screen reader users all rely on keyboard navigation. Standard patterns: Tab/Shift+Tab to move focus, Enter/Space to activate, Escape to close, and Arrow keys to navigate within components (per ARIA Authoring Practices)."
    }
  ];
  
  let currentQuestion = 0;
  let score = 0;
  let answered = false;
  
  function initGame() {
    const gameEl = document.getElementById('accessibility-game');
    if (!gameEl) return;
  
    renderQuestion();
  }
  
  function renderQuestion() {
    const gameEl = document.getElementById('accessibility-game');
    if (!gameEl) return;
  
    if (currentQuestion >= GAME_QUESTIONS.length) {
      renderResults();
      return;
    }
  
    const q = GAME_QUESTIONS[currentQuestion];
    const progress = ((currentQuestion) / GAME_QUESTIONS.length) * 100;
    const letters = ['A', 'B', 'C'];
  
    answered = false;
  
    gameEl.innerHTML = `
      <div class="game-meta">
        <span>Question ${currentQuestion + 1} of ${GAME_QUESTIONS.length}</span>
        <span class="game-score">Score: ${score}/${currentQuestion}</span>
      </div>
      <div class="game-progress-bar" role="progressbar" aria-valuenow="${currentQuestion}" aria-valuemin="0" aria-valuemax="${GAME_QUESTIONS.length}" aria-label="Game progress">
        <div class="game-progress-fill" style="width: ${progress}%"></div>
      </div>
  
      <div class="game-question-card">
        <div class="game-question-number">Question ${currentQuestion + 1}</div>
        <h3>${q.question}</h3>
        ${q.context ? `<p style="color:rgba(255,255,255,.65);font-size:.88rem;margin-top:.75rem;">${q.context}</p>` : ''}
      </div>
  
      <div class="game-options" role="group" aria-label="Answer choices">
        ${q.options.map((opt, i) => `
          <button class="game-option" data-index="${i}" onclick="selectAnswer(${i})" aria-label="Option ${letters[i]}: ${opt.title}">
            <span class="game-option-letter">${letters[i]}</span>
            <div class="game-option-content">
              <strong>${opt.title}</strong>
              <span style="font-family:'DM Mono',monospace;font-size:.78rem;">${escapeHtml(opt.description)}</span>
              <br><span>${opt.detail}</span>
            </div>
          </button>
        `).join('')}
      </div>
  
      <div class="game-feedback" id="game-feedback" role="alert" aria-live="polite"></div>
  
      <div class="game-controls">
        <button class="btn btn-primary" id="next-btn" onclick="nextQuestion()" style="display:none;">
          ${currentQuestion + 1 < GAME_QUESTIONS.length ? 'Next Question →' : 'See Results 🎓'}
        </button>
      </div>
    `;
  
    // Animate in
    requestAnimationFrame(() => {
      gameEl.querySelectorAll('.game-option').forEach((opt, i) => {
        opt.style.opacity = '0';
        opt.style.transform = 'translateY(12px)';
        setTimeout(() => {
          opt.style.transition = 'opacity .3s ease, transform .3s ease, border-color .25s, background .25s, transform .25s';
          opt.style.opacity = '1';
          opt.style.transform = 'translateY(0)';
        }, i * 80);
      });
    });
  }
  
  function selectAnswer(selectedIndex) {
    if (answered) return;
    answered = true;
  
    const q = GAME_QUESTIONS[currentQuestion];
    const isCorrect = selectedIndex === q.correctIndex;
    if (isCorrect) score++;
  
    // Update option styles
    const options = document.querySelectorAll('.game-option');
    options.forEach((opt, i) => {
      opt.disabled = true;
      opt.classList.add('disabled');
      if (i === q.correctIndex) opt.classList.add('correct');
      if (i === selectedIndex && !isCorrect) opt.classList.add('incorrect');
    });
  
    // Show feedback
    const feedback = document.getElementById('game-feedback');
    if (feedback) {
      feedback.className = `game-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.innerHTML = `
        <div class="game-feedback-icon">${isCorrect ? '✅' : '❌'}</div>
        <div class="game-feedback-text">
          <strong>${isCorrect ? 'Correct!' : 'Not quite.'}</strong>
          <p>${q.explanation}</p>
        </div>
      `;
    }
  
    // Show next button
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) nextBtn.style.display = 'inline-flex';
  }
  
  function nextQuestion() {
    currentQuestion++;
    renderQuestion();
    // Scroll to game top
    const gameEl = document.getElementById('accessibility-game');
    if (gameEl) gameEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  function renderResults() {
    const gameEl = document.getElementById('accessibility-game');
    if (!gameEl) return;
  
    const pct = Math.round((score / GAME_QUESTIONS.length) * 100);
    let grade, message, badges;
  
    if (pct >= 90) {
      grade = 'Accessibility Expert 🏆';
      message = "Outstanding! You have a deep understanding of digital accessibility standards. You're ready to champion inclusive design in your projects.";
      badges = ['<span class="badge badge-gold">WCAG Master</span>', '<span class="badge badge-outline">A11y Champion</span>', '<span class="badge badge-outline">Inclusive Designer</span>'];
    } else if (pct >= 70) {
      grade = 'Accessibility Advocate 🎓';
      message = "Great work! You understand most core accessibility principles. Keep exploring WCAG guidelines and you'll be an expert in no time.";
      badges = ['<span class="badge badge-gold">A11y Advocate</span>', '<span class="badge badge-outline">WCAG Aware</span>'];
    } else if (pct >= 50) {
      grade = 'Accessibility Learner 📚';
      message = "Good start! You're building your foundation. Review the explanations for missed questions and check out the Resources page for deeper learning.";
      badges = ['<span class="badge badge-gold">A11y Learner</span>'];
    } else {
      grade = 'Accessibility Beginner 🌱';
      message = "Everyone starts somewhere! Accessibility is a skill that grows with practice. Explore our Resources page and try the quiz again — you'll improve quickly.";
      badges = ['<span class="badge badge-gold">Getting Started</span>'];
    }
  
    gameEl.innerHTML = `
      <div class="game-results">
        <div class="game-results-score">${score}/${GAME_QUESTIONS.length}</div>
        <div class="game-results-label">Questions Correct • ${pct}% Score</div>
        <h3>${grade}</h3>
        <p>${message}</p>
        <div class="game-results-badges">
          ${badges.join('')}
        </div>
        <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
          <button class="btn btn-primary btn-lg" onclick="restartGame()">Try Again 🔄</button>
          <a href="resources.html" class="btn btn-outline btn-lg">Explore Resources →</a>
        </div>
      </div>
    `;
  }
  
  function restartGame() {
    currentQuestion = 0;
    score = 0;
    answered = false;
    renderQuestion();
    const gameEl = document.getElementById('accessibility-game');
    if (gameEl) gameEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  function escapeHtml(str) {
    return str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  
  // ── COUNTER ANIMATION ────────────────────────────────────────
  function animateCounters() {
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
  
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  
  // Trigger counter animation when stats section enters viewport
  const statsSection = document.querySelector('.stat-strip');
  if (statsSection) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    counterObserver.observe(statsSection);
  }
  
  // ── INIT ─────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    initGame();
  });