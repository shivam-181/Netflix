'use client';
import styled from '@emotion/styled';
import { useState, useEffect, useRef } from 'react';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import TrendingModal from './TrendingModal';
import tmdb, { fetchLogo, requests } from '@/lib/tmdb';

const GENRE_MAP: { [key: number]: string } = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
  28: "Action",
  12: "Adventure",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War"
};

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
  /* Combined Background: Centered Blue Glow + Black Body */
  background: radial-gradient(50% 150px at 50% 0, rgba(33, 13, 85, 0.6) 0%, rgba(0,0,0,0) 100%), black;
  border-top-left-radius: 55% 60px; /* Slight stretch */
  border-top-right-radius: 55% 60px;
  padding: 80px 0 40px 0; /* Increased top padding from 40px to move content down */
  position: relative;
  top: -30px; /* Pull it up into the Hero */
  margin-bottom: -30px;
  
  /* Gradient Ribbon Line */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin-top: -.25rem;
    border-radius: inherit;
    background: linear-gradient(to right, rgba(33, 13, 22, 1) 16%, rgba(184, 40, 105, 1), rgba(229, 9, 20, 1), rgba(184, 40, 105, 1), rgba(33, 13, 22, 1) 84%);
  }
  
  /* Blue Shadow Glow downwards */
  /* Removed full-width box-shadow, handled by background radial gradient */
`;

const Title = styled.h2`
  color: white;
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem; /* Reduced from 1.75rem */
  font-weight: 700;
  margin-bottom: 10px; /* Closer to cards (was 20px) */
  margin-top: 30px; /* Further down (was 20px) */
  text-align: left;
`;

const ScrollContainer = styled.div`
  display: flex;
  gap: 0px; /* Reduced from 2px */
  overflow-x: auto;
  padding: 20px 0;
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar { display: none; } /* Chrome */
  scroll-behavior: smooth;
`;

const InnerContainer = styled.div`
  max-width: 1200px; /* Reduced from 1400px */
  width: 80%; /* Increased gap from 90% */
  margin: 0 auto; /* Centers the block */
`;

const CardWrapper = styled.div`
  flex: 0 0 auto;
  position: relative;
  width: 240px; /* Increased from 200px */
  transition: transform 0.3s;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const Poster = styled.img`
  width: 180px; /* Increased from 150px */
  height: 260px; /* Increased from 220px */
  object-fit: cover;
  border-radius: 8px;
  margin-left: 40px; /* Adjusted margin */
`;

// The Big Number (1, 2, 3...)
// Using SVG to get that nice outline stroke effect perfectly
const RankNumber = styled.svg`
  position: absolute;
  bottom: -5px; /* Stick to bottom */
  left: 20px;  /* Slide further right (~20% overlap) */
  width: 60px;
  height: 80px; 
  z-index: 2;
  overflow: visible;

  text {
    fill: black;
    stroke: white; /* Changed from #595959 */
    stroke-width: 0.2px; /* Thinner border */
    font-size: 90px;
    font-weight: 800;
    font-family: impact, sans-serif;
    transform: scaleX(1.1); /* Make wider */
    transform-origin: left bottom;
  }
`;

