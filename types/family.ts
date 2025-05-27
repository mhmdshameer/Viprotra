export interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  gender: 'male' | 'female';
  photo?: string;
  parents?: {
    father?: string;
    mother?: string;
  };
  spouse?: string;
  children?: string[];
} 