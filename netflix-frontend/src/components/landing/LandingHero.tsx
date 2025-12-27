'use client';
import styled from '@emotion/styled';
import { ASSETS } from '@/constants/assets';
import LandingNavbar from './LandingNavbar';

const HeroContainer = styled.div`
  position: relative;
  height: 100vh; /* Restore to standard viewport height for better cover fit */
  min-height: 45rem; /* Ensure minimum height */
  width: 100%;
  background-image: url(${ASSETS.LANDING_BG});
  background-size: 100%; /* Fully touches the sides */
  background-position: center 40%; /* Kept the slight upward shift */
  background-repeat: no-repeat;
  background-color: #000;
  
  /* The dark overlay logic */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    /* Diming the background + Dual gradients */
    background-color: rgba(0, 0, 0, 0.4); /* General dim (40%) */
    background-image: 
      linear-gradient(to bottom, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 60%),
      radial-gradient(ellipse 150% 100% at 50% 100%, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%);
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
  padding: 0 1rem 2rem; /* Reduced bottom padding to move content down */
  color: white;
  box-sizing: border-box; 
`;

const Title = styled.h1`
  font-size: 1.75rem; /* Reduced base size */
  font-weight: 700;
  margin-bottom: 0.5rem;
  max-width: 640px;
  line-height: 1.25;

  @media (min-width: 600px) {
    font-size: 2rem;
    font-weight: 700;
  }

  @media (min-width: 960px) {
    font-size: 2.5rem;
    font-weight: 700;
  }

  @media (min-width: 1280px) {
    font-family: unset;
    font-size: 3.5rem; /* Increased from 3rem */
    font-weight: 900;
    margin-bottom: 0.75rem; 
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 700; /* Bold */
  margin-bottom: 1rem;
  color: rgb(255, 255, 255);
  
  @media (min-width: 600px) {
    font-size: 1rem;
    font-weight: 700;
  }

  @media (min-width: 960px) {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  @media (min-width: 1280px) {
    font-family: unset;
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 2rem; /* Increased to push "Ready..." & Form further down */
    margin-top: 1rem;
  }
`;

const Description = styled.h3`
  font-size: 0.875rem; /* Reduced to small */
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  color: white;

  @media (min-width: 960px) {
    font-size: 1rem; 
    font-family: unset;
    font-weight: 400;
    line-height: 1.5;
    color: rgb(255, 255, 255);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 36.625rem; /* Precise width per snippet */
  margin: 1rem auto 0; /* Increased from 0.5rem to push form down (spacing "Ready to watch" up) */
  padding-top: 0; /* Removed padding to bring closer */

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-start; /* Aligns input and button tops */
    gap: 8px; 
  }
`;

const Input = styled.input`
  flex: 1;
  height: 3.5rem; /* ~56px height */
  padding: 0 1rem;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, 0.7);
  background: rgba(22, 22, 22, 0.7); /* Darker translucent */
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: #b3b3b3;
  }
`;

const GetStartedButton = styled.button`
  box-sizing: border-box; 
  min-height: 3.5rem;
  width: auto;
  padding: 0.75rem 1rem; /* Reduced horizontal padding */
  font-size: 1.125rem; /* Base size */
  font-weight: 600; /* Bold per image */
  border-radius: 0.25rem; /* 4px */
  background: #e50914; /* TrendingModal Red */
  color: white; 
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem; 
  white-space: nowrap;
  
  /* Transitions per snippet */
  transition-duration: 250ms;
  transition-property: background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.68, 0.06);

  /* Layout & Resets */
  line-height: 1;
  letter-spacing: normal;
  vertical-align: text-top;
  appearance: none;
  user-select: none;
  fill: currentcolor;

  position: relative; 

  &::after {
    inset: 0px;
    position: absolute;
    transition: inherit;
    border-style: solid;
    border-width: 0.0625rem;
    border-radius: calc(0.1875rem); 
    content: "";
    border-color: rgba(0, 0, 0, 0);
  }

  &:hover {
    background: #f40612; /* Lighter Red per TrendingModal */
  }

  @media (min-width: 1280px) {
      font-size: 1.5rem; /* Large size for large screens */
  }
`;

const NavBarGradient = styled.div`
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.8000) 0.000%, rgba(0, 0, 0, 0.7889) 8.333%, rgba(0, 0, 0, 0.7556) 16.67%, rgba(0, 0, 0, 0.7000) 25.00%, rgba(0, 0, 0, 0.6222) 33.33%, rgba(0, 0, 0, 0.5222) 41.67%, rgba(0, 0, 0, 0.4000) 50.00%, rgba(0, 0, 0, 0.2778) 58.33%, rgba(0, 0, 0, 0.1778) 66.67%, rgba(0, 0, 0, 0.1000) 75.00%, rgba(0, 0, 0, 0.04444) 83.33%, rgba(0, 0, 0, 0.01111) 91.67%, rgba(0, 0, 0, 0.000) 100.0%);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10rem; /* Covers navbar and a bit more */
  z-index: 2;
`;

export default function LandingHero() {
  return (
    <HeroContainer>
      <NavBarGradient />
      <LandingNavbar />
      
      <Content>
        <Title>Unlimited movies, shows, and more</Title>
        <Subtitle>Starts at ₹149. Cancel at any time.</Subtitle>
        <Description>
          Ready to watch? Enter your email to create or restart your membership.
        </Description>

        <Form action="/auth/signup">
          <Input type="email" placeholder="Email address" required />
          <GetStartedButton type="submit">
            Get Started 
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </GetStartedButton>
        </Form>
      </Content>
    </HeroContainer>
  );
}