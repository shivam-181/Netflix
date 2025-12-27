'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Billboard from '@/components/hero/Billboard'; // Optional in Latest, but usually keeps design consistent
import ContentRow from '@/components/common/ContentRow';
import Footer from '@/components/layout/Footer';
import tmdb, { requests, fetchLogo } from '@/lib/tmdb';
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

const PageTitle = styled.h1`
    font-size: 1.5rem;
    font-weight: 500;
    color: #e5e5e5;
    padding: 0 4%;
    margin-top: 100px;
    margin-bottom: -120px; /* Pull content up */
    position: relative;
    z-index: 20;
`;

export default function LatestPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  const [billboardMovie, setBillboardMovie] = useState<any>(null);

  // Rows Data State
  const [newReleases, setNewReleases] = useState<any[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [trendingTV, setTrendingTV] = useState<any[]>([]);
  const [newAction, setNewAction] = useState<any[]>([]);
  const [exciting, setExciting] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchContent = async () => {
        const [
            newRes,
            trendingRes, 
            upcomingRes,
            topRatedRes,
            trendingMoviesRes,
            trendingTVRes,
            newActionRes,
            excitingRes
        ] = await Promise.all([
            tmdb.get(requests.fetchNewOnNetflix || '/movie/now_playing?language=en-US'), 
            tmdb.get(requests.fetchTrending),
            tmdb.get('/movie/upcoming?language=en-US'),
            tmdb.get('/movie/top_rated?language=en-US'),
            tmdb.get(requests.fetchTrendingMovies),
            tmdb.get(requests.fetchTrendingTV),
            tmdb.get(requests.fetchNewActionMovies),
            tmdb.get(requests.fetchExcitingSeries),
        ]);
        
        // Map and filter (basic mapping)
        const mapRes = (res: any) => res.data.results.map((item: any) => ({
             ...item,
             _id: item.id?.toString(),
             thumbnailUrl: item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : item.poster_path,
             media_type: item.media_type || (item.first_air_date ? 'tv' : 'movie')
        }));

        setNewReleases(mapRes(newRes));
        setTrending(mapRes(trendingRes));
        setUpcoming(mapRes(upcomingRes));
        setTopRated(mapRes(topRatedRes));
        setTrendingMovies(mapRes(trendingMoviesRes));
        setTrendingTV(mapRes(trendingTVRes));
        setNewAction(mapRes(newActionRes));
        setExciting(mapRes(excitingRes));

        // Use a Trending item for Billboard
        const trend = mapRes(trendingRes);
        if (trend.length > 0) {
            const random = trend[Math.floor(Math.random() * trend.length)];
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
        
        {/* We reuse Billboard for visual consistency, or could just start with rows */}
        <Billboard movie={billboardMovie} />

      <ContentStack>
        <ContentRow title="Top 10 Movies in India Today" data={trendingMovies.slice(0, 10)} isRanked={true} />
        <ContentRow title="Top 10 Shows in India Today" data={trendingTV.slice(0, 10)} isRanked={true} />
        <ContentRow title="New on Netflix" data={newReleases} />
        <ContentRow title="Coming Soon" data={upcoming} />
        <ContentRow title="New Action Movies" data={newAction} />
        <ContentRow title="Exciting TV Shows" data={exciting} />
        <ContentRow title="Trending Now" data={trending} />
        <ContentRow title="Top Rated" data={topRated} />
        <Footer />
      </ContentStack>
      <InfoModal />
    </PageContainer>
  );
}
