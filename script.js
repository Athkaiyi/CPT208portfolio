document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".section-observe");
    const navLinks = document.querySelectorAll(".nav-link");
    const navProgress = document.querySelector(".nav-progress");

    const activateLink = (id) => {
        navLinks.forEach(link => {
            const href = link.getAttribute("href");
            link.classList.toggle("active", href === `#${id}`);
        });
    };

    const updateProgress = () => {
        if (!navProgress) return;

        const scrollTop = window.scrollY || window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        navProgress.style.width = `${Math.min(progress, 100)}%`;
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

            requestAnimationFrame(() => {
                updateProgress();
            });
        });
    });

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    updateProgress();
});
