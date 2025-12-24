'use client';
import { useEffect, useState } from 'react';
import LandingHero from '@/components/landing/LandingHero';
import FeatureRow from '@/components/landing/FeatureRow';
import FaqSection from '@/components/landing/FaqSection';
import Footer from '@/components/landing/Footer';
import { Separator } from '@/components/common/Separator';
import TrendingCurveSection from '@/components/landing/TrendingCurveSection';
import api from '@/lib/axios';

export default function Home() {
  const [trendingMovies, setTrendingMovies] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/content?type=movie&limit=10');
        setTrendingMovies(res.data);
      } catch (err) {
        console.error("Could not fetch landing page movies", err);
      }
    };

    fetchTrending();
  }, []);

  return (
    <main style={{ backgroundColor: 'black', overflowX: 'hidden' }}>
      <LandingHero />
      
      {/* Curved Trending Section with Top 10 numbers */}
      {/* We use the internal MOCK_DATA to match the strictly requested "Trending" visual 
          instead of the generic backend movies (Frankenstein/Interstellar) */}
      <TrendingCurveSection />

      <FeatureRow 
        title="Enjoy on your TV"
        subtitle="Watch on smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players and more."
        imageUrl="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/tv.png"
        videoUrl="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/video-tv-0819.m4v"
      />

      <FeatureRow 
        title="Download your shows to watch offline"
        subtitle="Save your favourites easily and always have something to watch."
        imageUrl="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/mobile-0819.jpg"
        direction="row-reverse"
      />
      
      <FeatureRow 
        title="Create profiles for kids"
        subtitle="Send children on adventures with their favourite characters in a space made just for them—free with your membership."
        imageUrl="https://occ-0-4994-2186.1.nflxso.net/dnm/api/v6/19OhWN2dO19C9txTON9tvTFtefw/AAAABVr8nYuAg0xDpXDv0VI9HUoH7r2aGp4TKRCsKNQrMwxzTtr-NlwOHeS8bCI2oeZddmu3nMYr3j9MjYhHyjBASb1FaOGYZNYvPBCL.png?r=54d"
        direction="row-reverse"
      />
      
      <FaqSection />
      
      <Footer />
    </main>
  );
}