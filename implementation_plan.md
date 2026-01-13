# Infinite Scroll Implementation Plan

## Goal
Make the content row scrolling "endless" (circular), so that scrolling past the last item seamlessly loops back to the first item (and vice versa).

## Strategy
Use the "Triple Set" technique:
1.  Render 3 copies of the data: `[Left Clones] [Real Data] [Right Clones]`.
2.  Initialize the scroll position to the start of the `[Real Data]` set (middle).
3.  Monitor `scrollLeft`.
    -   If the user scrolls into the `[Left Clones]` area, silently jump forward to the corresponding position in `[Real Data]`.
    -   If the user scrolls into the `[Right Clones]` area, silently jump backward to the corresponding position in `[Real Data]`.

## Proposed Changes

### `src/components/common/ContentRow.tsx`

1.  **Data Duplication:**
    -   Create `extendedData` concatenation of `[...data, ...data, ...data]`.
    -   Preserve the logic to calculate the *original* rank/index for display.

2.  **Scroll Logic (`handleScroll`):**
    -   Detect if `scrollLeft` is outside the middle bounds.
    -   Use `requestAnimationFrame` to perform silent jumps.
    -   Temporarily disable `scroll-behavior: smooth` on the container during jumps to prevent visual rollback.

3.  **Initialization:**
    -   On mount (or data change), set `scrollLeft` to the start of the middle set.
    -   Calculate `singleSetWidth` dynamically (approx `scrollWidth / 3`).

4.  **Rank Rendering:**
    -   Update the loop to calculate rank as `(index % originalLength) + 1`.

## Risks & Mitigations
-   **Jittery Jumps:** Ensure we disable smooth scrolling style specifically during the position reset, then re-enable it.
-   **Performance:** Rendering 3x items might be heavy if list is huge. Assuming lists are top 10 or reasonably sized (< 20 items usually). 3x is acceptable.
