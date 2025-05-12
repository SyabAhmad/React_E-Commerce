import React, { useState } from 'react'; // Import useState
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { Footer, Navbar } from "../components";

const Login = () => {
  // State for form inputs and feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(''); // Optional: for success message

  const navigate = useNavigate(); // Hook for navigation

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission
    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:5001/login', { // Your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) { // Check if response status is 200 OK
        setSuccess('Login successful! Redirecting...');
        // Clear form
        setEmail('');
        setPassword('');

        // *** Store user info in localStorage ***
        localStorage.setItem('user', JSON.stringify(data.user)); // Store the user object

        console.log('Logged in user:', data.user); // Log user data from API
        // Redirect to home page after a short delay
        setTimeout(() => {
          // Force a reload or navigate to trigger Navbar update if needed,
          // or ideally use context/state management for reactivity.
          // For simplicity, navigation might trigger a re-render.
          navigate('/');
          // window.location.reload(); // Alternative: Force reload - less ideal UX
        }, 1000); // Redirect after 1 second
      } else {
        // Handle errors from the API (e.g., invalid credentials, user not found)
        setError(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100"> {/* Use className */}
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            {/* Display Success Message */}
            {success && <div className="alert alert-success" role="alert">{success}</div>}
            {/* Display Error Message */}
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
              <div className="my-3"> {/* Use className */}
                <label htmlFor="Email">Email address</label> {/* Use htmlFor */}
                <input
                  type="email"
                  className="form-control" // Use className
                  id="Email" // Changed id for clarity
                  placeholder="name@example.com"
                  value={email} // Bind value to state
                  onChange={(e) => setEmail(e.target.value)} // Update state on change
                />
              </div>
              <div className="my-3"> {/* Use className */}
                <label htmlFor="Password">Password</label> {/* Use htmlFor */}
                <input
                  type="password"
                  className="form-control" // Use className
                  id="Password" // Changed id for clarity
                  placeholder="Password"
                  value={password} // Bind value to state
                  onChange={(e) => setPassword(e.target.value)} // Update state on change
                />
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit"> {/* Remove disabled, use className */}
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
