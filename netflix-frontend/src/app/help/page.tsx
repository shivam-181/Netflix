'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { ASSETS } from '@/constants/assets';
import { FaSearch, FaChevronDown, FaRegCreditCard } from 'react-icons/fa'; 
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';
import { BsTools, BsDisplay } from 'react-icons/bs';
import { RiRocketLine, RiErrorWarningLine } from 'react-icons/ri';
import { MdOutlineCancel, MdHistory } from 'react-icons/md';
import { BiMoviePlay } from 'react-icons/bi';
import { useProfileStore } from '@/store/useProfileStore';
import { useState } from 'react';
import { FiFileText } from 'react-icons/fi';

const PageContainer = styled.div`
  background-color: white;
  min-height: 100vh;
  color: #333;
  font-family: 'Netflix Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const HelpHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4%;
  height: 70px;
  background: white;
  border-bottom: 1px solid #e6e6e6;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Logo = styled.img`
  height: 25px;
  cursor: pointer;
  @media (min-width: 950px) { height: 30px; }
`;

const HeaderTitle = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: black;
  border-left: 1px solid #ccc;
  padding-left: 20px;
  line-height: 30px;
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:hover { text-decoration: underline; }
`;

const HeroSection = styled.div`
  background: white;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 30px;
  color: black;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px 15px 50px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  outline: none;
  transition: border 0.2s;
  
  &:focus {
    border-color: #0080ff; 
    box-shadow: 0 0 0 2px rgba(0,128,255,0.2);
  }
`;

const SearchIconPos = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const RecommendedLinks = styled.div`
  font-size: 0.9rem;
  color: #666;
  max-width: 600px;
  line-height: 1.5;
  
  a {
      color: #666;
      text-decoration: underline;
      margin: 0 5px;
      &:hover { color: #333; }
  }
`;

const ContentArea = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  gap: 30px;
`;

const SectionCard = styled.div`
  background: white;
  border: 1px solid #e6e6e6; 
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
`;

const SectionHeader = styled.div<{ color?: string }>`
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 1.2rem;
  font-weight: 700;
  
  svg {
      color: ${({ color }) => color || '#e50914'};
      font-size: 1.5rem;
  }
`;

const AccordionItem = styled.div`
  border-top: 1px solid #e6e6e6;
`;

const AccordionTrigger = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-weight: 500;
  font-size: 1rem;
  &:hover { background: #f9f9f9; }
`;

const ArticleList = styled.ul`
  list-style: none;
  padding: 0 20px 20px 20px;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 15px;
  animation: fadeIn 0.3s ease-in-out;
`;