// Custom Navigation Arrow (simplified)
// Custom Navigation Arrow
const ScrollButton = styled.button<{ position: 'left' | 'right' }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.position === 'left' ? 'left: -40px;' : 'right: -40px;'} /* Closer (was -60px) */
  z-index: 20;
  background: rgba(43, 43, 43, 0.8); /* Dark gray background */
  border: none;
  border-radius: 10px; /* Rounded corners */
  width: 25px; /* Thinner (was 40px) */
  height: 120px; /* Taller (was 100px) */
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: background 0.2s, transform 0.2s;
  
  &:hover {
    background: rgba(70, 70, 70, 0.9);
    transform: translateY(-50%) scale(1.05);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const MOCK_DATA: TrendingItem[] = [
  { 
    id: 66732, 
    media_type: 'Tv Show',
    title: 'Stranger Things', 
    img: 'https://occ-0-4079-3646.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVGH0ApPOylN23mLKN568pwcz8SCMPEVABYN6b1MUFfmQq_WHxanD1Tk8E79ZsKTlP0BWSbt6Yw0qkL8EbIxHUQRJXf0EN2Oysm9eQgf0nh63G_ujktcHp-m_SgqJSgGx4W3ZjI3H9T1QtCkNRkTwtuQU0Z3vBNUj5vHD9KTloI.jpg?r=a6c',
    logoUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABYfguYW0lpMIpLsc4DnQAzrFy2hYFGn5MbzUWzqZAkAMhI0wn5VAuwr1k18zX1JsWkhIKBUEU0-5aOph-51487g_qJ0580ZXgg.webp?r=59a',
    backdropUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABTB4BygAxLguyDLXZyn8wNw5IdQIoziMrif0a61BlDdwjxvmWoUCnfDHaqMoGYGA9y4T-k6ZKraIhyu8AZrx4ndq1KrDe8l2J1bL.webp?r=8be', 
    description: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.',
    year: '2016',
    maturity: 'U/A 16+',
    genres: ['Show', 'Horror', 'Sci-Fi', 'Dramas', 'Supernatural']
  },
  {
    id: 84661,
    media_type: 'Tv Show',
    title: "Kota Factory",
    img: "https://image.tmdb.org/t/p/w500/fMBookmwL6HjIgIVTjQ6EMr3pCH.jpg",
    backdropUrl: "https://image.tmdb.org/t/p/original/mQEmKXSFlzBlSoYgut0VfjxAzoA.jpg",
    description: "In a city of coaching centers known to train India’s finest collegiate minds, an earnest but unexceptional student and his friends navigate campus life.",
    year: "2019",
    maturity: "U/A 16+",
    genres: ["Series", "Drama", "Academic", "Youth"]
  },
  { 
    id: 235588, 
    media_type: 'Tv Show',
    title: 'The Great Indian Kapil Show', 
    img: 'https://image.tmdb.org/t/p/w500/3KMCmGDlYLlJ8zGOhCs6f3FZcnj.jpg',
    backdropUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABZkzPxl_f6DdM52xQl9sexbfg8PTREO74BkS5etuTQli1DnS1Rj1AUUCEDYKtU4scEaQlbPR19g2k6ri3qkM_liO0OeX9K1IB44-.webp?r=e3d', 
    logoUrl: 'https://occ-0-2484-3646.1.nflxso.net/dnm/api/v6/S4oi7EPZbv2UEPaukW54OORa0S8/AAAABR_N38PCa19r2bdHe1Oq0QQKmaP8ewUbZBF2SS77cWwcMwqce7Ww54teJF7fgq__W4p4QRAuqibCcpgKvB-DfhWNUmM-XV8hcg.webp?r=5e5',
    description: 'Comedian Kapil Sharma hosts this laugh-out-loud variety talk show with celebrity guests, hilarious antics and his signature supporting cast.',
    year: '2024',
    maturity: 'U/A 16+',
    genres: ['Talk', 'Comedy', 'Variety', 'Indian']
  },
  { 
    id: 202256, 
    media_type: 'Tv Show',
    title: 'Heeramandi', 
    img: 'https://image.tmdb.org/t/p/w500/fRhzhaWlFyypV12APz8EcMPRKa9.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/z0F11p7HBaIUizZHGzyZ32FLm7O.jpg',
    description: 'The scheming Mallikajaan rules over an elite house of courtesans — but a new rival threatens her reign as rebellion brews in British-ruled India.',
    year: '2024', 
    maturity: 'A',
    genres: ['Drama', 'History', 'Politics', 'Period Piece']
  }, 
  { 
    id: 781732, 
    media_type: 'Movie',
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
    media_type: 'Movie',
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
    media_type: 'Movie',
    title: 'Laapataa Ladies', 
    img: 'https://image.tmdb.org/t/p/w500/cGG5hCwPnMvuKzvUBnxo5y3DcVM.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/original/uUVXEEyMsyWxrcbmAppUCYg6egV.jpg',
    description: 'In 2001, somewhere in rural India, two young brides get accidentally swapped on a train. In the ensuing chaos, they both encounter a host of colourful characters.',
    year: '2024',
    maturity: 'U/A 16+',
    genres: ['Comedy', 'Drama']
  },
  { 
    id: 1226209, 
    media_type: 'Movie',
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
    media_type: 'Tv Show',
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
    media_type: 'Movie',
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 0);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 10); // tolerance
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.7; // Scroll 70% of view
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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
              /* media_type: 'tv', Removed duplicate. See below */
              img: (item.title === 'Stranger Things' || item.name === 'Stranger Things') 
                   ? 'https://occ-0-4079-3646.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVGH0ApPOylN23mLKN568pwcz8SCMPEVABYN6b1MUFfmQq_WHxanD1Tk8E79ZsKTlP0BWSbt6Yw0qkL8EbIxHUQRJXf0EN2Oysm9eQgf0nh63G_ujktcHp-m_SgqJSgGx4W3ZjI3H9T1QtCkNRkTwtuQU0Z3vBNUj5vHD9KTloI.jpg?r=a6c'
                   : `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              posterUrl: `https://image.tmdb.org/t/p/w500${item.poster_path}`,
              backdropUrl: `https://image.tmdb.org/t/p/original${item.backdrop_path}`,
              description: item.overview,
              year: (item.first_air_date || item.release_date || '').substring(0, 4),
              maturity: item.adult ? 'A' : 'U/A 16+', // Simple heuristic
              genres: item.genre_ids ? item.genre_ids.map((id: number) => GENRE_MAP[id]).filter(Boolean) : [],
              media_type: 'Tv Show' // Specific to this endpoint
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

        const type = (item.media_type === 'Tv Show' || item.media_type === 'tv') ? 'tv' : 'movie';
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

      
      <CurvedContent>
        <InnerContainer style={{position: 'relative'}}>
          <Title>Trending Now</Title>
          
          {showLeft && (
            <ScrollButton position="left" onClick={() => scroll('left')}>
                <FaChevronLeft />
            </ScrollButton>
          )}
          
          {showRight && (
            <ScrollButton position="right" onClick={() => scroll('right')}>
                <FaChevronRight />
            </ScrollButton>
          )}

          <ScrollContainer ref={scrollRef} onScroll={handleScroll}>
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
        </InnerContainer>
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
