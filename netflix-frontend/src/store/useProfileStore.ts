import { create } from 'zustand';
import api from '@/lib/axios';

interface WatchHistoryItem {
  contentId: string;
  progress: number;
  duration: number;
  lastWatched: Date;
  title?: string;
  thumbnailUrl?: string;
}

interface Profile {
  _id: string;
  name: string;
  avatarUrl: string;
  isKid: boolean;
  watchHistory: WatchHistoryItem[];
}

interface ProfileState {
  profiles: Profile[];
  currentProfile: Profile | null;
  isLoading: boolean;
  myList: string[]; // Array of Content IDs
  
  fetchProfiles: () => Promise<void>;
  selectProfile: (profile: Profile) => void;
  addProfile: (name: string, isKid?: boolean) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;

  addToList: (contentId: string) => void;
  removeFromList: (contentId: string) => void;
  isInList: (contentId: string) => boolean;

  updateProgress: (data: { contentId: string; progress: number; duration: number; title?: string; thumbnailUrl?: string }) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  currentProfile: null,
  isLoading: false,
  myList: [],

  fetchProfiles: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/profiles');
      set({ profiles: res.data, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch profiles', error);
      set({ isLoading: false });
    }
  },

  selectProfile: async (profile) => {
    set({ currentProfile: profile });
    localStorage.setItem('currentProfileId', profile._id);
    
    // Fetch the real list from backend
    try {
       const res = await api.get(`/profiles/${profile._id}/list`);
       const ids = res.data.map((item: any) => item._id);
       set({ myList: ids });
    } catch (err) {
       console.error("Failed to load list", err);
       set({ myList: [] });
    }
  },

  addProfile: async (name, isKid = false) => {
    try {
      await api.post('/profiles', { name, isKid });
      // Refresh the list after adding
      await get().fetchProfiles(); 
    } catch (error) {
      console.error('Failed to add profile', error);
      throw error;
    }
  },

  deleteProfile: async (id) => {
    try {
      await api.delete(`/profiles/${id}`);
      await get().fetchProfiles();
    } catch (error) {
      console.error('Failed to delete profile', error);
      throw error;
    }
  },

  addToList: async (contentId) => {
    const { currentProfile } = get();
    if (!currentProfile) return;
    
    // Optimistic update
    const currentList = get().myList;
    if (!currentList.includes(contentId)) {
      set({ myList: [...currentList, contentId] });
      
      try {
        await api.post(`/profiles/${currentProfile._id}/list`, { contentId });
      } catch (err) {
        console.error("Failed to add to list", err);
        // Revert on failure
        set({ myList: currentList });
      }
    }
  },

  removeFromList: async (contentId) => {
    const { currentProfile } = get();
    if (!currentProfile) return;

    // Optimistic update
    const currentList = get().myList;
    set({ myList: currentList.filter(id => id !== contentId) });

    try {
      await api.delete(`/profiles/${currentProfile._id}/list/${contentId}`);
    } catch (err) {
      console.error("Failed to remove from list", err);
      set({ myList: currentList });
    }
  },

  isInList: (contentId) => get().myList.includes(contentId),

  updateProgress: async (data) => {
    const { currentProfile } = get();
    if (!currentProfile) return;

    // Optimistic Update (Optional, but complex for history array)
    
    try {
       await api.post(`/profiles/${currentProfile._id}/history`, data);
       // Silent update, or maybe refresh profile if needed
    } catch (e) {
       console.error("Failed to update history", e);
    }
  }
}));