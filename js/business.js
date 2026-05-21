document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-business-form');
    const tableBody = document.querySelector('#business-table tbody');

    // Set default date to today
    document.getElementById('entry-date').valueAsDate = new Date();

    const renderTable = () => {
        const entries = getBusinessEntries();
        // Sort by date descending
        entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        tableBody.innerHTML = '';

        entries.forEach(entry => {
            const tr = document.createElement('tr');
            
            const isIncome = entry.type === 'income';
            const amountClass = isIncome ? 'text-green' : 'text-red';
            const amountPrefix = isIncome ? '+' : '-';
            const icon = isIncome ? '<i class="fa-solid fa-arrow-down text-green"></i>' : '<i class="fa-solid fa-arrow-up text-red"></i>';

            tr.innerHTML = `
                <td>${entry.date}</td>
                <td style="text-transform: capitalize;">${icon} ${entry.type}</td>
                <td>${entry.category}</td>
                <td>${entry.description}</td>
                <td class="${amountClass}"><b>${amountPrefix}${formatCurrency(entry.amount)}</b></td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteEntry(${entry.id})"><i class="fa-solid fa-trash"></i></button></td>
            `;
            tableBody.appendChild(tr);
        });
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const entries = getBusinessEntries();
        const newEntry = {
            id: Date.now(),
            date: document.getElementById('entry-date').value,
            type: document.getElementById('entry-type').value,
            category: document.getElementById('entry-category').value,
            description: document.getElementById('entry-desc').value,
            amount: parseFloat(document.getElementById('entry-amount').value)
        };

        entries.push(newEntry);
        localStorage.setItem('businessEntries', JSON.stringify(entries));
        
        form.reset();
        document.getElementById('entry-date').valueAsDate = new Date();
        renderTable();
    });

    window.deleteEntry = (id) => {
        let entries = getBusinessEntries();
        entries = entries.filter(e => e.id !== id);
        localStorage.setItem('businessEntries', JSON.stringify(entries));
        renderTable();
    };

    renderTable();
});
