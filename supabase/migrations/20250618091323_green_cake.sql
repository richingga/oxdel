/*
  # Create page views table for analytics

  1. New Tables
    - `page_views`
      - `id` (int, primary key, auto increment)
      - `page_id` (int, foreign key to pages table)
      - `ip_address` (varchar, visitor IP)
      - `user_agent` (text, browser info)
      - `visited_at` (timestamp, when visited)

  2. Indexes
    - Index on page_id for faster queries
    - Index on visited_at for date-based queries
    - Index on ip_address for unique visitor counting

  3. Foreign Keys
    - page_id references pages(id) with CASCADE delete
*/

CREATE TABLE IF NOT EXISTS page_views (
  id INT PRIMARY KEY AUTO_INCREMENT,
  page_id INT NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_page_views_page_id (page_id),
  INDEX idx_page_views_visited_at (visited_at),
  INDEX idx_page_views_ip (ip_address),
  
  FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);