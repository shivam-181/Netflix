'use client';
import { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { AiOutlineClose, AiOutlinePlus, AiOutlineCheck } from 'react-icons/ai'; 
import { FaPlay, FaThumbsUp, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useModalStore } from '@/store/useModalStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';
import { fetchTrailer, fetchDetails, fetchCredits, fetchLogo } from '@/lib/tmdb';

const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 30px;
  overflow-y: scroll;
`;

const ModalContainer = styled(motion.div)`
  position: relative;
  width: 90%;
  max-width: 850px;
  background-color: #181818;
  border-radius: 8px;
  overflow: hidden;
  color: white;
  margin-bottom: 50px;
  box-shadow: 0 0 20px rgba(0,0,0,0.5);
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 480px; 
  background-color: black;
  
  .video-frame {
     width: 100%;
     height: 100%;
     pointer-events: none; /* User interacts with custom buttons */
  }

  /* Gradient Vignette */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    background: linear-gradient(to top, #181818, transparent);
    pointer-events: none;
  }
`;

const FallbackImage = styled.div<{ bgUrl: string }>`
  width: 100%;
  height: 100%;
  background-image: url(${props => props.bgUrl});
  background-size: cover;
  background-position: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #181818;
  border: 2px solid rgba(255,255,255,0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s;

  &:hover { 
      border-color: white;
      background-color: #333;
  }
`;

const MuteButton = styled.button`
  position: absolute;
  bottom: 80px; 
  right: 50px; 
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255,255,255,0.3);
  background-color: rgba(0,0,0,0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  transition: all 0.2s;
  
  &:hover {
      background-color: rgba(255,255,255,0.1);
      border-color: white;
  }
`;

const ContentLayer = styled.div`
  padding: 0 40px 40px;
`;

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 20px;
  margin-top: -140px; 
  position: relative;
  z-index: 10;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  position: relative;
  z-index: 10;
`;

const PlayButton = styled.button`
  background: white;
  color: black;
  border: none;
  padding: 8px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;

  &:hover { background: #e6e6e6; }
`;

const CircleButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  background: rgba(42,42,42,0.6);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;

  &:hover { 
      border-color: white; 
      background: rgba(255,255,255,0.1);
  }
`;

const MetadataGrid = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr; 
  gap: 40px;
`;

const LeftCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StatsLine = styled.div`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    font-size: 1rem;
    color: white;
`;

const MatchText = styled.span`
  color: #46d369; 
  font-weight: bold;
`;

const Badge = styled.span`
    border: 1px solid rgba(255,255,255,0.4);
    border-radius: 2px;
    padding: 0 5px;
    font-size: 0.75rem;
    color: white;
`;

const AgeBadge = styled.span`
    border: 1px solid rgba(255,255,255,0.4);
    padding: 0 5px;
    font-size: 0.85rem;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: white;
`;

const RightCol = styled.div`
  font-size: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  .row {
      line-height: 1.4;
      color: #777;
  }
  
  .label {
      color: #777;
  }
  
  .value {
      color: white;
      cursor: pointer;
      &:hover { text-decoration: underline; }
  }
`;

const LogoImage = styled.img`
  width: 40%;
  max-width: 300px;
  max-height: 100px;
  object-fit: contain;
  margin-bottom: 20px;
  margin-top: -140px; 
  position: relative;
  z-index: 10;
  display: block;
`;

export default function InfoModal() {
  const { isOpen, movie, closeModal } = useModalStore();
  const router = useRouter();
  const { addToList, removeFromList, isInList } = useProfileStore();
  
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [muted, setMuted] = useState(true); 
  
  const [detailedMovie, setDetailedMovie] = useState<any>(null);
  const [credits, setCredits] = useState<any>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const isAdded = movie ? isInList(movie._id) : false;

  useEffect(() => {
     if (isOpen && movie) {
         setMuted(true); 
         
         const fetchData = async () => {
             const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
             
             // Parallel fetch
             const [trailer, details, creds, logo] = await Promise.all([
                 fetchTrailer(type, movie.id || movie._id),
                 fetchDetails(type, movie.id || movie._id),
                 fetchCredits(type, movie.id || movie._id),
                 fetchLogo(type, movie.id || movie._id)
             ]);

             setTrailerKey(trailer?.key || null);
             setDetailedMovie(details);
             setCredits(creds);
             setLogoUrl(logo);
         };
         fetchData();
     }
  }, [isOpen, movie]);

  const toggleList = () => {
    if (!movie) return;
    const id = movie._id || movie.id?.toString();
    const type = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    if (isAdded) removeFromList(id);
    else addToList(id, type);
  };

  const handleClose = useCallback(() => {
    closeModal();
    setTrailerKey(null);
  }, [closeModal]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handlePlay = () => {
    const id = movie._id || movie.id;
    if (id) {
      router.push(`/watch/${id}`);
      handleClose();
    }
  };

  // Helpers
  const getDuration = () => {
      if (detailedMovie?.runtime) {
          const h = Math.floor(detailedMovie.runtime / 60);
          const m = detailedMovie.runtime % 60;
          return `${h}h ${m}m`;
      }
      if (detailedMovie?.number_of_seasons) return `${detailedMovie.number_of_seasons} Seasons`;
      return '';
  };

  const getYear = () => {
      const date = detailedMovie?.release_date || detailedMovie?.first_air_date || movie?.release_date || movie?.first_air_date;
      return date ? new Date(date).getFullYear() : '';
  };

  return (
    <AnimatePresence>
      {isOpen && !!movie && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <ModalContainer
            initial={{ scale: 0.5, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 100 }}
            onClick={(e) => e.stopPropagation()}
            transition={{ duration: 0.3 }}
          >
            <CloseButton onClick={handleClose}>
              <AiOutlineClose size={20} />
            </CloseButton>

            <VideoContainer>
                {trailerKey ? (
                     <YouTube
                        videoId={trailerKey}
                        className="video-frame"
                        opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: {
                                autoplay: 1,
                                mute: muted ? 1 : 0,
                                controls: 0,
                                loop: 1,
                                playlist: trailerKey, 
                                modestbranding: 1
                            }
                        }}
                     />
                ) : (
                    <FallbackImage bgUrl={movie.backdropUrl || movie.thumbnailUrl} />
                )}
                
                {trailerKey && (
                    <MuteButton onClick={() => setMuted(!muted)}>
                        {muted ? <FaVolumeMute size={16} /> : <FaVolumeUp size={16} />}
                    </MuteButton>
                )}
            </VideoContainer>

            <ContentLayer>
              {logoUrl ? (
                  <LogoImage src={`https://image.tmdb.org/t/p/w500${logoUrl}`} alt={movie.title} />
              ) : (
                  <Title>{movie.title || movie.name}</Title>
              )}
              
              <ButtonRow>
                <PlayButton onClick={handlePlay}>
                  <FaPlay /> Play
                </PlayButton>
                <CircleButton onClick={toggleList}>
                   {isAdded ? <AiOutlineCheck size={20} /> : <AiOutlinePlus size={20} />}
                </CircleButton>
                <CircleButton>
                    <FaThumbsUp size={18} />
                </CircleButton>
              </ButtonRow>

              <MetadataGrid>
                <LeftCol>
                  <StatsLine>
                    <MatchText>98% Match</MatchText>
                    <span>{getYear()}</span>
                    <span>{getDuration()}</span>
                    <Badge>HD</Badge>
                    <AgeBadge>U/A 13+</AgeBadge>
                    {/* Placeholder for 'mild language' etc */}
                    {/* <span style={{ fontSize: '0.9rem', color: '#ccc' }}>mild language</span> */}
                  </StatsLine>
                  <Description>{detailedMovie?.overview || movie.description}</Description>
                </LeftCol>

                <RightCol>
                  {credits?.cast && (
                      <div className="row">
                          <span className="label">Cast: </span>
                          {credits.cast.slice(0, 4).map((c: any) => (
                              <span key={c.id} className="value">{c.name}, </span>
                          ))}
                          <span className="value" style={{ fontStyle: 'italic' }}>more</span>
                      </div>
                  )}
                  {detailedMovie?.genres && (
                      <div className="row">
                          <span className="label">Genres: </span>
                          {detailedMovie.genres.map((g: any) => (
                              <span key={g.id} className="value">{g.name}, </span>
                          ))}
                      </div>
                  )}
                </RightCol>
              </MetadataGrid>
              
              {/* Episodes (if available and needed) can go here */}

            </ContentLayer>
          </ModalContainer>
        </Backdrop>
      )}
    </AnimatePresence>
  );
}