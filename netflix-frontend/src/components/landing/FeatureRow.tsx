'use client';
import styled from '@emotion/styled';
import Image from 'next/image';

const Container = styled.section`
  display: flex;
  background-color: black;
  color: white;
  padding: 50px 5%;
  justify-content: center;
  align-items: center;
  /* If direction is 'row-reverse', image is on left, text on right */
  flex-direction: column;

  @media (min-width: 960px) {
    flex-direction: ${({ direction }: { direction?: string }) => direction || 'row'};
  }
`;

const TextPane = styled.div`
  flex: 1;
  text-align: center;
  padding: 0 1rem;
  z-index: 2;

  @media (min-width: 960px) {
    text-align: left;
    padding: 0 3rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 1rem;
  
  @media (min-width: 960px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  font-weight: 400;
  
  @media (min-width: 960px) {
    font-size: 1.5rem;
  }
`;

const ImagePane = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Video = styled.video`
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -54%);
  width: 73%;
  height: auto;
  height: auto;
  z-index: 1;
`;

const DownloadBox = styled.div`
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  background: black;
  border: 2px solid #222;
  border-radius: 0.75rem;
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 60%;
  min-width: 15rem;
  z-index: 3;
  box-shadow: 0 0 2em 0 black;
`;

const BoxImage = styled.img`
  height: 3rem;
  width: auto;
`;

const BoxText = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  text-align: left; /* Ensure text aligns left even if parent is centered */
`;

const BoxTitle = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const BoxStatus = styled.div`
  color: #0071eb;
  font-size: 0.75rem;
  font-weight: 400;
`;

const DownloadGif = styled.img`
  height: 3rem;
  width: 3rem;
`;

// "Unoptimized" prop is used for external images to save bandwidth on Vercel
interface FeatureRowProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string;
  hasDownloadAnimation?: boolean;
  direction?: 'row' | 'row-reverse';
}

export default function FeatureRow({ title, subtitle, imageUrl, videoUrl, hasDownloadAnimation, direction = 'row' }: FeatureRowProps) {
  return (
    <Container direction={direction}>
      <TextPane>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
      </TextPane>
      <ImagePane>
        <img src={imageUrl} alt={title} style={{ position: 'relative', zIndex: 2, maxWidth: '100%', height: 'auto' }} />
        {videoUrl && (
          <Video autoPlay playsInline muted loop>
            <source src={videoUrl} type="video/mp4" />
          </Video>
        )}
        {hasDownloadAnimation && (
          <DownloadBox>
            <BoxImage src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/boxshot.png" alt="Stranger Things" />
            <BoxText>
              <BoxTitle>Stranger Things</BoxTitle>
              <BoxStatus>Downloading...</BoxStatus>
            </BoxText>
            <DownloadGif src="https://assets.nflxext.com/ffe/siteui/acquisition/ourStory/fuji/desktop/download-icon.gif" alt="Downloading" />
          </DownloadBox>
        )}
      </ImagePane>
    </Container>
  );
}