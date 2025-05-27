import { FamilyMember } from '../types/family';

export const familyMembers: FamilyMember[] = [
  {
    id: '1',
    name: 'John Smith',
    birthDate: '1960-05-15',
    gender: 'male',
    photo: 'https://i.pravatar.cc/150?img=1',
    children: ['3', '4']
  },
  {
    id: '2',
    name: 'Mary Smith',
    birthDate: '1962-08-20',
    gender: 'female',
    photo: 'https://i.pravatar.cc/150?img=2',
    children: ['3', '4']
  },
  {
    id: '3',
    name: 'James Smith',
    birthDate: '1985-03-10',
    gender: 'male',
    photo: 'https://i.pravatar.cc/150?img=3',
    parents: {
      father: '1',
      mother: '2'
    },
    spouse: '5',
    children: ['6']
  },
  {
    id: '4',
    name: 'Sarah Smith',
    birthDate: '1988-11-25',
    gender: 'female',
    photo: 'https://i.pravatar.cc/150?img=4',
    parents: {
      father: '1',
      mother: '2'
    }
  },
  {
    id: '5',
    name: 'Emma Smith',
    birthDate: '1986-07-15',
    gender: 'female',
    photo: 'https://i.pravatar.cc/150?img=5',
    spouse: '3',
    children: ['6']
  },
  {
    id: '6',
    name: 'Michael Smith',
    birthDate: '2010-09-30',
    gender: 'male',
    photo: 'https://i.pravatar.cc/150?img=6',
    parents: {
      father: '3',
      mother: '5'
    }
  }
]; 