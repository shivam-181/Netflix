'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function TitleManager() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let title = 'Netflix';

    if (pathname === '/') {
      title = 'Netflix India – Watch Shows Online, Watch Movies Online';
    } else if (pathname === '/browse') {
      title = 'Home – Netflix';
    } else if (pathname === '/tv' || pathname === '/shows') {
      title = 'TV Shows – Netflix';
    } else if (pathname === '/movies') {
      title = 'Movies – Netflix';
    } else if (pathname === '/latest' || pathname === '/new-popular') {
      title = 'New & Popular – Netflix';
    } else if (pathname === '/my-list') {
      title = 'My List – Netflix';
    } else if (pathname === '/profiles') {
      title = 'Profiles – Netflix';
    } else if (pathname?.startsWith('/watch')) {
      title = 'Now Playing – Netflix';
    } else if (pathname === '/search') {
      const query = searchParams?.get('q');
      if (query) {
        title = `Search Results for "${query}" – Netflix`;
      } else {
        title = 'Search – Netflix';
      }
    }

    document.title = title;
  }, [pathname, searchParams]);

  return null;
}
