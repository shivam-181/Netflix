'use client';

import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { ASSETS } from '@/constants/assets';
import { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import IconPicker from '@/components/profiles/IconPicker';
import { MdEdit, MdClose } from 'react-icons/md';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #141414;
  color: white;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 500;
  margin-bottom: 2rem;
  
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`;

const ProfileList = styled.div`
  display: flex;
  gap: 2vw;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfileItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  group;

  &:hover img {
    border: 3px solid white;
  }
  
  &:hover span {
    color: white;
  }
`;

const ProfileAvatarWrapper = styled.div`
  position: relative;
  width: 11vw;
  height: 11vw;
  min-width: 100px;
  min-height: 100px;
  max-width: 200px;
  max-height: 200px;
`;

const Avatar = styled.img<{ isManaging?: boolean }>`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  border: 3px solid transparent;
  transition: border 0.2s, opacity 0.2s;
  
  ${props => props.isManaging && `
    opacity: 0.5;
  `}
`;

const EditOverlay = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  border: 3px solid transparent;
  
  &:hover {
    border-color: white;
    background: rgba(0,0,0,0.4);
  }
`;

const ProfileName = styled.span`
  color: #808080;
  font-size: 1.2rem;
  transition: color 0.2s;
`;

const ManageButton = styled.button`
  background: transparent;
  border: 1px solid #808080;
  color: #808080;
  padding: 10px 30px;
  font-size: 1.2rem;
  margin-top: 3rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 2px;

  &:hover {
    color: white;
    border-color: white;
  }
`;

const DoneButton = styled.button`
  background: white;
  border: 1px solid white;
  color: black;
  padding: 10px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 3rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 2px;

  &:hover {
    background: #c00; 
    color: white;
    border-color: #c00;
  }

`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease-out;
`;

const ModalContent = styled.div`
  background-color: #141414;
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Box shadow not strictly needed but good for depth if overlay is light, here it's dark */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    color: #ccc;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 500;
  margin-bottom: 1rem;
  text-align: center;
  color: white;
`;

const ModalSubtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  width: 100%;
  justify-content: center;
  margin-bottom: 2rem;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ModalAvatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 8px;
`;

const ModalInput = styled.input`
  background: #666;
  border: none;
  border-radius: 2px;
  padding: 10px 15px;
  height: 40px;
  min-width: 250px;
  color: white;
  font-size: 1.2rem;
  
  &::placeholder {
    color: #ccc;
  }

  &:focus {
    outline: none;
    background: #555;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ secondary?: boolean }>`
  padding: 10px 30px;
  font-size: 1.1rem;
  letter-spacing: 1px;
  cursor: pointer;
  border: 1px solid ${props => props.secondary ? '#808080' : 'white'};
  background: ${props => props.secondary ? 'transparent' : 'white'};
  color: ${props => props.secondary ? '#808080' : 'black'};
  font-weight: ${props => props.secondary ? 'normal' : 'bold'};
  text-transform: uppercase;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.secondary ? 'transparent' : '#c00'};
    color: ${props => props.secondary ? 'white' : 'white'};
    border-color: ${props => props.secondary ? 'white' : '#c00'};
  }
`;


export default function ProfilesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png');
  const [isManaging, setIsManaging] = useState(false);
  
  const { profiles, fetchProfiles, selectProfile, addProfile } = useProfileStore();

  const searchParams = useSearchParams();
  const manageParam = searchParams.get('manage');

  useEffect(() => {
    if (manageParam === 'true') {
      setIsManaging(true);
    }
  }, [manageParam]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleProfileClick = (profile: any) => {
    if (isManaging) {
      router.push(`/settings/${profile._id}`);
      return; 
    }
    selectProfile(profile);
    router.push('/browse');
  };

  const handleManageClick = () => {
      // Toggle manage mode
      setIsManaging(true);
  };
  
  const handleDoneClick = () => {
      setIsManaging(false);
      router.replace('/profiles');
  };

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

  return (
    <Container>
      <Title>{isManaging ? "Manage Profiles:" : "Who's watching?"}</Title>
      
      {showIconPicker && (
          <IconPicker 
             onSelect={(url) => { setSelectedIcon(url); setShowIconPicker(false); }}
             onClose={() => setShowIconPicker(false)}
          />
      )}

      <ProfileList>
        {profiles.map((profile) => (
          <ProfileItem key={profile._id} onClick={() => handleProfileClick(profile)}>
            <ProfileAvatarWrapper>
              <Avatar src={profile.avatarUrl} alt={profile.name} isManaging={isManaging} />
              {isManaging && (
                <EditOverlay>
                  <MdEdit size={32} color="white" />
                </EditOverlay>
              )}
            </ProfileAvatarWrapper>
            <ProfileName>{profile.name}</ProfileName>
          </ProfileItem>
        ))}

        {profiles.length < 4 && (
            <ProfileItem onClick={() => setShowAddModal(true)}>
            <div style={{ 
                width: '12vw', height: '12vw', minWidth: 100, minHeight: 100, maxWidth: 200, maxHeight: 200,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'transparent',
                borderRadius: '4px'
            }}>
                <FaPlusCircle size={50} color="#808080" />
            </div>
            <ProfileName>Add Profile</ProfileName>
            </ProfileItem>
        )}
      </ProfileList>

      {isManaging ? (
        <DoneButton onClick={handleDoneClick}>
          Done
        </DoneButton>
      ) : (
        <ManageButton onClick={handleManageClick}>
          MANAGE PROFILES
        </ManageButton>
      )}

      {showAddModal && (
        <ModalOverlay onClick={() => setShowAddModal(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <CloseButton onClick={() => setShowAddModal(false)}>
                    <MdClose size={40} />
                </CloseButton>

                <ModalTitle>Add a profile</ModalTitle>
                <ModalSubtitle>Add a profile for another person watching Netflix.</ModalSubtitle>
                
                <InputGroup>
                    <ModalAvatar src={selectedIcon} alt="New Profile" />
                    <ModalInput 
                        type="text" 
                        placeholder="Name" 
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        autoFocus
                    />
                </InputGroup>

                <ModalActions>
                    <ActionButton onClick={handleCreateProfile}>
                        Continue
                    </ActionButton>
                    <ActionButton secondary onClick={() => setShowAddModal(false)}>
                        Cancel
                    </ActionButton>
                </ModalActions>
            </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
