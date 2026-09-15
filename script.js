/* =========================================================
   STUDENT RIGHTS CAMPAIGN
   COMPLETE WEBSITE JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. MOBILE NAVIGATION
       ===================================================== */

    const menuButton = document.querySelector(".mobile-menu-button");
    const mainNav = document.querySelector(".main-nav");

    if (menuButton && mainNav) {

        menuButton.addEventListener("click", () => {

            const isOpen = mainNav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuButton.setAttribute(
                "aria-label",
                isOpen ? "Close navigation" : "Open navigation"
            );

            menuButton.textContent = isOpen ? "✕" : "☰";
        });


        /* Close menu after clicking a link */

        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                mainNav.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

                menuButton.textContent = "☰";
            });

        });


        /* Close menu when clicking outside */

        document.addEventListener("click", event => {

            if (
                mainNav.classList.contains("open") &&
                !mainNav.contains(event.target) &&
                !menuButton.contains(event.target)
            ) {

                mainNav.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

                menuButton.textContent = "☰";
            }

        });

    }


    /* =====================================================
       02. ACTIVE NAVIGATION LINK
       ===================================================== */

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const navigationLinks =
        document.querySelectorAll(".main-nav a");

    navigationLinks.forEach(link => {

        const linkPage =
            link.getAttribute("href");

        if (
            linkPage === currentPage ||
            (currentPage === "" && linkPage === "index.html")
        ) {

            link.classList.add("active");

        }

    });


    /* =====================================================
       03. HEADER SCROLL EFFECT
       ===================================================== */

    const header =
        document.querySelector(".site-header");

    if (header) {

        const updateHeader = () => {

            if (window.scrollY > 30) {

                header.classList.add("scrolled");

            } else {

                header.classList.remove("scrolled");

            }

        };

        window.addEventListener(
            "scroll",
            updateHeader,
            { passive: true }
        );

        updateHeader();

    }


    /* =====================================================
       04. SMOOTH ANCHOR SCROLLING
       ===================================================== */

    const anchorLinks =
        document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            if (
                !targetId ||
                targetId === "#"
            ) {
                return;
            }

            const target =
                document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight =
                header ? header.offsetHeight : 0;

            const targetPosition =
                target.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                20;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            /* Update URL without jumping */

            history.replaceState(
                null,
                "",
                targetId
            );

        });

    });


    /* =====================================================
       05. SCROLL REVEAL ANIMATIONS
       ===================================================== */

    const revealElements = document.querySelectorAll(
        ".card, " +
        ".right-card, " +
        ".campaign-card, " +
        ".resource-card, " +
        ".news-card, " +
        ".action-card, " +
        ".value-card, " +
        ".join-benefit, " +
        ".contact-detail, " +
        ".action-step, " +
        ".featured-news-card, " +
        ".subscribe-box, " +
        ".message-box, " +
        ".community-box, " +
        ".join-form-box, " +
        ".contact-form-box"
    );


    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        revealElements.forEach(element => {

            element.classList.add("scroll-reveal");

        });


        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "revealed"
                            );

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {

            revealObserver.observe(element);

        });

    }


    /* =====================================================
       06. FAQ ACCORDION
       ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        item.addEventListener("toggle", () => {

            if (item.open) {

                faqItems.forEach(otherItem => {

                    if (
                        otherItem !== item &&
                        otherItem.open
                    ) {

                        otherItem.open = false;

                    }

                });

            }

        });

    });


    /* =====================================================
       07. FORM VALIDATION
       ===================================================== */

    const forms =
        document.querySelectorAll(
            ".join-form, .contact-form, .subscribe-form"
        );


    forms.forEach(form => {

        form.addEventListener("submit", event => {

            event.preventDefault();


            /* ---------------------------------------------
               Validate required fields
               --------------------------------------------- */

            const requiredFields =
                form.querySelectorAll(
                    "input[required], textarea[required], select[required]"
                );


            let valid = true;


            requiredFields.forEach(field => {

                field.classList.remove(
                    "form-error"
                );


                if (!field.value.trim()) {

                    valid = false;

                    field.classList.add(
                        "form-error"
                    );

                }


                if (
                    field.type === "email" &&
                    field.value.trim()
                ) {

                    const emailPattern =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                    if (
                        !emailPattern.test(
                            field.value.trim()
                        )
                    ) {

                        valid = false;

                        field.classList.add(
                            "form-error"
                        );

                    }

                }

            });


            /* ---------------------------------------------
               Checkboxes
               --------------------------------------------- */

            const checkbox =
                form.querySelector(
                    'input[type="checkbox"][required]'
                );


            if (
                checkbox &&
                !checkbox.checked
            ) {

                valid = false;

                checkbox.classList.add(
                    "form-error"
                );

            }


            /* ---------------------------------------------
               Show error
               --------------------------------------------- */

            if (!valid) {

                showFormMessage(
                    form,
                    "Please complete the required fields.",
                    "error"
                );

                const firstError =
                    form.querySelector(
                        ".form-error"
                    );

                if (firstError) {

                    firstError.focus();

                }

                return;

            }


            /* ---------------------------------------------
               Successful front-end submission
               --------------------------------------------- */

            showFormMessage(
                form,
                "Thank you. Your message has been received.",
                "success"
            );


            form.reset();

        });

    });


    /* =====================================================
       08. REMOVE FORM ERROR WHILE TYPING
       ===================================================== */

    document.querySelectorAll(
        ".form-group input, " +
        ".form-group textarea, " +
        ".form-group select"
    ).forEach(field => {

        field.addEventListener(
            "input",
            () => {

                field.classList.remove(
                    "form-error"
                );

            }
        );

        field.addEventListener(
            "change",
            () => {

                field.classList.remove(
                    "form-error"
                );

            }
        );

    });


    /* =====================================================
       09. FORM MESSAGE FUNCTION
       ===================================================== */

    function showFormMessage(
        form,
        message,
        type
    ) {

        let messageBox =
            form.querySelector(
                ".form-message"
            );


        if (!messageBox) {

            messageBox =
                document.createElement("div");

            messageBox.className =
                "form-message";

            form.appendChild(
                messageBox
            );

        }


        messageBox.textContent =
            message;

        messageBox.className =
            `form-message ${type}`;


        messageBox.setAttribute(
            "role",
            "alert"
        );


        messageBox.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    /* =====================================================
       10. BACK TO TOP BUTTON
       ===================================================== */

    const backToTop =
        document.createElement("button");

    backToTop.type = "button";

    backToTop.className =
        "back-to-top";

    backToTop.innerHTML =
        "↑";

    backToTop.setAttribute(
        "aria-label",
        "Back to top"
    );


    document.body.appendChild(
        backToTop
    );


    const toggleBackToTop = () => {

        if (window.scrollY > 500) {

            backToTop.classList.add(
                "visible"
            );

        } else {

            backToTop.classList.remove(
                "visible"
            );

        }

    };


    window.addEventListener(
        "scroll",
        toggleBackToTop,
        { passive: true }
    );


    backToTop.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );


    toggleBackToTop();


    /* =====================================================
       11. FOOTER YEAR
       ===================================================== */

    const yearElements =
        document.querySelectorAll(
            ".current-year"
        );


    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


    /* =====================================================
       12. NEWSLETTER FORM
       ===================================================== */

    const subscribeForms =
        document.querySelectorAll(
            ".subscribe-form"
        );


    subscribeForms.forEach(form => {

        form.addEventListener(
            "submit",
            event => {

                const email =
                    form.querySelector(
                        'input[type="email"]'
                    );


                if (!email) {
                    return;
                }


                if (!email.value.trim()) {

                    event.preventDefault();

                    email.focus();

                    return;

                }

            }
        );

    });


    /* =====================================================
       13. ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                mainNav &&
                mainNav.classList.contains("open")
            ) {

                mainNav.classList.remove(
                    "open"
                );


                if (menuButton) {

                    menuButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menuButton.setAttribute(
                        "aria-label",
                        "Open navigation"
                    );

                    menuButton.textContent =
                        "☰";

                }

            }

        }
    );


    /* =====================================================
       14. PREVENT DOUBLE SUBMISSION
       ===================================================== */

    forms.forEach(form => {

        form.addEventListener(
            "submit",
            () => {

                const submitButton =
                    form.querySelector(
                        'button[type="submit"], input[type="submit"]'
                    );


                if (!submitButton) {
                    return;
                }


                setTimeout(() => {

                    submitButton.disabled =
                        false;

                }, 1500);

            }
        );

    });


    /* =====================================================
       15. EXTERNAL LINKS
       ===================================================== */

    document.querySelectorAll(
        'a[target="_blank"]'
    ).forEach(link => {

        link.setAttribute(
            "rel",
            "noopener noreferrer"
        );

    });


    /* =====================================================
       16. PAGE LOADED
       ===================================================== */

    document.body.classList.add(
        "page-loaded"
    );

});