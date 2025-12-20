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