'use client';
import { useEffect, useState } from 'react';
import Billboard from '@/components/hero/Billboard';
import ContentRow from '@/components/common/ContentRow';
import Footer from '@/components/layout/Footer';
import api from '@/lib/axios'; // Keep for My List
import tmdb, { requests } from '@/lib/tmdb';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import InfoModal from '@/components/common/InfoModal';

export default function BrowsePage() {
  const { currentProfile, isLoading: profileLoading } = useProfileStore();
  const router = useRouter();
  
  const [trending, setTrending] = useState<any[]>([]);
  const [topRated, setTopRated] = useState<any[]>([]);
  const [netflixOriginals, setNetflixOriginals] = useState<any[]>([]);
  const [actionMovies, setActionMovies] = useState<any[]>([]);
  const [comedyMovies, setComedyMovies] = useState<any[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<any[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<any[]>([]);
  const [documentaries, setDocumentaries] = useState<any[]>([]);
  const [newOnNetflix, setNewOnNetflix] = useState<any[]>([]);
  const [crowdPleasers, setCrowdPleasers] = useState<any[]>([]);
  const [topSearches, setTopSearches] = useState<any[]>([]);
  const [usMovies, setUsMovies] = useState<any[]>([]);
  const [strangerThingsRecs, setStrangerThingsRecs] = useState<any[]>([]);
  const [excitingTV, setExcitingTV] = useState<any[]>([]);
  const [psychologicalThrillers, setPsychologicalThrillers] = useState<any[]>([]);
  
  const [thrillers, setThrillers] = useState<any[]>([]);
  const [millennialTV, setMillennialTV] = useState<any[]>([]);
  const [usWorkplaceTV, setUsWorkplaceTV] = useState<any[]>([]);
  const [watchItAgain, setWatchItAgain] = useState<any[]>([]);
  const [bingeWorthyTV, setBingeWorthyTV] = useState<any[]>([]);
  const [awardWinningTV, setAwardWinningTV] = useState<any[]>([]);
  const [hollywoodDramas, setHollywoodDramas] = useState<any[]>([]);
  const [basedOnBooks, setBasedOnBooks] = useState<any[]>([]);
  const [tvThrillersMysteries, setTVThrillersMysteries] = useState<any[]>([]);
  const [teenComingOfAge, setTeenComingOfAge] = useState<any[]>([]);
  const [darkRecommendations, setDarkRecommendations] = useState<any[]>([]);
  
  const [hiddenGems, setHiddenGems] = useState<any[]>([]);
  const [anime, setAnime] = useState<any[]>([]);
  const [kDramas, setKDramas] = useState<any[]>([]);
  const [familyMovies, setFamilyMovies] = useState<any[]>([]);
  const [sciFiFantasy, setSciFiFantasy] = useState<any[]>([]);
  const [acclaimed, setAcclaimed] = useState<any[]>([]);
  const [historical, setHistorical] = useState<any[]>([]);
  const [crimeTV, setCrimeTV] = useState<any[]>([]);
  const [realityTV, setRealityTV] = useState<any[]>([]);
  const [blockbusterAction, setBlockbusterAction] = useState<any[]>([]);
  
  // Phase 3 States
  const [westerns, setWesterns] = useState<any[]>([]);
  const [martialArts, setMartialArts] = useState<any[]>([]);
  const [epicFantasy, setEpicFantasy] = useState<any[]>([]);
  const [cyberpunk, setCyberpunk] = useState<any[]>([]);
  const [standUp, setStandUp] = useState<any[]>([]);
  const [britishTV, setBritishTV] = useState<any[]>([]);
  const [miniseries, setMiniseries] = useState<any[]>([]);
  const [zombie, setZombie] = useState<any[]>([]);
  const [vampire, setVampire] = useState<any[]>([]);
  const [spyThrillers, setSpyThrillers] = useState<any[]>([]);
  const [courtroom, setCourtroom] = useState<any[]>([]);
  const [periodRomance, setPeriodRomance] = useState<any[]>([]);
  const [supernaturalHorror, setSupernaturalHorror] = useState<any[]>([]);
  const [nostalgia90s, setNostalgia90s] = useState<any[]>([]);
  const [hits80s, setHits80s] = useState<any[]>([]);
  const [cultClassics, setCultClassics] = useState<any[]>([]);
  const [darkComedies, setDarkComedies] = useState<any[]>([]);
  const [politicalThrillers, setPoliticalThrillers] = useState<any[]>([]);
  const [roadTrip, setRoadTrip] = useState<any[]>([]);
  const [tearjerkers, setTearjerkers] = useState<any[]>([]);
  const [mindBending, setMindBending] = useState<any[]>([]);
  const [slasher, setSlasher] = useState<any[]>([]);
  const [musicals, setMusicals] = useState<any[]>([]);
  const [sportsDramas, setSportsDramas] = useState<any[]>([]);
  const [warPeace, setWarPeace] = useState<any[]>([]);
  const [gangster, setGangster] = useState<any[]>([]);
  const [spaceOperas, setSpaceOperas] = useState<any[]>([]);
  const [creatureFeatures, setCreatureFeatures] = useState<any[]>([]);
  const [highSchool, setHighSchool] = useState<any[]>([]);
  const [women, setWomen] = useState<any[]>([]);
  
  const [myListContent, setMyListContent] = useState<any[]>([]);
  const [randomMovie, setRandomMovie] = useState<any>(null);

  // Protection
  useEffect(() => {
    if (!profileLoading && !currentProfile) {
      router.push('/profiles');
    }
  }, [currentProfile, profileLoading, router]);

  // Fetch TMDB Data
  useEffect(() => {
    const fetchTMDB = async () => {
      // Helper to map TMDB to our internal format
      const mapData = (results: any[], type?: 'movie' | 'tv') => {
        return results
            .filter(item => item.backdrop_path || item.poster_path) // STRICT FILTERING
            .map(item => ({
                _id: item.id.toString(),
                id: item.id, 
                title: item.title || item.name,
                description: item.overview,
                thumbnailUrl: item.backdrop_path 
                    ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` 
                    : `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                genre: 'Movie', 
                media_type: type || item.media_type || (item.first_air_date ? 'tv' : 'movie'), // Infer type
                ageRating: item.adult ? '18+' : 'UA',
                duration: 'N/A', 
                ...item 
            }));
      };

      const fetchRow = async (url: string, setter: Function, type?: 'movie' | 'tv', filterFn?: (item: any) => boolean) => {
         try {
             const res = await tmdb.get(url);
             let mapped = mapData(res.data.results, type);
             if (filterFn) mapped = mapped.filter(filterFn);
             setter(mapped);
             return mapped; // Return MAPPED data
         } catch (e) { console.error("TMDB Fetch Error", e); return []; }
      };

      // Parallel Fetch
      const [originals, trend] = await Promise.all([
          fetchRow(requests.fetchNetflixOriginals, setNetflixOriginals, 'tv'),
          fetchRow(requests.fetchTrending, setTrending, undefined, (item) => 
                !item.title.includes('Avatar: Fire and Ash') && 
                !item.title.includes('Sisu')
          ), 
          fetchRow(requests.fetchTopRated, setTopRated, 'movie'),
          fetchRow(requests.fetchActionMovies, setActionMovies, 'movie'),
          fetchRow(requests.fetchComedyMovies, setComedyMovies, 'movie'),
          fetchRow(requests.fetchHorrorMovies, setHorrorMovies, 'movie'),
          fetchRow(requests.fetchRomanceMovies, setRomanceMovies, 'movie'),
          fetchRow(requests.fetchDocumentaries, setDocumentaries, 'movie'),
          fetchRow(requests.fetchNewOnNetflix, setNewOnNetflix, 'tv'),
          fetchRow(requests.fetchCrowdPleasers, setCrowdPleasers, 'movie'),
          fetchRow(requests.fetchTopSearches, setTopSearches),
          fetchRow(requests.fetchUSMovies, setUsMovies, 'movie'),
          fetchRow(requests.fetchStrangerThingsRecommendations, setStrangerThingsRecs, 'tv'),
          fetchRow(requests.fetchExcitingTV, setExcitingTV, 'tv'),
          fetchRow(requests.fetchExcitingTV, setExcitingTV, 'tv'),
          fetchRow(requests.fetchPsychologicalThrillers, setPsychologicalThrillers, 'movie'),
          fetchRow(requests.fetchThrillers, setThrillers, 'movie'),
          fetchRow(requests.fetchMillennialTV, setMillennialTV, 'tv'),
          fetchRow(requests.fetchUSWorkplaceTV, setUsWorkplaceTV, 'tv'),
          fetchRow(requests.fetchWatchItAgain, setWatchItAgain, 'movie'),
          fetchRow(requests.fetchBingeWorthyTV, setBingeWorthyTV, 'tv'),
          fetchRow(requests.fetchAwardWinningTV, setAwardWinningTV, 'tv'),
          fetchRow(requests.fetchHollywoodDramas, setHollywoodDramas, 'movie'),
          fetchRow(requests.fetchBasedOnBooks, setBasedOnBooks, 'tv'),
          fetchRow(requests.fetchTVThrillersMysteries, setTVThrillersMysteries, 'tv'),
          fetchRow(requests.fetchTeenComingOfAge, setTeenComingOfAge, 'tv'),
          fetchRow(requests.fetchDarkRecommendations, setDarkRecommendations, 'tv'),
          fetchRow(requests.fetchHiddenGems, setHiddenGems, 'movie'),
          fetchRow(requests.fetchAnime, setAnime, 'tv'),
          fetchRow(requests.fetchKDramas, setKDramas, 'tv'),
          fetchRow(requests.fetchFamilyMovies, setFamilyMovies, 'movie'),
          fetchRow(requests.fetchSciFiFantasyTV, setSciFiFantasy, 'tv'),
          fetchRow(requests.fetchCriticallyAcclaimed, setAcclaimed, 'movie'),
          fetchRow(requests.fetchHistoricalDramas, setHistorical, 'tv'),
          fetchRow(requests.fetchCrimeTV, setCrimeTV, 'tv'),
          fetchRow(requests.fetchRealityTV, setRealityTV, 'tv'),
          fetchRow(requests.fetchBlockbusterAction, setBlockbusterAction, 'movie'),
          // Phase 3 Fetches
          fetchRow(requests.fetchWesterns, setWesterns, 'movie'),
          fetchRow(requests.fetchMartialArts, setMartialArts, 'movie'),
          fetchRow(requests.fetchEpicFantasy, setEpicFantasy, 'movie'),
          fetchRow(requests.fetchCyberpunk, setCyberpunk, 'movie'),
          fetchRow(requests.fetchStandUpComedy, setStandUp, 'tv'),
          fetchRow(requests.fetchBritishTV, setBritishTV, 'tv'),
          fetchRow(requests.fetchMiniseries, setMiniseries, 'tv'),
          fetchRow(requests.fetchZombieApocalypse, setZombie, 'movie'),
          fetchRow(requests.fetchVampireChronicles, setVampire, 'movie'),
          fetchRow(requests.fetchSpyThrillers, setSpyThrillers, 'movie'),
          fetchRow(requests.fetchCourtroomDramas, setCourtroom, 'movie'),
          fetchRow(requests.fetchPeriodRomances, setPeriodRomance, 'movie'),
          fetchRow(requests.fetchSupernaturalHorror, setSupernaturalHorror, 'movie'),
          fetchRow(requests.fetch90sNostalgia, setNostalgia90s, 'movie'),
          fetchRow(requests.fetch80sHits, setHits80s, 'movie'),
          fetchRow(requests.fetchCultClassics, setCultClassics, 'movie'),
          fetchRow(requests.fetchDarkComedies, setDarkComedies, 'movie'),
          fetchRow(requests.fetchPoliticalThrillers, setPoliticalThrillers, 'movie'),
          fetchRow(requests.fetchRoadTrip, setRoadTrip, 'movie'),
          fetchRow(requests.fetchTearjerkers, setTearjerkers, 'movie'),
          fetchRow(requests.fetchMindBendingSciFi, setMindBending, 'movie'),
          fetchRow(requests.fetchSlasherMovies, setSlasher, 'movie'),
          fetchRow(requests.fetchMusicals, setMusicals, 'movie'),
          fetchRow(requests.fetchSportsDramas, setSportsDramas, 'movie'),
          fetchRow(requests.fetchWarAndPeace, setWarPeace, 'movie'),
          fetchRow(requests.fetchGangsterMovies, setGangster, 'movie'),
          fetchRow(requests.fetchSpaceOperas, setSpaceOperas, 'movie'),
          fetchRow(requests.fetchCreatureFeatures, setCreatureFeatures, 'movie'),
          fetchRow(requests.fetchHighSchoolDrama, setHighSchool, 'movie'),
          fetchRow(requests.fetchWomenInCharge, setWomen, 'tv'),
      ]);

      // Set Billboard Random from Originals or Trending
      const pool = originals && originals.length > 0 ? originals : trend;
      if (pool && pool.length > 0) {
          const random = pool[Math.floor(Math.random() * pool.length)];
          setRandomMovie({
              ...random,
              thumbnailUrl: `https://image.tmdb.org/t/p/original${random.backdrop_path}`
          });
      }
    };

    fetchTMDB();
  }, []);

  // Fetch My List (Local Backend)
  useEffect(() => {
      if (!currentProfile) return;
      const fetchMyList = async () => {
         try {
             // This might return empty if using local backend without TMDB support
             const listRes = await api.get(`/profiles/${currentProfile._id}/list`);
             setMyListContent(listRes.data);
         } catch (err) {
             console.error("My List Fetch Error", err);
         }
      };
      fetchMyList();
  }, [currentProfile]);

  return (
    <main style={{ backgroundColor: '#141414', minHeight: '100vh', paddingBottom: '50px', overflowX: 'hidden' }}>
      <Billboard movie={randomMovie} />
      
      <div style={{ position: 'relative', zIndex: 10, paddingBottom: '20px', marginTop: '-50px', paddingTop: '50px' }}>
        {currentProfile && currentProfile.watchHistory && currentProfile.watchHistory.length > 0 && (
           <ContentRow 
              title={`Continue Watching for ${currentProfile.name}`} 
              data={currentProfile.watchHistory.map(h => ({
                  _id: h.contentId,
                  id: Number(h.contentId), 
                  title: h.title || 'Resume Playing',
                  thumbnailUrl: h.thumbnailUrl || '', 
                  progress: h.progress,
                  duration: `${Math.floor(h.duration / 60)}m`, // Convert to string
                  description: '', // Placeholder
                  genre: 'History', // Placeholder
                  ageRating: 'UA' // Placeholder
              }))} 
           />
        )}
        <ContentRow title="Trending Now" data={trending} />
        <ContentRow title="Netflix Originals" data={netflixOriginals} />
        <ContentRow title="Top Rated" data={topRated} />
        <ContentRow title="Action Thrillers" data={actionMovies} />
        <ContentRow title="New on Netflix" data={newOnNetflix} />
        <ContentRow title="Crowd Pleasers" data={crowdPleasers} />
        <ContentRow title="Top Searches" data={topSearches} />
        <ContentRow title="US Movies" data={usMovies} />
        <ContentRow title="Because you watched Stranger Things" data={strangerThingsRecs} />
        <ContentRow title="Exciting TV Shows" data={excitingTV} />
        <ContentRow title="Psychological Thrillers" data={psychologicalThrillers} />
        <ContentRow title="Comedies" data={comedyMovies} />
        <ContentRow title="Scary Movies" data={horrorMovies} />
        <ContentRow title="Romance Movies" data={romanceMovies} />
        <ContentRow title="Documentaries" data={documentaries} />

        <ContentRow title="Edge-of-your-seat Thrillers" data={thrillers} />
        <ContentRow title="Growing up Millennial" data={millennialTV} />
        <ContentRow title="US Workplace TV Shows" data={usWorkplaceTV} />
        <ContentRow title="Watch It Again" data={watchItAgain} />
        <ContentRow title="Binge-worthy TV Shows" data={bingeWorthyTV} />
        <ContentRow title="Award-Winning TV Shows" data={awardWinningTV} />
        <ContentRow title="Hollywood Drama Movies" data={hollywoodDramas} />
        <ContentRow title="TV Shows Based on Books" data={basedOnBooks} />
        <ContentRow title="TV Thrillers & Mysteries" data={tvThrillersMysteries} />
        <ContentRow title="Teen Coming-of-Age TV Shows" data={teenComingOfAge} />
        <ContentRow title="Because you watched Dark" data={darkRecommendations} />
        
        <ContentRow title="Hidden Gems" data={hiddenGems} />
        <ContentRow title="Anime for Beginners" data={anime} />
        <ContentRow title="K-Drama Fever" data={kDramas} />
        <ContentRow title="Family Movie Night" data={familyMovies} />
        <ContentRow title="Sci-Fi & Fantasy TV" data={sciFiFantasy} />
        <ContentRow title="Critically Acclaimed Films" data={acclaimed} />
        <ContentRow title="Historical Dramas" data={historical} />
        <ContentRow title="True Crime & Justice" data={crimeTV} />
        <ContentRow title="Reality TV" data={realityTV} />
        <ContentRow title="Blockbuster Action" data={blockbusterAction} />
        
        <ContentRow title="Fist of Fury: Martial Arts" data={martialArts} />
        <ContentRow title="Cyberpunk & Future Tech" data={cyberpunk} />
        <ContentRow title="Epic Fantasy Worlds" data={epicFantasy} />
        <ContentRow title="Stand-Up Comedy Specials" data={standUp} />
        <ContentRow title="Best of British TV" data={britishTV} />
        <ContentRow title="Limited Series" data={miniseries} />
        <ContentRow title="Zombie Apocalypse" data={zombie} />
        <ContentRow title="Vampire Chronicles" data={vampire} />
        <ContentRow title="Spy Thrillers" data={spyThrillers} />
        <ContentRow title="Courtroom Dramas" data={courtroom} />
        <ContentRow title="Period Romances" data={periodRomance} />
        <ContentRow title="Supernatural Horror" data={supernaturalHorror} />
        <ContentRow title="90s Nostalgia" data={nostalgia90s} />
        <ContentRow title="80s Hits" data={hits80s} />
        <ContentRow title="Cult Classics" data={cultClassics} />
        <ContentRow title="Dark Comedies" data={darkComedies} />
        <ContentRow title="Political Thrillers" data={politicalThrillers} />
        <ContentRow title="Road Trip Movies" data={roadTrip} />
        <ContentRow title="Tearjerkers" data={tearjerkers} />
        <ContentRow title="Mind-Bending Sci-Fi" data={mindBending} />
        <ContentRow title="Slasher Movies" data={slasher} />
        <ContentRow title="Musicals" data={musicals} />
        <ContentRow title="Sports Dramas" data={sportsDramas} />
        <ContentRow title="War & Peace" data={warPeace} />
        <ContentRow title="Gangster Movies" data={gangster} />
        <ContentRow title="Space Operas" data={spaceOperas} />
        <ContentRow title="Creature Features" data={creatureFeatures} />
        <ContentRow title="High School Drama" data={highSchool} />
        <ContentRow title="Women in Charge" data={women} />
        <ContentRow title="Westerns" data={westerns} />
      </div>
      
      <Footer />
      <InfoModal />
    </main>
  );
}