const ArticleItem = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  color: #333;
  cursor: pointer;
  
  &:hover { text-decoration: underline; color: #0071eb; }
  
  svg {
    color: #333;
    font-size: 1.1rem;
  }
`;

const QuickLinkList = styled.div`
   display: flex;
   flex-direction: column;
`;

const QuickRow = styled.div`
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  font-size: 0.95rem;

  &:last-child { border-bottom: none; }
  &:hover { background: #fafafa; text-decoration: underline; }
  
  svg { color: #555; font-size: 1.2rem; }
  span { flex: 1; }
`;

const FooterCTA = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #fff;
`;

const ContactButton = styled.button`
  background: black;
  color: white;
  padding: 15px 40px;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  &:hover { opacity: 0.8; }
`;

const SimpleFooter = styled.footer`
  border-top: 1px solid #e6e6e6;
  padding: 40px 4%;
  background: #f3f3f3; 
  font-size: 0.85rem;
  color: #666;
  
  ul {
      display: flex;
      flex-direction: column;
      gap: 15px;
      list-style: none;
      padding: 0;
  }
  
  a { color: #666; text-decoration: none; border-bottom: 1px solid #999; }
  a:hover { border-bottom: 1px solid #333; color: #333; }
`;

export default function HelpCenterPage() {
  const router = useRouter();
  const { currentProfile } = useProfileStore();
  const [openSections, setOpenSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (id: string) => {
      setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <PageContainer>
      <HelpHeader>
        <HeaderLeft>
          <Logo src={ASSETS.NETFLIX_LOGO} onClick={() => router.push('/browse')} alt="Netflix" />
          <HeaderTitle>Help Center</HeaderTitle>
        </HeaderLeft>
        <UserMenu>
           <span>{currentProfile?.name || 'User'}</span>
           <FaChevronDown size={12} color="#cc0000" style={{marginLeft: 5}}/> 
        </UserMenu>
      </HelpHeader>

      <HeroSection>
          <HeroTitle>How can we help?</HeroTitle>
          <SearchWrapper>
             <SearchIconPos><FaSearch /></SearchIconPos>
             <SearchInput placeholder="Type a question, topic or issue" />
          </SearchWrapper>
          <RecommendedLinks>
              <strong>Recommended for you:</strong> 
              <a href="#">How to keep your account secure</a>, 
              <a href="#">Parental controls on Netflix</a>, 
              <a href="#">How to change your plan</a>
          </RecommendedLinks>
      </HeroSection>
      
      <div style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1rem', fontWeight: 600 }}>Explore Topics</div>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}><FaChevronDown /></div>

      <ContentArea>
          <SectionCard>
              <SectionHeader color="#e50914">
                  <AiOutlineUser /> 
                  <span>Account and Billing</span>
              </SectionHeader>
              <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('account-settings')}>
                      <span>Account Settings</span>
                      <FaChevronDown style={{ transform: openSections['account-settings'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                  {openSections['account-settings'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> How to change your plan</ArticleItem>
                          <ArticleItem><FiFileText /> How to cancel Netflix</ArticleItem>
                          <ArticleItem><FiFileText /> How to change or reset your password</ArticleItem>
                          <ArticleItem><FiFileText /> How to update Netflix account information</ArticleItem>
                          <ArticleItem><FiFileText /> Sharing your Netflix account</ArticleItem>
                          <ArticleItem><FiFileText /> How to keep your account secure</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
              <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('paying')}>
                      <span>Paying for Netflix</span>
                      <FaChevronDown style={{ transform: openSections['paying'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                   {openSections['paying'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> Manage payment methods</ArticleItem>
                          <ArticleItem><FiFileText /> Billing dates and history</ArticleItem>
                          <ArticleItem><FiFileText /> Why was I charged?</ArticleItem>
                          <ArticleItem><FiFileText /> Gift cards & Promotions</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
          </SectionCard>

          <SectionCard>
              <SectionHeader color="#b00620"> 
                  <BsTools />
                  <span>Fix a Problem</span>
              </SectionHeader>
               <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('acct-issues')}>
                      <span>Account Issues</span>
                      <FaChevronDown style={{ transform: openSections['acct-issues'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                  {openSections['acct-issues'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> Can't sign in to Netflix</ArticleItem>
                          <ArticleItem><FiFileText /> Forgot email or password</ArticleItem>
                          <ArticleItem><FiFileText /> Netflix says my account is already in use</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
              <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('billing-issues')}>
                      <span>Billing Issues</span>
                      <FaChevronDown style={{ transform: openSections['billing-issues'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                   {openSections['billing-issues'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> Unknown charges on my card</ArticleItem>
                          <ArticleItem><FiFileText /> Payment declined</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
              <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('errors')}>
                      <span>Error Codes</span>
                      <FaChevronDown style={{ transform: openSections['errors'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                  {openSections['errors'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> Troubleshooting common error codes</ArticleItem>
                          <ArticleItem><FiFileText /> Network connectivity issues</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
               <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('watching')}>
                      <span>Problems Watching</span>
                      <FaChevronDown style={{ transform: openSections['watching'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                  {openSections['watching'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> Video buffering or loading slowly</ArticleItem>
                          <ArticleItem><FiFileText /> Black screen or no sound</ArticleItem>
                          <ArticleItem><FiFileText /> Frozen or unresponsive app</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
          </SectionCard>
          
          <SectionCard>
              <SectionHeader color="#6a0dad">
                  <BsDisplay />
                  <span>Watching and Playing</span>
              </SectionHeader>
              <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('profiles')}>
                       <span>Profiles</span>
                       <FaChevronDown style={{ transform: openSections['profiles'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                  {openSections['profiles'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> Create and edit profiles</ArticleItem>
                          <ArticleItem><FiFileText /> Profile locks and PINs</ArticleItem>
                          <ArticleItem><FiFileText /> Viewing history</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
              <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('features')}>
                       <span>Features and Settings</span>
                       <FaChevronDown style={{ transform: openSections['features'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                  {openSections['features'] && (
                      <ArticleList>
                           <ArticleItem><FiFileText /> Subtitles, captions and audio</ArticleItem>
                           <ArticleItem><FiFileText /> Playback settings and data usage</ArticleItem>
                           <ArticleItem><FiFileText /> Download titles to watch offline</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
          </SectionCard>

          <SectionCard>
              <SectionHeader color="#333"> 
                  <RiRocketLine />
                  <span>Getting Started</span>
              </SectionHeader>
              <AccordionItem>
                  <AccordionTrigger onClick={() => toggleSection('joining')}>
                      <span>Joining Netflix</span>
                      <FaChevronDown style={{ transform: openSections['joining'] ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
                  </AccordionTrigger>
                   {openSections['joining'] && (
                      <ArticleList>
                          <ArticleItem><FiFileText /> What is Netflix?</ArticleItem>
                          <ArticleItem><FiFileText /> Supported devices</ArticleItem>
                          <ArticleItem><FiFileText /> Internet speed recommendations</ArticleItem>
                      </ArticleList>
                  )}
              </AccordionItem>
          </SectionCard>

          <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '15px' }}>Quick Links</div>
          <SectionCard style={{ border: '1px solid #eee' }}>
             <QuickLinkList>
                 <QuickRow><RiErrorWarningLine /><span>Content Grievances in India</span></QuickRow>
                 <QuickRow><BiMoviePlay /><span>Request TV shows or movies</span></QuickRow>
                 <QuickRow><AiOutlineMail /><span>Update email</span></QuickRow>
                 <QuickRow><AiOutlineLock /><span>Update password</span></QuickRow>
                 <QuickRow><FaRegCreditCard /><span>Update payment method</span></QuickRow>
                 <QuickRow><MdOutlineCancel /><span>Cancel account</span></QuickRow>
                 <QuickRow><MdHistory /><span>Review payment history</span></QuickRow>
             </QuickLinkList>
          </SectionCard>

      </ContentArea>

      <FooterCTA>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>Need more help?</div>
          <ContactButton>Contact Us</ContactButton>
      </FooterCTA>

      <SimpleFooter>
          <ul>
              <li><a href="#">Terms of Use</a></li>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Cookie Preferences</a></li>
              <li><a href="#">Corporate Information</a></li>
          </ul>
      </SimpleFooter>

    </PageContainer>
  );
}
