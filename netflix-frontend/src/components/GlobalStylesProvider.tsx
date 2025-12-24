'use client';

import { Global } from '@emotion/react';
import { globalStyles } from '../styles/global';

export default function GlobalStylesProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Global styles={globalStyles} />
      {children}
    </>
  );
}