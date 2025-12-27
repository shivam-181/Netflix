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
import { MdEdit } from 'react-icons/md';
import Footer from '@/components/layout/Footer';


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
  border-radius: 8px;
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
  const { currentProfile, profiles, fetchProfiles, addProfile } = useProfileStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png');

  const handleCreateProfile = async () => {
    try {
      if (!newProfileName.trim()) return;
      await addProfile(newProfileName, false, selectedIcon);
      setNewProfileName('');
      setSelectedIcon('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png');
      setShowAddModal(false);
    } catch (error: any) {
       const msg = error.response?.data?.message || "Failed to create profile. Limit reached or server error.";
       alert(msg);
    }
  };

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
                    <CardRow key={profile._id} onClick={() => router.push(`/settings/${profile._id}`)}>
                        <RowLeft>
                            <ProfileAvatar src={profile.avatarUrl} />
                            <RowTitle>{profile.name}</RowTitle>
                        </RowLeft>
                        <FaChevronRight color="#ccc" />
                    </CardRow>
                ))}
            </Card>

            {profiles.length < 4 && (
                <AddProfileButton onClick={() => setShowAddModal(true)}>Add Profile</AddProfileButton>
            )}
         </ContentArea>
       </MainContent>

       {/* Gray Footer */}
       <div style={{ background: '#f3f3f3', borderTop: '1px solid #e6e6e6' }}>
        <Footer />
       </div>

      {/* Simple Add Profile Modal (Reused Logic) */}
      {showAddModal && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500
        }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '4px', border: '1px solid #ccc', width: '400px', maxWidth: '90%', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#333' }}>Add Profile</h2>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowIconPicker(true)}>
                        <img 
                            src={selectedIcon} 
                            style={{ width: '80px', height: '80px', borderRadius: '4px' }} 
                            alt="Profile" 
                        />
                         {/* Edit Overlay (Small) */}
                    </div>

                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        style={{ 
                            flex: 1, padding: '10px', fontSize: '1.1rem', background: 'white', 
                            border: '1px solid #ccc', color: '#333', outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={handleCreateProfile}
                        style={{ 
                            background: '#e50914', color: 'white', padding: '10px 20px', 
                            fontSize: '1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '4px' 
                        }}
                    >
                        Save
                    </button>
                    <button 
                        onClick={() => setShowAddModal(false)}
                        style={{ 
                            background: 'white', color: '#333', padding: '10px 20px', 
                            fontSize: '1rem', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' 
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}

      {showIconPicker && (
          <IconPicker 
             onSelect={(url) => { setSelectedIcon(url); setShowIconPicker(false); }}
             onClose={() => setShowIconPicker(false)}
          />
      )}
    </PageContainer>
  );
}
