'use client';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchRecommendations, fetchDetails, fetchLogo } from '@/lib/tmdb';
import { useModalStore } from '@/store/useModalStore';
import { FaPlus } from 'react-icons/fa';

const Container = styled.div`
  margin-top: 40px;
  color: white;
  padding: 0 40px; /* Align with modal padding */
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); /* Wider cards */
  gap: 15px;
`;

const Card = styled.div`
  background-color: #2f2f2f;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ImageSection = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #202020;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const LogoOverlay = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  max-height: 60%;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
`;

const TitleFallback = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
`;

const DurationBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.8);
`;

const InfoSection = styled.div`
  padding: 15px;
  background-color: #2f2f2f;
  flex: 1; /* Fill height */
  display: flex;
  flex-direction: column;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const LeftMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  border: 1px solid #808080;
  padding: 2px 6px;
  font-size: 0.8rem;
  color: #dcdcdc;
  border-radius: 2px;
  white-space: nowrap;
`;

const YearText = styled.span`
  font-size: 0.9rem;
  color: #dcdcdc;
`;

const AddButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #808080;
  background: transparent;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:hover {
    border-color: white;
  }
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: #d2d2d2;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4; /* Limit to 4 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

interface MoreLikeThisProps {
    type: 'movie' | 'tv';
    id: number;
}

export default function MoreLikeThis({ type, id }: MoreLikeThisProps) {
    const [items, setItems] = useState<any[]>([]);
    const { openModal } = useModalStore();

    useEffect(() => {
        const fetchRecs = async () => {
            const data = await fetchRecommendations(type, id);
            
            if (data && data.results) {
                // Take top 9
                const baseItems = data.results.slice(0, 9);
                
                // Enrich items with details + logos parallel
                const enriched = await Promise.all(baseItems.map(async (item: any) => {
                    const mediaType = item.media_type || 'tv'; // assumption for recs
                    const [details, logo] = await Promise.all([
                        fetchDetails(mediaType, item.id),
                        fetchLogo(mediaType, item.id)
                    ]);
                    
                    return {
                        ...item,
                        details,
                        logoPath: logo
                    };
                }));

                setItems(enriched);
            }
        };
        fetchRecs();
    }, [type, id]);

    if (!items.length) return null;

    return (
        <Container>
            <Title>More Like This</Title>
            <Grid>
                {items.map((item) => {
                    const d = item.details || {};
                    const durationText = d.number_of_seasons 
                        ? `${d.number_of_seasons} Seasons` 
                        : (d.runtime ? `${Math.floor(d.runtime/60)}h ${d.runtime%60}m` : '');
                    
                    const year = (item.first_air_date || item.release_date || '').substring(0, 4);
                    const ageRating = item.adult ? 'A' : 'U/A 16+';

                    return (
                        <Card key={item.id} onClick={(e) => { e.stopPropagation(); openModal(item); }}>
                            <ImageSection>
                                <Thumbnail 
                                    src={item.backdrop_path ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}` : `https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                                    alt={item.title || item.name} 
                                />
                                {durationText && <DurationBadge>{durationText}</DurationBadge>}
                                {item.logoPath ? (
                                    <LogoOverlay src={item.logoPath.startsWith('http') ? item.logoPath : `https://image.tmdb.org/t/p/w300${item.logoPath}`} />
                                ) : (
                                    <TitleFallback>{item.title || item.name}</TitleFallback>
                                )}
                            </ImageSection>
                            
                            <InfoSection>
                                <MetaRow>
                                    <LeftMeta>
                                        <Badge>{ageRating}</Badge>
                                        <Badge>HD</Badge>
                                        <YearText>{year}</YearText>
                                    </LeftMeta>
                                    <AddButton onClick={(e) => { e.stopPropagation(); /* Add to list logic */ }}>
                                        <FaPlus />
                                    </AddButton>
                                </MetaRow>
                                <Description>
                                    {item.overview}
                                </Description>
                            </InfoSection>
                        </Card>
                    );
                })}
            </Grid>
        </Container>
    );
}
