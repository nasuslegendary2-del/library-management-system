-- Library Management System Database Schema

-- Create database (run manually)
-- CREATE DATABASE library_db;

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borrowings table
CREATE TABLE IF NOT EXISTS borrowings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    book_id INTEGER REFERENCES books(id),
    borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_date TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'borrowed',
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_book FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Insert sample data
INSERT INTO books (title, author, isbn) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5'),
('To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4'),
('1984', 'George Orwell', '978-0-452-28423-4'),
('Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8'),
('The Catcher in the Rye', 'J.D. Salinger', '978-0-316-76948-0');

INSERT INTO users (name, email, phone) VALUES
('John Doe', 'john.doe@email.com', '555-0101'),
('Jane Smith', 'jane.smith@email.com', '555-0102'),
('Bob Johnson', 'bob.johnson@email.com', '555-0103');