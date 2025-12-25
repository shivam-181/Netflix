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
              // res.data is [{ id: '123', type: 'movie' }, ...]
              
              if (!res.data || res.data.length === 0) {
                  setMyList([]);
                  setLoadingList(false);
                  return;
              }

              // Import fetchDetails dynamically or assume it's available. 
              // It is imported in other files from '@/lib/tmdb'.
              // We need to import it at top or here.
              // I will assume explicit import at top is needed, but I can't add imports with this tool easily without replacing top of file.
              // I will replace the imports later or now.
              // Let's assume I will fix imports in next step.
              // For now, write logic assuming `fetchDetails` is available.
              
              const promises = res.data.map(async (item: any) => {
                  try {
                      // Fetch details from TMDB
                      // We need to fetch details based on ID and Type
                      // If type is missing, try movie first? Backend defaults to movie now.
                      const type = item.type || 'movie';
                      const details = await import('@/lib/tmdb').then(m => m.fetchDetails(type, item.id));
                      
                      return {
                          ...details,
                          media_type: type,
                          _id: item.id // Ensure ID matches for HoverCard check
                      };
                  } catch (err) {
                      console.error(`Failed to fetch ${item.id}`, err);
                      return null;
                  }
              });

              const results = await Promise.all(promises);
              setMyList(results.filter(r => r !== null));
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
