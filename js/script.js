// js/script.js

// --- General Utilities ---

/**
 * Gets the current post ID from the URL query parameter (?id=...).
 * @returns {string|null} The post ID as a string, or null if not found.
 */
function getCurrentPostId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


// --- DOM Ready Initializations ---

document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                     menuToggle.setAttribute('aria-expanded', 'false');
                     menuToggle.classList.remove('active');
                     mainNav.classList.remove('active');
                }
            });
        });

        document.addEventListener('click', (event) => {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
                 menuToggle.setAttribute('aria-expanded', 'false');
                 menuToggle.classList.remove('active');
                 mainNav.classList.remove('active');
            }
        });
    }

    // --- Update Footer Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    console.log("Blog website scripts initialized.");
});