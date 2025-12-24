'use client';

import { useState, useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import HoverCard from '@/components/common/HoverCard';
import InfoModal from '@/components/common/InfoModal';
import tmdb, { fetchLogo } from '@/lib/tmdb';
import { FaCaretDown } from 'react-icons/fa';

const PageContainer = styled.div`
  background-color: #141414;
  min-height: 100vh;
  position: relative;
`;

const ContentArea = styled.div`
  padding: 150px 4% 50px; /* Top padding to clear fixed header */
`;

const HeaderSection = styled.div`
  margin-bottom: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 500;
  color: white;
  margin-bottom: 15px;
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
  color: #grey;
  font-size: 0.9rem;
`;

const FilterLabel = styled.span`
  color: #a3a3a3;
  margin-right: 5px;
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: black;
  border: 1px solid #333;
  color: white;
  padding: 5px 15px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 120px;
  justify-content: space-between;

  &:hover {
    border-color: white;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  background: black;
  border: 1px solid #333;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 100;
  max-height: 300px;
  overflow-y: auto;
  min-width: 100%;
  
  /* Scrollbar styles */
  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-thumb { background: #333; border-radius: 3px; }
`;

const DropdownItem = styled.li`
  padding: 8px 15px;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    text-decoration: underline;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 30px;
`;

const SubHeaderFix = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: #141414; /* Ensuring readability over scroll */
  z-index: 50; 
  padding-top: 70px; /* Space for Navbar */
  padding-bottom: 20px;
  padding-left: 4%;
  padding-right: 4%;
`;

// Languages Mapping
const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ko', name: 'Korean' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'tr', name: 'Turkish' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'th', name: 'Thai' },
    { code: 'pl', name: 'Polish' },
    { code: 'id', name: 'Indonesian' },
];

const SORT_OPTIONS = [
    { value: 'popularity.desc', label: 'Suggestions For You' },
    { value: 'primary_release_date.desc', label: 'Year Released' },
    { value: 'original_title.asc', label: 'A-Z' },
    { value: 'original_title.desc', label: 'Z-A' },
];

export default function BrowseLanguagesPage() {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();
  
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]); // Default English
  const [sortOption, setSortOption] = useState(SORT_OPTIONS[0]);
  const [prefType, setPrefType] = useState('Original Language');
  
  const [content, setContent] = useState<any[]>([]);
  const [langOpen, setLangOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [prefOpen, setPrefOpen] = useState(false);

  // Close dropdowns on outside click
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
        if (filterRef.current && !filterRef.current.contains(event.target)) {
            setLangOpen(false);
            setSortOpen(false);
            setPrefOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
        if (!user) return;
        
        try {
            // Build query
            // Discover movies/tv with specific original language and sort
            // We fetch both movie and tv and combine? Or just one?
            // "Browse by Languages" usually mixes them or prioritizes one. Let's fetch Movies for now or combine 1 page each.
            // Let's implement discover 'movie' primarily, or make another toggle if needed. 
            // Usually Netflix mixes them. Let's try fetching both and interleaving or just movies + shows in a robust generic list.
            
            // Simpler approach: Fetch standard discover for "movie" and "tv" 
            
            const [moviesRes, tvRes] = await Promise.all([
                tmdb.get(`/discover/movie`, {
                    params: {
                        with_original_language: selectedLanguage.code,
                        sort_by: sortOption.value,
                        'vote_count.gte': 50 // Filter trash
                    }
                }),
                tmdb.get(`/discover/tv`, {
                     params: {
                        with_original_language: selectedLanguage.code,
                        sort_by: sortOption.value,
                        'vote_count.gte': 50
                    }
                })
            ]);

            const movies = moviesRes.data.results.map((m: any) => ({ ...m, media_type: 'movie' }));
            const tvs = tvRes.data.results.map((t: any) => ({ ...t, media_type: 'tv' }));
            
            // Interleave or just concat. For language browse, sorting by popularity usually dominates.
            // Let's concat and re-sort appropriately if "popularity"
            let combined = [...movies, ...tvs];
            
            if (sortOption.value.includes('popularity')) {
                combined.sort((a, b) => b.popularity - a.popularity);
            } else if (sortOption.value.includes('date')) {
                 // rough date sort
                 combined.sort((a, b) => {
                     const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
                     const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
                     return dateB - dateA;
                 });
            }

            // Map standard fields
            const mapped = combined.map((item: any) => ({
                 ...item,
                 _id: item.id?.toString(),
                 thumbnailUrl: item.backdrop_path 
                    ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` 
                    : `https://image.tmdb.org/t/p/w500${item.poster_path}`,
                 title: item.title || item.name
            }));

            // Filter broken images immediately
            const validItems = mapped.filter((i: any) => i.backdrop_path || i.poster_path);

            setContent(validItems);

        } catch (error) {
            console.error("Failed to fetch language content", error);
        }
    };
    
    fetchData();
  }, [user, selectedLanguage, sortOption]);

  if (isLoading || !user) return <div style={{ background: '#141414', minHeight: '100vh' }} />;

  return (
    <PageContainer>
        
        <SubHeaderFix>
            <HeaderSection>
                <PageTitle>Browse by Languages</PageTitle>
                
                <FilterBar ref={filterRef}>
                    <FilterLabel>Select Your Preferences</FilterLabel>
                    
                    {/* Preference Type Dropdown (Dummy/Visual mainly as "Original Language" is strictly enforced logic) */}
                    <DropdownContainer>
                         <DropdownButton onClick={() => { setPrefOpen(!prefOpen); setLangOpen(false); setSortOpen(false); }}>
                            {prefType} <FaCaretDown />
                         </DropdownButton>
                         {prefOpen && (
                             <DropdownMenu>
                                 {['Original Language', 'Dubbing', 'Subtitles'].map((opt) => (
                                     <DropdownItem key={opt} onClick={() => { setPrefType(opt); setPrefOpen(false); }}>
                                         {opt}
                                     </DropdownItem>
                                 ))}
                             </DropdownMenu>
                         )}
                    </DropdownContainer>

                    {/* Language Dropdown */}
                    <DropdownContainer>
                        <DropdownButton onClick={() => { setLangOpen(!langOpen); setPrefOpen(false); setSortOpen(false); }}>
                            {selectedLanguage.name} <FaCaretDown />
                        </DropdownButton>
                         {langOpen && (
                             <DropdownMenu>
                                 {LANGUAGES.map((lang) => (
                                     <DropdownItem key={lang.code} onClick={() => { setSelectedLanguage(lang); setLangOpen(false); }}>
                                         {lang.name}
                                     </DropdownItem>
                                 ))}
                             </DropdownMenu>
                         )}
                    </DropdownContainer>

                    <FilterLabel style={{ marginLeft: '10px' }}>Sort by</FilterLabel>

                    {/* Sort Dropdown */}
                    <DropdownContainer>
                        <DropdownButton onClick={() => { setSortOpen(!sortOpen); setLangOpen(false); setPrefOpen(false); }}>
                            {sortOption.label} <FaCaretDown />
                        </DropdownButton>
                        {sortOpen && (
                             <DropdownMenu>
                                 {SORT_OPTIONS.map((opt) => (
                                     <DropdownItem key={opt.value} onClick={() => { setSortOption(opt); setSortOpen(false); }}>
                                         {opt.label}
                                     </DropdownItem>
                                 ))}
                             </DropdownMenu>
                         )}
                    </DropdownContainer>

                </FilterBar>
            </HeaderSection>
        </SubHeaderFix>

        <ContentArea>
            <Grid>
                {content.map((item) => (
                    <div key={item._id}>
                        <HoverCard item={item} />
                    </div>
                ))}
            </Grid>
        </ContentArea>

        <Footer />
        <InfoModal />
    </PageContainer>
  );
}
