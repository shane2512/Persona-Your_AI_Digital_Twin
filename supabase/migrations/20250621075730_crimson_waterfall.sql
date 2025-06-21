/*
  # Remove image attachments from reflections table

  1. Changes
    - Remove any image-related columns from reflections table
    - Clean up any image references in the database
  
  2. Security
    - No changes to RLS policies needed
*/

-- Remove image-related columns if they exist
DO $$
BEGIN
  -- Check and remove image_url column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reflections' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE reflections DROP COLUMN image_url;
  END IF;

  -- Check and remove image_data column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reflections' AND column_name = 'image_data'
  ) THEN
    ALTER TABLE reflections DROP COLUMN image_data;
  END IF;

  -- Check and remove attachment_url column if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reflections' AND column_name = 'attachment_url'
  ) THEN
    ALTER TABLE reflections DROP COLUMN attachment_url;
  END IF;

  -- Check and remove any other image-related columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reflections' AND column_name = 'attachments'
  ) THEN
    ALTER TABLE reflections DROP COLUMN attachments;
  END IF;
END $$;