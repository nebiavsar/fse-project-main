ALTER TABLE orders
ADD COLUMN customer_id BIGINT,
ADD CONSTRAINT fk_orders_customer
FOREIGN KEY (customer_id)
REFERENCES customers(customer_id);