document.addEventListener('DOMContentLoaded', function() {
  // Initialize Bootstrap tabs
  const transferSteps = new bootstrap.Tab(document.querySelector('#transferSteps .nav-link'));
  
  // Step Navigation - Next
  document.querySelectorAll('.next-step').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Validate current step before proceeding
      if (validateCurrentStep(this)) {
        const currentTab = this.closest('.tab-pane');
        const nextTabId = currentTab.getAttribute('aria-labelledby').replace('step', 'tabstep');
        const nextTab = document.querySelector(`#${nextTabId}`);
        
        if (nextTab) {
          new bootstrap.Tab(nextTab).show();
          
          // Update progress bar (if you add one)
          updateProgressBar();
        }
      }
    });
  });
  
  // Step Navigation - Previous
  document.querySelectorAll('.prev-step').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const currentTab = this.closest('.tab-pane');
      const prevTabId = currentTab.getAttribute('aria-labelledby').replace('step', 'tabstep');
      const prevTab = document.querySelector(`#${prevTabId}`);
      
      if (prevTab) {
        new bootstrap.Tab(prevTab).show();
        updateProgressBar();
      }
    });
  });
  
  // Amount Presets
  document.querySelectorAll('.preset-btn').forEach(button => {
    button.addEventListener('click', function() {
      const amount = this.textContent.replace('$', '');
      document.getElementById('transferAmount').value = amount;
    });
  });
  
  // Recipient Selection
  document.querySelectorAll('.recipient-card').forEach(card => {
    card.addEventListener('click', function() {
      document.querySelectorAll('.recipient-card').forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
    });
  });
  
  // Confirm Transfer
  document.getElementById('confirmTransfer').addEventListener('click', function(e) {
    e.preventDefault();
    
    // Validate all steps first
    if (validateAllSteps()) {
      // Show loading state
      this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processing...';
      this.disabled = true;
      
      // Simulate API call
      setTimeout(() => {
        // Show success message
        showTransferSuccess();
      }, 2000);
    }
  });
  
  // Validation Functions
  function validateCurrentStep(button) {
    const currentTab = button.closest('.tab-pane');
    
    if (currentTab.id === 'step1') {
      if (!document.querySelector('.recipient-card.selected')) {
        alert('Please select a recipient');
        return false;
      }
    } else if (currentTab.id === 'step2') {
      const amount = document.getElementById('transferAmount').value;
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        alert('Please enter a valid amount');
        return false;
      }
    }
    
    return true;
  }
  
  function validateAllSteps() {
    // Validate recipient
    if (!document.querySelector('.recipient-card.selected')) {
      alert('Please select a recipient');
      return false;
    }
    
    // Validate amount
    const amount = document.getElementById('transferAmount').value;
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return false;
    }
    
    return true;
  }
  
  function showTransferSuccess() {
    // Create success modal
    const successModal = `
      <div class="modal fade" id="transferSuccessModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-body text-center p-5">
              <div class="success-icon mb-4">
                <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
              </div>
              <h3>Transfer Successful!</h3>
              <p class="mb-4">Your transfer of $${document.getElementById('transferAmount').value} has been processed.</p>
              <button class="btn btn-primary" data-bs-dismiss="modal">Done</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Add to DOM
    document.body.insertAdjacentHTML('beforeend', successModal);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('transferSuccessModal'));
    modal.show();
    
    // Redirect when modal closes
    document.getElementById('transferSuccessModal').addEventListener('hidden.bs.modal', function() {
      window.location.href = '/dashboard.html';
    });
  }
  
  function updateProgressBar() {
    // Optional: Implement if you add a progress bar
  }
});