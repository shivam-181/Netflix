'use client';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import { AiOutlinePlusCircle } from 'react-icons/ai'; // npm install react-icons if needed

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #141414;
  color: white;
  animation: fadeIn 0.4s;
`;

const Title = styled.h1`
  font-size: 3.5vw;
  font-weight: 400;
  margin-bottom: 2rem;
  
  @media (max-width: 800px) { font-size: 2rem; }
`;

const ProfileGrid = styled.div`
  display: flex;
  gap: 2vw;
  flex-wrap: wrap;
  justify-content: center;
`;

const ProfileCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  group: hover;
  max-width: 200px;

  &:hover img {
    border: 3px solid white;
  }
  &:hover span {
    color: white;
  }
`;

const Avatar = styled.img`
  /* ... existing styles ... */
  
  /* Force minimum sizes */
  width: 10vw;
  height: 10vw;
  min-width: 84px;
  min-height: 84px;
  
  @media (max-width: 500px) {
    min-width: 60px;
    min-height: 60px;
  }
`;

const Name = styled.span`
  margin-top: 10px;
  color: grey;
  font-size: 1.3vw;
  transition: color 0.2s;
  
  @media (max-width: 800px) { font-size: 1rem; }
`;

// Add Profile Button Styles
const AddButton = styled.button`
  background: transparent;
  border: 1px solid grey;
  color: grey;
  padding: 10px 30px;
  margin-top: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 2px;
  
  &:hover {
    border-color: white;
    color: white;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  background: #666;
  border: none;
  padding: 10px;
  color: white;
  width: 200px;
`;

const EditOverlay = styled.div`
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.9);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 500px;
  width: 90%;
  padding: 40px;
  background: #141414;
  border: 1px solid #333;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  letter-spacing: 2px;
  &:hover { background: #c00; border-color: #c00; }
`;

import { FaPencilAlt } from 'react-icons/fa';

export default function ProfilesPage() {
  const router = useRouter();
  const { profiles, fetchProfiles, selectProfile, addProfile, deleteProfile, isLoading } = useProfileStore();
  
  const [isAdding, setIsAdding] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null); 
  const [newProfileName, setNewProfileName] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleProfileClick = (profile: any) => {
    if (isManaging) {
      setEditingProfile(profile);
    } else {
      selectProfile(profile);
      router.push('/browse'); // Go to the main app!
    }
  };

  const handleAddProfile = async () => {
    if (!newProfileName) return;
    await addProfile(newProfileName);
    setIsAdding(false);
    setNewProfileName('');
  };

  const handleDelete = async () => {
    if (editingProfile) {
       await deleteProfile(editingProfile._id);
       setEditingProfile(null);
    }
  };

  // Generate deterministic color style
  const getAvatarStyle = (index: number) => {
    // Premium Colors: 
    const hueRotations = [0, 140, 60, 240]; 
    // Adding saturation and brightness to make them "premium" and "light" as requested
    return { filter: `hue-rotate(${hueRotations[index % 4]}deg) saturate(2.5) contrast(1.1) brightness(1.1)` };
  };

  if (isLoading) return <Container>Loading profiles...</Container>;

  return (
    <Container>
      <Title>{isManaging ? 'Manage Profiles:' : "Who's watching?"}</Title>
      
      <ProfileGrid>
        {profiles.map((profile, index) => (
          <ProfileCard key={profile._id} onClick={() => handleProfileClick(profile)}>
            <div style={{ position: 'relative' }}>
                <Avatar src={profile.avatarUrl} alt={profile.name} style={getAvatarStyle(index)} />
                {isManaging && (
                    <EditOverlay>
                        <FaPencilAlt size={24} color="white" />
                    </EditOverlay>
                )}
            </div>
            <Name>{profile.name}</Name>
          </ProfileCard>
        ))}

        {/* Logic for "Add Profile" UI */}
        {profiles.length < 4 && !isAdding && !isManaging && (
          <ProfileCard onClick={() => setIsAdding(true)}>
             <div style={{
                width: '10vw', height: '10vw', minWidth: '84px', minHeight: '84px',
                background: 'transparent', border: '1px solid grey', display: 'flex',
                justifyContent: 'center', alignItems: 'center', borderRadius: '4px'
             }}>
               <AiOutlinePlusCircle size={50} color="grey" />
             </div>
             <Name>Add Profile</Name>
          </ProfileCard>
        )}
      </ProfileGrid>
      
      {isAdding && (
        <InputGroup style={{ marginTop: '20px' }}>
          <Title style={{fontSize: '1.5rem'}}>Add Profile</Title>
           <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
             <Avatar 
                src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" 
                style={getAvatarStyle(profiles.length)} 
             />
             <Input 
                placeholder="Name" 
                value={newProfileName}
                onChange={(e: any) => setNewProfileName(e.target.value)}
                autoFocus
             />
           </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <AddButton style={{ marginTop: '0', background: 'white', color: 'black', border: 'none' }} onClick={handleAddProfile}>SAVE</AddButton>
            <AddButton style={{ marginTop: '0' }} onClick={() => setIsAdding(false)}>CANCEL</AddButton>
          </div>
        </InputGroup>
      )}

      {/* Manage / Done Button */}
      {!isAdding && (
        <AddButton 
            onClick={() => setIsManaging(!isManaging)} 
            style={{ 
                background: isManaging ? 'white' : 'transparent', 
                color: isManaging ? 'black' : 'grey',
                borderColor: isManaging ? 'white' : 'grey'
            }}
        >
          {isManaging ? 'Done' : 'MANAGE PROFILES'}
        </AddButton>
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <ModalOverlay onClick={() => setEditingProfile(null)}>
           <ModalContent onClick={e => e.stopPropagation()}>
             <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Edit Profile</h2>
             <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Avatar 
                    src={editingProfile.avatarUrl} 
                    style={getAvatarStyle(profiles.findIndex(p => p._id === editingProfile._id))} 
                />
                <div style={{ flex: 1 }}>
                   <Input value={editingProfile.name} readOnly style={{ width: '100%', fontSize: '1.5rem', background: '#333' }} />
                </div>
             </div>
             
             <div style={{ marginTop: '30px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
               <AddButton onClick={() => setEditingProfile(null)} style={{marginTop: 0}}>SAVE</AddButton>
               <DeleteButton onClick={handleDelete}>DELETE PROFILE</DeleteButton>
             </div>
           </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
