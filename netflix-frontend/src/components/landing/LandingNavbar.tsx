'use client';
import styled from '@emotion/styled';
import Link from 'next/link';
import { ASSETS } from '@/constants/assets';
import { MdTranslate } from 'react-icons/md';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 120rem; 
  height: 5.5rem; /* Reduced from 7.5rem to move items up */
  margin: 0 auto -5.5rem auto; /* Adjusted margin */
  z-index: 10;
  position: relative;
  gap: 1rem;
  
  padding: 0 1.5rem; /* Base padding */

  @media (min-width: 600px) {
    padding: 0 2rem;
  }

  @media (min-width: 960px) {
    padding: 0 5rem;
  }

  @media (min-width: 1280px) {
    padding: 0 9.25rem; /* Aggressive padding for "inwards" feel */
  }
`;

const Logo = styled.img`
  height: 2rem; /* Smaller mobile base */
  width: auto; 
  
  @media (min-width: 900px) { 
      height: 3rem; /* Reduced from 5rem to 3rem */
      width: auto;
  }
`;

const SignInButton = styled(Link)`
  background-color: var(--netflix-red);
  color: white;
  height: 32px; /* Explicit height match */
  padding: 0 1rem; /* Horizontal padding only */
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  text-decoration: none;
  &:hover { background-color: #c11119; }
`;

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LanguageSelectParams = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  padding: 4px 10px;
  background: rgba(0,0,0,0.4);
  color: white;
  
  /* Globe Icon placeholder/styling can go here if using svg directly, 
     but let's use a unicode globe or icon library if available. 
     User has react-icons. */
  height: 32px; /* Explicit height match */
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Select = styled.select`
  background: transparent;
  color: white;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  appearance: none;
  padding-left: 5px;
  padding-right: 15px;
  cursor: pointer;
  
  &:focus { outline: none; }
  
  option {
    background: black;
    color: white;
  }
`;

export default function LandingNavbar() {
  return (
    <Nav>
      <Logo src={ASSETS.NETFLIX_LOGO} alt="Netflix Logo" />
      <RightContainer>
          <LanguageSelectParams>
             <MdTranslate style={{ fontSize: '1.2rem', marginRight: 5 }} />
             <Select>
                <option>English</option>
                <option>Hindi</option>
             </Select>
             <span style={{fontSize: '0.6rem', position: 'absolute', right: 5, pointerEvents: 'none'}}>▼</span>
          </LanguageSelectParams>
         <SignInButton href="/auth/login">Sign In</SignInButton>
      </RightContainer>
    </Nav>
  );
}