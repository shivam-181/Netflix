'use client';

import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter, useParams } from 'next/navigation';
import { ASSETS } from '@/constants/assets';
import { FaArrowLeft } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import Footer from '@/components/layout/Footer';

const PageContainer = styled.div`
  background-color: white;
  min-height: 100vh;
  color: #333;
  font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4%;
  height: 70px;
  border-bottom: 1px solid #e6e6e6;
  background: white;
`;

const Logo = styled.img`
  height: 25px;
  @media (min-width: 950px) { height: 35px; }
  cursor: pointer;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

const MainContent = styled.main`
  max-width: 600px;
  margin: 0 auto;
  padding: 20px 4%;
  width: 100%;
  flex: 1;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #333;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  
  &:hover { text-decoration: underline; }
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
`;

const ProfileContext = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 500;
`;

const SmallAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 4px;
`;

const Description = styled.p`
    font-size: 1.1rem;
    color: #333;
    line-height: 1.4;
    margin-bottom: 40px;
`;

const CreateButton = styled.button`
    width: 100%;
    background-color: black;
    color: white;
    font-size: 1.1rem;
    font-weight: 700;
    padding: 15px;
    border: none;
    cursor: pointer;
    border-radius: 2px;
    
    &:hover {
        background-color: #333;
    }
`;

const FooterNote = styled.p`
    font-size: 0.9rem;
    color: #666;
    margin-top: 40px;
    border-top: 1px solid #ccc;
    padding-top: 20px;
`;


export default function ProfileLockPage() {
  const router = useRouter();
  const params = useParams();
  const { currentProfile, profiles, fetchProfiles } = useProfileStore();
  const [targetProfile, setTargetProfile] = useState<any>(null);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (profiles.length > 0 && params?.id) {
        const found = profiles.find(p => p._id === params.id);
        if (found) setTargetProfile(found);
    }
  }, [profiles, params?.id]);

  if (!targetProfile) return <div style={{padding: 40, color: 'black'}}>Loading...</div>;

  return (
    <PageContainer>
       <Header>
           <Logo src={ASSETS.NETFLIX_LOGO} onClick={() => router.push('/browse')} alt="Netflix" />
           {currentProfile && (
             <Avatar src={currentProfile.avatarUrl} alt="Profile" />
           )}
       </Header>

       <MainContent>
            {/* Back Arrow with no text, just arrow? Screenshot shows arrow then Title below. actually screenshot shows arrow next to nothing or maybe 'Back'? 
                User screenshot: Arrow is top left of content area. 
                Wait, screenshot shows "<- Create a Profile Lock". 
                Ah, actually the arrow is part of the header usually or standalone. 
                Let's stick to standard internal nav: Arrow opens previous page. 
            */}
            <BackButton onClick={() => router.push(`/settings/${targetProfile._id}`)}>
                <FaArrowLeft size={24} />
            </BackButton>

            <PageTitle>Create a Profile Lock</PageTitle>

            <ProfileContext>
                For {targetProfile.name}
                <SmallAvatar src={targetProfile.avatarUrl} />
            </ProfileContext>

            <Description>
                Make this profile private by adding a 4-digit PIN that is needed to access it.
            </Description>

            <CreateButton>
                Create a Profile Lock
            </CreateButton>

            <FooterNote>
                Note: You will be asked to enter the account password when making changes to profile lock.
            </FooterNote>

       </MainContent>

       {/* Gray Footer */}
       <div style={{ background: '#f3f3f3', borderTop: '1px solid #e6e6e6' }}>
         <Footer />
       </div>
    </PageContainer>
  );
}
