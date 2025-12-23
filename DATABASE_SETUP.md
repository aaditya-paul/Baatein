# AI Companion Database Setup

## For New Databases

If you're setting up a fresh database, simply run the complete schema:

```bash
psql -h your-db-host -U your-user -d your-database -f lib/supabase/schema.sql
```

The schema already includes:

- `ai_interactions` column in the `entries` table
- `aiCompanionEnabled: true` default in profiles preferences

## For Existing Databases

If you have an existing Baatein database, you need to run the migration:

### Option 1: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `lib/supabase/migration-ai-companion.sql`
4. Paste into the SQL editor
5. Click **Run**

### Option 2: Using psql Command Line

```bash
psql -h your-db-host -U your-user -d your-database -f lib/supabase/migration-ai-companion.sql
```

### Option 3: Manual SQL Execution

Connect to your database and run:

```sql
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
```

## What the Migration Does

1. **Adds `ai_interactions` column** to the `entries` table

   - Type: `jsonb`
   - Purpose: Store encrypted AI companion interactions with each journal entry
   - Format: `[{mode, response, timestamp}]`

2. **Updates existing user preferences**

   - Sets `aiCompanionEnabled: true` for all existing users
   - Preserves existing preferences (like viewMode)

3. **Updates default preferences**
   - New users will have AI companion enabled by default

## Verification

After running the migration, verify it worked:

```sql
-- Check that ai_interactions column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'entries' AND column_name = 'ai_interactions';

-- Check that preferences have aiCompanionEnabled
SELECT preferences FROM profiles LIMIT 5;
```

Expected output for preferences:

```json
{
  "viewMode": "grid",
  "aiCompanionEnabled": true
}
```

## Rollback (If Needed)

If you need to undo the migration:

```sql
-- Remove ai_interactions column
ALTER TABLE entries DROP COLUMN IF EXISTS ai_interactions;

-- Remove aiCompanionEnabled from preferences (optional)
UPDATE profiles
SET preferences = preferences - 'aiCompanionEnabled';

-- Restore old default
ALTER TABLE profiles ALTER COLUMN preferences SET DEFAULT '{"viewMode": "grid"}'::jsonb;
```

## Notes

- The migration is **safe** - it uses `IF NOT EXISTS` to prevent errors if already applied
- Existing data is **preserved** - only new columns/fields are added
- AI companion will be **enabled by default** for all users after migration
- Users can still disable it via the toggle in the journal editor
- All AI interactions are **encrypted** before storage using the user's DEK
