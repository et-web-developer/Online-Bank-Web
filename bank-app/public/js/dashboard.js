// Initialize Balance Chart
function initBalanceChart() {
  const ctx = document.getElementById('balanceChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Balance',
        data: [12000, 15000, 18000, 21000, 23000, 24500],
        borderColor: '#6c5ce7',
        backgroundColor: 'rgba(108, 92, 231, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

// Load Recent Transactions
async function loadRecentTransactions() {
  try {
    const response = await fetch('/api/transactions/recent');
    const transactions = await response.json();
    
    const activityList = document.querySelector('.activity-list');
    activityList.innerHTML = '';
    
    transactions.forEach(transaction => {
      const transactionEl = document.createElement('div');
      transactionEl.className = `activity-item ${transaction.type}`;
      transactionEl.innerHTML = `
        <div class="activity-icon">
          <i class="fas ${transaction.type === 'credit' ? 'fa-arrow-down' : 'fa-arrow-up'}"></i>
        </div>
        <div class="activity-details">
          <h4>${transaction.description}</h4>
          <p>${transaction.date}</p>
        </div>
        <div class="activity-amount ${transaction.type}">
          ${transaction.type === 'credit' ? '+' : '-'}$${transaction.amount}
        </div>
      `;
      activityList.appendChild(transactionEl);
    });
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
}

// Theme Toggle
document.getElementById('theme-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initBalanceChart();
  loadRecentTransactions();
  
  // Set initial theme
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }
});