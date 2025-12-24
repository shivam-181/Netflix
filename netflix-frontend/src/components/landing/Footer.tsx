'use client';
import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  background-color: black;
  color: #b3b3b3;
  padding: 70px 45px;
  font-size: 1rem;
  width: 100%;
  
  @media (max-width: 740px) {
    padding: 50px 5%;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const TopText = styled.p`
  margin-bottom: 20px;
  a {
    color: #b3b3b3;
    text-decoration: underline;
    &:hover { color: #b3b3b3; }
  }
`;

const LinkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  font-size: 0.875rem;

  @media (max-width: 740px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const FooterLink = styled.a`
  color: #b3b3b3;
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    color: #b3b3b3;
  }
`;

const LanguageSelect = styled.select`
  background: rgba(0,0,0,0.4);
  border: 1px solid #555;
  color: white;
  padding: 6px 26px;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-top: 20px;
  width: fit-content;
  
  /* Simple arrow replacement/styling would go here, keeping standard for now */
  appearance: none; 
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem top 50%;
  background-size: 0.65rem auto;
  padding-right: 2rem;
`;

const BrandingText = styled.p`
  font-size: 0.875rem;
  margin-top: 20px;
`;

const LINKS = [
  "FAQ", "Help Centre", "Account", "Media Centre",
  "Investor Relations", "Jobs", "Ways to Watch", "Terms of Use",
  "Privacy", "Cookie Preferences", "Corporate Information", "Contact Us",
  "Speed Test", "Legal Notices", "Only on Netflix"
];

export default function Footer() {
  return (
    <FooterContainer>
      <ContentWrapper>
        <TopText>
          Questions? Call <a href="tel:000-800-919-1694">000-800-919-1694</a>
        </TopText>

        <LinkGrid>
          {LINKS.map((link) => (
            <FooterLink key={link} href="#">{link}</FooterLink>
          ))}
        </LinkGrid>

        <div style={{ position: 'relative', width: 'fit-content' }}>
            {/* Globe icon could participate here, simplified for now */}
            <LanguageSelect>
              <option value="en">English</option>
              <option value="hi">Hindi</option>
            </LanguageSelect>
        </div>

        <BrandingText>Netflix India</BrandingText>
      </ContentWrapper>
    </FooterContainer>
  );
}
