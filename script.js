/* ============================================================
   AESTIS STUDIO — script.js
   Handles: sticky header, mobile menu, budget calculator, form
   ============================================================ */

/* ── Sticky Header ────────────────────────────────────────── */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
})();


/* ── Mobile Menu ──────────────────────────────────────────── */
(function initMobileMenu() {
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const header     = document.getElementById('site-header');
  const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

  if (!burger || !mobileMenu) return;

  function openMenu() {
    burger.classList.add('open');
    mobileMenu.classList.add('open');
    header.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-label', 'Close menu');
  }

  function closeMenu() {
    burger.classList.remove('open');
    mobileMenu.classList.remove('open');
    header.classList.remove('menu-open');
    document.body.style.overflow = '';
    burger.setAttribute('aria-label', 'Open menu');
  }

  burger.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  /* Close when any link is tapped */
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });
})();


/* ── Budget Calculator ────────────────────────────────────── */
(function initCalculator() {
  const calcBtn    = document.getElementById('calc-btn');
  const resultEl   = document.getElementById('calc-result');
  const errorEl    = document.getElementById('calc-error');

  if (!calcBtn) return;

  /*
   * Project-type multipliers:
   *   Modern     → ×1.0  (standard finish, no adjustment)
   *   Luxury     → ×1.6  (premium materials & detailing)
   *   Minimalist → ×0.8  (reduced material complexity)
   */
  var MULTIPLIERS = {
    Modern:     1.0,
    Luxury:     1.6,
    Minimalist: 0.8,
  };

  function formatCurrency(n) {
    return '$' + Math.round(n).toLocaleString('en-US');
  }

  calcBtn.addEventListener('click', function () {
    var areaInput    = document.getElementById('calc-area');
    var budgetInput  = document.getElementById('calc-budget');
    var typeSelect   = document.getElementById('calc-type');

    var area   = parseFloat(areaInput.value);
    var budget = parseFloat(budgetInput.value);
    var type   = typeSelect.value;

    /* --- Validation --- */
    if (!area || !budget || area <= 0 || budget <= 0) {
      errorEl.classList.add('visible');
      resultEl.classList.remove('visible');
      return;
    }
    errorEl.classList.remove('visible');

    /* --- Core calculation --- */
    /* Step 1: base cost = area × rate per sq ft */
    var baseCost = area * budget;

    /* Step 2: apply style multiplier (Luxury adds 60%, Minimalist reduces by 20%) */
    var multiplier   = MULTIPLIERS[type] || 1.0;
    var adjustedCost = baseCost * multiplier;

    /* Step 3: add professional fees
       - 8% design fee  (studio oversight, drawings, sourcing)
       - 5% contingency (unforeseen site conditions) */
    var designFee   = adjustedCost * 0.08;
    var contingency = adjustedCost * 0.05;
    var fees        = designFee + contingency;
    var total       = adjustedCost + fees;

    /* --- Populate result panel --- */
    document.getElementById('result-base').textContent  = formatCurrency(adjustedCost);
    document.getElementById('result-fees').textContent  = formatCurrency(fees);
    document.getElementById('result-total').textContent = formatCurrency(total);

    resultEl.classList.add('visible');

    /* Smooth scroll into view */
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  /* Allow Enter key in inputs to trigger calculation */
  ['calc-area', 'calc-budget'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') calcBtn.click();
      });
    }
  });
})();


/* ── Lead Generation Form ─────────────────────────────────── */
(function initForm() {
  var form       = document.getElementById('lead-form');
  var formWrap   = document.getElementById('form-wrap');
  var successEl  = document.getElementById('form-success');
  var successName = document.getElementById('success-name');

  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    /* HTML5 `required` + type="email" / type="tel" handle
       native validation. Only submit if the form is valid. */
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var nameVal = document.getElementById('field-name').value.trim();

    /* Hide form, show thank-you message */
    formWrap.style.display   = 'none';
    successEl.classList.add('visible');
    if (successName) successName.textContent = nameVal;
  });
})();
