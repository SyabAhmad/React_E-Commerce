import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { NavLink, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useSelector } from 'react-redux';

const Navbar = () => {
    const navigate = useNavigate(); // Hook for navigation
    const [loggedInUser, setLoggedInUser] = useState(null); // State to hold user info

    // Check localStorage on component mount and update state
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setLoggedInUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Error parsing user data from localStorage", e);
                localStorage.removeItem('user'); // Clear invalid data
            }
        }
    }, []); // Empty dependency array means this runs once on mount

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('user'); // Clear user data
        setLoggedInUser(null); // Update state
        navigate('/login'); // Redirect to login page
        // Optionally: window.location.reload(); // Force reload if needed
    };


    // Get state from Redux store (assuming you might still use this for cart)
    const state = useSelector((state) => state.handleCart);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        {loggedInUser ? (
                            // If user is logged in, show welcome message and Logout button
                            <>
                                <span className="me-2">Welcome, {loggedInUser.name}!</span>
                                <button onClick={handleLogout} className="btn btn-outline-dark m-2">
                                    <i className="fa fa-sign-out-alt mr-1"></i> Logout
                                </button>
                            </>
                        ) : (
                            // If user is not logged in, show Login and Register buttons
                            <>
                                <NavLink to="/login" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-sign-in-alt mr-1"></i> Login
                                </NavLink>
                                <NavLink to="/register" className="btn btn-outline-dark m-2">
                                    <i className="fa fa-user-plus mr-1"></i> Register
                                </NavLink>
                            </>
                        )}
                        {/* Keep Cart button regardless of login state */}
                        <NavLink to="/cart" className="btn btn-outline-dark m-2">
                            <i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length})
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;