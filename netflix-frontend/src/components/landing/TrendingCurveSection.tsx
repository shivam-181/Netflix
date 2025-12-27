'use client';
import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import TrendingModal from './TrendingModal';
import tmdb, { fetchLogo, requests } from '@/lib/tmdb';

// ... (styled components remain same)

const SectionContainer = styled.section`
  position: relative;
  background-color: black;
  padding-bottom: 50px;
  margin-top: -50px; /* Pull up to overlap if needed, or just let curve handle it */
  z-index: 2;
`;

// The Curve Effect
// We can use a pseudo-element or a specific div to create the arch.
// Netflix uses a clip-path or a radial gradient for this.
const CurveDivider = styled.div`
  position: absolute;
  top: -40px; /* Adjust based on curve height */
  left: 0;
  width: 100%;
  height: 60px;
  background: radial-gradient(50% 100% at 50% 100%, black 0%, black 50%, transparent 50.1%);
  /* Alternatively, a border-radius approach: */
  /* background: black; border-top-left-radius: 50% 20px; border-top-right-radius: 50% 20px; */
  /* Let's try the radial gradient for that nice arch look, or just a simple rounded top */
  z-index: 5;
  pointer-events: none;
  
  /* Actually, looking at the screenshot, it looks like a "bulge" of the black section UPWARDS into the hero?
     Or the hero curving DOWN? 
     "the next section after scrolling should look exactly like this"
     The screenshot shows the black section has a curve on top.
     Let's try a border-radius on the container itself.
  */
  display: none; // Resetting strategy below
`;

// Better Strategy: The Section itself has a curved top
const CurvedContent = styled.div`
  background: black;
  border-top-left-radius: 50% 60px; /* Increased curvature */
  border-top-right-radius: 50% 60px;
  padding: 40px 5%;
  position: relative;
  top: -30px; /* Pull it up into the Hero */
  margin-bottom: -30px;
  
  /* Gradient Ribbon Line */
  &::before {
    content: "";
    position: absolute;
    top: -5px; /* Slightly thicker/higher overlap */
    left: 0; 
    right: 0;
    bottom: 0;
    z-index: -1;
    border-top-left-radius: 50% 64px; 
    border-top-right-radius: 50% 64px;
    /* Use the same Blue/Purple as the glow start color */
    background: linear-gradient(to right, rgba(33, 13, 22, 1) 16%, rgba(184, 40, 105, 1), rgba(229, 9, 20, 1), rgba(184, 40, 105, 1), rgba(33, 13, 22, 1) 84%);
    box-shadow: 0 -10px 40px rgba(229, 9, 20, 0.4);
  }
`;

const Title = styled.h2`
  color: white;
  font-family: unset;
  font-size: 1.75rem; /* Increased a bit */
  font-weight: 900;
  margin-bottom: 20px;
  margin-top: 20px; /* Added spacing */
  text-align: left;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 40px;
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { display: none; } /* Chrome */
  scroll-behavior: smooth;
`;

const CardWrapper = styled.div`
  flex: 0 0 auto;
  position: relative;
  width: 200px;
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const Poster = styled.img`
  width: 150px;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
  margin-left: 35px; /* Reduced to pull poster closer */
`;

// The Big Number (1, 2, 3...)
// Using SVG to get that nice outline stroke effect perfectly
const RankNumber = styled.svg`
  position: absolute;
  bottom: -5px; /* Stick to bottom */
  left: -5px;  /* Slight overlap */
  width: 60px;
  height: 80px; 
  z-index: 2;
  overflow: visible;

  text {
    fill: black;
    stroke: #595959; 
    stroke-width: 2px;
    font-size: 90px;
    font-weight: 800;
    font-family: impact, sans-serif;
  }
`;

// Custom Navigation Arrow (simplified)
const NavButton = styled.button`
  /* ... simplified for now, usually appears on hover */
