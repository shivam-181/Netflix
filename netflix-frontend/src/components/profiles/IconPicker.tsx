'use client';
import styled from '@emotion/styled';
import { PROFILE_ICONS } from '@/lib/profileIcons';
import { BiArrowBack } from 'react-icons/bi';

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #141414;
  z-index: 3000; /* Highest */
  color: white;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
`;

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  background-color: #141414;
  padding: 20px 4%;
  display: flex;
  align-items: center;
  gap: 30px;
  border-bottom: 1px solid #333;
  z-index: 10;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 10px;
  transition: transform 0.2s;

  &:hover { transform: scale(1.1); }
`;

const HeaderText = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
`;

const Subtitle = styled.span`
  font-size: 1.2rem;
  color: #a3a3a3;
`;

const Content = styled.div`
  padding: 40px 4%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  padding-bottom: 100px;
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  color: #e5e5e5;
  margin: 0;
  font-weight: 500;
`;

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const IconWrapper = styled.div`
  width: 130px;
  height: 130px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, border 0.2s;
  border: 3px solid transparent;

  &:hover {
    transform: scale(1.1);
    border-color: white;
  }

  @media (max-width: 600px) {
    width: 90px;
    height: 90px;
  }
`;

const IconImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

interface IconPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function IconPicker({ onSelect, onClose }: IconPickerProps) {
  return (
    <Overlay>
      <StickyHeader>
        <BackButton onClick={onClose}><BiArrowBack /></BackButton>
        <HeaderText>
           <Title>Edit Profile</Title>
           <Subtitle>Choose a profile icon</Subtitle>
        </HeaderText>
      </StickyHeader>

      <Content>
        {PROFILE_ICONS.map((category) => (
          <CategorySection key={category.category}>
            <CategoryTitle>{category.category}</CategoryTitle>
            <Grid>
               {category.images.map((url, idx) => (
                 <IconWrapper key={idx} onClick={() => onSelect(url)}>
                    <IconImg src={url} alt="Profile Icon" />
                 </IconWrapper>
               ))}
            </Grid>
          </CategorySection>
        ))}
      </Content>
    </Overlay>
  );
}
