'use client';

import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter, useParams } from 'next/navigation';
import { ASSETS } from '@/constants/assets';
import { FaArrowLeft, FaChevronRight } from 'react-icons/fa';
import { MdOutlineLanguage, MdHistory, MdPrivacyTip, MdDeleteOutline } from 'react-icons/md';
import { BiTransfer, BiLockAlt } from 'react-icons/bi';
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
  border-radius: 8px;
`;

const MainContent = styled.main`
  max-width: 800px;
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
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
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
  gap: 20px;
`;

const RowText = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowTitle = styled.span`
  font-weight: 600;
  font-size: 1.1rem;
  color: #333;
`;

const RowDesc = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin-top: 4px;
`;

const ProfileAvatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 400;
  color: #333;
  margin-bottom: 15px;
  margin-top: 40px;
`;

const DeleteButton = styled.button`
  width: 100%;
  padding: 15px;
  background: white;
  border: 1px solid #ccc;
  font-weight: 600;
  font-size: 1.1rem;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;

  &:hover { background: #f5f5f5; color: #333; }
`;

const FooterNote = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9rem;
  margin-top: 20px;
`;

export default function ProfileSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const { currentProfile, profiles, fetchProfiles, deleteProfile } = useProfileStore();
  
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

  const handleDelete = async () => {
      if (targetProfile) {
          await deleteProfile(targetProfile._id);
          router.push('/profiles');
      }
  };

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
           <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
                <BackButton onClick={() => router.push('/ManageProfiles')}>
                    <FaArrowLeft />
                </BackButton>
                <PageTitle>Manage profile and preferences</PageTitle>
           </div>
           
           <Card>
               <CardRow onClick={() => router.push(`/settings/profile/edit/${targetProfile._id}`)}>
                   <RowLeft>
                       <ProfileAvatar src={targetProfile.avatarUrl} />
                       <RowText>
                           <RowTitle>{targetProfile.name}</RowTitle>
                           <RowDesc>Edit personal and contact info</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </CardRow>

               <CardRow>
                   <RowLeft>
                        <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
                           <BiLockAlt size={28} color="#666" />
                        </div>
                       <RowText>
                           <RowTitle>Profile Lock</RowTitle>
                           <RowDesc>Require a PIN to access this profile</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </CardRow>
           </Card>

           <SectionTitle>Preferences</SectionTitle>

           <Card>
               <CardRow>
                   <RowLeft>
                       <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
                            <MdOutlineLanguage size={28} color="#666" />
                        </div>
                       <RowText>
                           <RowTitle>Languages</RowTitle>
                           <RowDesc>Set languages for display and audio</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </CardRow>

               <CardRow>
                   <RowLeft>
                        <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
                            <MdHistory size={28} color="#666" />
                        </div>
                       <RowText>
                           <RowTitle>Viewing activity</RowTitle>
                           <RowDesc>Manage viewing history and ratings</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </CardRow>

               <CardRow>
                   <RowLeft>
                        <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
                            <MdPrivacyTip size={28} color="#666" />
                        </div>
                       <RowText>
                           <RowTitle>Privacy and data settings</RowTitle>
                           <RowDesc>Manage usage of personal info</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </CardRow>
           </Card>

           <Card>
                <CardRow onClick={() => router.push('/transfer-profile')}>
                   <RowLeft>
                        <div style={{ width: 60, display: 'flex', justifyContent: 'center' }}>
                            <BiTransfer size={28} color="#666" />
                        </div>
                       <RowText>
                           <RowTitle>Profile transfer</RowTitle>
                           <RowDesc>Copy this profile to another account</RowDesc>
                       </RowText>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </CardRow>
           </Card>

           <DeleteButton onClick={handleDelete}>
               <MdDeleteOutline size={24} />
               Delete Profile
           </DeleteButton>
           
           <FooterNote>The primary profile cannot be deleted.</FooterNote>

       </MainContent>

       {/* Gray Footer */}
       <div style={{ background: '#f3f3f3', borderTop: '1px solid #e6e6e6' }}>
        <Footer />
       </div>
    </PageContainer>
  );
}
