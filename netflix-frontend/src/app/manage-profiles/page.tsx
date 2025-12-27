'use client';

import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import { ASSETS } from '@/constants/assets';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { MdSecurity, MdDevices } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import { AiOutlineExclamationCircle } from 'react-icons/ai'; // For parental controls icon
import { useEffect, useState } from 'react';
import IconPicker from '@/components/profiles/IconPicker'; // Reuse if needed


const PageContainer = styled.div`
  background-color: white;
  min-height: 100vh;
  color: #333;
  font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px 4%;
  display: flex;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  flex-shrink: 0;
`;

const BackLink = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 30px;
  
  &:hover { text-decoration: underline; color: #333; }
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${props => props.$active ? '#000' : '#666'};
  font-weight: ${props => props.$active ? '700' : '400'};
  cursor: pointer;
  padding: 5px 0;
  font-size: 1rem;

  svg { font-size: 1.2rem; }
  &:hover { color: #000; }
`;

const ContentArea = styled.div`
  flex-grow: 1;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #000;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 400;
  color: #555;
  margin-bottom: 20px;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 40px;
  background: white;
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  
  &:last-child { border-bottom: none; }
  &:hover { background: #f9f9f9; }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const RowText = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowTitle = styled.span`
  font-weight: 600;
  font-size: 1rem;
  color: #333;
`;

const RowDesc = styled.span`
  font-size: 0.85rem;
  color: #666;
  margin-top: 2px;
`;

const ProfileAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
`;

const AddProfileButton = styled.button`
  width: 100%;
  padding: 15px;
  background: #e6e6e6;
  border: none;
  font-weight: 600;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 4px;

  &:hover { background: #dcdcdc; }
`;

export default function ManageProfilesPage() {
  const router = useRouter();
  const { currentProfile, profiles, fetchProfiles } = useProfileStore();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  return (
    <PageContainer>
       <Header>
           <Logo src={ASSETS.NETFLIX_LOGO} onClick={() => router.push('/browse')} alt="Netflix" />
           {currentProfile && (
             <Avatar src={currentProfile.avatarUrl} alt="Profile" />
           )}
       </Header>

       <MainContent>
         <Sidebar>
            <BackLink onClick={() => router.push('/browse')}>
                <FaArrowLeft /> Back to Netflix
            </BackLink>

            <SidebarNav>
                <NavItem onClick={() => router.push('/account')}><BiTransfer style={{transform: 'rotate(90deg)'}}/> Overview</NavItem>
                <NavItem onClick={() => router.push('/account')}><MdSecurity /> Membership</NavItem>
                <NavItem onClick={() => router.push('/account')}><MdSecurity /> Security</NavItem>
                <NavItem onClick={() => router.push('/account')}><MdDevices /> Devices</NavItem>
                <NavItem $active><BiTransfer /> Profiles</NavItem>
            </SidebarNav>
         </Sidebar>

         <ContentArea>
            <PageTitle>Profiles</PageTitle>
            <SectionTitle>Parental controls and permissions</SectionTitle>

            <Card>
                <CardRow>
                   <RowLeft>
                       <AiOutlineExclamationCircle size={24} color="#666" />
                       <RowText>
                           <RowTitle>Adjust parental controls</RowTitle>
                           <RowDesc>Set maturity ratings, block titles</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
                </CardRow>

                <CardRow>
                   <RowLeft>
                       <BiTransfer size={24} color="#666" />
                       <RowText>
                           <RowTitle>Transfer a profile</RowTitle>
                           <RowDesc>Copy a profile to another account</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
                </CardRow>
            </Card>

            <SectionTitle>Profile settings</SectionTitle>
            
            <Card>
                {profiles.map(profile => (
                    <CardRow key={profile._id}>
                        <RowLeft>
                            <ProfileAvatar src={profile.avatarUrl} />
                            <RowTitle>{profile.name}</RowTitle>
                        </RowLeft>
                        <FaChevronRight color="#ccc" />
                    </CardRow>
                ))}
            </Card>

            <AddProfileButton onClick={() => router.push('/profiles')}>Add Profile</AddProfileButton>
         </ContentArea>
       </MainContent>
    </PageContainer>
  );
}
