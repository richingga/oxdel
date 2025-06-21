/*
  # Add additional fields to templates table

  1. New Columns
    - `description` (text, template description)
    - `tags` (varchar, comma-separated tags)
    - `featured` (boolean, is featured template)
    - `downloads` (int, download count)
    - `rating` (decimal, average rating)
    - `created_by` (int, admin who created)

  2. Indexes
    - Index on featured for featured templates query
    - Index on category and type for filtering
*/

DO $$
BEGIN
  -- Add description column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'templates' AND column_name = 'description'
  ) THEN
    ALTER TABLE templates ADD COLUMN description TEXT;
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'templates' AND column_name = 'tags'
  ) THEN
    ALTER TABLE templates ADD COLUMN tags VARCHAR(500);
  END IF;

  -- Add featured column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'templates' AND column_name = 'featured'
  ) THEN
    ALTER TABLE templates ADD COLUMN featured BOOLEAN DEFAULT FALSE;
  END IF;

  -- Add downloads column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'templates' AND column_name = 'downloads'
  ) THEN
    ALTER TABLE templates ADD COLUMN downloads INT DEFAULT 0;
  END IF;

  -- Add rating column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'templates' AND column_name = 'rating'
  ) THEN
    ALTER TABLE templates ADD COLUMN rating DECIMAL(3,2) DEFAULT 0.00;
  END IF;

  -- Add created_by column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'templates' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE templates ADD COLUMN created_by INT;
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_templates_featured ON templates(featured);
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);