/* ============================================================
   SHERYL PHARMACEUTICALS - Main JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 0. SCROLL PROGRESS BAR */
  const progressBar = document.createElement("div");
  progressBar.id = "scroll-progress";
  document.body.appendChild(progressBar);
  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    progressBar.style.width = Math.min(pct, 100) + "%";
  }, { passive: true });

  /* 1. NAVBAR */
  const navbar    = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileClose = document.getElementById("mobile-nav-close");

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 60);
      document.getElementById("back-to-top")?.classList.toggle("show", window.scrollY > 400);
    }, { passive: true });
  }

  function openMobile() {
    hamburger?.classList.add("open");
    mobileNav?.classList.add("open");
    document.body.style.overflow = "hidden";
    hamburger?.setAttribute("aria-expanded", "true");
  }
  function closeMobile() {
    hamburger?.classList.remove("open");
    mobileNav?.classList.remove("open");
    document.body.style.overflow = "";
    hamburger?.setAttribute("aria-expanded", "false");
  }

  hamburger?.addEventListener("click", () =>
    mobileNav?.classList.contains("open") ? closeMobile() : openMobile()
  );
  mobileClose?.addEventListener("click", closeMobile);
  document.querySelectorAll(".mobile-nav .nav-link").forEach(l => l.addEventListener("click", closeMobile));
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeMobile(); });

  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: "smooth", block: "start" }); }
    });
  });

  /* 2. ACTIVE NAV LINK */
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* 3. BACK TO TOP */
  const btt = document.getElementById("back-to-top");
  if (btt) btt.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* 4. SCROLL REVEAL */
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if (!prefersReducedMotion && revealEls.length > 0) {
    document.documentElement.classList.add("js-ready");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  /* 5. HERO PARALLAX + BG LOAD */
  const heroBg = document.querySelector(".home-hero-bg");
  if (heroBg) {
    setTimeout(() => heroBg.classList.add("loaded"), 100);
    if (!prefersReducedMotion) {
      window.addEventListener("scroll", () => {
        if (window.scrollY < window.innerHeight) {
          heroBg.style.transform = "translateY(" + (window.scrollY * 0.25) + "px)";
        }
      }, { passive: true });
    }
  }

  /* 6. ANIMATED COUNTERS */
  function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }
  function animateCounter(el) {
    if (prefersReducedMotion) {
      el.textContent = parseInt(el.getAttribute("data-count"), 10).toLocaleString();
      return;
    }
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1800;
    const startTime = performance.now();
    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(easeOutQuart(progress) * target).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { animateCounter(entry.target); counterObs.unobserve(entry.target); }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll("[data-count]").forEach(el => counterObs.observe(el));

  /* 7. PORTFOLIO FILTER */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.getAttribute("data-filter");
      portfolioItems.forEach(item => {
        const show = filter === "all" || item.getAttribute("data-category") === filter;
        if (show) {
          item.style.display = "";
          requestAnimationFrame(() => { item.style.opacity = "1"; item.style.transform = "translateY(0)"; });
        } else {
          item.style.opacity = "0";
          item.style.transform = "translateY(12px)";
          setTimeout(() => { item.style.display = "none"; }, 220);
        }
      });
    });
  });

  /* 8. FILE UPLOAD */
  const fileInput  = document.getElementById("resume-upload");
  const fileArea   = document.getElementById("file-upload-area");
  const fileNameEl = document.getElementById("file-selected-name");
  const MAX_FILE_BYTES = 5 * 1024 * 1024;

  if (fileInput && fileArea) {
    fileInput.addEventListener("change", () => handleFileSelect(fileInput.files[0]));
    fileArea.addEventListener("dragover", e => { e.preventDefault(); fileArea.classList.add("drag-over"); });
    fileArea.addEventListener("dragleave", () => fileArea.classList.remove("drag-over"));
    fileArea.addEventListener("drop", e => {
      e.preventDefault();
      fileArea.classList.remove("drag-over");
      if (e.dataTransfer.files.length > 0) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect(e.dataTransfer.files[0]);
      }
    });
    fileArea.addEventListener("click", e => { if (e.target !== fileInput) fileInput.click(); });
    fileArea.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fileInput.click(); }
    });
  }

  function handleFileSelect(file) {
    if (!file) return;
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    if (file.size > MAX_FILE_BYTES) {
      showMessage(document.getElementById("careers-msg"), "File too large (" + sizeMB + " MB). Max 5 MB.", "error");
      if (fileInput) fileInput.value = "";
      fileNameEl?.classList.remove("show");
      return;
    }
    if (fileNameEl) {
      fileNameEl.querySelector(".fn-name").textContent = file.name;
      fileNameEl.querySelector(".fn-size").textContent = "(" + sizeMB + " MB)";
      fileNameEl.classList.add("show");
    }
  }

  /* 9. EMAILJS */
  if (typeof emailjs !== "undefined" && window.EMAILJS_CONFIG) {
    emailjs.init(window.EMAILJS_CONFIG.publicKey);
  }

  /* 10. CONTACT FORM */
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = contactForm.querySelector(".submit-btn");
      const msg = document.getElementById("contact-msg");
      setLoading(btn, true, "Sending...");
      clearMessage(msg);
      try {
        await emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.contactTemplateId, {
          from_name: contactForm.from_name.value.trim(),
          from_email: contactForm.from_email.value.trim(),
          phone: contactForm.phone.value.trim(),
          subject: contactForm.subject.value,
          message: contactForm.message.value.trim(),
          form_type: "General Enquiry"
        });
        showMessage(msg, "Thank you! Your message has been sent.", "success");
        contactForm.reset();
      } catch (err) {
        showMessage(msg, "Something went wrong. Please email sherylpharmaceuticals@gmail.com.", "error");
        console.error(err);
      } finally { setLoading(btn, false); }
    });
  }

  /* 11. BUSINESS FORM */
  const bizForm = document.getElementById("business-form");
  if (bizForm) {
    bizForm.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = bizForm.querySelector(".submit-btn");
      const msg = document.getElementById("biz-msg");
      setLoading(btn, true, "Sending...");
      clearMessage(msg);
      try {
        await emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.contactTemplateId, {
          from_name: bizForm.from_name.value.trim(),
          company: bizForm.company.value.trim(),
          country: bizForm.country.value.trim(),
          business_type: bizForm.business_type.value,
          from_email: bizForm.from_email.value.trim(),
          phone: bizForm.phone.value.trim(),
          product_interest: bizForm.product_interest.value.trim(),
          message: bizForm.message.value.trim(),
          form_type: "Business Enquiry"
        });
        showMessage(msg, "Enquiry received! We will contact you within 24-48 hours.", "success");
        bizForm.reset();
      } catch (err) {
        showMessage(msg, "Submission failed. Please contact sherylpharmaceuticals@gmail.com.", "error");
        console.error(err);
      } finally { setLoading(btn, false); }
    });
  }

  /* 12. CAREERS FORM */
  const careersForm = document.getElementById("careers-form");
  if (careersForm) {
    const urlParams = new URLSearchParams(window.location.search);
    const positionParam = urlParams.get("position");
    const positionField = document.getElementById("position");
    if (positionParam && positionField) positionField.value = decodeURIComponent(positionParam);

    careersForm.addEventListener("submit", async e => {
      e.preventDefault();
      const btn = careersForm.querySelector(".submit-btn");
      const msg = document.getElementById("careers-msg");
      const statusSelected = careersForm.querySelector("input[name='employment_status']:checked");
      if (!statusSelected) { showMessage(msg, "Please select your employment status.", "error"); return; }
      const resumeFile = document.getElementById("resume-upload")?.files[0];
      if (resumeFile && resumeFile.size > MAX_FILE_BYTES) {
        showMessage(msg, "Resume exceeds 5 MB.", "error");
        return;
      }
      setLoading(btn, true, "Submitting...");
      clearMessage(msg);
      let base64Resume = null, resumeFileName = "";
      if (resumeFile) {
        try { base64Resume = await fileToBase64(resumeFile); resumeFileName = resumeFile.name; } catch (_) {}
      }
      const params = {
        full_name: careersForm.full_name.value.trim(),
        from_email: careersForm.from_email.value.trim(),
        phone: careersForm.phone.value.trim(),
        position: careersForm.position.value.trim(),
        start_date: careersForm.start_date.value,
        employment_status: statusSelected.value,
        resume_name: resumeFileName || "No resume attached",
        form_type: "Career Application"
      };
      if (base64Resume) { params.attachment = base64Resume; params.attachment_name = resumeFileName; }
      try {
        await emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.careersTemplateId, params);
        showMessage(msg, "Application submitted! We will be in touch within 5-7 business days.", "success");
        careersForm.reset();
        document.getElementById("file-selected-name")?.classList.remove("show");
      } catch (err) {
        showMessage(msg, "Submission failed. Please email sherylpharmaceuticals@gmail.com.", "error");
        console.error(err);
      } finally { setLoading(btn, false); }
    });
  }

  /* HELPERS */
  function setLoading(btn, loading, label) {
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? (label || "Sending...") : (btn.getAttribute("data-label") || "Submit");
  }
  function showMessage(el, text, type) {
    if (!el) return;
    el.textContent = text;
    el.className = "form-message " + type;
  }
  function clearMessage(el) {
    if (!el) return;
    el.textContent = "";
    el.className = "form-message";
  }
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

});