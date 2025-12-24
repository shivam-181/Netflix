'use client';
import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ASSETS } from '@/constants/assets';
import { MdEdit, MdOutlineHelpOutline } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import { AiOutlineUser } from 'react-icons/ai';
import { FaCaretDown } from 'react-icons/fa';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Nav = styled.nav<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  width: 100%;
  height: 68px;
  z-index: 100;
  padding: 0 4%;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
  /* Magic: Transparent at top, Black when scrolled */
  background-color: ${({ isScrolled }) => (isScrolled ? '#141414' : 'transparent')};
  background-image: ${({ isScrolled }) => (isScrolled ? 'none' : 'linear-gradient(to bottom,rgba(0,0,0,.7) 10%,rgba(0,0,0,0))')};
  
  @media (max-width: 500px) {
      height: 50px; /* Slimmer navbar on mobile */
      padding: 0 3%;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 500px) {
      gap: 10px;
  }
`;

const Logo = styled.img`
  height: 25px;
  margin-right: 25px;
  @media (min-width: 950px) { height: 30px; }
  
  @media (max-width: 500px) {
      height: 20px; /* Smaller logo on mobile */
      margin-right: 10px;
  }
`;

const Links = styled.ul`
  display: flex;
  gap: 20px;
  list-style: none;
  font-size: 0.9rem;
  color: #e5e5e5;
  
  li { cursor: pointer; transition: color 0.3s; }
  li:hover { color: #b3b3b3; }
  
  @media (max-width: 800px) { display: none; } /* Hide links on mobile */
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;
  color: white;

  @media (max-width: 500px) {
      gap: 10px;
  }
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
`;

// Add styled Input
const SearchInput = styled.input<{ visible: boolean }>`
  background: transparent;
  border: none;
  color: white;
  padding: 5px;
  width: ${({ visible }) => (visible ? '200px' : '0px')};
  opacity: ${({ visible }) => (visible ? '1' : '0')};
  transition: width 0.3s, opacity 0.3s;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  outline: none;

  @media (max-width: 500px) {
      /* On mobile, take up more relative space or absolute position if needed, 
         for now reducing max-width to avoid breaking layout */
      width: ${({ visible }) => (visible ? '110px' : '0px')};
      font-size: 0.8rem;
  }
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: 50px; /* Offset from avatar */
  right: 0;
  width: 220px;
  background-color: rgba(0, 0, 0, 0.95);
  border: 1px solid #333;
  display: none;
  flex-direction: column;
  z-index: 1000;
  padding: 10px 0;

  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 24px;
    width: 0; 
    height: 0; 
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid white;
  }
`;

const MenuWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 0;
  
  &:hover .profile-menu {
    display: flex;
  }

  &:hover .caret {
    transform: rotate(180deg);
  }
`;



