import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'f8707136961bdd17962e12cca6706b53';
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const requests = {
  fetchTrending: `/trending/all/week?language=en-US`,
  fetchTrendingMovies: `/trending/movie/day?language=en-US`,
  fetchTrendingTV: `/trending/tv/day?language=en-US`,
  fetchNetflixOriginals: `/discover/tv?with_networks=213`,
  fetchTopRated: `/movie/top_rated?language=en-US`,
  fetchActionMovies: `/discover/movie?with_genres=28`,
  fetchComedyMovies: `/discover/movie?with_genres=35`,
  fetchHorrorMovies: `/discover/movie?with_genres=27`,
  fetchRomanceMovies: `/discover/movie?with_genres=10749`,
  fetchDocumentaries: `/discover/movie?with_genres=99`,
  fetchNewOnNetflix: `/discover/tv?with_networks=213&sort_by=first_air_date.desc`,
  fetchCrowdPleasers: `/discover/movie?sort_by=vote_count.desc`,
  fetchTopSearches: `/trending/all/day`,
  fetchUSMovies: `/discover/movie?with_original_language=en&region=US`,
  fetchStrangerThingsRecommendations: `/tv/66732/recommendations`,
  fetchExcitingTV: `/discover/tv?with_genres=10759`,
  fetchPsychologicalThrillers: `/discover/movie?with_genres=53`,
  fetchThrillers: `/discover/movie?with_genres=53`,
  fetchMillennialTV: `/discover/tv?with_genres=35&first_air_date.gte=1990-01-01&first_air_date.lte=2005-12-31&with_original_language=en`,
  fetchUSWorkplaceTV: `/discover/tv?with_genres=35&with_original_language=en&region=US`,
  fetchWatchItAgain: `/discover/movie?sort_by=vote_count.desc`,
  fetchBingeWorthyTV: `/discover/tv?sort_by=vote_count.desc&vote_average.gte=8`,
  fetchAwardWinningTV: `/discover/tv?sort_by=vote_average.desc&vote_count.gte=1000`,
  fetchHollywoodDramas: `/discover/movie?with_genres=18&with_original_language=en&region=US`,
  fetchBasedOnBooks: `/discover/tv?with_genres=18`, 
  fetchTVThrillersMysteries: `/discover/tv?with_genres=53,9648`,
  fetchTeenComingOfAge: `/discover/tv?with_genres=18&with_keywords=10634`, 
  fetchDarkRecommendations: `/tv/70523/recommendations`,
  fetchHiddenGems: `/discover/movie?vote_average.gte=7.5&vote_count.gte=500&vote_count.lte=2500&with_original_language=en`,
  fetchAnime: `/discover/tv?with_genres=16&with_original_language=ja`,
  fetchKDramas: `/discover/tv?with_genres=18&with_original_language=ko`,
  fetchFamilyMovies: `/discover/movie?with_genres=10751,16`,
  fetchSciFiFantasyTV: `/discover/tv?with_genres=10765`,
  fetchCriticallyAcclaimed: `/discover/movie?vote_average.gte=8&vote_count.gte=2000`,
  fetchHistoricalDramas: `/discover/tv?with_genres=36`,
  fetchCrimeTV: `/discover/tv?with_genres=80`,
  fetchRealityTV: `/discover/tv?with_genres=10764`,
  fetchBlockbusterAction: `/discover/movie?with_genres=28&sort_by=revenue.desc`,
  fetchWesterns: `/discover/movie?with_genres=37`,
  fetchMartialArts: `/discover/movie?with_genres=28&with_keywords=9748`,
  fetchEpicFantasy: `/discover/movie?with_genres=14&vote_count.gte=1000`,
  fetchCyberpunk: `/discover/movie?with_genres=878&with_keywords=10085`,
  fetchStandUpComedy: `/discover/tv?with_genres=35&with_keywords=9716`,
  fetchBritishTV: `/discover/tv?with_original_language=en&origin_country=GB`,
  fetchMiniseries: `/discover/tv?with_type=3`, // or keywords=2233
  fetchZombieApocalypse: `/discover/movie?with_keywords=12377`,
  fetchVampireChronicles: `/discover/movie?with_keywords=3133`,
  fetchSpyThrillers: `/discover/movie?with_keywords=470`,
  fetchCourtroomDramas: `/discover/movie?with_keywords=9663`,
  fetchPeriodRomances: `/discover/movie?with_genres=10749&with_keywords=9840`,
  fetchSupernaturalHorror: `/discover/movie?with_genres=27&with_keywords=9663`,
  fetch90sNostalgia: `/discover/movie?primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31&vote_average.gte=7.5`,
  fetch80sHits: `/discover/movie?primary_release_date.gte=1980-01-01&primary_release_date.lte=1989-12-31&vote_average.gte=7.5`,
  fetchCultClassics: `/discover/movie?with_keywords=9799`,
  fetchDarkComedies: `/discover/movie?with_genres=35&with_keywords=10183`,
  fetchPoliticalThrillers: `/discover/movie?with_genres=53&with_keywords=2041`,
  fetchRoadTrip: `/discover/movie?with_keywords=2356`,
  fetchTearjerkers: `/discover/movie?with_genres=18&with_keywords=5608`,
  fetchMindBendingSciFi: `/discover/movie?with_genres=878&vote_average.gte=8`,
  fetchSlasherMovies: `/discover/movie?with_genres=27&with_keywords=12339`,
  fetchMusicals: `/discover/movie?with_genres=10402`,
  fetchSportsDramas: `/discover/movie?with_genres=18&with_keywords=6075`,
  fetchWarAndPeace: `/discover/movie?with_genres=10752`,
  fetchGangsterMovies: `/discover/movie?with_keywords=8347`,
  fetchSpaceOperas: `/discover/movie?with_genres=878&with_keywords=3801`,
  fetchCreatureFeatures: `/discover/movie?with_genres=27&with_keywords=13031`,
  fetchHighSchoolDrama: `/discover/movie?with_keywords=6054`,
  fetchWomenInCharge: `/discover/tv?with_keywords=17865`,
  fetchBlockbusterMovies: `/discover/movie?sort_by=revenue.desc`,
  fetchCriticallyAcclaimedDramas: `/discover/movie?with_genres=18&sort_by=vote_average.desc&vote_count.gte=1000`,
  fetchAnimeSeries: `/discover/tv?with_genres=16&with_original_language=ja`,
  fetchSciFiHalo: `/discover/movie?with_genres=878`, 
  fetchSuspenseThriller: `/discover/movie?with_genres=53`,
  fetchFamilyNights: `/discover/movie?with_genres=10751`,
  fetchKoreanDramas: `/discover/tv?with_genres=18&with_original_language=ko`,
  fetchRealityTVShows: `/discover/tv?with_genres=10764`, 
  fetchSciFiFantasySeries: `/discover/tv?with_genres=10765`,
  fetchNewActionMovies: `/discover/movie?with_genres=28&primary_release_date.gte=2023-01-01&sort_by=popularity.desc`,
  fetchExcitingSeries: `/discover/tv?with_genres=10759&sort_by=popularity.desc`,
};

