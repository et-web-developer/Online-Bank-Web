document.addEventListener('DOMContentLoaded', function() {
  // Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const animationDuration = 2000; // 2 seconds
  const frameDuration = 1000 / 60; // 60fps
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const suffix = counter.getAttribute('data-suffix') || '';
    const start = 0;
    const frames = Math.floor(animationDuration / frameDuration);
    
    const animate = () => {
      let current = start;
      const increment = target / frames;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          clearInterval(timer);
          current = target;
        }
        counter.textContent = Math.floor(current) + suffix;
      }, frameDuration);
    };
    
    // Start animation when counter is in view
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animate();
        observer.unobserve(counter);
      }
    }, { threshold: 0.5 });
    
    observer.observe(counter);
  });
}

  // Testimonial Scroller
  function setupTestimonialScroller() {
    const track = document.querySelector('.testimonials-track');
    const leftBtn = document.querySelector('.scroll-left');
    const rightBtn = document.querySelector('.scroll-right');
    const cardWidth = 320; // Width + gap

    if (track && leftBtn && rightBtn) {
      leftBtn.addEventListener('click', () => {
        track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
      });
      
      rightBtn.addEventListener('click', () => {
        track.scrollBy({ left: cardWidth, behavior: 'smooth' });
      });
    }
  }

  // Navbar Scroll Effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Initialize everything
  animateCounters();
  setupTestimonialScroller();
});