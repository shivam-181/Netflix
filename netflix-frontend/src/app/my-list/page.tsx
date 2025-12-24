'use client';

import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useProfileStore } from '@/store/useProfileStore';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import api from '@/lib/axios';
import InfoModal from '@/components/common/InfoModal';
import HoverCard from '@/components/common/HoverCard';

const PageContainer = styled.div`
  background-color: #141414;
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ContentArea = styled.div`
  margin-top: 120px; /* Below navbar */
  padding: 0 4%;
  flex: 1;
`;

const PageTitle = styled.h1`
  font-size: 1.5rem;
  color: #e5e5e5;
  margin-bottom: 20px;
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-bottom: 50px;
  
  @media (max-width: 800px) {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const EmptyMessage = styled.div`
    color: #999;
    font-size: 1.2rem;
    margin-top: 50px;
    text-align: center;
`;

export default function MyListPage() {
  const { user, isLoading } = useAuthStore();
  const { currentProfile } = useProfileStore();
  const router = useRouter();
  const [myList, setMyList] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
      if (!currentProfile) return;
      
      const fetchList = async () => {
          try {
              const res = await api.get(`/profiles/${currentProfile._id}/list`);
              // Helper mapping if backend returns raw db objects
              const mapped = res.data.map((item: any) => ({
                    ...item,
                    // Ensure we have correct props for HoverCard
                     _id: item.contentId || item._id, // Adapt based on how backend stores it
                     id: Number(item.contentId),
                     thumbnailUrl: item.thumbnailUrl || item.posterPath, // Fallback
                     media_type: item.type || 'movie'
              }));
              setMyList(mapped);
          } catch (e) {
              console.error(e);
          } finally {
              setLoadingList(false);
          }
      };
      fetchList();
  }, [currentProfile]);

  if (isLoading || !user) return <div style={{ background: '#141414', minHeight: '100vh' }} />;

  return (
    <PageContainer>
        
        <ContentArea>
            <PageTitle>My List</PageTitle>
            
            {loadingList ? (
                <div style={{ color: 'white' }}>Loading...</div>
            ) : myList.length > 0 ? (
                <Grid>
                    {myList.map((item) => (
                        <div key={item._id} style={{ position: 'relative', aspectRatio: '16/9' }}>
                           {/* HoverCard expects item and assumes it is inside a row usually, 
                               but we can reuse it if we wrap it carefully or just use a simpler Card */}
                           <HoverCard item={item} />
                        </div>
                    ))}
                </Grid>
            ) : (
                <EmptyMessage>
                    You haven't added any titles to your list yet.
                </EmptyMessage>
            )}
        </ContentArea>

        <Footer />
        <InfoModal />
    </PageContainer>
  );
}
