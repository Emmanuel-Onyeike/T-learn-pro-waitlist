/**
 * T LEARN PRO | Admin Command Script
 * Version: 1.0.1
 */

// This array represents your database. 
// When you connect a real DB, this will be populated from your server.
let uplinks = []; 

/**
 * Update the Dashboard Analytics & Table
 */
function updateAdminDashboard() {
    const tableBody = document.getElementById('adminTableBody');
    const totalRequests = document.getElementById('totalRequests');
    const totalEmails = document.getElementById('totalEmails');
    const totalUsers = document.getElementById('totalUsers');

    // 1. Handle Empty State
    if (uplinks.length === 0) {
        totalRequests.innerText = "0";
        totalEmails.innerText = "0";
        totalUsers.innerText = "0";
        return; // Exit, keeping the HTML "Awaiting Uplink" row visible
    }

    // 2. Calculate Tactical Metrics
    const requestCount = uplinks.length;
    const uniqueEmails = [...new Set(uplinks.map(u => u.email.toLowerCase()))].length;
    
    // Update KPI Displays
    totalRequests.innerText = requestCount.toLocaleString();
    totalEmails.innerText = uniqueEmails.toLocaleString();
    totalUsers.innerText = uniqueEmails.toLocaleString(); // Unique users based on email

    // 3. Render Data Feed
    tableBody.innerHTML = ''; // Clear the "Awaiting Uplink" message

    // Sort by latest first
    const sortedUplinks = [...uplinks].reverse();

    sortedUplinks.forEach(data => {
        const row = `
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
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

/**
 * Filter System
 * Allows searching through the uplink identities
 */
document.querySelector('input[placeholder="FILTER BY IDENTITY..."]').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#adminTableBody tr');

    rows.forEach(row => {
        const email = row.querySelector('td')?.innerText.toLowerCase();
        if (email) {
            row.style.display = email.includes(term) ? '' : 'none';
        }
    });
});

// Initial Execution
document.addEventListener('DOMContentLoaded', updateAdminDashboard);