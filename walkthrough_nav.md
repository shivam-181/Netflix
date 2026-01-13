# Profile Navigation Flow Update

## Changes
1.  **Backend Fix (Previous Step)**: Switched `PUT` to `PATCH` for profile updates to resolve 404 error.
2.  **Frontend Navigation**:
    *   Modified `EditProfilePage` (`src/app/settings/profile/edit/[id]/page.tsx`) to redirect to `/profiles?manage=true` after saving.
    *   Updated `ProfilesPage` (`src/app/profiles/page.tsx`) to:
        *   Detect `?manage=true` query parameter and auto-enable "Manage Profiles" mode.
        *   Update URL to `/profiles` (removing query param) when "Done" is clicked, switching view to "Who's Watching".

## Verification
1.  **Navigate to Edit Profile**: Go to a profile's edit page.
2.  **Save Changes**: Modify name and click Save.
3.  **Expect**: Redirect to "Manage Profiles" page (Grid with Edit overlays).
4.  **Click Done**:
5.  **Expect**: View switches to "Who's Watching" (Select Profile). URL updates to `/profiles`.
