/* Carlisle Soccer Club - shared chrome (header, nav, footer) */
(function () {
    "use strict";

    var NAV = [
        { label: "Home", href: "index.html" },
        { label: "Fields", href: "fields.html" },
        { label: "Coaches", href: "coaches.html" },
        { label: "Referees", href: "referees.html" },
        { label: "About", href: "about.html" },
        { label: "Parents", href: "parents.html" },
    ];

    function currentPage() {
        var path = window.location.pathname.split("/").pop();
        return path === "" ? "index.html" : path;
    }

    function isActive(href, page) {
        return href === page;
    }

    function esc(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    function linkHtml(item, page) {
        var current = isActive(item.href, page) ? ' aria-current="page"' : "";
        var external = item.href.indexOf("http") === 0 ? ' target="_blank" rel="noopener"' : "";
        return '<a href="' + esc(item.href) + '"' + current + external + ">" + esc(item.label) + "</a>";
    }

    function navHtml(page) {
        return NAV.map(function (item, index) {
            if (!item.children) {
                return "<li>" + linkHtml(item, page) + "</li>";
            }
            var hasActiveChild = item.children.some(function (child) {
                return isActive(child.href, page);
            });
            var id = "submenu-" + index;
            var items = item.children
                .map(function (child) {
                    return "<li>" + linkHtml(child, page) + "</li>";
                })
                .join("");
            return (
                '<li class="has-submenu' +
                (hasActiveChild ? " is-section" : "") +
                '">' +
                '<button type="button" class="nav-trigger" aria-expanded="false" aria-controls="' +
                id +
                '">' +
                esc(item.label) +
                "</button>" +
                '<ul class="submenu" id="' +
                id +
                '">' +
                items +
                "</ul></li>"
            );
        }).join("");
    }

    function headerHtml(page) {
        return (
            '<header class="site-header" id="siteHeader"><div class="wrap header-inner">' +
            '<a class="brand" href="index.html" aria-label="Carlisle Soccer Club, Home of the Pride">' +
            '<img class="brand-logo" src="images/logo.png" alt="" aria-hidden="true" width="48" height="48">' +
            '<span class="brand-text" aria-hidden="true"><span class="brand-name">Carlisle Soccer Club</span><br>' +
            '<span class="brand-tag">Home of the Pride</span></span></a>' +
            '<button type="button" class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="primaryNav">Menu</button>' +
            '<nav aria-label="Primary"><ul class="nav" id="primaryNav">' +
            navHtml(page) +
            "</ul></nav>" +
            '<a class="btn btn-primary btn-sm" href="register.html">Register Now</a>' +
            "</div></header>"
        );
    }

    function footerHtml() {
        var year = new Date().getFullYear();
        return (
            '<footer class="site-footer"><div class="wrap">' +
            '<div class="footer-grid">' +
            "<div>" +
            '<h4>Carlisle Soccer Club</h4>' +
            "<p>A volunteer-run, non-profit youth soccer club serving Carlisle, Iowa and the surrounding communities. Home of the Pride.</p>" +
            '<p><a href="https://www.facebook.com/CarlisleSoccer" target="_blank" rel="noopener">Follow us on Facebook</a></p>' +
            "</div>" +
            "<div><h4>Play</h4><ul>" +
            '<li><a href="register.html">Registration Info</a></li>' +
            '<li><a href="age-brackets.html">Age Brackets</a></li>' +
            '<li><a href="game-information.html">Game Information</a></li>' +
            '<li><a href="practice-information.html">Practice Information</a></li>' +
            '<li><a href="fields.html">Fields &amp; Directions</a></li>' +
            "</ul></div>" +
            "<div><h4>Get Involved</h4><ul>" +
            '<li><a href="volunteer.html">Volunteer</a></li>' +
            '<li><a href="coaches.html">Coaches Corner</a></li>' +
            '<li><a href="become-a-referee.html">Become a Referee</a></li>' +
            '<li><a href="financial-assistance.html">Financial Assistance</a></li>' +
            "</ul></div>" +
            "<div><h4>Club Info</h4><ul>" +
            '<li><a href="about.html">About Us</a></li>' +
            '<li><a href="staff.html">Our Staff &amp; Board</a></li>' +
            '<li><a href="code-of-conduct.html">Code of Conduct</a></li>' +
            '<li><a href="refund-policy.html">Refund Policy</a></li>' +
            '<li><a href="contact.html">Contact</a></li>' +
            "</ul></div>" +
            "</div>" +
            '<div class="footer-bottom">' +
            "<span>&copy; " + year + " Carlisle Soccer Club. All rights reserved.</span>" +
            "<span>Registration powered by PlayMetrics</span>" +
            "</div></div></footer>"
        );
    }

    function wireNav() {
        var header = document.getElementById("siteHeader");
        var toggle = document.getElementById("navToggle");
        if (!header || !toggle) return;

        toggle.addEventListener("click", function () {
            var open = header.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", String(open));
        });

        var triggers = header.querySelectorAll(".nav-trigger");
        Array.prototype.forEach.call(triggers, function (trigger) {
            trigger.addEventListener("click", function (event) {
                event.stopPropagation();
                var parent = trigger.parentNode;
                var wasOpen = parent.classList.contains("open");
                closeAllSubmenus(header);
                if (!wasOpen) {
                    parent.classList.add("open");
                    trigger.setAttribute("aria-expanded", "true");
                }
            });
        });

        document.addEventListener("click", function (event) {
            if (!header.contains(event.target)) {
                closeAllSubmenus(header);
                header.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeAllSubmenus(header);
                header.classList.remove("nav-open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    function closeAllSubmenus(header) {
        var open = header.querySelectorAll("li.open");
        Array.prototype.forEach.call(open, function (li) {
            li.classList.remove("open");
            var trigger = li.querySelector(".nav-trigger");
            if (trigger) trigger.setAttribute("aria-expanded", "false");
        });
    }

    function wireHeaderScroll() {
        var header = document.getElementById("siteHeader");
        if (!header) return;
        var hero = document.querySelector(".hero, .page-hero");
        var ticking = false;

        function update() {
            ticking = false;
            var threshold = hero ? hero.offsetHeight - header.offsetHeight : 40;
            var scrolled = (window.pageYOffset || document.documentElement.scrollTop) > threshold;
            header.classList.toggle("is-solid", scrolled);
        }

        function onScroll() {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(update);
        }

        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
    }

    function syncHeaderHeight() {
        var header = document.getElementById("siteHeader");
        if (!header) return;
        var root = document.documentElement;

        function set() {
            root.style.setProperty("--header-h", header.offsetHeight + "px");
        }

        set();
        if (window.ResizeObserver) {
            new ResizeObserver(set).observe(header);
        } else {
            window.addEventListener("resize", set);
            window.addEventListener("load", set);
        }
    }

    function render() {
        var page = currentPage();
        var headerMount = document.getElementById("site-header");
        var footerMount = document.getElementById("site-footer");
        if (headerMount) headerMount.innerHTML = headerHtml(page);
        if (footerMount) footerMount.innerHTML = footerHtml();
        wireNav();
        wireHeaderScroll();
        syncHeaderHeight();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }
})();
