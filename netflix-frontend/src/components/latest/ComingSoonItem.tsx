'use client';
import styled from '@emotion/styled';
import { FaRegBell, FaInfoCircle } from 'react-icons/fa';
import { useModalStore } from '@/store/useModalStore';

const Container = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  color: white;
  
  @media (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
  }
`;

const DateCol = styled.div`
  display: flex;
  flex-direction: column;
  width: 50px;
  flex-shrink: 0;
  align-items: flex-start;
  padding-top: 10px;
`;

const Month = styled.span`
    text-transform: uppercase;
    font-weight: bold;
    font-size: 0.9rem;
    color: #a3a3a3;
`;

const Day = styled.span`
    font-size: 2rem;
    font-weight: 800;
    color: #e5e5e5;
    letter-spacing: 2px;
`;

const ContentCol = styled.div`
  flex: 1;
`;

const MediaWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  
  &:hover .play-icon {
      transform: scale(1.1);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ButtonRow = styled.div`
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
`;

const ActionButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    background: transparent;
    border: none;
    color: white;
    font-size: 0.8rem;
    cursor: pointer;
    color: #a3a3a3;
    
    &:hover {
        color: white;
    }
`;

const Title = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 10px;
    font-family: 'Netflix Sans', sans-serif;
`;

const Overview = styled.p`
    color: #a3a3a3;
    font-size: 0.95rem;
    line-height: 1.5;
    max-width: 600px;
    margin-bottom: 10px;
`;

const GenreRow = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    font-size: 0.85rem;
    color: white;
    
    span:not(:last-child)::after {
        content: '•';
        color: #666;
        margin-left: 10px;
    }
`;

const ComingSoonLabel = styled.div`
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 10px;
    letter-spacing: 1px;
    color: white;
`;

export default function ComingSoonItem({ item }: { item: any }) {
    const { openModal } = useModalStore();
    
    // Parse date
    const dateStr = item.release_date || item.first_air_date;
    const dateProxy = new Date(dateStr);
    const month = dateProxy.toLocaleString('default', { month: 'short' });
    const day = dateProxy.getDate();

    const handleClick = () => {
        openModal(item);
    };

    return (
        <Container>
            <DateCol>
                <Month>{month}</Month>
                <Day>{day}</Day>
            </DateCol>
            
            <ContentCol>
                <MediaWrapper onClick={handleClick}>
                    <Image src={`https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`} />
                </MediaWrapper>
                
                <ButtonRow>
                    <ActionButton>
                        <FaRegBell size={24} />
                        Remind Me
                    </ActionButton>
                    <ActionButton onClick={handleClick}>
                        <FaInfoCircle size={24} />
                        Info
                    </ActionButton>
                </ButtonRow>
                
                <ComingSoonLabel>
                    Scanning {month} {day}
                </ComingSoonLabel>
                
                <Title>{item.title || item.name}</Title>
                <Overview>{item.overview}</Overview>
                
                <GenreRow>
                    {item.genre_ids?.map((id: number) => (
                        <span key={id}>Genre {id}</span> 
                    ))}
                     {/* In reality we map IDs to names or fetch details */}
                </GenreRow>
                
            </ContentCol>
        </Container>
    );
}
