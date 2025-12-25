'use client';
import styled from '@emotion/styled';
import { ASSETS } from '@/constants/assets';
import LandingNavbar from './LandingNavbar';

const HeroContainer = styled.div`
  position: relative;
  height: 115vh; /* Stretched a bit per request */
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
  padding: 0 1rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
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
    font-size: 3.5rem;
    font-weight: 900;
    margin-bottom: 1rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: rgb(255, 255, 255);
  
  @media (min-width: 600px) {
    font-size: 1rem;
    font-weight: 400;
  }

  @media (min-width: 960px) {
    font-size: 1rem;
    font-weight: 400;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 1280px) {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 2rem;
  }
`;

const Description = styled.h3`
  font-size: 1.125rem; /* 18px */
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  color: white;

  @media (min-width: 960px) {
    font-size: 1.25rem; /* 20px */
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 36.625rem; /* Precise width per snippet */
  margin: 1rem auto 0;
  padding-top: 16px;

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
  min-height: 3.5rem;
  width: auto;
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem; /* Base size */
  font-weight: 500;
  border-radius: 0.25rem; /* 4px */
  background: rgb(229, 9, 20);
  color: rgb(255, 255, 255);
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem; /* Adjust gap for arrow */
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

  position: relative; /* Ensure relative for the absolute ::after */

  &::after {
    inset: 0px;
    position: absolute;
    transition: inherit;
    border-style: solid;
    border-width: 0.0625rem;
    border-radius: calc(0.1875rem); /* approx 3px */
    content: "";
    border-color: rgba(0, 0, 0, 0);
  }

  &:hover {
    background: rgb(193, 17, 25); /* Darker red */
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
            Get Started &gt;
          </GetStartedButton>
        </Form>
      </Content>
    </HeroContainer>
  );
}