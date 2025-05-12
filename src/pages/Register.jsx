import React, { useState } from 'react';
import { Footer, Navbar } from "../components";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate

const Register = () => {
    // State for form inputs
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for error messages
    const [success, setSuccess] = useState(''); // State for success messages

    const navigate = useNavigate(); // Hook for navigation

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages

        // Basic validation (optional, but recommended)
        if (!name || !email || !password) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5001/signup', { // Your API endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) { // Check if response status is 2xx
                setSuccess('Registration successful! Redirecting to login...');
                // Clear form
                setName('');
                setEmail('');
                setPassword('');
                // Redirect to login page after a short delay
                setTimeout(() => {
                    navigate('/login');
                }, 1500); // Redirect after 1.5 seconds
            } else {
                // Handle errors from the API (e.g., email already exists)
                setError(data.message || 'Registration failed.');
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError('An error occurred during registration. Please try again.');
        }
    };

    return (
        <>
            <Navbar />
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        {/* Display Success Message */}
                        {success && <div className="alert alert-success" role="alert">{success}</div>}
                        {/* Display Error Message */}
                        {error && <div className="alert alert-danger" role="alert">{error}</div>}
                        <form onSubmit={handleSubmit}> {/* Add onSubmit handler */}
                            <div className="form my-3"> {/* Use className instead of class */}
                                <label htmlFor="Name">Full Name</label> {/* Use htmlFor */}
                                <input
                                    type="text" // Changed type to text
                                    className="form-control" // Use className
                                    id="Name"
                                    placeholder="Enter Your Name"
                                    value={name} // Bind value to state
                                    onChange={(e) => setName(e.target.value)} // Update state on change
                                />
                            </div>
                            <div className="form my-3"> {/* Use className */}
                                <label htmlFor="Email">Email address</label> {/* Use htmlFor */}
                                <input
                                    type="email"
                                    className="form-control" // Use className
                                    id="Email"
                                    placeholder="name@example.com"
                                    value={email} // Bind value to state
                                    onChange={(e) => setEmail(e.target.value)} // Update state on change
                                />
                            </div>
                            <div className="form my-3"> {/* Use className */}
                                <label htmlFor="Password">Password</label> {/* Use htmlFor */}
                                <input
                                    type="password"
                                    className="form-control" // Use className
                                    id="Password"
                                    placeholder="Password"
                                    value={password} // Bind value to state
                                    onChange={(e) => setPassword(e.target.value)} // Update state on change
                                />
                            </div>
                            <div className="my-3">
                                <p>Already have an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit"> {/* Remove disabled, use className */}
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Register;