`;

const MOCK_DATA: TrendingItem[] = [
  { 
    id: 66732, 
    media_type: 'tv',
    title: 'Stranger Things', 
    img: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABTB4BygAxLguyDLXZyn8wNw5IdQIoziMrif0a61BlDdwjxvmWoUCnfDHaqMoGYGA9y4T-k6ZKraIhyu8AZrx4ndq1KrDe8l2J1bL.webp?r=8be',
    logoUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABYfguYW0lpMIpLsc4DnQAzrFy2hYFGn5MbzUWzqZAkAMhI0wn5VAuwr1k18zX1JsWkhIKBUEU0-5aOph-51487g_qJ0580ZXgg.webp?r=59a',
    backdropUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABTB4BygAxLguyDLXZyn8wNw5IdQIoziMrif0a61BlDdwjxvmWoUCnfDHaqMoGYGA9y4T-k6ZKraIhyu8AZrx4ndq1KrDe8l2J1bL.webp?r=8be', 
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    year: '2016',
    maturity: 'U/A 16+',
    genres: ['Show', 'Horror', 'Sci-Fi', 'Dramas']
  },
  {
    id: 84661,
    media_type: 'tv',
    title: "Kota Factory",
    img: "https://image.tmdb.org/t/p/w500/fMBookmwL6HjIgIVTjQ6EMr3pCH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/mQEmKXSFlzBlSoYgut0VfjxAzoA.jpg",
    description: "In a city of coaching centers known to train India’s finest collegiate minds, an earnest but unexceptional student and his friends navigate campus life.",
    year: "2019",
    maturity: "U/A 16+",
    genres: ["Series", "Drama"]
  },
  { 
    id: 235588, 
    media_type: 'tv',
    title: 'The Great Indian Kapil Show', 
    img: 'https://image.tmdb.org/t/p/w500/3KMCmGDlYLlJ8zGOhCs6f3FZcnj.jpg',
    backdropUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABZkzPxl_f6DdM52xQl9sexbfg8PTREO74BkS5etuTQli1DnS1Rj1AUUCEDYKtU4scEaQlbPR19g2k6ri3qkM_liO0OeX9K1IB44-.webp?r=e3d', 
    logoUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABR_N38PCa19r2bdHe1Oq0QQKmaP8ewUbZBF2SS77cWwcMwqce7Ww54teJF7fgq__W4p4QRAuqibCcpgKvB-DfhWNUmM-XV8hcg.webp?r=5e5',
    description: 'Comedian Kapil Sharma hosts this laugh-out-loud variety talk show with celebrity guests, hilarious antics and his signature supporting cast.',
    year: '2024',
    maturity: 'U/A 16+',
    genres: ['Talk', 'Comedy']
  },
  { 
    id: 202256, 
    media_type: 'tv',
    title: 'Heeramandi', 
    img: 'https://image.tmdb.org/t/p/w500/fRhzhaWlFyypV12APz8EcMPRKa9.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/z0F11p7HBaIUizZHGzyZ32FLm7O.jpg',
    description: 'The scheming Mallikajaan rules over an elite house of courtesans — but a new rival threatens her reign as rebellion brews in British-ruled India.',
    year: '2024', 
    maturity: 'A',
    genres: ['Drama', 'History', 'Politics']
  }, 
  { 
    id: 781732, 
    media_type: 'movie',
    title: 'Animal', 
    img: 'https://image.tmdb.org/t/p/w500/hr9rjR3J0xBBKmlJ4n3gHId9ccx.jpg',
    backdropUrl: 'https://images.lifestyleasia.com/wp-content/uploads/sites/7/2024/01/25155217/Animal-movie-1600x900.jpg', 
    description: 'A son undergoes a remarkable transformation as the bond with his father begins to fracture, and he becomes consumed by a quest for vengeance.',
    year: '2023',
    maturity: 'A',
    genres: ['Action', 'Crime', 'Drama']
  },
  { 
    id: 1090336, 
    media_type: 'movie',
    title: 'Amar Singh Chamkila', 
    img: 'https://image.tmdb.org/t/p/w500/t9wSGgaPfbGUBBlne7xw8GaArvu.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/qh7PWKRfy2K8rZZP7LzembGgWIU.jpg',
    description: 'A humble singer’s brash lyrics ignite fame and fury across Punjab as he grapples with soaring success and brutal criticism before his untimely death.',
    year: '2024',
    maturity: 'U/A 16+',
    genres: ['Drama', 'Music', 'Biography']
  },
  { 
    id: 1030052, 
    media_type: 'movie',
    title: 'Laapataa Ladies', 
    img: 'https://image.tmdb.org/t/p/w500/cGG5hCwPnMvuKzvUBnxo5y3DcVM.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/uUVXEEyMsyWxrcbmAppUCYg6egV.jpg',
    description: 'In 2001, somewhere in rural India, two young brides get accidentally swapped on a train. In the ensuing chaos, they both encounter a host of colourful characters.',
    year: '2024',
    maturity: 'U/A 13+',
    genres: ['Comedy', 'Drama']
  },
  { 
    id: 1226209, 
    media_type: 'movie',
    title: 'Shaitaan', 
    img: 'https://image.tmdb.org/t/p/w500/oRvFzcagAcC6Q317xtV7QXzwBnj.jpg',
    backdropUrl: 'https://occ-0-8407-90.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABeNQCI8plFcjKsfzg_3_k62n-xV1yClmP_WaorGR6IlnllKZHVc-RN76TILwjF_a4pcEpx4FQXhebAZL_vkxmY8k1uqGwqlcs-_f.jpg?r=e85', 
    description: 'A family getaway takes a terrifying turn when a mysterious intruder takes over their minds and puts them in grave danger.',
    year: '2024',
    maturity: 'A',
    genres: ['Horror', 'Thriller']
  },
  { 
    id: 87786, 
    media_type: 'tv',
    title: 'Delhi Crime', 
    img: 'https://image.tmdb.org/t/p/w500/xkpkTj6KGsjSaet0VQaq0aTn31D.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/j6djmR4hi8ULL0xUPQN4ZVyzgVN.jpg',
    description: 'Following the police force as they investigate high-profile crimes in Delhi, this series has seasons inspired by both real and fictional events.',
    year: '2019',
    maturity: 'A',
    genres: ['Crime', 'Drama', 'Police']
  },
  {
    id: 906126,
    media_type: 'movie',
    title: "Jawan",
    img: "https://image.tmdb.org/t/p/w500/jFt1gS4BGHlK8xt76Y81Alp4dbt.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/5LtSjMNw6j3LkG29Oa4O0iY5U8.jpg",
    description: "An emotional journey of a prison warden, driven by a personal vendetta while keeping up to a promise made years ago, recruits inmates to commit outrageous crimes that shed light on corruption and injustice.",
    year: "2023",
    maturity: "U/A 16+",
    genres: ["Movie", "Action", "Thriller"]
  }
];

// Update Props to interface
interface TrendingItem {
  id: string | number;
  title: string;
  media_type?: string; 
  thumbnailUrl?: string; // Backend field
  posterUrl?: string; // Potential legacy backend field
  img?: string; // MOCK_DATA field
  logoUrl?: string; // For composite cards (bg + logo)
  /* Modal Details */
  description?: string;
  backdropUrl?: string;
  year?: string;
  maturity?: string;
  genres?: string[];
}

interface TrendingProps {
  data?: TrendingItem[];
  title?: string;
}

const LogoOverlay = styled.img`
  position: absolute;
  bottom: 20px;
  left: 35px; /* Matches Poster margin-left */
  width: 150px; /* Matches Poster width */
  padding: 0 10px; /* Padding inside the poster area */
  object-fit: contain;
  z-index: 1; /* Above poster, below number? No, above number perhaps? Or beside. */
  /* Actually RankNumber is z-index 2. Logo should be readable. */
  max-height: 80px; 
