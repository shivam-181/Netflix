'use client';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Navbar from '@/components/layout/Navbar';
import tmdb, { requests, fetchLogo } from '@/lib/tmdb';
import ContentRow from '@/components/common/ContentRow';
import Footer from '@/components/layout/Footer';
import InfoModal from '@/components/common/InfoModal';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';

const PageContainer = styled.div`
    background-color: #141414;
    min-height: 100vh;
    padding-top: 70px; /* Navbar height */
    position: relative;
    overflow-x: hidden;
`;

const ContentStack = styled.div`
  position: relative;
  z-index: 10;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 2vw;
  margin-top: 20px;
`;

export default function LatestPage() {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();

    const [newOnNetflix, setNewOnNetflix] = useState<any[]>([]);
    const [trendingTV, setTrendingTV] = useState<any[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
    const [worthTheWait, setWorthTheWait] = useState<any[]>([]);
    const [comingThisWeek, setComingThisWeek] = useState<any[]>([]);
    const [comingNextWeek, setComingNextWeek] = useState<any[]>([]);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, isLoading, router]);

    useEffect(() => {
        const fetchContent = async () => {
            const today = new Date();
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            const weekAfter = new Date(nextWeek);
            weekAfter.setDate(nextWeek.getDate() + 7);

            const formatDate = (date: Date) => date.toISOString().split('T')[0];

            // Helper to fetch logos
            const enrichWithLogos = async (items: any[]) => {
                const promises = items.map(async (item) => {
                    try {
                        const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                        const logo = await fetchLogo(type, item.id);
                        return { ...item, logoPath: logo, media_type: type };
                    } catch { return item; }
                });
                return Promise.all(promises);
            };

            const mapData = (res: any, type?: string) => res.data.results.map((item: any) => ({
                ...item,
                _id: item.id.toString(),
                title: item.title || item.name,
                description: item.overview,
                thumbnailUrl: item.backdrop_path 
                    ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` 
                    : `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                media_type: type || item.media_type || (item.first_air_date ? 'tv' : 'movie'),
                ageRating: item.adult ? 'A' : 'U/A 16+',
            }));

            try {
                const [
                    newRes,
                    trendTVRes,
                    trendMovRes,
                    upcomingRes,
                    thisWeekMovRes,
                    thisWeekTVRes,
                    nextWeekMovRes,
                    nextWeekTVRes
                ] = await Promise.all([
                    tmdb.get(requests.fetchNewOnNetflix),
                    tmdb.get(requests.fetchTrendingTV),
                    tmdb.get(requests.fetchTrendingMovies),
                    tmdb.get('/movie/upcoming?region=US&sort_by=popularity.desc'),
                    // This Week
                    tmdb.get(`/discover/movie?primary_release_date.gte=${formatDate(today)}&primary_release_date.lte=${formatDate(nextWeek)}&sort_by=popularity.desc&with_original_language=en`),
                    tmdb.get(`/discover/tv?first_air_date.gte=${formatDate(today)}&first_air_date.lte=${formatDate(nextWeek)}&sort_by=popularity.desc&with_original_language=en`),
                    // Next Week
                    tmdb.get(`/discover/movie?primary_release_date.gte=${formatDate(nextWeek)}&primary_release_date.lte=${formatDate(weekAfter)}&sort_by=popularity.desc&with_original_language=en`),
                    tmdb.get(`/discover/tv?first_air_date.gte=${formatDate(nextWeek)}&first_air_date.lte=${formatDate(weekAfter)}&sort_by=popularity.desc&with_original_language=en`)
                ]);

                // Set Data with Logo Enrichment for crucial rows
                const newItems = mapData(newRes, 'tv');
                setNewOnNetflix(await enrichWithLogos(newItems));

                const topTV = mapData(trendTVRes, 'tv');
                setTrendingTV(await enrichWithLogos(topTV));

                const topMov = mapData(trendMovRes, 'movie');
                setTrendingMovies(await enrichWithLogos(topMov));

                setWorthTheWait(mapData(upcomingRes, 'movie'));

                const thisWeek = [...mapData(thisWeekMovRes, 'movie'), ...mapData(thisWeekTVRes, 'tv')].sort((a,b) => b.popularity - a.popularity);
                setComingThisWeek(thisWeek);

                const nextWeekItems = [...mapData(nextWeekMovRes, 'movie'), ...mapData(nextWeekTVRes, 'tv')].sort((a,b) => b.popularity - a.popularity);
                setComingNextWeek(nextWeekItems);

            } catch (e) {
                console.error("Error fetching latest content", e);
            }
        };

        if (user) fetchContent();
    }, [user]);

    if (isLoading || !user) return <div style={{ background: '#141414', minHeight: '100vh' }} />;

    return (
        <PageContainer>
            <Navbar />
            
            <ContentStack>
                <ContentRow title="New on Netflix" data={newOnNetflix} />
                <ContentRow title="Top 10 Shows in India Today" data={trendingTV.slice(0, 10)} isRanked={true} />
                <ContentRow title="Top 10 Movies in India Today" data={trendingMovies.slice(0, 10)} isRanked={true} />
                <ContentRow title="Worth the Wait" data={worthTheWait} />
                <ContentRow title="Coming This Week" data={comingThisWeek} />
                <ContentRow title="Coming Next Week" data={comingNextWeek} />
            </ContentStack>

            <Footer />
            <InfoModal />
        </PageContainer>
    );
}
