'use client';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import Navbar from '@/components/layout/Navbar';
import tmdb from '@/lib/tmdb';
import ComingSoonItem from '@/components/latest/ComingSoonItem';

const PageContainer = styled.div`
    background-color: #000;
    min-height: 100vh;
    padding-top: 100px; /* Navbar height */
    display: flex;
    justify-content: center;
`;

const ContentWrapper = styled.div`
    width: 100%;
    max-width: 600px; /* Timeline usually narrow */
    padding: 20px;
`;

const Header = styled.h1`
    color: white;
    margin-bottom: 30px;
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 10px;
`;

const Icon = styled.div`
    background: #e50914;
    width: 30px;
    height: 30px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
`;

export default function LatestPage() {
    const [items, setItems] = useState<any[]>([]);

    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                // Fetch upcoming movies
                const res = await tmdb.get('/movie/upcoming?region=US');
                // Could also fetch tv/on_the_air
                if (res.data.results) {
                    setItems(res.data.results.filter((i: any) => i.backdrop_path));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchUpcoming();
    }, []);

    return (
        <>
            <Navbar />
            <PageContainer>
                <ContentWrapper>
                    <Header>
                        <Icon>🍿</Icon> 
                        New & Hot
                    </Header>
                    
                    {items.map(item => (
                        <ComingSoonItem key={item.id} item={item} />
                    ))}
                    
                    {items.length === 0 && (
                        <div style={{ color: 'white' }}>Loading...</div>
                    )}
                </ContentWrapper>
            </PageContainer>
        </>
    );
}