const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 20px;
  color: #e5e5e5;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    text-decoration: underline;
    color: white;
  }
  
  & svg { color: #b3b3b3; font-size: 1.3rem; }
`;

const ProfileRow = styled(MenuItem)`
  gap: 10px;
  padding: 5px 20px;
  
  img {
    width: 32px;
    height: 32px;
    border-radius: 4px;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: #333;
  margin: 10px 0;
`;

const SignOutLink = styled.div`
  text-align: center;
  font-size: 0.85rem;
  color: white;
  cursor: pointer;
  padding: 5px 0;
  &:hover { text-decoration: underline; }
`;

import ProfileSwitcherLoading from './ProfileSwitcherLoading';

// ... (keep existing imports)

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [switchingProfile, setSwitchingProfile] = useState<any>(null); // State for overlay
  const { currentProfile, profiles, selectProfile } = useProfileStore();
  const { logout } = useAuthStore();
  const router = useRouter(); 
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Paths where Navbar should NOT be visible
  const EXCLUDED_PATHS = ['/', '/auth/login', '/auth/signup', '/profiles', '/account', '/help', '/auth/logout'];
  const shouldShow = !EXCLUDED_PATHS.includes(pathname || '') && !pathname?.startsWith('/watch');

  // Sync Search state with URL (for when we navigate or refresh on search page)
  useEffect(() => {
     if (pathname === '/search') {
         const q = searchParams.get('q');
         if (q) {
             setSearchValue(q);
             setSearchVisible(true);
         }
     } else {
         // Optional: Reset if leaving search? 
         // Actually, if we leave search, we might want to clear it or keep closed.
         setSearchValue('');
         setSearchVisible(false);
     }
  }, [pathname, searchParams]);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!shouldShow) return null; 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (e.target.value.length > 0) {
      router.push(`/search?q=${e.target.value}`);
    } else {
      router.push(`/browse`);
    }
  };

  const handleProfileSwitch = async (profile: any) => {
    setSwitchingProfile(profile);
    
    // Simulate delay for animation
    setTimeout(() => {
        selectProfile(profile);
        router.push('/browse'); 
        
        // Safety timeout to unmount overlay if simple route change doesn't unmount Navbar (which it won't if in layout)
        // Ideally Navbar remounts or state resets? 
        // In Next.js App Router, Navbar inside Layout persists. 
        // So we need to reset state.
        setTimeout(() => setSwitchingProfile(null), 500);
    }, 2000); 
  };

  const handleSignOut = () => {
    logout(); 
    router.push('/auth/logout');
  };

  const getAvatarStyle = (index: number) => {
    // Premium Colors: 
    // 0: Netflix Red/Pink (Rotate 140)
    // 1: Bright Blue (Default)
    // 2: Golden Yellow (Rotate 60)
    // 3: Emerald Green (Rotate -60 or -120)
    const hueRotations = [0, 140, 60, 240]; 
    return { filter: `hue-rotate(${hueRotations[index % 4]}deg) saturate(2.5) contrast(1.1) brightness(1.1)` };
  };

  return (
    <>
    {switchingProfile && <ProfileSwitcherLoading avatarUrl={switchingProfile.avatarUrl} />}
    
    <Nav isScrolled={isScrolled}>
      <Left>
        <Link href="/browse"><Logo src={ASSETS.NETFLIX_LOGO} alt="Logo" /></Link>
        <Links>
          <li><Link href="/browse" style={{ fontWeight: 700, color: 'white', textDecoration: 'none' }}>Home</Link></li>
          <li><Link href="/tv" style={{ color: 'inherit', textDecoration: 'none' }}>Shows</Link></li>
          <li><Link href="/movies" style={{ color: 'inherit', textDecoration: 'none' }}>Movies</Link></li>
          <li><Link href="/latest" style={{ color: 'inherit', textDecoration: 'none' }}>New & Popular</Link></li>
          <li><Link href="/my-list" style={{ color: 'inherit', textDecoration: 'none' }}>My List</Link></li>
          <li><Link href="/browse/languages" style={{ color: 'inherit', textDecoration: 'none' }}>Browse by Languages</Link></li>
        </Links>
      </Left>
      
      <Right>

        <div style={{ display: 'flex', alignItems: 'center', border: searchVisible ? '1px solid white' : 'none', background: searchVisible ? '#141414' : 'transparent', transition: 'all 0.3s', paddingLeft: '4px' }}>
          <svg 
             width="24" 
             height="24" 
             viewBox="0 0 24 24" 
             fill="white" 
             xmlns="http://www.w3.org/2000/svg" 
             style={{ cursor: 'pointer', margin: '0 4px' }}
             onClick={() => setSearchVisible(!searchVisible)}
          >
             <path fillRule="evenodd" clipRule="evenodd" d="M16 11.586L21.707 17.293L20.293 18.707L14.586 13C13.676 13.649 12.576 14.043 11.385 14.043C7.307 14.043 4 10.899 4 7.021C4 3.143 7.307 0 11.385 0C15.464 0 18.771 3.143 18.771 7.021C18.771 8.783 18.118 10.378 17.039 11.586H16ZM11.385 2C8.528 2 6.216 4.249 6.216 7.021C6.216 9.794 8.528 12.043 11.385 12.043C14.243 12.043 16.554 9.794 16.554 7.021C16.554 4.249 14.243 2 11.385 2Z" />
          </svg>
          <SearchInput 
            visible={searchVisible} 
            placeholder="Titles, people, genres"
            value={searchValue}
            onChange={handleSearch}
          />
          {searchVisible && searchValue && (
              <span onClick={() => { setSearchValue(''); router.push('/browse'); }} style={{ cursor: 'pointer', padding: '0 5px' }}>✕</span>
          )}
        </div>
        
        {/* Authentic Bell Icon */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" style={{ cursor: 'pointer' }}>
            <path d="M18 17H6V15L7 14V9C7 5.686 9.686 3 13 3C16.314 3 19 5.686 19 9V14L20 15V17ZM13 21C11.343 21 10 19.657 10 18H16C16 19.657 14.657 21 13 21Z" />
        </svg>
        
        <MenuWrapper>
           <Avatar 
               src={currentProfile?.avatarUrl || "https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"} 
               style={currentProfile ? getAvatarStyle(profiles.findIndex(p => p._id === currentProfile._id)) : {}}
           />
           <FaCaretDown 
               size={14} 
               className={`caret ${!searchVisible ? 'visible' : ''}`} 
               style={{ transition: 'transform 0.3s' }}
           />
           
           <ProfileMenu className="profile-menu">
               {profiles.filter(p => p._id !== currentProfile?._id).map((p, idx) => (
                   <ProfileRow key={p._id} onClick={() => handleProfileSwitch(p)}>
                       <img 
                           src={p.avatarUrl} 
                           style={getAvatarStyle(profiles.findIndex(prof => prof._id === p._id))} 
                           alt={p.name} 
                       />
                       <span>{p.name}</span>
                   </ProfileRow>
               ))}
               
               {profiles.length > 1 && <MenuDivider style={{margin: '5px 0'}} />}

               <MenuItem onClick={() => router.push('/profiles')}>
                   <MdEdit />
                   <span>Manage Profiles</span>
               </MenuItem>
               
               <MenuItem onClick={() => router.push('/transfer-profile')}>
                   <BiTransfer />
                   <span>Transfer Profile</span>
               </MenuItem>
               
               <MenuItem onClick={() => router.push('/account')}>
                   <AiOutlineUser />
                   <span>Account</span>
               </MenuItem>
               
               <MenuItem onClick={() => router.push('/help')}>
                   <MdOutlineHelpOutline />
                   <span>Help Center</span>
               </MenuItem>

               <MenuDivider />
               
               <SignOutLink onClick={handleSignOut}>
                   Sign out of Netflix
               </SignOutLink>
           </ProfileMenu>
        </MenuWrapper>
      </Right>
    </Nav>
    </>
  );
}