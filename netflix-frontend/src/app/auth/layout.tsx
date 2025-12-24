'use client';
import styled from '@emotion/styled';
import { ASSETS } from '@/constants/assets';
import Link from 'next/link';

// Reusing the background logic
const Background = styled.div`
  min-height: 100vh;
  background-image: url(${ASSETS.LANDING_BG});
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;

  /* Dark Overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
  }
`;

const Header = styled.header`
  padding: 20px 40px;
  position: relative;
  z-index: 10;
`;

const Logo = styled.img`
  height: 45px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 10;
`;

import { usePathname } from 'next/navigation';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/auth/logout') {
    return <>{children}</>;
  }

  return (
    <Background>
      <Header>
        <Link href="/">
          <Logo src={ASSETS.NETFLIX_LOGO} alt="Netflix" />
        </Link>
      </Header>
      <Content>{children}</Content>
    </Background>
  );
}