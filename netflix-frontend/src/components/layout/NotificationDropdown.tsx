import { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import tmdb, { requests } from '@/lib/tmdb';

const DropdownContainer = styled.div`
  position: absolute;
  top: 35px;
  right: 0;
  width: 400px;
  background-color: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: none;
  flex-direction: column;
  z-index: 1000;
  max-height: 350px;
  overflow-y: auto;
  border-top: 2px solid white;
  cursor: default;

  /* Custom Scrollbar */
  &::-webkit-scrollbar { width: 8px; }
  &::-webkit-scrollbar-track { background: black; }
  &::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
  &::-webkit-scrollbar-thumb:hover { background: #888; }

  /* Arrow Tip */
  &::before {
    content: '';
    position: absolute;
    top: -6px;
    right: 6px;
    width: 0; 
    height: 0; 
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 6px solid white;
  }

  /* Hover Bridge */
  &::after {
    content: '';
    position: absolute;
    top: -30px;
    left: 0;
    width: 100%;
    height: 40px;
    background: transparent;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover { background-color: rgba(255,255,255,0.05); }
  &:last-child { border-bottom: none; }
`;

const NotificationImage = styled.img`
  width: 110px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`;

const NotificationText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

const NotificationTitle = styled.span`
  font-size: 0.95rem;
  color: #dcdcdc;
  line-height: 1.2;
`;

const NotificationSubtitle = styled.span`
  font-size: 0.85rem;
  color: white;
  font-weight: 600;
`;

const NotificationTime = styled.span`
  font-size: 0.75rem;
  color: #808080;
`;

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch "New on Netflix" or Trending
        const req = await tmdb.get(requests.fetchNewOnNetflix || requests.fetchTrending);
        const results = req.data.results
          .filter((item: any) => item.backdrop_path || item.poster_path) // Filter out items with no image
          .slice(0, 10);
        
        const formatted = results.map((item: any) => ({
          id: item.id,
          title: item.name || item.title || "New Arrival",
          subtitle: item.overview ? "New Arrival" : "Now Available", 
          image: `https://image.tmdb.org/t/p/w500${item.backdrop_path || item.poster_path}`,
          time: getRandomTime(), // Simulate "X days ago"
          description: item.overview
        }));

        setNotifications(formatted);
      } catch (error) {
        console.error("Failed to fetch notifications", error);
      }
    }
    fetchData();
  }, []);

  const getRandomTime = () => {
    const times = ["Today", "Yesterday", "2 days ago", "New Arrival", "Just now"];
    return times[Math.floor(Math.random() * times.length)];
  };

  if (notifications.length === 0) return null;

  return (
    <DropdownContainer className="notification-menu">
      {notifications.map((note) => (
        <NotificationItem key={note.id}>
          <NotificationImage src={note.image} alt={note.title} />
          <NotificationText>
            <NotificationSubtitle>{note.subtitle}</NotificationSubtitle>
            <NotificationTitle>{note.title}</NotificationTitle>
            <NotificationTime>{note.time}</NotificationTime>
          </NotificationText>
        </NotificationItem>
      ))}
    </DropdownContainer>
  );
}
