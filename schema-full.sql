DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    category TEXT NOT NULL,
    price REAL DEFAULT 0,
    unit TEXT,
    minOrder INTEGER DEFAULT 1,
    sizes TEXT, -- stored as JSON array string
    finish TEXT, -- stored as JSON array string
    thickness TEXT, -- stored as JSON array string
    features TEXT, -- stored as JSON array string
    applications TEXT, -- stored as JSON array string
    images TEXT, -- stored as JSON array string
    inStock INTEGER DEFAULT 1, -- boolean 0/1
    featured INTEGER DEFAULT 0, -- boolean 0/1
    rating REAL DEFAULT 0,
    reviews INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
