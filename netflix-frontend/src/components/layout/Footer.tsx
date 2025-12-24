'use client';

import styled from '@emotion/styled';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

const FooterContainer = styled.footer`
  max-width: 980px;
  margin: 20px auto 0;
  padding: 0 4%;
  color: grey;
  font-size: 13px;
  line-height: 1.2em;
  padding-bottom: 20px;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  color: white;
  font-size: 24px;
  
  svg {
    cursor: pointer;
    &:hover { color: #b3b3b3; }
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const LinkItem = styled.a`
  color: grey;
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ServiceCodeButton = styled.button`
  background: transparent;
  border: 1px solid grey;
  color: grey;
  padding: 6px 16px;
  font-size: 13px;
  margin-bottom: 20px;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const Copyright = styled.p`
  font-size: 11px;
  margin-bottom: 15px;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <SocialLinks>
        <FaFacebookF />
        <FaInstagram />
        <FaTwitter />
        <FaYoutube />
      </SocialLinks>
      
      <LinksGrid>
        <LinkItem>Audio Description</LinkItem>
        <LinkItem>Help Center</LinkItem>
        <LinkItem>Gift Cards</LinkItem>
        <LinkItem>Media Center</LinkItem>
        
        <LinkItem>Investor Relations</LinkItem>
        <LinkItem>Jobs</LinkItem>
        <LinkItem>Terms of Use</LinkItem>
        <LinkItem>Privacy</LinkItem>
        
        <LinkItem>Legal Notices</LinkItem>
        <LinkItem>Cookie Preferences</LinkItem>
        <LinkItem>Corporate Information</LinkItem>
        <LinkItem>Contact Us</LinkItem>
      </LinksGrid>
      
      <Copyright>© 1997-2025 Netflix, Inc.</Copyright>
    </FooterContainer>
  );
}
