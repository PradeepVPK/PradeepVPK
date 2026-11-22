if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('arrive');
        observer.unobserve(entry.target);
      }
    }
  });
  document.querySelectorAll('.section > h2, .feature, .card, .role').forEach(element => observer.observe(element));
}
