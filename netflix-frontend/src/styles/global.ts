// src/styles/global.ts
import { css } from '@emotion/react';

export const globalStyles = css`
  :root {
    --netflix-red: #E50914;
    --netflix-black: #141414;
    --netflix-dark-gray: #181818;
    --netflix-light-gray: #b3b3b3;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: var(--netflix-black);
    color: white;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    overflow-x: hidden; /* Prevent horizontal scroll */
  }

  a {
    text-decoration: none;
    color: inherit;
  }
`;