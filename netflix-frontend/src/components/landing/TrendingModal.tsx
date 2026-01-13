'use client';
import styled from '@emotion/styled';
import { useEffect } from 'react';
/* import { FaTimes } from 'react-icons/fa'; Removed for custom SVG */
import MoreLikeThis from '@/components/common/MoreLikeThis';


interface TrendingModalProps {
  item: any;
  onClose: () => void;
}

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 700px; /* Reduced from 850px */
  max-height: 90vh; /* Limit height to viewport */
  overflow-y: auto; /* Allow vertical scrolling */
  overflow-x: hidden;
  background: #181818;
  border-radius: 6px;
  /* overflow: hidden; Removed to allow scroll */
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s ease-out;

  /* Custom Scrollbar Styles */
  &::-webkit-scrollbar {
    width: 30px;
    display: block;
  }
  &::-webkit-scrollbar-track {
    background: white; 
    border-radius: 4px;
    margin: 6px 0; /* Add some spacing top/bottom */
  }
  &::-webkit-scrollbar-thumb {
    background: #8e8e8e; /* Gray thumb */
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  /* Firefox Scrollbar */
  scrollbar-width: thick;
  scrollbar-color: #8e8e8e white;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const HeroSection = styled.div<{ bgUrl: string }>`
  height: 400px; /* Reduced to move info up */
  background-image: linear-gradient(to top, #181818, transparent 50%),
                    url(${props => props.bgUrl});
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 40px 50px 20px 50px; /* Padding for the Title/Logo */
`;

const InfoSection = styled.div`
  padding: 10px 50px 40px 50px;
  background: #181818;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent; /* Removed circle bg */
  border: none;
  color: white;
  width: 42px;
  height: 42px;
  /* border-radius: 50%; Removed circle */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  
  &:hover {
    background: transparent;
    transform: scale(1.1);
  }
`;

const LogoOrTitle = styled.div`
  margin-bottom: 20px;
`;

const LogoValues = styled.img`
  width: 300px;
  object-fit: contain;
`;

const TitleText = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  text-transform: uppercase;
  margin: 0;
  font-family: 'Arial Black', sans-serif; /* Fallback for impact-like font */
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background: #404040; /* Darker gray background for all */
  color: #dcdcdc;
  padding: 4px 8px;
  font-size: 0.9rem;
  border-radius: 4px;
  font-weight: 400;
  border: 1px solid transparent; /* Ensure consistent box model */
  
  /* Removed specific overrides to make them look uniform like the image */
  &.year {
    color: #dcdcdc;
    font-weight: 400;
  }
  
  &.maturity {
    border: 1px solid transparent; 
  }
`;

const Description = styled.p`
  color: white;
  font-size: 1.1rem;
  line-height: 1.5;
  max-width: 600px;
  margin-bottom: 30px;
`;

const GetStartedButton = styled.a`
  display: inline-flex;
  align-self: flex-start; /* Prevent stretching */
  align-items: center;
  gap: 10px;
  background-color: #e50914;
  color: white;
  padding: 12px 32px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background-color: #f40612;
  }
`;

// Default content fallback
const DEFAULT_DESC = "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.";

export default function TrendingModal({ item, onClose }: TrendingModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const metaList = item.genres || ['Show', 'Horror', 'Sci-Fi', 'Dramas'];

  return (
    <Backdrop onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <HeroSection bgUrl={item.backdropUrl || item.img}>
          <CloseButton onClick={onClose}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6L18 18M6 18L18 6" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </CloseButton>
          
          <LogoOrTitle>
            {item.logoUrl ? (
              <LogoValues src={item.logoUrl} alt={item.title} />
            ) : (
              <TitleText>{item.title}</TitleText>
            )}
          </LogoOrTitle>
        </HeroSection>

        <InfoSection>
          <MetaRow>
            <Badge className="year">{item.year || '2025'}</Badge>
            <Badge className="maturity">{item.maturity || 'U/A 16+'}</Badge>
            {item.media_type && <Badge>{item.media_type}</Badge>}
            <Badge>HD</Badge>
            <Badge>5.1</Badge>
            {metaList && metaList.length > 0 && metaList.map((g: string, i: number) => (
              <Badge key={i}>{g}</Badge>
            ))}
          </MetaRow>

          <Description>
            {item.description || DEFAULT_DESC}
          </Description>

          <GetStartedButton href="/auth/signup">
            Get Started 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </GetStartedButton>
        </InfoSection>

        {/* More Like This Section */}
        <MoreLikeThis 
            type={item.media_type === 'movie' ? 'movie' : 'tv'} 
            id={item.id} 
        />
      </ModalContainer>
    </Backdrop>
  );
}
