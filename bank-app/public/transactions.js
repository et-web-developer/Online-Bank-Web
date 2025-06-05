document.addEventListener('DOMContentLoaded', function() {
  // Initialize date range picker
  $('#dateRangePicker').daterangepicker({
    opens: 'left',
    locale: {
      format: 'MMM D, YYYY'
    },
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    startDate: moment().subtract(29, 'days'),
    endDate: moment()
  }, function(start, end, label) {
    // This function runs when a date range is selected
    loadTransactions(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
  });

  // Filter transactions when dropdowns change
  document.getElementById('transactionType').addEventListener('change', filterTransactions);
  document.getElementById('transactionStatus').addEventListener('change', filterTransactions);

  // Initialize transaction detail modal
  const detailModal = new bootstrap.Modal(document.getElementById('transactionDetailModal'));

  // Attach click handlers to view buttons
  document.querySelectorAll('.btn-view-details').forEach(button => {
    button.addEventListener('click', function() {
      const transactionId = this.dataset.transactionId;
      showTransactionDetails(transactionId);
    });
  });

  // Function to load transactions
  function loadTransactions(startDate, endDate) {
    // Show loading state
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch from your backend
      // and update the DOM with real data
      console.log(`Loading transactions from ${startDate} to ${endDate}`);
      
      // For demo, we'll just reload the static content
      location.reload();
    }, 1000);
  }

  // Function to filter transactions
  function filterTransactions() {
    const type = document.getElementById('transactionType').value;
    const status = document.getElementById('transactionStatus').value;
    
    // Show loading state
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4"><div class="spinner-border text-primary"></div></td></tr>';

    // Simulate filtering
    setTimeout(() => {
      console.log(`Filtering by type: ${type}, status: ${status}`);
      // In a real app, you would filter the data or fetch filtered results
      location.reload();
    }, 500);
  }

  // Function to show transaction details
  function showTransactionDetails(transactionId) {
    // Show loading state
    const modalBody = document.querySelector('#transactionDetailModal .modal-body');
    modalBody.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary"></div></div>';

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch transaction details
      const transactionData = {
        id: transactionId,
        date: 'June 15, 2023 10:45 AM',
        description: 'Salary Deposit',
        type: 'Deposit',
        amount: '$5,200.00',
        status: 'Completed',
        from: 'TechCorp Inc.',
        reference: 'TX-789456123',
        notes: 'Monthly salary deposit'
      };

      // Populate modal
      modalBody.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <div class="mb-3">
              <h6 class="text-muted">Transaction ID</h6>
              <p>${transactionData.id}</p>
            </div>
            <div class="mb-3">
              <h6 class="text-muted">Date & Time</h6>
              <p>${transactionData.date}</p>
            </div>
            <div class="mb-3">
              <h6 class="text-muted">Description</h6>
              <p>${transactionData.description}</p>
            </div>
          </div>
          <div class="col-md-6">
            <div class="mb-3">
              <h6 class="text-muted">Amount</h6>
              <p class="text-success fw-bold">${transactionData.amount}</p>
            </div>
            <div class="mb-3">
              <h6 class="text-muted">Status</h6>
              <p><span class="badge bg-success">${transactionData.status}</span></p>
            </div>
            <div class="mb-3">
              <h6 class="text-muted">Reference</h6>
              <p>${transactionData.reference}</p>
            </div>
          </div>
        </div>
        <div class="mt-3">
          <h6 class="text-muted">Notes</h6>
          <p>${transactionData.notes}</p>
        </div>
      `;

      // Show modal
      detailModal.show();
    }, 800);
  }
});