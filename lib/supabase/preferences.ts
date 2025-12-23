import { createClient } from "./client";

export interface UserPreferences {
  viewMode?: "grid" | "list";
  aiCompanionEnabled?: boolean;
  // Add more preferences here as needed
}

const DEFAULT_PREFERENCES: UserPreferences = {
  viewMode: "grid",
  aiCompanionEnabled: true,
};

/**
 * Load user preferences from the database
 * @returns User preferences object or default preferences if not found
 */
export async function loadPreferences(): Promise<UserPreferences> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return DEFAULT_PREFERENCES;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("preferences")
      .eq("id", user.id)
      .single();

    if (error || !data) {
      console.error("Error loading preferences:", error);
      return DEFAULT_PREFERENCES;
    }

    return { ...DEFAULT_PREFERENCES, ...data.preferences };
  } catch (err) {
    console.error("Failed to load preferences:", err);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Save user preferences to the database
 * @param preferences Partial preferences object to save (will be merged with existing)
 */
export async function savePreferences(
  preferences: Partial<UserPreferences>
): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("No user logged in");
      return false;
    }

    // Load current preferences first
    const currentPreferences = await loadPreferences();
    const updatedPreferences = { ...currentPreferences, ...preferences };

    const { error } = await supabase
      .from("profiles")
      .update({
        preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      console.error("Error saving preferences:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Failed to save preferences:", err);
    return false;
  }
}

/**
 * Update a specific preference value
 * @param key Preference key to update
 * @param value New value for the preference
 */
export async function updatePreference<K extends keyof UserPreferences>(
  key: K,
  value: UserPreferences[K]
): Promise<boolean> {
  return savePreferences({ [key]: value });
}
