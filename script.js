const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach((el) => observer.observe(el));

function scalePortfolioPreviews() {
  document.querySelectorAll('.mock-viewport').forEach((viewport) => {
    const iframe = viewport.querySelector('iframe');
    if (!iframe) return;
    const scale = viewport.clientWidth / 1280;
    iframe.style.transform = `scale(${scale})`;
  });
}

window.addEventListener('load', scalePortfolioPreviews);
window.addEventListener('resize', scalePortfolioPreviews);

const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const form = document.getElementById('contact-form');
if (form) {
  const submitBtn = document.getElementById('contact-submit');
  const status = document.getElementById('contact-status');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = '';
    status.className = 'contact-status';

    if (form.querySelector('[name="_honey"]').value) {
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'שולח...';

    try {
      const response = await fetch(
        form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'),
        {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form),
        }
      );

      if (response.ok) {
        status.textContent = 'ההודעה נשלחה בהצלחה! נחזור אליך בקרוב.';
        status.classList.add('contact-status-success');
        form.reset();
      } else {
        throw new Error('שליחה נכשלה');
      }
    } catch (err) {
      status.textContent = 'משהו השתבש. אפשר לנסות שוב או לפנות בוואטסאפ.';
      status.classList.add('contact-status-error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'שלח הודעה';
    }
  });
}
