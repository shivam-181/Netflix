'use client';
import { useEffect, useState, useRef } from 'react';
import styled from '@emotion/styled';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { FaArrowLeft, FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaCompress, FaExpand, FaUndo, FaForward } from 'react-icons/fa';
import api from '@/lib/axios';
import tmdb, { fetchTrailer } from '@/lib/tmdb';
import { useProfileStore } from '@/store/useProfileStore';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  background-color: black;
  position: relative;
  overflow: hidden;
  user-select: none;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const YouTubeFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  pointer-events: auto; /* Allow interaction with YouTube controls */
`;

// Overlay covering the video
const ControlsOverlay = styled.div<{ show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.7) 0%,
    rgba(0,0,0,0) 20%,
    rgba(0,0,0,0) 80%,
    rgba(0,0,0,0.7) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  pointer-events: none; /* Let clicks pass through to video/iframe if needed, BUT buttons need pointer-events: auto */
  z-index: 10;
`;

// Top Bar
const TopBar = styled.div`
  display: flex;
  align-items: center;
  padding: 20px 4%;
  color: white;
  gap: 20px;
  pointer-events: auto; /* Enable clicking back button */
`;



// Bottom Bar
const BottomControls = styled.div`
  padding: 20px 4%;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
  pointer-events: auto;
`;

const ScrubberContainer = styled.div`
  position: relative;
  width: 100%;
  height: 6px;
  background: #555;
  border-radius: 3px;
  cursor: pointer;
  transition: height 0.1s;

  &:hover {
    height: 10px;
  }

  /* When hovering scrubber, affect progress bar dot */
  &:hover .progress-dot {
    transform: translateY(-50%) scale(1);
    background: white;
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: ${({ progress }) => progress}%;
  height: 100%;
  background: #e50914;
  border-radius: 3px;
  position: relative;
`;

const ProgressDot = styled.div`
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%) scale(0);
  width: 16px;
  height: 16px;
  background: #e50914;
  border-radius: 50%;
  transition: transform 0.1s;
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LeftButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const RightButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  font-weight: 500;
  font-size: 1.1rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s;

  &:hover {
    transform: scale(1.1);
    color: #e5e5e5;
  }
`;

// Skip Intro Button
const SkipButton = styled.button`
  position: absolute;
  bottom: 120px;
  right: 4%;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: white;
  padding: 8px 16px;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
  z-index: 20;
  pointer-events: auto;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  font-size: 2rem;
`;

const FallbackContainer = styled.div<{ bg: string }>`
  height: 100vh;
  width: 100vw;
  background-image: url(${props => props.bg});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(8px);
    z-index: 1;
  }
`;

const FallbackContent = styled.div`
  position: relative;
  z-index: 10;
  text-align: center;
  max-width: 800px;
  padding: 40px;
`;

const FallbackTitle = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(to right, #e50914, #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  @media (max-width: 768px) { font-size: 2.5rem; }
`;

const FallbackMessage = styled.p`
  font-size: 1.5rem;
  color: #ddd;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const HomeButton = styled.button`
  background-color: #e50914;
  color: white;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s, background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background-color: #b20710;
    transform: scale(1.05);
  }
