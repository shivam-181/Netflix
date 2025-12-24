'use client';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useModalStore } from '@/store/useModalStore';
import InfoModal from '@/components/common/InfoModal';
import tmdb, { fetchLogo } from '@/lib/tmdb'; // Use direct TMDB if needed for search
import { ASSETS } from '@/constants/assets';
import HoverCard from '@/components/common/HoverCard';
import Footer from '@/components/layout/Footer';

const Container = styled.div`
  min-height: 100vh;
  background-color: #141414;
  padding-top: 80px;
  padding-left: 4%;
  padding-right: 4%;
`;

const MoreToExplore = styled.div`
  color: #808080;
  font-size: 0.9rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  line-height: 1.5;

  strong { margin-right: 5px; color: #666; font-weight: 400; font-size: 1rem; }

  span {
      padding-right: 12px;
      margin-right: 2px;
      border-right: 1px solid #444;
      cursor: pointer;
      color: white;
      white-space: nowrap;
      &:last-child { border: none; padding-right: 0; }
      &:hover { text-decoration: underline; }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(196px, 1fr));
  gap: 0.5px;
  grid-row-gap: 0.5px;
  padding-bottom: 20px;
`;

// Badges
const TopBadge = styled.div`
  position: absolute;
  top: 0;
  right: 10px;
  background: #db0000;
  color: white;
  font-weight: 700;
  font-size: 0.65rem;
  padding: 4px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  z-index: 5;

  span:first-of-type { font-size: 0.5rem; text-transform: uppercase; }
  span:last-of-type { font-size: 0.9rem; }
`;

const LabelBadge = styled.div<{ color?: string }>`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ color }) => color || '#db0000'};
  color: white;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  white-space: nowrap;
`;

const BottomBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #db0000;
  color: white;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  white-space: nowrap;
`;

const LiveBadgeContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const LiveRed = styled.div`
  background: #db0000;
  color: white;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
`;

const LiveDate = styled.div`
  background: rgba(255, 255, 255, 0.9);
  color: black;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
`;

const NewEpisodeContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 5;
`;

