'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import Billboard from '@/components/hero/Billboard';
import ContentRow from '@/components/common/ContentRow';
import Footer from '@/components/layout/Footer';
import tmdb, { requests, fetchLogo } from '@/lib/tmdb';
import { FaCaretDown, FaList, FaThLarge } from 'react-icons/fa';
import InfoModal from '@/components/common/InfoModal';

const PageContainer = styled.div`
  background-color: #141414;
  min-height: 100vh;
  position: relative;
`;

const ContentStack = styled.div`
  position: relative;
  z-index: 10;
  margin-top: -70px; 
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 3vw;
`;

// Sub-Header for Movies Page
const SubHeader = styled.div<{ isScrolled: boolean }>`
    position: fixed;
    top: 68px; /* Below main navbar */
    left: 0;
    width: 100%;
    height: 68px;
    z-index: 90; 
    display: flex;
    align-items: center;
    padding: 0 4%;
    background: ${props => props.isScrolled ? '#141414' : 'transparent'};
    transition: background 0.4s;
`;

const PageTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-right: 30px;
`;

const GenreDropdownContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`;

const GenreButton = styled.button`
    background: black;
    border: 1px solid white;
    color: white;
    padding: 5px 15px;
    font-size: 0.9rem;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 15px;
    
    &:hover { background: rgba(255,255,255,0.1); }
`;

const GenreMenu = styled.div`
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(0,0,0,0.95);
    border: 1px solid #333;
    padding: 20px;
    display: flex;
    gap: 40px;
    min-width: 450px;
    margin-top: 5px;
`;

const GenreColumn = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    span {
        color: #e5e5e5;
        font-size: 0.9rem;
        cursor: pointer;
        &:hover { text-decoration: underline; }
    }
`;

const RightControls = styled.div`
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 20px;
    color: white;
`;

const ToggleBtn = styled.button`
    background: transparent;
    border: 1px solid #333;
    color: white;
    padding: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover { border-color: white; }
