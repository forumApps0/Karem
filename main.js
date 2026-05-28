// Add scroll animation functionality
document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Fade-in and Counter Animations ---
  
  // Helper to animate numbers
  const animateValue = (obj, start, end, duration) => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easeProgress * (end - start) + start);
      obj.innerHTML = currentVal.toLocaleString('en-US');
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.innerHTML = end.toLocaleString('en-US'); // Ensure exact final value
      }
    };
    window.requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Fade in
        if (entry.target.classList.contains('fade-in')) {
          entry.target.classList.add('visible');
        }
        
        // Counters
        if (entry.target.hasAttribute('data-target') && !entry.target.classList.contains('counted')) {
          const target = parseInt(entry.target.getAttribute('data-target'), 10);
          entry.target.classList.add('counted');
          animateValue(entry.target, 0, target, 1500);
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in, [data-target]').forEach(element => {
    observer.observe(element);
  });

  // --- 2. Smooth scroll for the down button ---
  const scrollBtn = document.getElementById('scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const firstSection = document.querySelector('.insights-section');
      if (firstSection) {
        window.scrollTo({
          top: firstSection.offsetTop - 50,
          behavior: 'smooth'
        });
      }
    });
  }

  // --- 3. Reading Progress Bar ---
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progress-bar').style.width = scrolled + '%';
  });

  // --- 4. Carousel Logic ---
  const slides = document.querySelectorAll('.quote-card');
  const dots = document.querySelectorAll('.dot');
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[index] && dots[index]) {
      slides[index].classList.add('active');
      dots[index].classList.add('active');
      currentSlide = index;
    }
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };

  if (slides.length > 0) {
    slideInterval = setInterval(nextSlide, 5000);

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(slideInterval);
        showSlide(index);
        slideInterval = setInterval(nextSlide, 5000);
      });
    });
  }

  // --- 5. Lightbox Logic ---
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const galleryImages = Array.from(document.querySelectorAll('.gallery-img'));
  
  let currentImageIndex = 0;

  const openLightbox = (index) => {
    currentImageIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    lightbox.classList.remove('show');
    document.body.style.overflow = 'auto';
  };

  const showPrevImage = (e) => {
    if (e) e.stopPropagation();
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex].src;
  };

  const showNextImage = (e) => {
    if (e) e.stopPropagation();
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentImageIndex].src;
  };

  galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openLightbox(index));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrevImage);
  if (nextBtn) nextBtn.addEventListener('click', showNextImage);

  // Close when clicking outside the image
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });
});