// Simple in-memory cache
const cache = new Map<string, any>();
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

const getCached = (key: string) => {
    const item = cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
        cache.delete(key);
        return null;
    }
    return item.value;
};

const setCache = (key: string, value: any) => {
    cache.set(key, { value, expiry: Date.now() + CACHE_DURATION });
};

export const fetchTrailer = async (type: 'movie' | 'tv', id: number) => {
    const key = `trailer-${type}-${id}`;
    const cached = getCached(key);
    if (cached) return cached;

    try {
        const response = await tmdb.get(`/${type}/${id}/videos`);
        const trailer = response.data.results.find(
            (vid: any) => vid.name === "Official Trailer" || vid.type === "Trailer"
        );
        setCache(key, trailer);
        return trailer;
    } catch (error: any) {
        if (error.response && error.response.status === 404) return null;
        console.error("Trailer fetch failed", error);
        return null;
    }
};

export const fetchLogo = async (type: 'movie' | 'tv', id: number) => {
    const key = `logo-${type}-${id}`;
    const cached = getCached(key);
    if (cached) return cached;

    try {
        const response = await tmdb.get(`/${type}/${id}/images`);
        const logo = response.data.logos.find((img: any) => img.iso_639_1 === 'en');
        const result = logo ? logo.file_path : response.data.logos[0]?.file_path;
        setCache(key, result);
        return result;
    } catch (error: any) {
        if (error.response && error.response.status === 404) return null;
        console.error("Logo fetch failed", error);
        return null;
    }
};

export const fetchDetails = async (type: 'movie' | 'tv', id: number) => {
    const key = `details-${type}-${id}`;
    const cached = getCached(key);
    if (cached) return cached;

    try {
        const response = await tmdb.get(`/${type}/${id}`);
        setCache(key, response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) return null;
        console.error("Details fetch failed", error);
        return null;
    }
};

export const fetchCredits = async (type: 'movie' | 'tv', id: number) => {
    const key = `credits-${type}-${id}`;
    const cached = getCached(key);
    if (cached) return cached;

    try {
        const response = await tmdb.get(`/${type}/${id}/credits`);
        setCache(key, response.data);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) return null;
        console.error("Credits fetch failed", error);
        return null;
    }
};

export default tmdb;
