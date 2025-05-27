import { FamilyMember } from '../types/family';
import Image from 'next/image';
import { familyMembers } from '../lib/familyData';

interface FamilyMemberProps {
  member: FamilyMember;
  onClick?: () => void;
  isCurrentUser?: boolean;
}

const FamilyMemberCard = ({ member, onClick, isCurrentUser = false }: FamilyMemberProps) => {
  const getRelation = (member: FamilyMember) => {
    const currentUser = familyMembers.find(m => m.id === '3'); // Assuming user is James Smith (id: 3)
    if (!currentUser) return '';

    if (member.id === currentUser.id) return 'You';
    if (member.id === currentUser.parents?.father) return 'Father';
    if (member.id === currentUser.parents?.mother) return 'Mother';
    if (member.id === currentUser.spouse) return 'Spouse';
    if (currentUser.children?.includes(member.id)) return 'Child';
    if (member.parents?.father === currentUser.parents?.father && 
        member.parents?.mother === currentUser.parents?.mother) return 'Sibling';
    return 'Relative';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-4 w-48 cursor-pointer hover:shadow-lg transition-shadow ${
        isCurrentUser ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative w-32 h-32 mx-auto mb-3">
        <Image
          src={member.photo || '/default-avatar.png'}
          alt={member.name}
          fill
          className="rounded-full object-cover"
        />
      </div>
      <h3 className="text-lg font-semibold text-center">{member.name}</h3>
      <p className="text-sm text-gray-600 text-center">
        {formatDate(member.birthDate)}
      </p>
      <div className="flex flex-col items-center gap-1 mt-2">
        <span className={`px-2 py-1 rounded text-xs ${
          member.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
        }`}>
          {member.gender}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {getRelation(member)}
        </span>
      </div>
    </div>
  );
};

export default FamilyMemberCard; 