`;

export default function MoviesPage() {
  const { user, isLoading } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const router = useRouter();
  const [billboardMovie, setBillboardMovie] = useState<any>(null);
  const [showGenres, setShowGenres] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Rows Data State
  const [trending, setTrending] = useState<any[]>([]);
  const [action, setAction] = useState<any[]>([]);
  const [comedy, setComedy] = useState<any[]>([]);
  const [scary, setScary] = useState<any[]>([]);
  const [romance, setRomance] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [scifi, setScifi] = useState<any[]>([]);
  const [suspense, setSuspense] = useState<any[]>([]);
  const [family, setFamily] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
        // Movies Specific endpoints
        const [
            trendingRes,
            topRatedRes,
            actionRes, 
            comedyRes, 
            horrorRes,
            romanceRes,
            scifiRes,
            suspenseRes,
            familyRes
        ] = await Promise.all([
            // Use movie specific trending if possible, usually '/trending/movie/week' in tmdb.ts or requests
            tmdb.get(requests.fetchTrendingMovies),  // Use specific Movies Today request
            tmdb.get('/movie/top_rated?language=en-US'),
            tmdb.get('/discover/movie?with_genres=28'),
            tmdb.get('/discover/movie?with_genres=35'),
            tmdb.get('/discover/movie?with_genres=27'),
            tmdb.get('/discover/movie?with_genres=10749'),
            tmdb.get(requests.fetchSciFiHalo),
            tmdb.get(requests.fetchSuspenseThriller),
            tmdb.get(requests.fetchFamilyNights),
        ]);
        
        // Map and filter (basic mapping)
        const mapRes = (res: any) => res.data.results.map((item: any) => ({
             ...item,
             _id: item.id?.toString(),
             thumbnailUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : item.poster_path,
             media_type: 'movie'
        }));

        // Helper to fetch logos and filter out items without them
        const fetchLogosAndFilter = async (items: any[]) => {
             const promises = items.map(async (item) => {
                 try {
                     const logo = await fetchLogo('movie', item.id);
                     if (logo) return { ...item, logoPath: logo };
                     return null;
                 } catch(e) { return null; }
             });
             const results = await Promise.all(promises);
             return results.filter(Boolean);
        };

        // Filter crucial rows (Trending usually has big cards)
        const trendingItems = mapRes(trendingRes);
        
        // We do this in parallel effectively
        const [filteredTrending] = await Promise.all([
             fetchLogosAndFilter(trendingItems)
        ]);

        setTrending(filteredTrending);

        // Standard rows
        setTopRated(mapRes(topRatedRes));
        setAction(mapRes(actionRes));
        setComedy(mapRes(comedyRes));
        setScary(mapRes(horrorRes));
        setRomance(mapRes(romanceRes));
        setScifi(mapRes(scifiRes));
        setSuspense(mapRes(suspenseRes));
        setFamily(mapRes(familyRes));

        // Pick distinct billboard from filtered list
        if (filteredTrending.length > 0) {
            const random = filteredTrending[Math.floor(Math.random() * filteredTrending.length)];
            setBillboardMovie({
                ...random,
                backdropUrl: `https://image.tmdb.org/t/p/original${random.backdrop_path}`
            });
        } else {
             const random = trendingItems[Math.floor(Math.random() * trendingItems.length)];
             setBillboardMovie({
                ...random,
                backdropUrl: `https://image.tmdb.org/t/p/original${random.backdrop_path}`
             });
        }
    };

    if (user) fetchContent();
  }, [user]);

  if (isLoading || !user) return <div style={{ background: '#141414', minHeight: '100vh' }} />;

  return (
    <PageContainer>
        {/* Helper Sub-Header - Visible on top of Billboard */}
        <SubHeader isScrolled={isScrolled}>
            <PageTitle>Movies</PageTitle>
            
            <GenreDropdownContainer onMouseLeave={() => setShowGenres(false)}>
                <GenreButton onMouseEnter={() => setShowGenres(true)}>
                    Genres <FaCaretDown size={12} />
                </GenreButton>
                
                {showGenres && (
                    <GenreMenu>
                        <GenreColumn>
                            <span>Action</span>
                            <span>Anime</span>
                            <span>Classic</span>
                            <span>Comedies</span>
                            <span>Crime</span>
                            <span>Cult Movies</span>
                        </GenreColumn>
                        <GenreColumn>
                             <span>Documentaries</span>
                            <span>Dramas</span>
                            <span>Faith & Spirituality</span>
                            <span>Horror</span>
                            <span>Independent</span>
                            <span>International</span>
                        </GenreColumn>
                         <GenreColumn>
                            <span>Kids & Family</span>
                            <span>Music & Musicals</span>
                            <span>Romance</span>
                            <span>Sci-Fi & Fantasy</span>
                            <span>Sports</span>
                            <span>Thrillers</span>
                        </GenreColumn>
                    </GenreMenu>
                )}
            </GenreDropdownContainer>

            <RightControls>
                <ToggleBtn><FaList size={14} /></ToggleBtn>
                <ToggleBtn><FaThLarge size={14} /></ToggleBtn>
            </RightControls>
        </SubHeader>

        <Billboard movie={billboardMovie} />

      <ContentStack>
        {currentProfile && currentProfile.watchHistory && currentProfile.watchHistory.length > 0 && (
           <ContentRow 
              title={`Continue Watching for ${currentProfile.name}`} 
              data={currentProfile.watchHistory.map(h => ({
                  _id: h.contentId,
                  id: Number(h.contentId), 
                  title: h.title || 'Resume Playing',
                  thumbnailUrl: h.thumbnailUrl || '', 
                  progress: h.progress,
                  duration: `${Math.floor(h.duration / 60)}m`,
                  description: '', 
                  genre: 'Movie',
                  ageRating: 'UA'
              }))} 
           />
        )}
        <ContentRow title="Top 10 Movies in India Today" data={trending.slice(0, 10)} isRanked={true} />
        <ContentRow title="Trending Now" data={trending} />
        <ContentRow title="Mind-Bending Sci-Fi" data={scifi} />
        <ContentRow title="Suspenseful Thrillers" data={suspense} />
        <ContentRow title="Action Thrillers" data={action} />
        <ContentRow title="Top Rated Movies" data={topRated} />
        <ContentRow title="Comedy Movies" data={comedy} />
        <ContentRow title="Scary Movies" data={scary} />
        <ContentRow title="Romantic Favorites" data={romance} />
        <ContentRow title="Family Movie Night" data={family} />
        <Footer />
      </ContentStack>
      <InfoModal />
    </PageContainer>
  );
}
