document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-investment-form');
    const tableBody = document.querySelector('#investments-table tbody');

    const filterDropdown = document.getElementById('asset-filter');
    const pageTotalEl = document.getElementById('inv-page-total');

    const renderTable = () => {
        let investments = getInvestments();
        const filterVal = filterDropdown ? filterDropdown.value : 'all';
        
        if (filterVal !== 'all') {
            investments = investments.filter(inv => inv.type === filterVal);
        }

        tableBody.innerHTML = '';
        let currentTotal = 0;

        investments.forEach(inv => {
            const totalCost = inv.quantity * inv.buyPrice;
            const currentValue = inv.quantity * inv.currentPrice;
            currentTotal += currentValue;
            
            const pl = currentValue - totalCost;
            const gainPercent = totalCost === 0 ? 0 : ((pl / totalCost) * 100).toFixed(2);
            
            const plClass = pl >= 0 ? 'text-green' : 'text-red';
            const icon = inv.type === 'crypto' ? '<i class="fa-brands fa-bitcoin text-green"></i>' : '<i class="fa-solid fa-arrow-trend-up text-blue"></i>';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${icon} ${inv.name}</td>
                <td style="text-transform: capitalize;">${inv.type}</td>
                <td>${inv.quantity}</td>
                <td>${formatCurrency(inv.buyPrice)}</td>
                <td>${formatCurrency(inv.currentPrice)}</td>
                <td>${formatCurrency(currentValue)}</td>
                <td class="${plClass}"><b>${formatCurrency(pl)}</b></td>
                <td class="${plClass}">${gainPercent}%</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteInvestment(${inv.id})"><i class="fa-solid fa-trash"></i></button></td>
            `;
            tableBody.appendChild(tr);
        });

        if (pageTotalEl) {
            pageTotalEl.innerText = formatCurrency(currentTotal);
        }
    };

    if (filterDropdown) {
        filterDropdown.addEventListener('change', renderTable);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const investments = getInvestments();
        const newAsset = {
            id: Date.now(),
            name: document.getElementById('asset-name').value,
            type: document.getElementById('asset-type').value,
            quantity: parseFloat(document.getElementById('asset-qty').value),
            buyPrice: parseFloat(document.getElementById('asset-buy').value),
            currentPrice: parseFloat(document.getElementById('asset-current').value)
        };

        investments.push(newAsset);
        localStorage.setItem('investments', JSON.stringify(investments));
        
        form.reset();
        renderTable();
    });

    window.deleteInvestment = (id) => {
        let investments = getInvestments();
        investments = investments.filter(inv => inv.id !== id);
        localStorage.setItem('investments', JSON.stringify(investments));
        renderTable();
    };

    renderTable();
});
