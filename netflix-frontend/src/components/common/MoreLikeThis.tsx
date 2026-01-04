'use client';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchRecommendations } from '@/lib/tmdb';
import { useModalStore } from '@/store/useModalStore';

const Container = styled.div`
  margin-top: 40px;
  color: white;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 15px;
`;

const Card = styled.div`
  background-color: #2f2f2f;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Poster = styled.img`
  width: 100%;
  aspect-ratio: 2/3;
  object-fit: cover;
`;

const Meta = styled.div`
  padding: 10px;
`;

const Name = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Rating = styled.span`
    color: #46d369;
    font-size: 0.8rem;
    font-weight: bold;
`;

interface MoreLikeThisProps {
    type: 'movie' | 'tv';
    id: number;
}

export default function MoreLikeThis({ type, id }: MoreLikeThisProps) {
    const [items, setItems] = useState<any[]>([]);
    const { openModal } = useModalStore();

    useEffect(() => {
        const fetchRecs = async () => {
            const data = await fetchRecommendations(type, id);
            if (data && data.results) {
                // Filter out items without posters to look clean
                setItems(data.results.filter((i: any) => i.poster_path).slice(0, 12));
            }
        };
        fetchRecs();
    }, [type, id]);

    if (!items.length) return null;

    return (
        <Container>
            <Title>More Like This</Title>
            <Grid>
                {items.map((item) => (
                    <Card key={item.id} onClick={() => openModal(item)}>
                        <Poster 
                            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`} 
                            alt={item.title || item.name} 
                        />
                        <Meta>
                            <Name>{item.title || item.name}</Name>
                            <Rating>{Math.round(item.vote_average * 10)}% Match</Rating>
                        </Meta>
                    </Card>
                ))}
            </Grid>
        </Container>
    );
}
