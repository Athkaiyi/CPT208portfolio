document.addEventListener("DOMContentLoaded", () => {
    const sections = Array.from(document.querySelectorAll(".section-observe[id]"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));
    const navProgress = document.querySelector(".nav-progress");
    const sideNav = document.querySelector(".side-nav");

    if (!sections.length || !navLinks.length || !navProgress || !sideNav) return;

    const textMeasureCanvas = document.createElement("canvas");
    const textMeasureContext = textMeasureCanvas.getContext("2d");

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

    const measureTextWidth = (link) => {
        if (!textMeasureContext) return link.offsetWidth;

        const styles = getComputedStyle(link);
        textMeasureContext.font = `${styles.fontStyle} ${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
        return textMeasureContext.measureText(link.textContent.trim()).width;
    };

    const getLinkMetrics = () => {
        const navRect = sideNav.getBoundingClientRect();

        return navLinks.map(link => {
            const href = link.getAttribute("href") || "";
            const id = href.replace("#", "");
            const rect = link.getBoundingClientRect();

            const textWidth = measureTextWidth(link);
            const textStart = (rect.left - navRect.left) + ((rect.width - textWidth) / 2);
            const textEnd = textStart + textWidth;

            return {
                id,
                start: textStart,
                end: textEnd
            };
        });
    };

    const updateProgress = () => {
        const metrics = getLinkMetrics();
        if (!metrics.length) return;

        const offset = getTopOffset();
        const currentScrollY = window.scrollY || window.pageYOffset;
        const scrollPosition = currentScrollY + offset;

        let currentIndex = 0;

        for (let i = 0; i < sections.length; i++) {
            if (scrollPosition >= sections[i].offsetTop) {
                currentIndex = i;
            } else {
                break;
            }
        }

        const currentSection = sections[currentIndex];
        const nextSection = sections[currentIndex + 1];

        const currentMetric = metrics.find(item => item.id === currentSection.id) || metrics[0];

        let progressWidth = currentMetric.start;

        const currentStartScrollY = Math.max(currentSection.offsetTop - offset, 0);

        if (nextSection) {
            const nextMetric = metrics.find(item => item.id === nextSection.id) || currentMetric;
            const nextStartScrollY = Math.max(nextSection.offsetTop - offset, currentStartScrollY + 1);

            let sectionProgress = (currentScrollY - currentStartScrollY) / (nextStartScrollY - currentStartScrollY);
            sectionProgress = Math.min(Math.max(sectionProgress, 0), 1);

            progressWidth = currentMetric.start + (nextMetric.start - currentMetric.start) * sectionProgress;
        } else {
            const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
            const lastRange = Math.max(maxScrollY - currentStartScrollY, 1);

            let sectionProgress = (currentScrollY - currentStartScrollY) / lastRange;
            sectionProgress = Math.min(Math.max(sectionProgress, 0), 1);

            progressWidth = currentMetric.start + (currentMetric.end - currentMetric.start) * sectionProgress;
        }

        navProgress.style.width = `${Math.max(0, progressWidth)}px`;
    };

    const updateActiveSection = () => {
        const offset = getTopOffset();
        const scrollPosition = (window.scrollY || window.pageYOffset) + offset;

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