const NewEpBadge = styled.div`
  background: #db0000;
  color: white;
  padding: 2px 6px;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 2px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const WatchNowBadge = styled.div`
  background: white;
  color: black;
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 12px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  cursor: pointer;
`;

export default function SearchPage() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') || '';
  const query = rawQuery.toLowerCase();

  const [results, setResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const router = useRouter();
  
  // ... other state ...

  useEffect(() => {
    // Generate suggestions based on query
    const fetchSuggestions = async () => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        // Hardcoded overrides for screenshot fidelity
        if (query.includes('stranger') || query.includes('thing')) {
            setSuggestions([
                'Stand-Up Comedy', 'Stranger Things', 'Studio Ghibli', 'Steamy Movies', 
                'Lilo & Stitch', 'Stephen King', 'Stand Up', 
                'Star Wars: Episode IV: A New Hope', "It's a Strange World", 'Steamy'
            ]);
            return;
        } 
        
        if (query.includes('marvel')) {
             setSuggestions(['Marvel Studios', 'Captain Marvel', 'Marvel Anime', 'Lego Marvel']);
             return;
        }

        // Dynamic relevant suggestions from TMDB
        try {
            const res = await tmdb.get(`/search/keyword?query=${query}&page=1`);
            const keywords = res.data.results.slice(0, 10).map((k: any) => k.name);
            if (keywords.length > 0) {
                setSuggestions(keywords);
            } else {
                 // Fallbacks
                 setSuggestions(['TV Shows', 'Action Movies', 'Comedies', 'New Releases']);
            }
        } catch (err) {
            console.warn("Keyword fetch failed", err);
            setSuggestions([]);
        }
    };

    fetchSuggestions();
    
    // ... search logic (timer) starts here ...
    const timer = setTimeout(async () => {
      if (query && query.length > 0) {
        try {
          // 1. Try Local API first
          let data: any[] = [];
          try {
              const res = await api.get(`/content?search=${query}`);
              data = res.data;
          } catch (localErr) {
              console.warn("Local search failed, trying TMDB direct", localErr);
          }
          
          // 2. Fallback to TMDB id empty
          if (!data || data.length === 0) {
              const tmdbRes = await tmdb.get(`/search/multi?query=${query}&include_adult=false&language=en-US&page=1`);
              
              const mapTmdbItem = (item: any) => ({
                  _id: item.id,
                  title: item.title || item.name,
                  thumbnailUrl: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
                  backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
                  overview: item.overview,
                  type: item.media_type || 'movie',
                  vote_average: item.vote_average,
                  first_air_date: item.first_air_date,
                  release_date: item.release_date
              });

              let tmdbResults = tmdbRes.data.results
                .filter((item: any) => item.media_type !== 'person' && (item.backdrop_path || item.poster_path))
                .map(mapTmdbItem);

              // 3. ENRICHMENT: Massive Content Injection (Top 10 Recs + Trending + Popular)
              if (tmdbResults.length > 0) {
                  const topMatches = tmdbResults.slice(0, 10);
                  try {
                      const promises = [
                          // 1. Specific Recommendations
                          ...topMatches.map((item: any) => 
                             tmdb.get(`/${item.type}/${item._id}/recommendations?language=en-US&page=1`)
                                 .catch(() => ({ data: { results: [] } }))
                          ),
                          // 2. Trending (Mix)
                          tmdb.get('/trending/all/week?language=en-US').catch(() => ({ data: { results: [] } })),
                          // 3. Popular Movies
                          tmdb.get('/discover/movie?sort_by=popularity.desc&language=en-US&page=1').catch(() => ({ data: { results: [] } })),
                          // 4. Popular TV
                          tmdb.get('/discover/tv?sort_by=popularity.desc&language=en-US&page=1').catch(() => ({ data: { results: [] } }))
                      ];
                      
                      const responses = await Promise.all(promises);
                      let allRecs: any[] = [];
                      
                      responses.forEach((res: any) => {
                          if (res.data && res.data.results) {
                              const mapped = res.data.results
                                  .filter((item: any) => item.backdrop_path || item.poster_path)
                                  .map((item: any) => {
                                      // Force type for TV discover if needed, but mapTmdbItem helps.
                                      // Actually explicitly checking name vs title helps mapTmdbItem decide, 
                                      // but strictly speaking discover/tv doesn't return media_type: 'tv'.
                                      let type = item.media_type;
                                      if (!type) {
                                          if (item.first_air_date) type = 'tv';
                                          else type = 'movie';
                                      }
                                      return mapTmdbItem({ ...item, media_type: type });
                                  });
                              allRecs = [...allRecs, ...mapped];
                          }
                      });
                      
                      // Filter duplicates
                      const existingIds = new Set(tmdbResults.map((i: any) => i._id));
                      const uniqueRecs = allRecs.filter((i: any) => {
                          if (existingIds.has(i._id)) return false;
                          existingIds.add(i._id);
                          return true;
                      });
                      
                      tmdbResults = [...tmdbResults, ...uniqueRecs];
                  } catch (recErr) {
                      console.warn("Failed to enrichment", recErr);
                  }
              }

              data = tmdbResults;
          }

          setResults(data);

          // 4. Fetch Logos for nicer UI (for top 20 to avoid rate limits/slow load on massive lists)
          const enriched = await Promise.all(data.slice(0, 20).map(async (item: any) => {
               if ((item.type === 'movie' || item.type === 'tv') && item._id) {
                   const logoPath = await fetchLogo(item.type, item._id);
                   if (logoPath) {
                       return { ...item, logoPath: logoPath };
                   }
               }
               return item;
          }));
          
          // Merge enriched items back into data preserving order and keeping non-enriched items
          const finalData = [...enriched, ...data.slice(20)];
          setResults(finalData);

        } catch (err) {
          console.error("Search failed completely", err);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

// New Badges from Screenshot
const BottomBadge = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #db0000;
  color: white;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  white-space: nowrap;
`;

const LiveBadgeContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  z-index: 5;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const LiveRed = styled.div`
  background: #db0000;
  color: white;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
`;

const LiveDate = styled.div`
  background: rgba(255, 255, 255, 0.9);
  color: black;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
`;

const NewEpisodeContainer = styled.div`
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 5;
`;

const NewEpBadge = styled.div`
  background: #db0000;
  color: white;
  padding: 2px 6px;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 2px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
`;

const WatchNowBadge = styled.div`
  background: white;
  color: black;
  padding: 2px 8px;
  font-size: 0.65rem;
  font-weight: 700;
  border-radius: 12px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
  cursor: pointer;
`;

  // Helper to randomize badges for visual fidelity to screenshot
  const getBadge = (index: number) => {
       if (index === 0) return { type: 'NEW_SEASON' }; // Stranger Things in screenshot
       if (index === 2) return { type: 'NEW_SEASON' };
       if (index === 3) return { type: 'LIVE', date: '1/21' }; // Star Search
       if (index === 4) return { type: 'RECENTLY_ADDED' };
       if (index === 5) return { type: 'TOP_10' };
       if (index === 6) return { type: 'NEW_EPISODE' };
       if (index === 7) return { type: 'LEAVING_SOON' };
       return null;
  };

  return (
    <main>
      <Container>
        {suggestions.length > 0 && (
            <MoreToExplore>
                <strong>More to explore:</strong>
                {suggestions.map(s => (
                    <span key={s} onClick={() => router.push(`/search?q=${encodeURIComponent(s)}`)}>
                        {s}
                    </span>
                ))}
            </MoreToExplore>
        )}
        
        {/* If no query, show prompt. If query exists but no results, show nothing (or loading) */}
        {!query && <p style={{color: 'grey'}}>Type to search...</p>}
        {query && results.length === 0 && <p style={{color: 'grey'}}>No results found for "{query}".</p>}

        <Grid>
          {results
            .filter(item => item.backdropUrl || item.thumbnailUrl) // Ensure image exists
            .map((item, idx) => {
             const badge = getBadge(idx);
             return (
                 <HoverCard 
                    key={item._id || idx} 
                    item={item} 
                    bottomOffset={
                        (badge?.type === 'NEW_SEASON' || 
                         badge?.type === 'LIVE' || 
                         badge?.type === 'NEW_EPISODE' || 
                         badge?.type === 'RECENTLY_ADDED' || 
                         badge?.type === 'LEAVING_SOON') 
                        ? '32px' : '0'
                    }
                 >
                    {badge?.type === 'TOP_10' && (
                        <TopBadge>
                            <span>TOP</span>
                            <span>10</span>
                        </TopBadge>
                    )}

                    {badge?.type === 'RECENTLY_ADDED' && (
                        <LabelBadge color="#db0000">Recently Added</LabelBadge>
                    )}

                    {badge?.type === 'LEAVING_SOON' && (
                        <LabelBadge color="#e50914">Leaving Soon</LabelBadge>
                    )}

                    {badge?.type === 'NEW_SEASON' && (
                         <BottomBadge>New Season</BottomBadge>
                    )}

                    {badge?.type === 'LIVE' && (
                         <LiveBadgeContainer>
                             <LiveRed>Live</LiveRed>
                             <LiveDate>{badge.date}</LiveDate>
                         </LiveBadgeContainer>
                    )}

                    {badge?.type === 'NEW_EPISODE' && (
                         <NewEpisodeContainer>
                             <NewEpBadge>New Episode</NewEpBadge>
                             <WatchNowBadge>Watch Now</WatchNowBadge>
                         </NewEpisodeContainer>
                    )}
                 </HoverCard>
             );
          })}
        </Grid>
      </Container>
      <Footer />
      <InfoModal />
    </main>
  );
}
