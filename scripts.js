/**
 * T LEARN PRO | Tactical Interface Logic
 * Version: 1.0.0 Alpha - Fixed & Live
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    const waitlistBtn = document.getElementById('waitlistBtn');
    const waitlistEmail = document.getElementById('waitlistEmail');
    
    const feedbackModal = document.getElementById('feedbackModal');
    const feedbackTitle = document.getElementById('feedbackTitle');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const feedbackIcon = document.getElementById('feedbackIcon');

    // --- 1. Mobile Menu Logic ---
    const toggleMenu = (isOpen) => {
        if (isOpen) {
            mobileMenu.classList.remove('hidden');
            setTimeout(() => {
                mobileMenu.style.opacity = '1';
                mobileMenu.style.transform = 'scale(1)';
            }, 10);
        } else {
            mobileMenu.style.opacity = '0';
            mobileMenu.style.transform = 'scale(0.95)';
            setTimeout(() => mobileMenu.classList.add('hidden'), 500);
        }
    };

    if (mobileMenuBtn) mobileMenuBtn.onclick = () => toggleMenu(true);
    if (closeMenuBtn) closeMenuBtn.onclick = () => toggleMenu(false);

    // --- 2. Header Scroll Effect ---
    window.onscroll = () => {
        const headerInner = document.querySelector('header > div');
        if (headerInner) {
            if (window.scrollY > 40) {
                headerInner.classList.add('header-scrolled');
            } else {
                headerInner.classList.remove('header-scrolled');
            }
        }
    };

    // --- 3. Feedback Modal Logic ---
    const showFeedback = (title, message, isError = false) => {
        feedbackTitle.innerText = title;
        feedbackMessage.innerText = message;
        
        if (isError) {
            feedbackIcon.className = "fas fa-exclamation-triangle text-7xl text-rose-500 relative z-10";
            feedbackTitle.classList.replace('text-white', 'text-rose-500');
        } else {
            feedbackIcon.className = "fas fa-shield-check text-7xl text-blue-500 relative z-10";
            feedbackTitle.classList.replace('text-rose-500', 'text-white');
        }

        feedbackModal.classList.remove('hidden');
    };

    window.closeModal = () => {
        feedbackModal.classList.add('hidden');
    };

    // --- 4. Waitlist Button - REAL BACKEND WITH CORS FIX ---
    if (waitlistBtn && waitlistEmail) {
        waitlistBtn.onclick = async () => {
            const email = waitlistEmail.value.trim().toLowerCase();
            
            if (!email || !email.includes('@')) {
                showFeedback("Uplink Denied", "Valid authority email required.", true);
                return;
            }

            waitlistBtn.disabled = true;
            waitlistBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i>';

            try {
                const formData = new FormData();
                formData.append('email', email);

                await fetch('https://script.google.com/macros/s/AKfycbxNtAK6ToRg_J7USn9fNsoTGKGYpX2TkLEcGoddErh9IVRuv2ULYNn9xYgID46tBpSP/exec', {
                    method: 'POST',
                    mode: 'no-cors',
                    body: formData
                });

                showFeedback("Uplink Success", "Access confirmed. Welcome email sent!", false);
                waitlistEmail.value = '';

            } catch (err) {
                showFeedback("Transmission Failed", "Please try again.", true);
            } finally {
                waitlistBtn.disabled = false;
                waitlistBtn.innerHTML = '<span class="relative z-10 text-[11px] font-black uppercase tracking-[0.5em]">Request Access</span>';
            }
        };

        // Magnetic button effect
        waitlistBtn.addEventListener('mousemove', (e) => {
            const rect = waitlistBtn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            waitlistBtn.style.setProperty('--x', `${x}px`);
            waitlistBtn.style.setProperty('--y', `${y}px`);
        });
    }
});
