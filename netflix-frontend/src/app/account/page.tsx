'use client';

import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ASSETS } from '@/constants/assets';
import { FaArrowLeft, FaCreditCard, FaChevronRight } from 'react-icons/fa';
import { MdDevices, MdOutlineEmail, MdOutlineCardMembership } from 'react-icons/md';
import { BiTransfer } from 'react-icons/bi';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { HiOutlineMailOpen } from 'react-icons/hi';
import { VscPreview } from "react-icons/vsc";
import { AiOutlineUserAdd } from "react-icons/ai";

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
  margin-bottom: 20px;
  
  &:hover { text-decoration: underline; color: #333; }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #000;
`;

const SubTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SectionBox = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 40px;
`;

const MemberHeader = styled.div`
  padding: 20px;
  border-bottom: 1px solid #eee;
  background: #fdfdfd;
`;

const MemberSinceBadge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #e50914 0%, #b20710 100%);
  color: white;
  padding: 5px 15px;
  border-radius: 20px; // Rounded pill
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 15px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  
  /* Icon style */
  &::before {
      content: '★';
      font-size: 0.9rem;
  }
`;

const PlanDetails = styled.div`
  padding: 20px;
`;

const PlanTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 5px;
`;

const PlanMeta = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 15px;
`;

const PaymentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  font-weight: 500;
  color: #333;
`;

const ManageLink = styled.div`
  border-top: 1px solid #eee;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  color: #333;
  
  &:hover { background: #f9f9f9; }
`;

// Quick Links
const QuickLinksContainer = styled.div`
  margin-top: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const QuickRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.1s;
  
  &:last-child { border-bottom: none; }
  &:hover { background: #f9f9f9; }
`;

const RowLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 600;
  font-size: 1rem;
  color: #333;

  svg {
    color: #666;
    font-size: 1.5rem;
  }
`;

const NewBadge = styled.span`
  background: #d4e6ff;
  color: #0056b3;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  text-transform: uppercase;
  margin-left: 10px;
`;

const ProfileRowRight = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MiniAvatar = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 4px;
  border: 2px solid white;
  margin-left: -10px; /* Overlap effect */
  &:first-of-type { margin-left: 0; }
`;

// Footer
const FooterContainer = styled.footer`
  margin-top: 60px;
  padding: 40px 4%;
  color: #666;
  font-size: 0.9rem;
  border-top: 1px solid #e6e6e6; /* Optional separator */
`;

const FooterLinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-top: 20px;
  
  a {
      color: #666;
      text-decoration: none;
      &:hover { text-decoration: underline; }
  }
  
  @media (max-width: 700px) {
      grid-template-columns: 1fr 1fr;
  }
`;


export default function AccountPage() {
  const router = useRouter();
  const { currentProfile, profiles } = useProfileStore();
  const { user } = useAuthStore();

  return (
    <PageContainer>
       <Header>
           <Logo src={ASSETS.NETFLIX_LOGO} onClick={() => router.push('/browse')} alt="Netflix" />
           {currentProfile && (
             <Avatar src={currentProfile.avatarUrl} alt="Profile" />
           )}
       </Header>

       <MainContent>
           <BackLink onClick={() => router.push('/browse')}>
               <FaArrowLeft /> Back to Netflix
           </BackLink>
           
           <PageTitle>Account</PageTitle>
           <SubTitle>Membership Details</SubTitle>

           <SectionBox>
               <MemberHeader>
                   <MemberSinceBadge>Member since May 2024</MemberSinceBadge>
                   <PlanTitle>Premium plan</PlanTitle>
                   <PlanMeta>Next payment: January 2, 2026</PlanMeta>
                   <PaymentRow>
                       <FaCreditCard size={24} style={{ color: '#1a1f71' }} /> {/* Visalike color */}
                       <span>•••• •••• •••• 2888</span>
                   </PaymentRow>
               </MemberHeader>
               <ManageLink>
                   <span>Manage membership</span>
                   <FaChevronRight color="#ccc" />
               </ManageLink>
           </SectionBox>

           <SubTitle>Quick Links</SubTitle>
           <QuickLinksContainer>
               <QuickRow>
                   <RowLeft>
                       <VscPreview /> 
                       Change plan
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </QuickRow>

               <QuickRow>
                   <RowLeft>
                       <FaCreditCard />
                       Manage payment method
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </QuickRow>
               
                <QuickRow>
                   <RowLeft>
                       <HiOutlineMailOpen />
                       <span>Buy an extra member slot</span>
                       <NewBadge>New</NewBadge>
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </QuickRow>
               
               <QuickRow>
                   <RowLeft>
                       <MdDevices />
                       Manage access and devices
                   </RowLeft>
                   <FaChevronRight color="#ccc" />
               </QuickRow>

               <QuickRow onClick={() => router.push('/profiles')}>
                   <RowLeft>
                       <AiOutlineUserAdd /> {/* Using generic icon if needed, or none */}
                       Manage profiles
                   </RowLeft>
                   
                   <ProfileRowRight>
                       {/* Show actual profile avatars or mock if empty */}
                       {profiles.length > 0 ? profiles.map(p => (
                           <MiniAvatar key={p._id} src={p.avatarUrl} alt={p.name} />
                       )) : (
                            // Mock visual for development if profiles not loaded
                           <>
                           <MiniAvatar src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png" />
                           <MiniAvatar src="https://i.pinimg.com/originals/fb/8e/8a/fb8e8a96fca2fce49b55ddbf7d3c03e6.png" />
                           </>
                       )}
                       <FaChevronRight color="#ccc" style={{ marginLeft: '10px' }} />
                   </ProfileRowRight>
               </QuickRow>
           </QuickLinksContainer>

       </MainContent>

       <FooterContainer>
           <p style={{ marginBottom: '20px' }}>Questions? <a href="#">Contact Us</a></p>
           <FooterLinkGrid>
               <a href="#">Investor Relations</a>
               <a href="#">Media Center</a>
               <a href="#">Jobs</a>
               <a href="#">Cookie Preferences</a>
               <a href="#">Terms of Use</a>
               <a href="#">Privacy Statement</a>
               <a href="#">Audio and Subtitles</a>
               <a href="#">Help Center</a>
               <a href="#">Gift Cards</a>
           </FooterLinkGrid>
       </FooterContainer>

    </PageContainer>
  );
}
