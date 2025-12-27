import { useEffect, useState, useRef, useMemo } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { FaPlay, FaInfoCircle, FaVolumeMute, FaVolumeUp } from 'react-icons/fa'; 
import { useModalStore } from '@/store/useModalStore';
import { fetchLogo, fetchTrailer } from '@/lib/tmdb';
import YouTube from 'react-youtube';

const Container = styled.div`
  position: relative;
  height: 100vh;
  width: 100%;
  background-color: black;
  color: white;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, #141414 0%, transparent 50%);
    z-index: 2;
    pointer-events: none;
  }
`;

const BackgroundImage = styled.img<{ show: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 1; 
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const VideoWrapper = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: ${props => (props.show ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  pointer-events: none;
  overflow: hidden;

  iframe {
    width: 100vw;
    height: 56.25vw; /* Given 16:9 aspect ratio */
    min-height: 100vh;
    min-width: 177.77vh; /* Given 16:9 aspect ratio */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.18); /* Scale reduced to fit better */
  }
`;

const InfoLayer = styled.div`
  position: absolute;
  top: 35%; /* Moved up to fix interaction issues */
  left: 4%;
  width: 36%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  
  @media (max-width: 800px) {
    width: 80%;
    top: 45%;
  }
`;

const BrandLogo = styled.img`
  height: 20px; 
  margin-bottom: 10px;
  object-fit: contain;
  align-self: flex-start;
`;

const MovieTitle = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  
  @media (max-width: 800px) { font-size: 2rem; }
`;

const LogoImage = styled.img`
  width: 100%;
  max-width: 350px;
  max-height: 150px;
  object-fit: contain;
  margin-bottom: 20px;
  align-self: flex-start;
`;

const Description = styled.p`
  font-size: 1.2rem;
  margin: 0; /* Handled by wrapper */
  text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 800px) { font-size: 1rem; }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const PlayButton = styled.button`
  background-color: white;
  color: black;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  z-index: 25;

  &:hover { background-color: rgba(255,255,255,0.75); }
`;

const InfoButton = styled.button`
  background-color: rgba(109, 109, 110, 0.7);
  color: white;
  border: none;
  padding: 10px 25px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover { background-color: rgba(109, 109, 110, 0.4); }
`;

const RightControls = styled.div`
  position: absolute;
  right: 0;
  bottom: 35%;
  display: flex;
  align-items: center;
  z-index: 20;
`;

const MuteButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.3);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover { background: rgba(255, 255, 255, 0.1); border-color: white; }
`;

const AgeBadge = styled.div`
  background: rgba(51, 51, 51, 0.6);
  border-left: 3px solid #dcdcdc;
  padding: 8px 35px 8px 15px; /* Extended padding right */
  color: white;
  font-size: 1.1rem;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

interface Movie {
  _id: string;
  id?: number; 
  title: string;
  description: string;
  thumbnailUrl: string; 
  backdropUrl?: string; 
  videoUrl?: string; 
  media_type?: 'movie' | 'tv';
  logoUrl?: string; // Custom logo override
}

interface BillboardProps {
  movie: Movie | null;
}

const FadeInElement = styled.div<{ show: boolean }>`
  opacity: ${props => (props.show ? 1 : 0)};
  transform: translateY(${props => (props.show ? '0' : '20px')});
  max-height: ${props => (props.show ? '200px' : '0px')};
  margin-bottom: ${props => (props.show ? '20px' : '10px')}; /* Keep small gap when hidden */
  overflow: hidden;
  transition: all 1s ease-in-out;
  transition-delay: ${props => (props.show ? '0.5s' : '0s')};
`;

export default function Billboard({ movie }: BillboardProps) {
  const router = useRouter();
  const { openModal } = useModalStore();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [muted, setMuted] = useState(true);

  const playerRef = useRef<any>(null);

  // Custom options for YouTube player - Stable reference
  const opts = useMemo(() => ({
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      loop: 0, 
      mute: 1, // Always init muted, control via API later
    },
  }), []);

  useEffect(() => {
    if (movie && movie.id) {
        // Reset state for new movie
        setLogoUrl(movie.logoUrl || null);
        setTrailerKey(null);
        setShowVideo(false);
        setMuted(true);
        // Reset player ref
        playerRef.current = null;

        const fetch = async () => {
            const type = movie.media_type || 'movie'; 
            
            // If custom logo exists, only fetch trailer
            if (movie.logoUrl) {
                const trailer = await fetchTrailer(type, movie.id!);
                if (trailer) setTrailerKey(trailer.key);
                return;
            }

            // Parallel Fetch (Logo + Trailer)
            const [logo, trailer] = await Promise.all([
               fetchLogo(type, movie.id!),
               fetchTrailer(type, movie.id!)
            ]);

            setLogoUrl(logo);
            if (trailer) setTrailerKey(trailer.key);
        };
        fetch();
    }
  }, [movie]);

  // Video Delay Logic
  useEffect(() => {
      const timer = setTimeout(() => {
          if (trailerKey) {
              setShowVideo(true);
          }
      }, 2000); // 2 seconds delay

      return () => clearTimeout(timer);
  }, [trailerKey]);

  // Sync Mute State with Player
  useEffect(() => {
    if (playerRef.current) {
        if (muted) {
            playerRef.current.mute();
        } else {
            playerRef.current.unMute();
        }
    }
  }, [muted]);

  if (!movie) return null; 
  


  return (
    <Container>
      <BackgroundImage show={!showVideo} src={movie.backdropUrl || movie.thumbnailUrl} alt={movie.title} />
      
      {trailerKey && (
          <VideoWrapper show={showVideo}>
             <YouTube
                videoId={trailerKey}
                opts={opts}
                onReady={(e) => {
                    playerRef.current = e.target;
                    if (muted) e.target.mute(); // Ensure sync on load
                }}
                onEnd={() => setShowVideo(false)}
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100vw', height: '100vh', pointerEvents: 'none' }}
                className="video-iframe"
             />
          </VideoWrapper>
      )}

      <InfoLayer>
        {logoUrl ? (
            <>
              {movie.title !== 'Stranger Things' && <BrandLogo src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" alt="Netflix" />}
              <LogoImage 
                src={logoUrl.startsWith('http') ? logoUrl : `https://image.tmdb.org/t/p/w500${logoUrl}`} 
                alt={movie.title} 
              />
            </>
        ) : (
            <MovieTitle>{movie.title}</MovieTitle>
        )}
         
        <FadeInElement show={!showVideo}>
            <Description>{movie.description}</Description>
        </FadeInElement>
            
        <ButtonRow>
          <PlayButton onClick={() => router.push(`/watch/${movie._id}?type=${movie.media_type || 'movie'}`)}>
            <FaPlay /> Play
          </PlayButton>
          <InfoButton onClick={() => openModal(movie)}>
            <FaInfoCircle /> More Info
          </InfoButton>
        </ButtonRow>
      </InfoLayer>

      <RightControls>
          <MuteButton onClick={() => setMuted(!muted)}>
            {muted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </MuteButton>
          <AgeBadge>U/A 13+</AgeBadge>
      </RightControls>
    </Container>
  );
}