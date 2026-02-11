/**
 * T LEARN PRO | Admin Command Script
 * Version: 2.0.0 - Live Data Feed
 */

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNtAK6ToRg_J7USn9fNsoTGKGYpX2TkLEcGoddErh9IVRuv2ULYNn9xYgID46tBpSP/exec';

async function updateAdminDashboard() {
    const tableBody = document.getElementById('adminTableBody');
    const totalRequests = document.getElementById('totalRequests');
    const totalEmails = document.getElementById('totalEmails');
    const totalUsers = document.getElementById('totalUsers');

    try {
        // Fetch real data from Google Apps Script
        const response = await fetch(`${SCRIPT_URL}?mode=admin`);
        const { entries } = await response.json();

        // Handle empty state
        if (!entries || entries.length === 0) {
            totalRequests.innerText = "0";
            totalEmails.innerText = "0";
            totalUsers.innerText = "0";

            // Restore the original "Awaiting First Data Transmission..." message
            tableBody.innerHTML = `
                <tr>
                    <td colspan="3" class="px-8 py-24 text-center">
                        <div class="flex flex-col items-center justify-center space-y-4 opacity-20 group">
                            <div class="relative">
                                <i class="fas fa-satellite-dish text-5xl animate-pulse"></i>
                                <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping"></div>
                            </div>
                            <p class="text-[10px] font-black uppercase tracking-[0.6em]">Awaiting First Data Transmission...</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Calculate metrics
        const requestCount = entries.length;
        const uniqueEmailsCount = [...new Set(entries.map(e => e.email.toLowerCase()))].length;

        // Update KPIs
        totalRequests.innerText = requestCount.toLocaleString();
        totalEmails.innerText = uniqueEmailsCount.toLocaleString();
        totalUsers.innerText = uniqueEmailsCount.toLocaleString();

        // Clear table and populate with real data (latest first)
        tableBody.innerHTML = '';
        entries.reverse().forEach(data => {
            tableBody.insertAdjacentHTML('beforeend', `
                <tr class="hover:bg-blue-600/5 transition-all group">
                    <td class="px-8 py-6">
                        <span class="text-xs font-bold text-gray-200 group-hover:text-white tracking-wide">${data.email}</span>
                    </td>
                    <td class="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        ${data.date}
                    </td>
                    <td class="px-8 py-6 text-right text-[10px] font-black text-blue-500 tracking-tighter">
                        ${data.time}
                    </td>
                </tr>
            `);
        });

    } catch (error) {
        console.error("Failed to fetch uplink data:", error);
        tableBody.innerHTML = `
            <tr>
                <td colspan="3" class="px-8 py-24 text-center text-rose-500 font-black uppercase tracking-widest">
                    Connection Lost to HQ
                </td>
            </tr>
        `;
        totalRequests.innerText = "ERR";
        totalEmails.innerText = "ERR";
        totalUsers.innerText = "ERR";
    }
}

/**
 * Filter System - Search by email
 */
document.querySelector('input[placeholder="FILTER BY IDENTITY..."]')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#adminTableBody tr');

    rows.forEach(row => {
        const emailCell = row.querySelector('td');
        const email = emailCell ? emailCell.innerText.toLowerCase() : '';
        row.style.display = email.includes(term) ? '' : 'none';
    });
});

// Initial load + auto-refresh every 30 seconds
document.addEventListener('DOMContentLoaded', () => {
    updateAdminDashboard();
    setInterval(updateAdminDashboard, 30000); // Refresh every 30 seconds
});


const PIN_HASH = "80562e89643d99762df70068305001155f9f60f38b248e3a290510103759371e";

async function hashPin(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPin() {
    const input = document.getElementById('pinInput');
    const modal = document.getElementById('pinModal');
    const error = document.getElementById('errorMessage');
    
    // Hash the user's input
    const hashedInput = await hashPin(input.value);

    if (hashedInput === PIN_HASH) {
        // Success
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 500);
    } else {
        // Failure
        error.classList.remove('hidden');
        input.value = "";
        input.classList.add('border-red-500');
        
        input.animate([
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 100, iterations: 3 });
    }
}

// Keep the Enter key listener
document.getElementById('pinInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        verifyPin();
    }
});
(function systemWipe() {
    console.warn("INITIATING SYSTEM WIPE...");

    // 1. Clear all browser storage (Waitlist data, session keys, etc.)
    localStorage.clear();
    sessionStorage.clear();

    // 2. Clear Cookies (Standard session cookies)
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // 3. Force Redirect
    // Change 'index.html' to your login page or a 404 page
    alert("Unauthorized Access Detected. System Data Purged.");
    window.location.href = "index.html"; 
})();
// 1. Security Configuration
const PIN_HASH = "80562e89643d99762df70068305001155f9f60f38b248e3a290510103759371e"; // Hash for 123789
const MASTER_DEVICE_KEY = "MAC-7722-X99-PRO-TECH"; 

// 2. Hardware Validation (Runs instantly)
(function validateHardware() {
    const deviceToken = localStorage.getItem('device_uplink_auth');
    
    if (deviceToken !== MASTER_DEVICE_KEY) {
        // FAILSAFE: Wipe and Terminate
        localStorage.clear();
        sessionStorage.clear();
        
        document.documentElement.innerHTML = `
            <body style="background:#020617; color:#ef4444; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:monospace; text-align:center;">
                <h1 style="letter-spacing:0.5em;">CRITICAL SECURITY BREACH</h1>
                <p style="font-size:10px; color:#475569;">UNAUTHORIZED HARDWARE DETECTED. LOCAL DATA PURGED.</p>
            </body>
        `;
        
        setTimeout(() => {
            window.location.replace("https://www.google.com");
        }, 3000);
        throw new Error("Unauthorized Device Access");
    }
})();

// 3. PIN Verification Logic
async function hashPin(string) {
    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPin() {
    const input = document.getElementById('pinInput');
    const modal = document.getElementById('pinModal');
    
    const hashedInput = await hashPin(input.value);

    if (hashedInput === PIN_HASH) {
        modal.style.opacity = '0';
        setTimeout(() => { modal.classList.add('hidden'); }, 500);
    } else {
        // Wrong PIN also triggers a refresh for security
        window.location.reload();
    }
}
