from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os # To potentially use environment variables later

app = Flask(__name__)
CORS(app) # Enable CORS

# --- Database Configuration ---
# Replace with your actual PostgreSQL connection details
# Format: postgresql://username:password@host:port/database_name
# Ensure the 'ecommerce' database exists in your PostgreSQL instance.
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:mentee@localhost:5433/ecommerce' # <-- *** CHANGE 'your_password' ***
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # Disable modification tracking (recommended)

db = SQLAlchemy(app)
# --- End Database Configuration ---

# --- Database Model ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False) # Increased length for hash

    def __repr__(self):
        return f'<User {self.email}>'
# --- End Database Model ---

# --- Helper Functions (Using Werkzeug) ---
def hash_password(password):
    """Hashes a password using Werkzeug."""
    return generate_password_hash(password)

def check_password(hashed_password, provided_password):
    """Checks a provided password against the stored hash."""
    return check_password_hash(hashed_password, provided_password)
# --- End Helper Functions ---


@app.route('/signup', methods=['POST'])
def signup():
    """Handles user registration."""
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({'message': 'Missing required fields (name, email, password)'}), 400

    # Check if user already exists in the database
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({'message': 'Email already registered'}), 409 # Conflict

    # Hash the password
    hashed_pw = hash_password(password)

    # Create new user object
    new_user = User(name=name, email=email, password_hash=hashed_pw)

    # Add to database session and commit
    try:
        db.session.add(new_user)
        db.session.commit()
        print(f"User registered: {email}") # For debugging
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback() # Rollback in case of error
        print(f"Error during signup: {e}") # Log the error
        return jsonify({'message': 'Registration failed due to server error'}), 500


@app.route('/login', methods=['POST'])
def login():
    """Handles user login."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing required fields (email, password)'}), 400

    # Query the database for the user
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({'message': 'User not found'}), 404

    # Check the provided password against the stored hash
    if not check_password(user.password_hash, password):
        return jsonify({'message': 'Invalid credentials'}), 401 # Unauthorized

    # Login successful
    # In a real app, you might generate a JWT here.
    print(f"User logged in: {email}") # For debugging
    return jsonify({'message': 'Login successful', 'user': {'name': user.name, 'email': user.email}}), 200


@app.route('/')
def index():
    """Basic route to check if the API is running."""
    return jsonify({'message': 'Auth API is running!'})

# --- Function to Create Tables ---
def create_tables():
    """Creates database tables if they don't exist."""
    with app.app_context():
        print("Creating database tables...")
        db.create_all()
        print("Database tables created (if they didn't exist).")
# --- End Function ---

if __name__ == '__main__':
    # Create tables before running the app for the first time
    create_tables()
    # Note: Use a proper WSGI server (like Gunicorn or Waitress) for production.
    # Set debug=False in production.
    app.run(debug=True, port=5001)