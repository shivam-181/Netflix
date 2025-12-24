'use client';
import styled from '@emotion/styled';
import HoverCard from './HoverCard';

const RowContainer = styled.div`
  margin-bottom: 5px;
  padding-left: 4%;
  
  /* Ensure z-index layering */
  position: relative;
  z-index: 1; 
  &:hover { z-index: 2; } /* Bring row to front when interacting */
`;

const Title = styled.h2`
  color: #e5e5e5;
  margin-bottom: 5px;
  font-size: 1.5rem;
  font-weight: 500;
  @media (max-width: 800px) { font-size: 1.2rem; }
`;

const ScrollContainer = styled.div`
  display: flex;
  overflow-x: scroll; 
  overflow-y: visible; /* CRITICAL: Allow cards to scale vertically outside */
  gap: 10px;
  padding: 30px 0; /* Huge padding to allow large hover expansion */
  margin-top: -10px; /* Offset the padding visually */
  scroll-behavior: smooth;

  /* Hide Scrollbar */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

// Removed Card/Thumbnail components as they are moved to HoverCard

interface ContentItem {
  _id: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  videoUrl?: string;
  genre: string;
  duration?: string;
  ageRating?: string;
}

interface ContentRowProps {
  title: string;
  data: ContentItem[];
  isLargeRow?: boolean;
}

export default function ContentRow({ title, data, isLargeRow }: ContentRowProps) {
  if (!data || data.length === 0) return null;

  return (
    <RowContainer>
      <Title>{title}</Title>
      <ScrollContainer>
        {data.map((item) => (
           <HoverCard key={item._id} item={item} isLarge={isLargeRow} />
        ))}
      </ScrollContainer>
    </RowContainer>
  );
}