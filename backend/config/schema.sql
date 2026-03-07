-- DarshanBarter Finance Web App Schema
CREATE DATABASE IF NOT EXISTS darshan_barter;
USE darshan_barter;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('admin', 'candidate') DEFAULT 'candidate',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(255),
  reset_token VARCHAR(255),
  reset_token_expires DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Loan Products
CREATE TABLE IF NOT EXISTS loan_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  min_amount DECIMAL(15,2) DEFAULT 0,
  max_amount DECIMAL(15,2) DEFAULT 0,
  interest_rate DECIMAL(5,2) DEFAULT 0,
  tenure_months INT DEFAULT 12,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Candidates
CREATE TABLE IF NOT EXISTS candidates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  pincode VARCHAR(10),
  dob DATE,
  gender ENUM('male','female','other'),
  employment_type ENUM('salaried','self-employed','business','student','other'),
  monthly_income DECIMAL(15,2),
  pan_number VARCHAR(20),
  aadhar_number VARCHAR(20),
  credit_score INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Loan Applications
CREATE TABLE IF NOT EXISTS loan_applications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  tenure_months INT NOT NULL,
  purpose TEXT,
  status ENUM('pending','under_review','approved','rejected','disbursed') DEFAULT 'pending',
  remarks TEXT,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES loan_products(id)
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  application_id INT,
  doc_type VARCHAR(100),
  file_name VARCHAR(255),
  file_path VARCHAR(500),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Loan service contact info (for popup)
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_type VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(150),
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Seed contact info
INSERT IGNORE INTO contact_info (id, service_type, phone, email, description)
VALUES
  (1, 'loans', '+91 98765 43210', 'loans@darshanbarter.com', 'Call or email us for all loan enquiries'),
  (2, 'support', '+91 90000 11111', 'support@darshanbarter.com', 'General customer support');

-- Seed default admin
INSERT IGNORE INTO users (name, email, password, role, is_verified)
VALUES ('Admin User', 'admin@darshanbarter.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Seed loan products
INSERT IGNORE INTO loan_products (name, description, min_amount, max_amount, interest_rate, tenure_months) VALUES
  ('Personal Loan', 'Instant personal loans for any purpose', 10000, 500000, 12.5, 60),
  ('Home Loan', 'Affordable home loans with flexible EMI options', 500000, 10000000, 8.5, 240),
  ('Business Loan', 'Grow your business with quick funds', 100000, 5000000, 14.0, 84),
  ('Education Loan', 'Fund your education journey', 50000, 2000000, 10.5, 120),
  ('Vehicle Loan', 'Drive your dream vehicle today', 50000, 1500000, 9.5, 84);
