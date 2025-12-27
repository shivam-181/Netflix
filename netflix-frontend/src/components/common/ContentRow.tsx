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

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  width: fit-content;

  &:hover .explore-text {
    max-width: 200px;
    opacity: 1;
    transform: translate(0);
  }
  
  &:hover .chevron {
     color: #54b9c5;
  }
`;

const Title = styled.h2`
  color: #e5e5e5;
  display: table-cell;
  font-size: 1.4vw;
  line-height: 1.25vw;
  vertical-align: bottom;
  font-weight: 700; /* Bold as requested */
  transition: color 0.3s;
  
  .group:hover & {
    color: white;
  }

  @media (max-width: 800px) { font-size: 1.2rem; }
`;

const ExploreText = styled.div`
  display: flex; /* alignment */
  align-items: baseline;
  font-size: 0.9vw;
  font-weight: 600;
  color: #54b9c5;
  opacity: 0;
  max-width: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease-in-out;
  white-space: nowrap;
  vertical-align: bottom;
  
  @media (max-width: 800px) { display: none; }
`;

const Chevron = styled.span`
  color: #54b9c5; /* Always green/cyan as requested? Or only on hover? Images imply cyan. */
  font-size: 1vw;
  font-weight: bold;
  margin-left: 5px;
  display: inline-block; /* allows transform if needed */
  opacity: 0;
  transition: all 0.3s;
  transform: translateX(-10px);

  .group:hover & {
      opacity: 1;
      transform: translateX(0);
  }
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
  /* Hide Scrollbar */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const RankedWrapper = styled.div`
  display: flex;
  align-items: flex-end; /* Align to bottom usually looks best, or center */
  position: relative;
  margin-right: 50px; 
`;

const RankSvg = styled.svg`
  width: 140px;
  height: 330px; /* Match large card height (220px * 1.5) */
  /* Remove absolute */
  fill: #141414;
  stroke: #595959;
  stroke-width: 4px;
  margin-right: -10px; /* Slight visual connection */
  flex-shrink: 0;
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
  isRanked?: boolean;
}

// Update functional component to use Header
export default function ContentRow({ title, data, isLargeRow, isRanked }: ContentRowProps) {
  if (!data || data.length === 0) return null;

  return (
    <RowContainer>
      <Header className="group">
          <Title>{title}</Title>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExploreText className="explore-text">Explore All</ExploreText>
            <Chevron className="chevron">{'>'}</Chevron>
          </div>
      </Header>
      <ScrollContainer>
        {data.map((item, index) => {
           if (isRanked) {
             return (
               <RankedWrapper key={item._id}>
                  <RankSvg viewBox="0 0 140 330">
                     <text x="50%" y="280" textAnchor="middle" fontSize="280" fontWeight="900" letterSpacing="-10">{index + 1}</text>
                  </RankSvg>
                  <HoverCard item={item} isLarge={true} isRanked={true} />
               </RankedWrapper>
             );
           }
           return <HoverCard key={item._id} item={item} isLarge={isLargeRow} />;
        })}
      </ScrollContainer>
    </RowContainer>
  );
}