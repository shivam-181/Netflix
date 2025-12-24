'use client';
import styled from '@emotion/styled';
import Image from 'next/image';

const Container = styled.section`
  display: flex;
  background-color: black;
  color: white;
  padding: 2rem 5%; /* Smaller padding for mobile */
  justify-content: center;
  align-items: center;
  /* If direction is 'row-reverse', image is on left, text on right */
  flex-direction: column;

  @media (min-width: 960px) {
    padding: 50px 5%; /* Original padding for desktop */
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
  font-size: 1.75rem; /* Smaller font on mobile */
  font-weight: 900;
  margin-bottom: 1rem;
  
  @media (min-width: 600px) {
    font-size: 2.5rem;
  }
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
  z-index: 1;
`;

// "Unoptimized" prop is used for external images to save bandwidth on Vercel
interface FeatureRowProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  videoUrl?: string;
  direction?: 'row' | 'row-reverse';
}

export default function FeatureRow({ title, subtitle, imageUrl, videoUrl, direction = 'row' }: FeatureRowProps) {
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
      </ImagePane>
    </Container>
  );
}