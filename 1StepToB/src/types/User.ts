export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  defaultTodoPriority: 'low' | 'medium' | 'high' | 'urgent';
  weekStartsOn: 'sunday' | 'monday';
}

export interface UserFormData {
  name: string;
  email: string;
  avatar?: string;
  preferences: UserPreferences;
}