`;

export default function TrendingCurveSection({ data = [] }: TrendingProps) {
  const [selectedItem, setSelectedItem] = useState<TrendingItem | null>(null);
  const [items, setItems] = useState<TrendingItem[]>(data);

  // Fetch Trending Data (Top 10) on Mount
  useEffect(() => {
    const fetchData = async () => {
      let initialItems = data;
      
      if (initialItems.length === 0) {
        try {
           // USER REQUEST: STRICTLY TOP 10 NETFLIX ORIGINALS
           const res = await tmdb.get(requests.fetchNetflixOriginals);
           // Map to TrendingItem interface
           initialItems = res.data.results.slice(0, 10).map((item: any) => ({
              id: item.id,
              title: item.title || item.name,
              media_type: 'tv', // Netflix Originals endpoint is TV
              img: (item.title === 'Stranger Things' || item.name === 'Stranger Things') 
                   ? 'https://dnm.nflximg.net/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABXfDF4ai-ybeNPenuuM-9I0496QZnUqg5QqJPlO5OMIzCmAfB5smwT2C8h4X_4b3MuyK3SzE-6_fq_tQLGQ2xYimuptuhV6HUXY9.jpg?r=27a'
                   : `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
              description: item.overview,
              year: (item.first_air_date || item.release_date || '').substring(0, 4),
              maturity: item.adult ? 'A' : 'U/A 13+', // Simple heuristic
              genres: [] 
           }));
        } catch (e) {
           console.error("Failed to fetch trending", e);
           initialItems = MOCK_DATA; // Fallback
        }
      }

      // Now fetch logos for these items
      const updatedItems = await Promise.all(initialItems.map(async (item) => {
        // OVERRIDE FOR STRANGER THINGS
        if (item.title === 'Stranger Things') {
            return { 
                ...item, 
                logoUrl: 'https://occ-0-4412-3646.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABYfguYW0lpMIpLsc4DnQAzrFy2hYFGn5MbzUWzqZAkAMhI0wn5VAuwr1k18zX1JsWkhIKBUEU0-5aOph-51487g_qJ0580ZXgg.webp?r=59a' 
            };
        }

        if (item.logoUrl) return item; 

        const type = (item.media_type || 'movie') as 'movie' | 'tv'; 
        const logo = await fetchLogo(type, Number(item.id));
        
        if (logo) {
            return { ...item, logoUrl: `https://image.tmdb.org/t/p/w500${logo}` };
        }
        return item;
      }));
      
      setItems(updatedItems);
    };

    fetchData();
  }, [data]); 

  const displayData = items;

  return (
    <>
      <div style={{background: 'transparent', position: 'relative', zIndex: 10, marginTop: '-2rem'}}>
      {/* Visual Blue Gradient Glow - Extended to blend */}
      <div style={{
        height: '150px', 
        background: 'radial-gradient(50% 100% at 50% 100%, rgba(33, 13, 85, 1) 0%, rgba(33, 13, 85, 0) 100%)',
        position: 'absolute',
        top: '-120px', /* Push higher into hero but extend lower */
        width: '100%',
        zIndex: 0,
        opacity: 0.8
      }} />

      <CurvedContent>
        <Title>Trending Now</Title>
        <ScrollContainer>
          {displayData.map((item, index) => (
            <CardWrapper key={item.id} onClick={() => setSelectedItem(item)}>
              {/* SVG Number - Adjusted for bottom position */}
              <RankNumber viewBox="0 0 60 80">
                <text x="0" y="70">{index + 1}</text>
              </RankNumber>
              {/* Handle different image keys */}
              <Poster src={item.thumbnailUrl || item.img || item.posterUrl} alt={item.title} />
            </CardWrapper>
          ))}
        </ScrollContainer>
      </CurvedContent>
    </div>

    {selectedItem && (
      <TrendingModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
      />
    )}
    </>
  );
}
