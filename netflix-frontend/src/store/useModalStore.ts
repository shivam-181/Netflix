import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  movie: any | null;
  openModal: (movie: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  movie: null,
  openModal: (movie) => set({ isOpen: true, movie }),
  closeModal: () => set({ isOpen: false, movie: null }),
}));