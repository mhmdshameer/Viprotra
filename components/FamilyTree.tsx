import { useState } from 'react';
import { familyMembers } from '../lib/familyData';
import { FamilyMember } from '../types/family';
import FamilyMemberCard from './FamilyMemberCard';

const FamilyTree = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const currentUserId = '3'; // James Smith is the current user

  const getMemberById = (id: string) => {
    return familyMembers.find(member => member.id === id);
  };

  const renderParents = (member: FamilyMember) => {
    const father = member.parents?.father ? getMemberById(member.parents.father) : null;
    const mother = member.parents?.mother ? getMemberById(member.parents.mother) : null;

    if (!father && !mother) return null;

    return (
      <div className="flex items-center gap-4 mb-4">
        {father && (
          <FamilyMemberCard 
            member={father} 
            onClick={() => setSelectedMember(father)}
            isCurrentUser={false}
          />
        )}
        {father && mother && <div className="w-8 h-0.5 bg-gray-300" />}
        {mother && (
          <FamilyMemberCard 
            member={mother} 
            onClick={() => setSelectedMember(mother)}
            isCurrentUser={false}
          />
        )}
      </div>
    );
  };

  const renderFamilyGroup = (member: FamilyMember) => {
    const spouse = member.spouse ? getMemberById(member.spouse) : null;
    const children = member.children?.map(childId => getMemberById(childId)).filter(Boolean) || [];

    return (
      <div key={member.id} className="flex flex-col items-center">
        {renderParents(member)}
        <div className="flex items-center gap-4 mb-4">
          <FamilyMemberCard 
            member={member} 
            onClick={() => setSelectedMember(member)}
            isCurrentUser={member.id === currentUserId}
          />
          {spouse && (
            <>
              <div className="w-8 h-0.5 bg-gray-300" />
              <FamilyMemberCard 
                member={spouse} 
                onClick={() => setSelectedMember(spouse)}
                isCurrentUser={false}
              />
            </>
          )}
        </div>
        {children.length > 0 && (
          <div className="flex gap-8 mt-4">
            {children.map(child => (
              <div key={child?.id} className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-gray-300" />
                <FamilyMemberCard 
                  member={child!} 
                  onClick={() => setSelectedMember(child!)}
                  isCurrentUser={child?.id === currentUserId}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Find root members (those without parents)
  const rootMembers = familyMembers.filter(member => !member.parents);

  return (
    <div className="p-8">
      <div className="flex flex-col items-center gap-8">
        {rootMembers.map(member => renderFamilyGroup(member))}
      </div>
      
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md">
            <h2 className="text-2xl font-bold mb-4">{selectedMember.name}</h2>
            <p>Birth Date: {new Date(selectedMember.birthDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}</p>
            <p>Gender: {selectedMember.gender}</p>
            {selectedMember.spouse && (
              <p>Spouse: {getMemberById(selectedMember.spouse)?.name}</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setSelectedMember(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTree; 