`;

function formatTime(seconds: number) {
  if (!seconds) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const episodeIndex = searchParams.get('episodeIndex');
  const typeParam = searchParams.get('type'); // Get passed type

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [movie, setMovie] = useState<any>(null);
  const [currentEpisode, setCurrentEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSkip, setShowSkip] = useState(false);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { updateProgress, currentProfile } = useProfileStore();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (!id) return;
        
        // Check local history first for resume
        const historyItem = currentProfile?.watchHistory?.find(h => h.contentId === id);
        const startParams = historyItem ? historyItem.progress : 0;

        let data;
        let foundTrailer = null;
        let isTrailler = false;

        // PRIORITIZED: Fetch Trailer immediately if type is known
        if (typeParam) {
            try {
                const trailer = await fetchTrailer(typeParam as 'movie' | 'tv', Number(id));
                if (trailer) {
                    foundTrailer = trailer.key;
                    console.log(`Found trailer using param type ${typeParam}:`, trailer.key);
                }
            } catch(e) {}
        }

        try {
           // 1. Try Local Fetch
           const res = await api.get(`/content/${id}`);
           data = res.data;

           // 2. If trailer not found yet, try aggressively from TMDB
           if (!foundTrailer) {
               try {
                   const tmdbId = Number(data.id || id);
                   if (!isNaN(tmdbId)) {
                       let trailer = await fetchTrailer('movie', tmdbId);
                       if (!trailer) trailer = await fetchTrailer('tv', tmdbId);
                       if (trailer) foundTrailer = trailer.key;
                   }
               } catch (ignore) {}
           }

        } catch (localErr) {
           // 3. Fallback logic (Full TMDB fetch)
           console.log("Local fetch failed, trying TMDB for ID:", id);
           try {
               const targetType = typeParam || 'movie'; // Use param or default to movie
               
               // Try the target type first
               let tmdbRes;
               try {
                  tmdbRes = await tmdb.get(`/${targetType}/${id}`);
               } catch(e) {
                   // If failed and type wasn't explicit, try the other
                   if (!typeParam) tmdbRes = await tmdb.get(targetType === 'movie' ? `/tv/${id}` : `/movie/${id}`);
                   else throw e;
               }

               const finalType = tmdbRes.data.title ? 'movie' : 'series'; // Simple heuristic
               
               // Fetch Trailer one last time if still needed
               if (!foundTrailer) {
                  const tr = await fetchTrailer(finalType === 'movie' ? 'movie' : 'tv', Number(id));
                  if (tr) foundTrailer = tr.key;
               }

               data = {
                   title: tmdbRes.data.title || tmdbRes.data.name,
                   description: tmdbRes.data.overview,
                   thumbnailUrl: `https://image.tmdb.org/t/p/original${tmdbRes.data.backdrop_path}`,
                   type: finalType,
                   episodes: [] 
               };

           } catch (e) {
              console.error("Content not found on TMDB either");
              setLoading(false);
              return;
           }
        }
        
        setMovie(data);
        if (foundTrailer) {
            setTrailerKey(foundTrailer);
            isTrailler = true;
        }

        // Determine what to play (Only if no trailer found)
        if (!isTrailler) {
            if (data.type === 'series' && data.episodes?.length > 0) {
              const idx = episodeIndex ? parseInt(episodeIndex) : 0;
              setCurrentEpisode(data.episodes[idx]);
            } else {
              // STRICT: No fallback. 
              setCurrentEpisode({
                title: data.title,
                videoUrl: data.videoUrl 
              });
            }
    
            // Slight delay
            setTimeout(() => {
                if (videoRef.current && startParams > 0) {
                    videoRef.current.currentTime = startParams;
                }
            }, 100);
        }

      } catch (err) {
        // console.error("Failed to load video", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, episodeIndex, currentProfile]);

  // Periodic Save (Only for Custom Player)
  useEffect(() => {
      if (trailerKey) return; 

      const interval = setInterval(() => {
          if (videoRef.current && !videoRef.current.paused) {
             const curr = videoRef.current.currentTime;
             const dur = videoRef.current.duration;
             if (curr > 5) { // Only save if watched > 5s
                 updateProgress({
                     contentId: id as string,
                     progress: curr,
                     duration: dur,
                     title: movie?.title,
                     thumbnailUrl: movie?.thumbnailUrl
                 });
             }
          }
      }, 10000); // Every 10s

      return () => clearInterval(interval);
  }, [id, movie, trailerKey]);

  // 2. Controls Visibility Logic
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
       if (isPlaying) setShowControls(false); // Only hide if playing
    }, 3000);
  };

  // 3. Main Video Logic
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(curr);
    setDuration(dur);
    setProgress((curr / dur) * 100);

    // Skip Intro Logic (Show for first 30s)
    if (curr > 0 && curr < 30) setShowSkip(true);
    else setShowSkip(false);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
  };

  const skipIntro = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += 30; // Jump 30s
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const rewind10 = () => {
     if (!videoRef.current) return;
     videoRef.current.currentTime -= 10;
  };

  const forward10 = () => {
     if (!videoRef.current) return;
     videoRef.current.currentTime += 10;
  };

  const toggleFullscreen = () => {
     if (!containerRef.current) return;
     if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
     } else {
        document.exitFullscreen();
        setIsFullscreen(false);
     }
  };

  if (loading) return <Loading>Loading...</Loading>;
  if (!movie) return <Loading>Content not found</Loading>;

  // Trailer View
  if (trailerKey) {
      return (
        <Container>
            <ControlsOverlay show={true} style={{ background: 'transparent', pointerEvents: 'none' }}>
                <TopBar>
                </TopBar>
            </ControlsOverlay>

            <YouTubeFrame 
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&modestbranding=1&rel=0&iv_load_policy=3&controls=1`}
                title="Trailer"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
            />
        </Container>
      );
  }

  // Regular Player View
  if (!currentEpisode) return <Loading>Video unavailable</Loading>;
  if (!currentEpisode.videoUrl) {
      return (
          <FallbackContainer bg={movie.thumbnailUrl || "https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg"}>
              <FallbackContent>
                  <FallbackTitle>Trailer In Production</FallbackTitle>
                  <FallbackMessage>
                      The reel for <strong>{movie.title}</strong> is currently being polished in the editing room.
                      <br />
                      Check back soon for an exclusive first look!
                  </FallbackMessage>
                  <HomeButton onClick={() => router.back()}>
                      <FaArrowLeft /> Return to Browse
                  </HomeButton>
              </FallbackContent>
          </FallbackContainer>
      );
  }

  return (
    <Container ref={containerRef} onMouseMove={handleMouseMove} onMouseLeave={() => isPlaying && setShowControls(false)}>
      
      <Video 
        ref={videoRef}
        src={currentEpisode.videoUrl}
        autoPlay
        playsInline
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Skip Intro Button */}
      {showSkip && showControls && (
        <SkipButton onClick={skipIntro}>Skip Intro</SkipButton>
      )}

      {/* Custom Overlay */}
      <ControlsOverlay show={showControls}>
        
        {/* Top Bar */}
        {/* Top Bar */}
        <TopBar>
        </TopBar>

        {/* Bottom Bar */}
        <BottomControls>
           {/* Scrubber */}
           <ScrubberContainer onClick={handleSeek}>
              <ProgressBar progress={progress}>
                <ProgressDot className="progress-dot" />
              </ProgressBar>
           </ScrubberContainer>

           <ControlsRow>
              <LeftButtons>
                 <IconButton onClick={togglePlay}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                 </IconButton>
                 <IconButton onClick={rewind10}>
                    <FaUndo size={20} />
                 </IconButton>
                 <IconButton onClick={forward10}>
                    <FaForward size={20} />
                 </IconButton>
                 <IconButton onClick={toggleMute}>
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                 </IconButton>
                 <span style={{fontSize: '0.9rem'}}>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </LeftButtons>

              <RightButtons>
                 <span>{currentEpisode.title || movie.title}</span>
                 <IconButton onClick={toggleFullscreen}>
                    {isFullscreen ? <FaCompress /> : <FaExpand />}
                 </IconButton>
              </RightButtons>
           </ControlsRow>
        </BottomControls>

      </ControlsOverlay>

    </Container>
  );
}