document.addEventListener("DOMContentLoaded", () => {
    const sections = Array.from(document.querySelectorAll(".section-observe[id]"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const navProgress = document.querySelector(".nav-progress");

    const getTopOffset = () => {
        const rootStyle = getComputedStyle(document.documentElement);
        const navOffset = parseFloat(rootStyle.getPropertyValue("--top-nav-offset")) || 118;
        return navOffset + 30;
    };

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

    const updateActiveSection = () => {
        if (!sections.length) return;

        const offset = getTopOffset();
        const scrollPosition = window.scrollY + offset;

        let currentSection = sections[0];

        for (const section of sections) {
            if (scrollPosition >= section.offsetTop) {
                currentSection = section;
            } else {
                break;
            }
        }

        if (currentSection && currentSection.id) {
            activateLink(currentSection.id);
        }
    };

    const handleScroll = () => {
        updateProgress();
        updateActiveSection();
    };

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetId = link.getAttribute("href")?.replace("#", "");
            if (targetId) activateLink(targetId);

            requestAnimationFrame(() => {
                updateProgress();
                updateActiveSection();
            });
        });
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    window.addEventListener("load", handleScroll);

    handleScroll();
});
