'use client';
import styled from '@emotion/styled';
import { ASSETS } from '@/constants/assets';
import LandingNavbar from './LandingNavbar';

const HeroContainer = styled.div`
  position: relative;
  min-height: 100vh; /* changed from fixed height to min-height */
  width: 100%;
  background-image: url(${ASSETS.LANDING_BG});
  background-size: cover;
  background-position: center;
  
  /* The dark overlay logic */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4); /* 40% opacity black */
    background-image: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0,
      rgba(0, 0, 0, 0) 60%,
      rgba(0, 0, 0, 0.8) 100%
    );
  }
`;

const Content = styled.div`
  position: relative;
  z-index: 1; 
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  /* Reduced top padding for mobile to bring content up */
  padding-top: 6rem; 
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;
  color: white;

  @media (min-width: 960px) {
    padding-top: 8rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem; /* Mobile first size */
  font-weight: 900;
  margin-bottom: 1rem;
  max-width: 600px;
  line-height: 1.1; 
  letter-spacing: -1px;

  @media (min-width: 600px) {
    font-size: 2.5rem;
  }
  @media (min-width: 960px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  margin-bottom: 1rem;
  font-weight: 500;
  
  @media (min-width: 960px) {
    font-size: 1.5rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px; /* Increased gap for touch targets on mobile */
  width: 100%;
  max-width: 580px; 
  margin-top: 1.5rem;

  @media (min-width: 960px) {
    flex-direction: row;
    align-items: center;
    gap: 8px; 
  }
`;

const Input = styled.input`
  flex: 1;
  width: 100%; /* Full width on mobile */
  height: 3rem; /* Slightly smaller for mobile */
  padding: 0 1rem;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, 0.7);
  background: rgba(22, 22, 22, 0.7); 
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: #b3b3b3;
  }

  @media (min-width: 960px) {
    height: 3.5rem;
  }
`;

const GetStartedButton = styled.button`
  width: 100%; /* Full width button on mobile */
  height: 3rem; 
  background-color: var(--netflix-red);
  color: white;
  border: none;
  padding: 0 1rem;
  font-size: 1.125rem; /* Smaller font on mobile */
  font-weight: 500;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background-color: #c11119;
  }

  @media (min-width: 600px) {
     width: auto; /* Auto width on larger screens */
     padding: 0 1.5rem;
     font-size: 1.5rem;
  }

  @media (min-width: 960px) {
    height: 3.5rem;
  }
`;

export default function LandingHero() {
  return (
    <HeroContainer>
      <LandingNavbar />
      
      <Content>
        <Title>Unlimited movies, shows, and more</Title>
        <Subtitle>Starts at ₹149. Cancel at any time.</Subtitle>
        <p style={{ fontSize: '1.125rem', marginBottom: '0', fontWeight: 400, padding: '0 20px', lineHeight: '1.5' }}>
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        <Form action="/auth/signup">
          <Input type="email" placeholder="Email address" required />
          <GetStartedButton type="submit">
            Get Started &gt;
          </GetStartedButton>
        </Form>
      </Content>
    </HeroContainer>
  );
}