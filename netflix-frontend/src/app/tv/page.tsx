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

// Sub-Header for TV Page
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

export default function TVPage() {
  const { user, isLoading } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const router = useRouter();
  const [billboardMovie, setBillboardMovie] = useState<any>(null);
  const [showGenres, setShowGenres] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Rows Data State
  const [trending, setTrending] = useState<any[]>([]);
  const [netflixOriginals, setNetflixOriginals] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [action, setAction] = useState<any[]>([]);
  const [comedy, setComedy] = useState<any[]>([]);
  const [doc, setDoc] = useState<any[]>([]);
  const [kdrama, setKdrama] = useState<any[]>([]);
  const [reality, setReality] = useState<any[]>([]);
  const [scifi, setScifi] = useState<any[]>([]);

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
        // TV Specific endpoints
        const [
            trendingRes,
            originalsRes, 
            topRatedRes,
            actionRes, 
            comedyRes, 
            docRes,
            kdramaRes,
            realityRes,
            scifiRes     
        ] = await Promise.all([
            tmdb.get(requests.fetchTrendingTV), 
            tmdb.get(requests.fetchNetflixOriginals),
            tmdb.get('/tv/top_rated?language=en-US'),
            tmdb.get('/discover/tv?with_genres=10759'),
            tmdb.get('/discover/tv?with_genres=35'),
            tmdb.get('/discover/tv?with_genres=99'),
            tmdb.get(requests.fetchKoreanDramas),
            tmdb.get(requests.fetchRealityTVShows),
            tmdb.get(requests.fetchSciFiFantasySeries),
        ]);
        
        // Map and filter (basic mapping)
        const mapRes = (res: any) => res.data.results.map((item: any) => ({
             ...item,
             _id: item.id?.toString(),
             thumbnailUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : item.poster_path,
             media_type: 'tv'
        }));

        // Helper to fetch logos and filter out items without them
        const fetchLogosAndFilter = async (items: any[]) => {
             const promises = items.map(async (item) => {
                 try {
                     const logo = await fetchLogo('tv', item.id);
                     if (logo) return { ...item, logoPath: logo };
                     return null;
                 } catch(e) { return null; }
             });
             const results = await Promise.all(promises);
             return results.filter(Boolean);
        };

        // Filter crucial rows (Originals & Trending usually have big cards where text looks bad)
        const originals = mapRes(originalsRes);
        const trendingItems = mapRes(trendingRes);
        
        // We do this in parallel effectively
        const [filteredOriginals, filteredTrending] = await Promise.all([
             fetchLogosAndFilter(originals),
             fetchLogosAndFilter(trendingItems)
        ]);

        setNetflixOriginals(filteredOriginals);
        setTrending(filteredTrending);

        // Standard rows - maybe acceptable without strict logo filtering for performance, 
        // or we can filter them too if user insists. For now, just map.
        setTopRated(mapRes(topRatedRes));
        setAction(mapRes(actionRes));
        setComedy(mapRes(comedyRes));
        setDoc(mapRes(docRes));
        setKdrama(mapRes(kdramaRes));
        setReality(mapRes(realityRes));
        setScifi(mapRes(scifiRes));

        // Pick distinct billboard from filtered list
        if (filteredOriginals.length > 0) {
            const random = filteredOriginals[Math.floor(Math.random() * filteredOriginals.length)];
            setBillboardMovie({
                ...random,
                backdropUrl: `https://image.tmdb.org/t/p/original${random.backdrop_path}`
            });
        } else {
             const random = originals[Math.floor(Math.random() * originals.length)];
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
            <PageTitle>TV Shows</PageTitle>
            
            <GenreDropdownContainer onMouseLeave={() => setShowGenres(false)}>
                <GenreButton onMouseEnter={() => setShowGenres(true)}>
                    Genres <FaCaretDown size={12} />
                </GenreButton>
                
                {showGenres && (
                    <GenreMenu>
                        <GenreColumn>
                            <span>Action</span>
                            <span>Anime</span>
                            <span>Asian</span>
                            <span>British</span>
                            <span>Comedies</span>
                            <span>Crime</span>
                        </GenreColumn>
                        <GenreColumn>
                            <span>Dramas</span>
                            <span>Docuseries</span>
                            <span>European</span>
                            <span>Family</span>
                            <span>Horror</span>
                            <span>Indian</span>
                        </GenreColumn>
                         <GenreColumn>
                            <span>Kids</span>
                            <span>Reality & Talk</span>
                            <span>Romance</span>
                            <span>Sci-Fi & Fantasy</span>
                            <span>Science & Nature</span>
                            <span>Teen</span>
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
                  genre: 'TV',
                  ageRating: 'UA'
              }))} 
           />
        )}
        <ContentRow title="Top 10 Shows in India Today" data={trending.slice(0, 10)} isRanked={true} />
        <ContentRow title="Trending Now" data={trending} />
        <ContentRow title="K-Dramas" data={kdrama} />
        <ContentRow title="Reality TV" data={reality} />
        <ContentRow title="Sci-Fi & Fantasy Series" data={scifi} />
        <ContentRow title="Top Rated TV Shows" data={topRated} />
        <ContentRow title="Action & Adventure TV" data={action} />
        <ContentRow title="TV Comedies" data={comedy} />
        <ContentRow title="Documentaries" data={doc} />
        <ContentRow title="Netflix Originals" data={netflixOriginals} isLargeRow />
        <Footer />
      </ContentStack>
      <InfoModal />
    </PageContainer>
  );
}
