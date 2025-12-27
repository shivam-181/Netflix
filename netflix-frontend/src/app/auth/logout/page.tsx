'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ASSETS } from '@/constants/assets';

const PageContainer = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100%;
  background-color: #000;
  background-image: url('https://pad.mymovies.it/cinemanews/2016/135277/coverlg_home.jpg');
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: 35vw center;
  display: flex;
  flex-direction: column;

  /* Dark Overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); 
    box-shadow: inset 0 0 150px #000;
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  padding: 20px 4%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.img`
  height: 45px;
  @media (max-width: 740px) { height: 32px; }
`;

const SignInButton = styled(Link)`
  background-color: #e50914;
  color: white;
  padding: 7px 17px;
  font-size: 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  &:hover { background-color: #f6121d; }
`;

const Body = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const LogoutCard = styled.div`
  background: white;
  padding: 32px;
  width: 100%;
  max-width: 450px;
  /* Removed border-radius to match screenshot closer (looks square-ish) or slight radius */
  border-radius: 2px; 
  text-align: left;
  color: #333;
`;

const CardTitle = styled.h1`
  margin: 0 0 20px;
  font-size: 2rem;
  color: #222;
  font-weight: 600;
`;

const CardText = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  color: #333;
`;

const TimerText = styled.p`
  font-size: 1rem;
  color: #333;
  margin-bottom: 25px;
`;

const ActionButton = styled.button`
  width: 100%;
  background-color: #0080ff; /* Bright Blue */
  color: white;
  border: none;
  padding: 16px;
  font-size: 1.2rem;
  font-weight: 400;
  cursor: pointer;
  border-radius: 2px;
  
  &:hover {
    background-color: #0071e3;
  }
`;

const Footer = styled.footer`
  padding: 30px 4%;
  background: rgba(0,0,0,0.75);
  color: #737373;
  font-size: 0.9em;
  position: relative;
  z-index: 10;
`;

const FooterText = styled.p`
  margin-bottom: 20px;
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  
  @media (max-width: 740px) {
      grid-template-columns: repeat(2, 1fr);
  }

  li a {
      color: #737373;
      text-decoration: none;
      &:hover { text-decoration: underline; }
  }
`;

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // 30 Seconds Timer
    const timer = setTimeout(() => {
      router.push('/');
    }, 30000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <PageContainer>
      <ContentWrapper>
        <Header>
            <Link href="/">
                <Logo src={ASSETS.NETFLIX_LOGO} alt="Netflix" />
            </Link>
            <SignInButton href="/auth/login">Sign In</SignInButton>
        </Header>

        <Body>
            <LogoutCard>
                <CardTitle>Leaving So Soon?</CardTitle>
                <CardText>
                    Just so you know, you don’t always need to sign out of Netflix. It’s only necessary if you’re on a shared or public computer.
                </CardText>
                <TimerText>
                    You&apos;ll be redirected to Netflix.com in 30 seconds.
                </TimerText>
                
                <ActionButton onClick={() => router.push('/')}>
                    Go Now
                </ActionButton>
            </LogoutCard>
        </Body>
      </ContentWrapper>
      
      <Footer>
          <FooterText>Questions? Call 000-800-919-1743</FooterText>
          <FooterLinks>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Help Centre</Link></li>
              <li><Link href="#">Terms of Use</Link></li>
              <li><Link href="#">Privacy</Link></li>
              {/* Added placeholders for balance */}
          </FooterLinks>
      </Footer>
    </PageContainer>
  );
}
