import React from 'react';
import { Footer, Navbar } from '../components';
import { useSelector } from 'react-redux'; // To potentially get cart details
import { Link } from 'react-router-dom';

const Payment = () => {
    const cartState = useSelector((state) => state.handleCart); // Get cart items from Redux

    // Calculate total amount (example)
    const totalAmount = cartState.reduce((acc, item) => acc + item.qty * item.price, 0);

    // Placeholder for payment form/integration
    const handlePayment = (e) => {
        e.preventDefault();
        // In a real app, you would integrate with a payment gateway (Stripe, PayPal, etc.) here
        alert('Payment processing is not implemented yet. Thank you for your order!');
        // TODO: Clear cart, redirect to order confirmation page, etc.
    };

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <h1 className="text-center mb-4">Checkout & Payment</h1>
                <div className="row g-5">
                    {/* Order Summary */}
                    <div className="col-md-5 col-lg-4 order-md-last">
                        <h4 className="d-flex justify-content-between align-items-center mb-3">
                            <span className="text-primary">Your cart</span>
                            <span className="badge bg-primary rounded-pill">{cartState.length}</span>
                        </h4>
                        <ul className="list-group mb-3">
                            {cartState.map((item) => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between lh-sm">
                                    <div>
                                        <h6 className="my-0">{item.title.substring(0, 20)}...</h6>
                                        <small className="text-muted">Qty: {item.qty}</small>
                                    </div>
                                    <span className="text-muted">${(item.price * item.qty).toFixed(2)}</span>
                                </li>
                            ))}
                            <li className="list-group-item d-flex justify-content-between">
                                <span>Total (USD)</span>
                                <strong>${totalAmount.toFixed(2)}</strong>
                            </li>
                        </ul>
                        <Link to="/cart" className="btn btn-sm btn-outline-secondary w-100 mb-3">Edit Cart</Link>
                    </div>

                    {/* Payment Form Placeholder */}
                    <div className="col-md-7 col-lg-8">
                        <h4 className="mb-3">Billing address / Payment Details</h4>
                        <form onSubmit={handlePayment}>
                            {/* Add form fields for address, payment method etc. here */}
                            <p>Payment gateway integration needed here.</p>
                            <div className="mb-3">
                                <label htmlFor="cc-name" className="form-label">Name on card</label>
                                <input type="text" className="form-control" id="cc-name" placeholder="" required />
                                <small className="text-muted">Full name as displayed on card</small>
                            </div>
                             <div className="mb-3">
                                <label htmlFor="cc-number" className="form-label">Credit card number</label>
                                <input type="text" className="form-control" id="cc-number" placeholder="" required />
                            </div>
                            {/* Add more fields: expiration, CVV etc. */}

                            <hr className="my-4" />

                            <button className="w-100 btn btn-primary btn-lg" type="submit">
                                Complete Purchase (Placeholder)
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Payment;