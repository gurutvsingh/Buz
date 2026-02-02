CREATE DATABASE IF NOT EXISTS buz_db;
USE buz_db;

-- ==========================================
-- USERS
-- ==========================================

CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('OWNER','EMPLOYEE') DEFAULT 'OWNER',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================================
-- BUSINESSES
-- ==========================================

CREATE TABLE businesses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    owner_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    business_type VARCHAR(100),
    description TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_business_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================
-- EMPLOYEE BUSINESS MAPPING
-- ==========================================

CREATE TABLE employee_business (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    employee_id BIGINT NOT NULL,
    business_id BIGINT NOT NULL,

    UNIQUE KEY uq_employee_business (
        employee_id,
        business_id
    ),

    CONSTRAINT fk_employee_user
        FOREIGN KEY (employee_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_employee_business
        FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

-- ==========================================
-- INCOME
-- ==========================================

CREATE TABLE income (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    business_id BIGINT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    description TEXT,

    income_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

-- ==========================================
-- EXPENSES
-- ==========================================

CREATE TABLE expenses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    business_id BIGINT NOT NULL,

    amount DECIMAL(12,2) NOT NULL,
    category VARCHAR(100),
    description TEXT,

    expense_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

-- ==========================================
-- CUSTOMERS
-- ==========================================

CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    business_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    address TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

-- ==========================================
-- DIGITAL KHATA
-- ==========================================

CREATE TABLE ledger_entries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    customer_id BIGINT NOT NULL,

    entry_type ENUM('CREDIT','DEBIT') NOT NULL,

    amount DECIMAL(12,2) NOT NULL,

    description TEXT,

    entry_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE CASCADE
);

-- ==========================================
-- REMINDERS
-- ==========================================

CREATE TABLE reminders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    business_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    due_date DATE NOT NULL,

    priority ENUM('LOW','MEDIUM','HIGH')
        DEFAULT 'MEDIUM',

    amount DECIMAL(12,2),

    status ENUM('PENDING','COMPLETED')
        DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

-- ==========================================
-- CHECKLISTS
-- ==========================================

CREATE TABLE checklists (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    business_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    frequency ENUM(
        'DAILY',
        'WEEKLY',
        'MONTHLY'
    ) DEFAULT 'DAILY',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

CREATE TABLE checklist_tasks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    checklist_id BIGINT NOT NULL,

    task_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (checklist_id)
        REFERENCES checklists(id)
        ON DELETE CASCADE
);

CREATE TABLE task_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    task_id BIGINT NOT NULL,

    completed_by BIGINT,

    completed_at TIMESTAMP NULL,

    status ENUM(
        'PENDING',
        'COMPLETED'
    ) DEFAULT 'PENDING',

    FOREIGN KEY (task_id)
        REFERENCES checklist_tasks(id)
        ON DELETE CASCADE,

    FOREIGN KEY (completed_by)
        REFERENCES users(id)
        ON DELETE SET NULL
);

-- ==========================================
-- INVENTORY
-- ==========================================

CREATE TABLE inventory_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    business_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,
    sku VARCHAR(100),

    quantity INT DEFAULT 0,
    low_stock_limit INT DEFAULT 0,

    unit VARCHAR(20) DEFAULT 'pcs',

    purchase_price DECIMAL(12,2) DEFAULT 0,
    selling_price DECIMAL(12,2) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE
);

-- ==========================================
-- BILLING
-- ==========================================

CREATE TABLE bills (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    business_id BIGINT NOT NULL,

    customer_id BIGINT,

    bill_number VARCHAR(100) UNIQUE NOT NULL,

    total_amount DECIMAL(12,2) NOT NULL,

    bill_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (business_id)
        REFERENCES businesses(id)
        ON DELETE CASCADE,

    FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON DELETE SET NULL
);

CREATE TABLE bill_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    bill_id BIGINT NOT NULL,

    inventory_item_id BIGINT NULL,

    item_name VARCHAR(255) NOT NULL,

    quantity INT NOT NULL,

    unit VARCHAR(20) DEFAULT 'pcs',

    price DECIMAL(12,2) NOT NULL,

    subtotal DECIMAL(12,2) NOT NULL,

    item_source ENUM(
        'INVENTORY',
        'CUSTOM'
    ) DEFAULT 'CUSTOM',

    FOREIGN KEY (bill_id)
        REFERENCES bills(id)
        ON DELETE CASCADE,

    FOREIGN KEY (inventory_item_id)
        REFERENCES inventory_items(id)
        ON DELETE SET NULL
);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    user_id BIGINT NOT NULL,

    title VARCHAR(255) NOT NULL,

    message TEXT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ==========================================
-- INDEXES
-- ==========================================

CREATE INDEX idx_business_owner
ON businesses(owner_id);

CREATE INDEX idx_income_business_date
ON income(business_id, income_date);

CREATE INDEX idx_expense_business_date
ON expenses(business_id, expense_date);

CREATE INDEX idx_customers_business
ON customers(business_id);

CREATE INDEX idx_ledger_customer_date
ON ledger_entries(customer_id, entry_date);

CREATE INDEX idx_reminders_business_due
ON reminders(business_id, due_date);

CREATE INDEX idx_bills_business_date
ON bills(business_id, bill_date);

CREATE INDEX idx_inventory_business
ON inventory_items(business_id);

CREATE INDEX idx_notifications_user_read
ON notifications(user_id, is_read);