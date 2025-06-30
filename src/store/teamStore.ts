import { create } from 'zustand';
import type { UserInfo } from '../types/User';

interface TeamStoreState {
  teamMembers: UserInfo[];
  setTeamMembers: (members: UserInfo[]) => void;
}

export const useTeamStore = create<TeamStoreState>((set) => ({
  teamMembers: [],
  setTeamMembers: (teamMembers) => set({ teamMembers }),
})); 