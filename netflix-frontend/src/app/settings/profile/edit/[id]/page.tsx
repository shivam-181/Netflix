'use client';

import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter, useParams } from 'next/navigation';
import { ASSETS } from '@/constants/assets';
import { FaPencilAlt, FaGamepad } from 'react-icons/fa'; // Assuming FaGamepad is close enough for controller
import { MdOutlineEmail, MdChevronRight } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Footer from '@/components/layout/Footer';
import IconPicker from '@/components/profiles/IconPicker';

const PageContainer = styled.div`
  background-color: white;
  min-height: 100vh;
  color: #333;
  font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: column;
`;

// Header (Consistent with other settings pages)
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

// Main Layout
const MainContent = styled.main`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 4%;
  width: 100%;
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 2rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 20px;
`;

const EditSection = styled.div`
  display: flex;
  gap: 20px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 30px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 100px;
  height: 100px;

  &:hover .edit-overlay {
    opacity: 1;
  }
`;

const ProfileAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 4px;
`;

const EditOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.2s;
  border: 1px solid white;
`;

const FormSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  color: #333;
  border-radius: 2px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 10px;
`;

const SectionDesc = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 20px;
  line-height: 1.4;
`;

const LinkText = styled.a`
  color: #0071eb;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const GameHandleBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  background: white;
  
  &:hover { background: #f9f9f9; }
`;

const GameHandleText = styled.span`
  font-weight: 500;
  color: #333;
`;

const ContactInfoCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 30px;
`;

const ContactRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  
  &:hover { background: #f9f9f9; }
`;

const ContactLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const ContactText = styled.div`
   display: flex;
   flex-direction: column;
`;

const ContactLabel = styled.span`
  font-weight: 600;
  font-size: 1rem;
`;
const ContactValue = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const InfoText = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin-top: -15px;
  margin-bottom: 30px;
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
`;

const SaveButton = styled.button`
  background: black;
  color: white;
  border: 1px solid black;
  padding: 10px 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-width: 100px;

  &:hover { background: #333; border-color: #333; }
`;

const CancelButton = styled.button`
  background: white;
  color: black;
  border: 1px solid #ccc;
  padding: 10px 30px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  min-width: 100px;

  &:hover { background: #f5f5f5; }
`;

const DeleteProfileButton = styled.button`
  width: 100%;
  padding: 15px;
  background: white;
  border: 1px solid #ccc;
  color: #737373;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 2px;
  margin-top: 20px;
  
  &:hover { background: #f5f5f5; color: #333; }
`;

export default function EditProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { currentProfile, profiles, fetchProfiles, updateProfile, deleteProfile } = useProfileStore();
  const { user } = useAuthStore();
  
  const [targetProfile, setTargetProfile] = useState<any>(null);
  const [name, setName] = useState('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  useEffect(() => {
    if (profiles.length > 0 && params?.id) {
        const found = profiles.find(p => p._id === params.id);
        if (found) {
            setTargetProfile(found);
            setName(found.name);
        }
    }
  }, [profiles, params?.id]);

  const handleSave = async () => {
      if (targetProfile && name) {
          await updateProfile(targetProfile._id, { name });
          router.push(`/settings/${targetProfile._id}`);
      }
  };
  
  const handleIconSelect = async (url: string) => {
      if (targetProfile) {
          // Optimistic update: Close picker and update UI immediately
          setShowIconPicker(false);
          setTargetProfile((prev: any) => ({ ...prev, avatarUrl: url }));
          
          try {
              await updateProfile(targetProfile._id, { avatarUrl: url });
          } catch (error) {
              console.error("Failed to update profile icon", error);
              // Optionally revert here
          }
      }
  };

  const handleDelete = async () => {
    if (targetProfile && confirm(`Delete profile ${targetProfile.name}? This cannot be undone.`)) {
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
           <PageTitle>Edit Profile</PageTitle>

           <EditSection>
               <AvatarWrapper onClick={() => setShowIconPicker(true)}>
                   <ProfileAvatar src={targetProfile.avatarUrl} />
                   <EditOverlay className="edit-overlay">
                       <div style={{ background: 'white', borderRadius: '50%', padding: '8px', display: 'flex' }}>
                            <FaPencilAlt size={16} color="black" />
                       </div>
                   </EditOverlay>
               </AvatarWrapper>

               <FormSection>
                   <Input 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Name"
                   />

                   <div style={{ marginTop: '20px' }}>
                       <SectionTitle>Game Handle</SectionTitle>
                       <SectionDesc>
                           Your handle is a unique name that will be used for playing with other Netflix members across all Netflix Games. <LinkText href="#">Learn more</LinkText>
                       </SectionDesc>
                       
                       <GameHandleBox>
                           <FaGamepad size={24} color="#333" />
                           <GameHandleText>Create Game Handle</GameHandleText>
                       </GameHandleBox>
                   </div>
               </FormSection>
           </EditSection>

           <SectionTitle>Contact Info</SectionTitle>
           <ContactInfoCard>
               <ContactRow>
                   <ContactLeft>
                       <MdOutlineEmail size={24} color="#666" />
                       <ContactText>
                           <ContactLabel>Email</ContactLabel>
                           {/* Assuming user email is available in auth store, or fallback */}
                           <ContactValue>{user?.email || 'email@example.com'}</ContactValue> 
                       </ContactText>
                   </ContactLeft>
                   <MdChevronRight size={24} color="#ccc" />
               </ContactRow>
           </ContactInfoCard>

           <InfoText>
               The email associated with this profile is also used for account access and recovery. Visit <LinkText href="#">account security</LinkText> to make changes.
           </InfoText>

           <ButtonRow>
               <SaveButton onClick={handleSave}>Save</SaveButton>
               <CancelButton onClick={() => router.back()}>Cancel</CancelButton>
           </ButtonRow>
           
           <hr style={{ border: 'none', borderTop: '1px solid #e6e6e6', margin: '30px 0' }} />

           <DeleteProfileButton onClick={handleDelete}>Delete Profile</DeleteProfileButton>

       </MainContent>

       {/* Gray Footer */}
       <div style={{ background: '#f3f3f3', borderTop: '1px solid #e6e6e6' }}>
        <Footer />
       </div>

       {showIconPicker && (
          <IconPicker 
             onSelect={handleIconSelect} 
             onClose={() => setShowIconPicker(false)} 
          />
       )}
    </PageContainer>
  );
}
