let currentTradeMode = 'buy';
let currentPrice = 0;

function getTradeData() {
  const params = new URLSearchParams(window.location.search);
  return {
    symbol: params.get('symbol') || 'AAPL',
    name: params.get('name') || 'Apple Inc.',
    price: parseFloat(params.get('price')) || 173.50
  };
}

function initializeTradePage() {
  const data = getTradeData();
  currentPrice = data.price;

  document.getElementById('detail-symbol').innerText = data.symbol;
  document.getElementById('about-symbol').innerText = data.symbol;
  document.getElementById('detail-name').innerText = data.name;
  document.getElementById('detail-price').innerText = `$${data.price.toFixed(2)}`;
  document.getElementById('summary-price').innerText = `$${data.price.toFixed(2)}`;

  const randomChange = (Math.random() * 5).toFixed(2);
  const isPositive = Math.random() > 0.5;
  const changeEl = document.getElementById('detail-change');
  changeEl.innerText = `${isPositive ? '+' : '-'}${randomChange} (${(randomChange / data.price * 100).toFixed(2)}%)`;
  changeEl.className = isPositive ? 'text-green' : 'text-red';

  updateTradeTotals();
  createStockChart(data.symbol);
}

window.updateTradeTotals = function() {
  const qty = parseFloat(document.getElementById('trade-qty').value) || 0;
  const fee = 1.99;
  const total = (qty * currentPrice) + fee;

  document.querySelectorAll('.summary-row span')[3].innerText = `$${fee.toFixed(2)}`;
  document.getElementById('summary-total').innerText = `$${total.toFixed(2)}`;
};

window.setTradeMode = function(mode) {
  currentTradeMode = mode;

  const buyTab = document.getElementById('tab-buy');
  const sellTab = document.getElementById('tab-sell');
  const submitBtn = document.getElementById('trade-submit-btn');

  buyTab.classList.remove('active');
  sellTab.classList.remove('active');

  if (mode === 'buy') {
    buyTab.classList.add('active');
    submitBtn.innerText = 'Buy Now';
    submitBtn.style.background = '#2563eb';
  } else {
    sellTab.classList.add('active');
    submitBtn.innerText = 'Sell Now';
    submitBtn.style.background = '#dc2626';
  }
};

window.executeTrade = function(event) {
  event.preventDefault();

  const qty = document.getElementById('trade-qty').value;
  const data = getTradeData();

  alert(`${currentTradeMode.toUpperCase()} order placed successfully!\n\nStock: ${data.symbol}\nQuantity: ${qty}\nPrice: $${currentPrice.toFixed(2)}`);
};

function createStockChart(symbol) {
  const canvas = document.getElementById('stockDetailChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const prices = Array.from({length: 7}, () => (currentPrice + (Math.random() * 20 - 10)).toFixed(2));

  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: `${symbol} Price`,
        data: prices,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37,99,235,0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            color: '#9ca3af'
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#9ca3af'
          }
        },
        y: {
          ticks: {
            color: '#9ca3af'
          }
        }
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', initializeTradePage);
