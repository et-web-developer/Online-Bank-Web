document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const signupBtn = document.getElementById('signupBtn');
  signupBtn.classList.add('loading');
  
  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      })
    });

    const data = await response.json();
    
    if (data.success) {
      // Redirect to homepage after successful signup
      window.location.href = data.redirect || '/dashboard.html';
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  } finally {
    signupBtn.classList.remove('loading');
  }
});