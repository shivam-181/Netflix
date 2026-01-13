# Fix HoverCard Scroll and Video

- [ ] Update `HoverCard` positioning to scroll with page. <!-- id: 0 -->
    - [ ] Change `position` from `fixed` to `absolute`. <!-- id: 1 -->
    - [ ] Update `top` calculation to `rect.top + window.scrollY`. <!-- id: 2 -->
    - [ ] Update `left` calculation to `rect.left + window.scrollX`. <!-- id: 3 -->
- [ ] Disable interactions on YouTube preview. <!-- id: 4 -->
    - [ ] Add transparent overlay or `pointer-events: none` to `YouTube` container. <!-- id: 5 -->
