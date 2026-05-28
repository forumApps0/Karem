// Add scroll animation functionality
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer for fade-in elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });

  // Smooth scroll for the down button
  const scrollBtn = document.getElementById('scroll-btn');
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const firstSection = document.querySelector('.stats-section');
      if (firstSection) {
        window.scrollTo({
          top: firstSection.offsetTop - 50,
          behavior: 'smooth'
        });
      }
    });
  }
});
