'use client';
import styled from '@emotion/styled';
import Link from 'next/link';
import { ASSETS } from '@/constants/assets';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  
  @media (max-width: 600px) { padding: 1rem; }
`;

const Logo = styled.img`
  height: 2.5rem;
  @media (min-width: 900px) { height: 3.5rem; }
`;

const SignInButton = styled(Link)`
  background-color: var(--netflix-red);
  color: white;
  padding: 7px 17px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s;
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
             <span style={{fontSize: '1.2rem', marginRight: 5}}>🌐</span> {/* Globe Icon */}
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