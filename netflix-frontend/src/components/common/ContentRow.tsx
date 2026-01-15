'use client';
import { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import HoverCard from './HoverCard';
import RankIcon from './RankIcon';

const RowContainer = styled.div`
  margin-bottom: 10px; 
  padding-left: 4%;
  
  /* Ensure z-index layering */
  position: relative;
  z-index: 1; 
  &:hover { z-index: 2; } /* Bring row to front when interacting */
`;

const ExploreText = styled.div<{ visible: boolean }>`
  display: flex; 
  align-items: baseline;
  font-size: 0.9vw;
  font-weight: 600;
  color: #54b9c5;
  opacity: ${props => props.visible ? 1 : 0};
  max-width: ${props => props.visible ? '200px' : '0'};
  overflow: hidden; 
  transform: ${props => props.visible ? 'translate(0)' : 'translateX(-20px)'};
  transition: all 0.4s ease-in-out;
  white-space: nowrap;
  vertical-align: bottom;
  
  @media (max-width: 500px) { display: none; }
`;

const Chevron = styled.span<{ visible: boolean }>`
  color: #54b9c5; 
  font-size: 1vw;
  font-weight: bold;
  margin-left: 5px;
  display: inline-block; 
  opacity: ${props => props.visible ? 1 : 0};
  transform: ${props => props.visible ? 'translateX(0)' : 'translateX(-10px)'};
  transition: all 0.3s;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 0px;
  cursor: pointer;
  width: fit-content;
`;

const Title = styled.h2`
  color: #e5e5e5;
  display: table-cell;
  font-size: 1.4vw;
  line-height: 1.25vw;
  vertical-align: bottom;
  font-weight: 700; 
  transition: color 0.3s;
  
  .group:hover & {
    color: white;
  }

  @media (max-width: 800px) { font-size: 1.2rem; }
`;


const ScrollContainer = styled.div`
  display: flex;
  overflow-x: scroll; 
  overflow-y: visible; 
  gap: 10px;
  padding: 50px 0; 
  margin-top: -45px; /* Reduced gap */
  margin-bottom: -40px; 
  scroll-behavior: smooth;

  /* Hide Scrollbar */
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const RankedWrapper = styled.div`
  display: flex;
  align-items: flex-end; 
  position: relative;
  margin-right: 10px; 
`;



const SliderArrow = styled.div<{ direction: 'left' | 'right' }>`
  position: absolute;
  top: 50px;
  bottom: 50px;
  ${props => props.direction === 'left' ? 'left: 0;' : 'right: 0;'}
  width: 50px; /* Reduced from default usually 4%, simplified px */
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s ease-in-out;
  border-radius: 4px; /* Soft edges */
  
  .group:hover & {
    opacity: 1;
  }

  &:hover {
    background: rgba(0,0,0,0.7);
    transform: scale(1.05); /* Slight pop */
  }

  @media (min-width: 768px) { width: 60px; }
`;

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

export default function ContentRow({ title, data, isLargeRow, isRanked }: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isHeaderHovered, setIsHeaderHovered] = useState(false);

  const handleScroll = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setIsMoved(scrollLeft > 0);
      setIsEnd(Math.ceil(scrollLeft + clientWidth) >= scrollWidth);
    }
  };

  useEffect(() => {
     handleScroll(); // Check initially
     // Add listener
     const row = rowRef.current;
     if(row) {
        row.addEventListener('scroll', handleScroll);
        // Also verify resizing
        window.addEventListener('resize', handleScroll);
        return () => {
            row.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
     }
  }, [data]);

  const handleClick = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? rowRef.current.scrollLeft - clientWidth 
        : rowRef.current.scrollLeft + clientWidth;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <RowContainer className="group">
      <Header 
        onMouseEnter={() => setIsHeaderHovered(true)}
        onMouseLeave={() => setIsHeaderHovered(false)}
      >
          <Title>{title}</Title>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ExploreText visible={isHeaderHovered}>Explore All</ExploreText>
            <Chevron visible={isHeaderHovered}>{'>'}</Chevron>
          </div>
      </Header>
      
      <div style={{ position: 'relative' }}> 
          {isMoved && (
            <SliderArrow direction="left" onClick={() => handleClick('left')}>
                <FaChevronLeft size={30} color="white" />
            </SliderArrow>
          )}

          <ScrollContainer ref={rowRef}>
            {data.map((item, index) => {
              if (isRanked) {
                return (
                  <RankedWrapper key={item._id}>
<RankIcon rank={index + 1} />
                      <HoverCard item={item} isLarge={true} isRanked={true} />
                  </RankedWrapper>
                );
              }
              return <HoverCard key={item._id} item={item} isLarge={isLargeRow} />;
            })}
          </ScrollContainer>

          {!isEnd && (
            <SliderArrow direction="right" onClick={() => handleClick('right')}>
                <FaChevronRight size={30} color="white" />
            </SliderArrow>
          )}
      </div>
    </RowContainer>
  );
}