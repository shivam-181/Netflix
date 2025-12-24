'use client';

import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #141414;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpinnerContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 4px;
`;

const SpinnerRing = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: #e50914; /* Netflix Red */
  border-right-color: #e50914; /* Semi-circle effect */
  box-sizing: border-box;
`;

interface ProfileSwitcherLoadingProps {
  avatarUrl: string;
}

export default function ProfileSwitcherLoading({ avatarUrl }: ProfileSwitcherLoadingProps) {
  return (
    <Overlay>
      <SpinnerContainer>
         <SpinnerRing 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
         />
         <Avatar src={avatarUrl} alt="Loading Profile" />
      </SpinnerContainer>
    </Overlay>
  );
}
