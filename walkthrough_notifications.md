# Notification Dropdown Implementation

## Updates
Implemented a "New & Hot" / Notification dropdown on the Navbar bell icon, replacing the mock data with real content from TMDB.

### Changes Implemented
1.  **New Component**: Created `src/components/layout/NotificationDropdown.tsx`.
    -   Fetches data from `requests.fetchNewOnNetflix` or `requests.fetchTrending`.
    -   Displays a scrollable list of recent items.
    -   Matches the dark Netflix UI theme.
2.  **Navbar Integration**: Updated `src/components/layout/Navbar.tsx`.
    -   Replaced mock notification list.
    -   Used `NotificationDropdown` component.
    -   Configured hover behavior to show the dropdown.

## Verification Plan

### Manual Usage
1.  Go to `/browse`.
2.  Hover over the **Bell Icon** in the top right navbar.
3.  **Verify**:
    -   A dropdown menu appears.
    -   It lists actual movies/shows (e.g., "Trending" or "New Entrants").
    -   Each item has a thumbnail, title, and "New Arrival" or similar text.
    -   The list is scrollable if long.
    -   The dropdown disappears when mouse leaves the notification area.

### Visuals
-   **Dark Theme**: Background is semi-transparent black (`rgba(0, 0, 0, 0.9)`).
-   **Scrollbar**: Custom styled dark scrollbar.
-   **Arrow Tip**: Small white arrow pointing to the bell icon.
