document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Fetch API for login
    try {
      const response = await fetch('http://127.0.0.1:5050/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
      console.log(result);
  
      if (response.ok) {
        // Store login data in localStorage
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('name', JSON.stringify(result.data.user.name));

        
        alert('Login successful');
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
});
