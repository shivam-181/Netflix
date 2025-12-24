'use client';
import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const Container = styled.div`
  padding: 100px 4%;
  color: white;
  min-height: 100vh;
  background: #141414;
`;

const Form = styled.form`
  background: #1f1f1f;
  padding: 30px;
  border-radius: 8px;
  max-width: 600px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  padding: 10px;
  background: #333;
  border: 1px solid #555;
  color: white;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 10px;
  background: #333;
  border: 1px solid #555;
  color: white;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 10px;
  background: #333;
  border: 1px solid #555;
  color: white;
  border-radius: 4px;
  min-height: 100px;
`;

const Button = styled.button`
  padding: 12px;
  background: #e50914;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover { background: #b00710; }
`;

const ListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

const AdminCard = styled.div`
  background: #333;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: red;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

export default function AdminPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [contentList, setContentList] = useState<any[]>([]);
  
  // Form State
  const [type, setType] = useState('movie');
  const [formData, setFormData] = useState({
    title: '', description: '', thumbnailUrl: '', backdropUrl: '', 
    genre: '', ageRating: '', videoUrl: '', duration: '', trailerUrl: ''
  });

  useEffect(() => {
    if (!user) return; // Wait for hydrate
    // Simple mock check or rely on backend 403
    if (user.isAdmin === false) {
      alert("Access Denied");
      router.push('/browse');
    }
    fetchContent();
  }, [user]);

  const fetchContent = async () => {
    try {
      // In a real app we'd paginate or have an admin list endpoint
      const res = await api.get('/content?limit=100');
      setContentList(res.data);
    } catch(e) { console.error(e); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/content', { ...formData, type });
      alert("Created!");
      fetchContent();
      setFormData({ 
        title: '', description: '', thumbnailUrl: '', backdropUrl: '', 
        genre: '', ageRating: '', videoUrl: '', duration: '', trailerUrl: '' 
      });
    } catch(e: any) {
      alert(e.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete?")) return;
    try {
      await api.delete(`/content/${id}`);
      fetchContent();
    } catch(e) { alert("Failed to delete"); }
  };

  if (!user?.isAdmin) return <Container>Loading or Access Denied...</Container>;

  return (
    <Container>
      <h1>Admin Panel</h1>
      <p style={{marginBottom: 20}}>Manage Movies and Series</p>

      <Form onSubmit={handleSubmit}>
        <h3>Add New Content</h3>
        <Select value={type} onChange={e => setType(e.target.value)}>
          <option value="movie">Movie</option>
          <option value="series">Series</option>
        </Select>
        
        <Input placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        <Textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
        <Input placeholder="Thumbnail URL" value={formData.thumbnailUrl} onChange={e => setFormData({...formData, thumbnailUrl: e.target.value})} required />
        <Input placeholder="Backdrop URL" value={formData.backdropUrl} onChange={e => setFormData({...formData, backdropUrl: e.target.value})} required />
        <Input placeholder="Genre (e.g. Action)" value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} required />
        <Input placeholder="Age Rating (e.g. 18+)" value={formData.ageRating} onChange={e => setFormData({...formData, ageRating: e.target.value})} required />
        <Input placeholder="Trailer URL (YouTube/MP4)" value={formData.trailerUrl} onChange={e => setFormData({...formData, trailerUrl: e.target.value})} />
        
        {type === 'movie' && (
          <>
            <Input placeholder="Video URL" value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
            <Input placeholder="Duration (e.g. 2h 15m)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
          </>
        )}
        
        {type === 'series' && (
          <p style={{color: '#aaa', fontSize: '0.9rem'}}>* Series episodes must be added via DB currently (UI WIP)</p>
        )}

        <Button type="submit">Create Content</Button>
      </Form>

      <h3>Existing Content</h3>
      <ListGrid>
        {contentList.map(item => (
          <AdminCard key={item._id}>
            <img src={item.thumbnailUrl} style={{width: '100%', height: '100px', objectFit: 'cover'}} />
            <div style={{padding: 10}}>
              <h4>{item.title}</h4>
              <p style={{fontSize: '0.8rem', color: '#999'}}>{item.type}</p>
            </div>
            <DeleteBtn onClick={() => handleDelete(item._id)}>X</DeleteBtn>
          </AdminCard>
        ))}
      </ListGrid>
    </Container>
  );
}
