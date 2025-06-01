
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserProfile {
  brandName: string;
  description: string;
  phoneNumber: string;
  website: string;
  industry: string;
  companySize: string;
  createdAt: Date;
  updatedAt: Date;
}

export const saveUserProfile = async (userId: string, profileData: Omit<UserProfile, 'createdAt' | 'updatedAt'>) => {
  const userDocRef = doc(db, 'users', userId);
  const now = new Date();
  
  const userData: UserProfile = {
    ...profileData,
    createdAt: now,
    updatedAt: now
  };

  await setDoc(userDocRef, userData);
  return userData;
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userDocRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  
  return null;
};
