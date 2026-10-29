
/* =========================================================
   FRESHNEST FOODS — MAIN JAVASCRIPT
   Navigation, animations, ordering and image handling
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Respect the user's reduced-motion accessibility setting.
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =====================================================
       1. MOBILE NAVIGATION
       ===================================================== */

    const menuBtn = document.getElementById("menuBtn");
    const navigation = document.querySelector(".navigations");

    function setMenuOpen(isOpen) {
        if (!menuBtn || !navigation) return;

        // Support both class names used in existing CSS.
        navigation.classList.toggle("active", isOpen);
        navigation.classList.toggle("open", isOpen);

        menuBtn.setAttribute("aria-expanded", String(isOpen));
        menuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        const icon = menuBtn.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
            icon.classList.toggle("fa-times", isOpen);
        }
    }

    if (menuBtn && navigation) {
        if (!navigation.id) {
            navigation.id = "site-navigation";
        }

        menuBtn.setAttribute("aria-controls", navigation.id);
        menuBtn.setAttribute("aria-expanded", "false");

        menuBtn.addEventListener("click", () => {
            const isOpen =
                navigation.classList.contains("active") ||
                navigation.classList.contains("open");

            setMenuOpen(!isOpen);
        });

        // Close the menu when a navigation link is selected.
        navigation.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                setMenuOpen(false);
            });
        });

        // Close the menu with Escape.
        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                setMenuOpen(false);
            }
        });

        // Close the menu when clicking outside it.
        document.addEventListener("click", event => {
            const isOpen =
                navigation.classList.contains("active") ||
                navigation.classList.contains("open");

            if (
                isOpen &&
                !navigation.contains(event.target) &&
                !menuBtn.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        });

        // Close the mobile menu when returning to desktop width.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                setMenuOpen(false);
            }
        });
    }

    /* =====================================================
       2. STICKY HEADER
       ===================================================== */

    const header = document.querySelector(".heading");

    function updateHeader() {
        if (!header) return;

        header.classList.toggle("scrolled", window.scrollY > 50);
    }

    /* =====================================================
       3. SMOOTH SCROLLING
       ===================================================== */

    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", event => {
            const href = link.getAttribute("href");

            // Ignore empty placeholder links.
            if (!href || href === "#") return;

            let target;

            try {
                target = document.querySelector(href);
            } catch (error) {
                return;
            }

            if (!target) return;

            event.preventDefault();
            setMenuOpen(false);

            target.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });

    /* =====================================================
       4. ACTIVE NAVIGATION LINK
       ===================================================== */

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    function updateActiveNavigation() {
        let currentSection = "";

        const marker =
            window.scrollY + Math.min(window.innerHeight * 0.32, 220);

        sections.forEach(section => {
            if (section.offsetTop <= marker) {
                currentSection = section.id;
            }
        });

        navLinks.forEach(link => {
            const isActive =
                link.getAttribute("href") === `#${currentSection}`;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    /* =====================================================
       5. SCROLL REVEAL ANIMATIONS
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".menu-grid article, " +
        ".why-us, " +
        ".about, " +
        ".popular article, " +
        ".contact-card, " +
        ".hours-card, " +
        ".contact-cta, " +
        ".image-block article"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
        element.classList.add("reveal-section");
    });

    function showElement(element) {
        element.classList.add("visible");
        element.classList.add("is-visible");
    }

    if (
        !reducedMotion &&
        "IntersectionObserver" in window
    ) {
        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        showElement(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -30px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        revealElements.forEach(showElement);
    }

    /* =====================================================
       6. BACK-TO-TOP BUTTON
       ===================================================== */

    let backToTop = document.querySelector(".back-to-top");

    // Create the button if it doesn't already exist.
    if (!backToTop) {
        backToTop = document.createElement("button");
        backToTop.type = "button";
        backToTop.className = "back-to-top";
        backToTop.setAttribute("aria-label", "Back to top");

        backToTop.innerHTML =
            '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';

        document.body.appendChild(backToTop);
    }

    function updateBackToTop() {
        const visible = window.scrollY > 500;

        backToTop.classList.toggle("show", visible);
        backToTop.classList.toggle("visible", visible);

        backToTop.setAttribute("aria-hidden", String(!visible));
        backToTop.tabIndex = visible ? 0 : -1;
    }

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    });

    /* =====================================================
       7. WHATSAPP ORDER BUTTONS
       ===================================================== */

    // IMPORTANT: Replace this with your real business number.
    // Nigerian number example: 2348012345678
    // Do not include +, spaces or dashes.
    const WHATSAPP_NUMBER = "2348001234567";

    const orderButtons = document.querySelectorAll(
        ".order, " +
        ".hero-btn, " +
        ".choice a, " +
        ".special-link, " +
        ".image-block article a"
    );

    orderButtons.forEach(button => {
        button.addEventListener("click", event => {
            const buttonText =
                (button.textContent || "").trim().toLowerCase();

            // Keep View Menu buttons working as navigation links.
            if (buttonText.includes("view menu")) return;

            const href = button.getAttribute("href") || "";

            // Preserve regular external, telephone and email links.
            if (/^(https?:|mailto:|tel:)/i.test(href)) return;

            event.preventDefault();

            let productName = button.dataset.product || "an order";

            const card = button.closest(
                "article, .menu-item, .product-card"
            );

            if (card) {
                const title = card.querySelector("h3, h2, .product-title");

                if (title && title.textContent.trim()) {
                    productName = title.textContent.trim();
                }
            }

            if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
                alert(
                    "Please configure the FreshNest Foods WhatsApp number."
                );
                return;
            }

            const message =
                `Hello FreshNest Foods! I would like to place an order for ${productName}.`;

            const whatsappURL =
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

            window.open(
                whatsappURL,
                "_blank",
                "noopener,noreferrer"
            );
        });
    });

    /* =====================================================
       8. DYNAMIC FOOTER YEAR
       ===================================================== */

    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* =====================================================
       9. IMAGE LOADING AND ERROR HANDLING
       ===================================================== */

    document.querySelectorAll("img").forEach(image => {
        function markLoaded() {
            image.classList.add("loaded");
            image.classList.remove("image-error");
        }

        function markError() {
            image.classList.add("image-error");

            console.warn(
                "FreshNest image could not be loaded:",
                image.currentSrc || image.src
            );
        }

        image.addEventListener("load", markLoaded, { once: true });
        image.addEventListener("error", markError, { once: true });

        // Handle images already loaded from the browser cache.
        if (image.complete) {
            if (image.naturalWidth > 0) {
                markLoaded();
            } else if (image.currentSrc || image.src) {
                markError();
            }
        }
    });

    /* =====================================================
       10. PERFORMANCE-FRIENDLY SCROLL EVENTS
       ===================================================== */

    let scrollScheduled = false;

    function handleScroll() {
        if (scrollScheduled) return;

        scrollScheduled = true;

        window.requestAnimationFrame(() => {
            updateHeader();
            updateActiveNavigation();
            updateBackToTop();

            scrollScheduled = false;
        });
    }

    window.addEventListener("scroll", handleScroll, {
        passive: true
    });

    // Initialize states on page load.
    updateHeader();
    updateActiveNavigation();
    updateBackToTop();

});
