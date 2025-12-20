/**
 * T LEARN PRO | Tactical Interface Logic
 * Version: 1.0.0 Alpha
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
            // Small delay to allow CSS transitions to trigger
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

    mobileMenuBtn.onclick = () => toggleMenu(true);
    closeMenuBtn.onclick = () => toggleMenu(false);

    // --- 2. Header Scroll Effect ---
    window.onscroll = () => {
        const headerInner = document.querySelector('header > div');
        if (window.scrollY > 40) {
            headerInner.classList.add('header-scrolled');
        } else {
            headerInner.classList.remove('header-scrolled');
        }
    };

    // --- 3. Waitlist Submission Logic ---
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

    waitlistBtn.onclick = () => {
        const email = waitlistEmail.value.trim();
        
        // Basic Tactical Validation
        if (!email || !email.includes('@')) {
            showFeedback("Uplink Denied", "Please provide a valid authority email address.", true);
            return;
        }

        // Simulate Network Processing
        waitlistBtn.disabled = true;
        waitlistBtn.innerHTML = '<i class="fas fa-spinner animate-spin"></i>';

        setTimeout(() => {
            showFeedback("Uplink Success", "Your priority position has been secured in the queue.");
            waitlistBtn.disabled = false;
            waitlistBtn.innerHTML = '<span class="relative z-10 text-[11px] font-black uppercase tracking-[0.5em]">Request Access</span>';
            waitlistEmail.value = ''; // Clear terminal
        }, 1500);
    };

    // --- 4. Magnetic Button Feel (Optional Polish) ---
    waitlistBtn.addEventListener('mousemove', (e) => {
        const rect = waitlistBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        waitlistBtn.style.setProperty('--x', `${x}px`);
        waitlistBtn.style.setProperty('--y', `${y}px`);
    });
});