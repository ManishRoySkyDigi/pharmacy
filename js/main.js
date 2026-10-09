/**
 * CityMed Pharmacy — Core Interactions (Vanilla JS, Zero Bloat, Fast LCP)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });
    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });
  }

  // 2. Active Nav Link Highlighter
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 3. Prescription Drop Zone & Upload Simulator
  const dropZones = document.querySelectorAll('.rx-drop-zone');
  dropZones.forEach(zone => {
    const fileInput = zone.querySelector('input[type="file"]') || document.createElement('input');
    if (!zone.querySelector('input[type="file"]')) {
      fileInput.type = 'file';
      fileInput.accept = 'image/*,.pdf';
      fileInput.style.display = 'none';
      zone.appendChild(fileInput);
    }

    zone.addEventListener('click', () => fileInput.click());

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.style.borderColor = 'var(--color-accent)';
      zone.style.backgroundColor = '#ccfbf1';
    });

    zone.addEventListener('dragleave', () => {
      zone.style.borderColor = '#99f6e4';
      zone.style.backgroundColor = '#f0fdfa';
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.style.borderColor = '#99f6e4';
      zone.style.backgroundColor = '#f0fdfa';
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelect(e.dataTransfer.files[0], zone);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files && fileInput.files[0]) {
        handleFileSelect(fileInput.files[0], zone);
      }
    });
  });

  function handleFileSelect(file, zone) {
    const titleEl = zone.querySelector('h4');
    const descEl = zone.querySelector('p');
    if (titleEl && descEl) {
      titleEl.innerHTML = `✅ Selected: <strong>${file.name}</strong>`;
      descEl.textContent = `${(file.size / 1024).toFixed(1)} KB • Pharmacist will verify in ~5 mins`;
      zone.style.borderColor = 'var(--color-success)';
      zone.style.backgroundColor = 'var(--color-success-soft)';
    }
  }

  // 4. Instant WhatsApp Prescription Sender
  const rxQuickBtn = document.querySelector('#sendWhatsAppRx');
  if (rxQuickBtn) {
    rxQuickBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const patientPhone = document.querySelector('#quickRxPhone')?.value || '';
      const patientArea = document.querySelector('#quickRxArea')?.value || 'Demo Medical District';
      
      const message = `Hello CityMed Pharmacy, I would like to order medicines from my prescription.%0A%0A📍 Delivery Area: ${encodeURIComponent(patientArea)}%0A📞 Contact: ${encodeURIComponent(patientPhone)}%0A%0APlease check availability and send pricing.`;
      const waUrl = `https://wa.me/15550192834?text=${message}`;
      window.open(waUrl, '_blank');
    });
  }

  // 5. Delivery Coverage Zone Checker (Sanitized Demo Metro Localities)
  const checkDeliveryBtn = document.querySelector('#checkPincodeBtn');
  const pincodeInput = document.querySelector('#pincodeInput');
  const deliveryResult = document.querySelector('#deliveryResult');

  if (checkDeliveryBtn && pincodeInput && deliveryResult) {
    checkDeliveryBtn.addEventListener('click', () => {
      const val = pincodeInput.value.trim().toLowerCase();
      if (!val) {
        deliveryResult.innerHTML = `<span style="color: var(--color-danger)">Please enter your PIN code or neighborhood name.</span>`;
        return;
      }

      const expressZones = ['medical district', 'downtown', 'central', 'west end', 'riverside', '90210', '10001', '560038', 'metro'];
      const standardZones = ['pinecrest', 'north hills', 'oakridge', 'suburbs', 'east side'];

      const isExpress = expressZones.some(z => val.includes(z));
      const isStandard = standardZones.some(z => val.includes(z));

      if (isExpress) {
        deliveryResult.innerHTML = `<div style="padding: 0.85rem; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; color: #065f46; font-weight: 500;">
          🚀 <strong>45-Minute Express Delivery Available!</strong><br>
          Our dispensary counter delivers to your address with temperature-controlled insulated ice packs.
        </div>`;
      } else if (isStandard) {
        deliveryResult.innerHTML = `<div style="padding: 0.85rem; background: #f0fdfa; border: 1px solid #ccfbf1; border-radius: 8px; color: #0f766e; font-weight: 500;">
          📦 <strong>Same-Day Scheduled Delivery Available (90–120 mins).</strong><br>
          Order before 6:00 PM for guaranteed evening courier dispatch.
        </div>`;
      } else {
        deliveryResult.innerHTML = `<div style="padding: 0.85rem; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; color: #92400e; font-weight: 500;">
          📍 <strong>Metro Express Courier Available.</strong><br>
          Connect with on-duty pharmacists at +1 (555) 019-2834 to schedule direct dispatch.
        </div>`;
      }
    });
  }

  // 6. Scroll Reveal Observer (Subtle, Butter-Smooth Motion)
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(el => {
      revealObserver.observe(el);
    });

    // 7. Animated Counter Observer
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const targetEl = entry.target;
          const targetVal = parseInt(targetEl.getAttribute('data-target'), 10);
          const prefix = targetEl.getAttribute('data-prefix') || '';
          const suffix = targetEl.getAttribute('data-suffix') || '';
          if (!isNaN(targetVal)) {
            let start = 0;
            const duration = 1400;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease out quad
              const easeProgress = 1 - (1 - progress) * (1 - progress);
              const currentVal = Math.floor(easeProgress * targetVal);
              targetEl.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCount);
              } else {
                targetEl.textContent = `${prefix}${targetVal.toLocaleString()}${suffix}`;
              }
            };
            requestAnimationFrame(updateCount);
          }
          observer.unobserve(targetEl);
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));
  } else {
    // Fallback for reduced motion or non-supporting browsers
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // 8. Accessible FAQ Accordion
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      const isActive = header.classList.contains('active');

      accordionHeaders.forEach(h => {
        h.classList.remove('active');
        if (h.nextElementSibling) {
          h.nextElementSibling.style.maxHeight = null;
        }
      });

      if (!isActive && content) {
        header.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // 9. General Form Validation Handler
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (form.id === 'quickRxForm') return; // Handled by WhatsApp generator
      e.preventDefault();

      let isValid = true;
      const requiredInputs = form.querySelectorAll('input[required], textarea[required], select[required]');

      requiredInputs.forEach(input => {
        const error = input.parentElement.querySelector('.form-error');
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--color-danger)';
          if (error) error.style.display = 'block';
        } else {
          input.style.borderColor = '';
          if (error) error.style.display = 'none';
        }
      });

      if (isValid) {
        const successBox = form.querySelector('.form-success-alert');
        if (successBox) {
          successBox.style.display = 'block';
          form.reset();
          setTimeout(() => { successBox.style.display = 'none'; }, 6000);
        }
      }
    });
  });
});
