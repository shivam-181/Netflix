'use client';

import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import { ASSETS } from '@/constants/assets';
import { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';

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

const Avatar = styled.img`
  width: 10vw;
  height: 10vw;
  min-width: 84px;
  min-height: 84px;
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  object-fit: cover;
  border: 3px solid transparent;
  transition: border 0.2s;
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

import IconPicker from '@/components/profiles/IconPicker';
import { MdEdit } from 'react-icons/md';

// ... (keep styled components)

export default function ProfilesPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png');
  const { profiles, fetchProfiles, selectProfile, addProfile } = useProfileStore();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleProfileClick = (profile: any) => {
    selectProfile(profile);
    router.push('/browse');
  };

  const handleManageClick = () => {
      router.push('/ManageProfiles');
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
      <Title>Who's watching?</Title>
      
      {showIconPicker && (
          <IconPicker 
             onSelect={(url) => { setSelectedIcon(url); setShowIconPicker(false); }}
             onClose={() => setShowIconPicker(false)}
          />
      )}

      <ProfileList>
        {profiles.map((profile) => (
          <ProfileItem key={profile._id} onClick={() => handleProfileClick(profile)}>
            <Avatar src={profile.avatarUrl} alt={profile.name} />
            <ProfileName>{profile.name}</ProfileName>
          </ProfileItem>
        ))}

        {profiles.length < 4 && (
            <ProfileItem onClick={() => setShowAddModal(true)}>
            <div style={{ 
                width: '10vw', height: '10vw', minWidth: 84, minHeight: 84, maxWidth: 200, maxHeight: 200,
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

      <ManageButton onClick={handleManageClick}>
        MANAGE PROFILES
      </ManageButton>

      {/* Simple Add Profile Modal */}
      {showAddModal && (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2500
        }}>
            <div style={{ background: '#141414', padding: '40px', borderRadius: '4px', border: '1px solid #333', width: '400px', maxWidth: '90%' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>Add Profile</h2>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowIconPicker(true)}>
                        <img 
                            src={selectedIcon} 
                            style={{ width: '80px', height: '80px', borderRadius: '4px' }} 
                            alt="Profile" 
                        />
                        <div style={{
                            position: 'absolute', bottom: 0, left: 0, right: 0,
                            background: 'rgba(0,0,0,0.6)', padding: '2px', textAlign: 'center'
                        }}>
                             <MdEdit color="white" />
                        </div>
                    </div>
                    
                    <input 
                        type="text" 
                        placeholder="Name" 
                        value={newProfileName}
                        onChange={(e) => setNewProfileName(e.target.value)}
                        style={{ 
                            flex: 1, padding: '10px', fontSize: '1.2rem', background: '#333', 
                            border: 'none', color: 'white', outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <button 
                        onClick={handleCreateProfile}
                        style={{ 
                            background: 'white', color: 'black', padding: '10px 20px', 
                            fontSize: '1.1rem', fontWeight: 'bold', border: 'none', cursor: 'pointer' 
                        }}
                    >
                        Continue
                    </button>
                    <button 
                        onClick={() => setShowAddModal(false)}
                        style={{ 
                            background: 'transparent', color: '#808080', padding: '10px 20px', 
                            fontSize: '1.1rem', border: '1px solid #808080', cursor: 'pointer' 
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}
    </Container>
  );
}
