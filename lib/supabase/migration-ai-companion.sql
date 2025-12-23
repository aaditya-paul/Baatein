-- Migration: Add AI companion support
-- Date: 2025-12-23

-- Add ai_interactions column to entries table
ALTER TABLE entries ADD COLUMN IF NOT EXISTS ai_interactions jsonb;

-- Update existing profiles to include aiCompanionEnabled preference (default true)
UPDATE profiles
SET preferences = jsonb_set(
  COALESCE(preferences, '{}'::jsonb),
  '{aiCompanionEnabled}',
  'true'::jsonb,
  true
)
WHERE preferences IS NULL OR NOT preferences ? 'aiCompanionEnabled';

-- Update default preferences for new profiles
ALTER TABLE profiles ALTER COLUMN preferences SET DEFAULT '{"viewMode": "grid", "aiCompanionEnabled": true}'::jsonb;

-- Add helpful comment
COMMENT ON COLUMN entries.ai_interactions IS 'Encrypted JSON array of AI companion interactions: [{mode, response, timestamp}]';
