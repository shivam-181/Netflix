'use client';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchSeasonDetails } from '@/lib/tmdb';
import { FaPlay } from 'react-icons/fa';

const Container = styled.div`
  margin-top: 30px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
  }
`;

const SeasonSelect = styled.select`
  background-color: #2a2a2a;
  color: white;
  border: 1px solid #444;
  padding: 8px 15px;
  font-size: 1rem;
  border-radius: 4px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: white;
  }
`;

const EpisodeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background-color: #333; /* Separator color */
  border-top: 1px solid #333;
`;

const EpisodeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: #181818;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #222;
    .play-icon { opacity: 1; }
  }
`;

const EpisodeNumber = styled.span`
  font-size: 1.5rem;
  color: #d2d2d2;
  font-weight: 500;
  width: 30px;
  text-align: center;
`;

const ThumbnailContainer = styled.div`
  position: relative;
  width: 140px;
  height: 80px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background-color: #333;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
`;

const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const HeaderRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.span`
    font-weight: 700;
    font-size: 1rem;
`;

const Duration = styled.span`
    font-size: 0.9rem;
    color: #a3a3a3;
`;

const Plot = styled.p`
    font-size: 0.85rem;
    color: #d2d2d2;
    line-height: 1.4;
    max-width: 90%;
    margin-top: 5px;
    
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

interface EpisodesListProps {
    tvId: number;
    seasons: any[];
}

export default function EpisodesList({ tvId, seasons }: EpisodesListProps) {
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [episodes, setEpisodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Filter out season 0 (specials) usually, unless desired. 
    // Netflix typically shows "Season 1", "Season 2" etc.
    const availableSeasons = seasons?.filter(s => s.season_number > 0) || [];

    useEffect(() => {
        const fetchEps = async () => {
             setLoading(true);
             const data = await fetchSeasonDetails(tvId, selectedSeason);
             if (data) {
                 setEpisodes(data.episodes);
             }
             setLoading(false);
        };
        fetchEps();
    }, [tvId, selectedSeason]);

    if (!availableSeasons.length) return null;

    return (
        <Container>
            <Header>
                <h3>Episodes</h3>
                <SeasonSelect 
                    value={selectedSeason} 
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                >
                    {availableSeasons.map((season) => (
                        <option key={season.id} value={season.season_number}>
                            {season.name}
                        </option>
                    ))}
                </SeasonSelect>
            </Header>

            <EpisodeList>
                {/* Fallback to dummy loop if loading or just to skeleton? For now simple text or keep old list until new loads */}
                {episodes.map((ep) => (
                    <EpisodeItem key={ep.id}>
                        <EpisodeNumber>{ep.episode_number}</EpisodeNumber>
                        <ThumbnailContainer>
                           {ep.still_path ? (
                               <Thumbnail src={`https://image.tmdb.org/t/p/w300${ep.still_path}`} alt={ep.name} />
                           ) : (
                               <div style={{ width: '100%', height: '100%', background: '#333' }} />
                           )}
                           <PlayOverlay className="play-icon">
                               <FaPlay color="white" size={20} />
                           </PlayOverlay>
                        </ThumbnailContainer>
                        
                        <Info>
                            <HeaderRow>
                                <Title>{ep.name}</Title>
                                <Duration>{ep.runtime}m</Duration>
                            </HeaderRow>
                            <Plot>{ep.overview}</Plot>
                        </Info>
                    </EpisodeItem>
                ))}
            </EpisodeList>
        </Container>
    );
}
