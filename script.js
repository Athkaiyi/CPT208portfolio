document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section-observe");
  const navLinks = document.querySelectorAll(".nav-link");

  const activateLink = (id) => {
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateLink(entry.target.id);
        }
      });
    },
    {
      root: null,
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0.1
    }
  );

  sections.forEach(section => observer.observe(section));

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinks.forEach(item => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
});
