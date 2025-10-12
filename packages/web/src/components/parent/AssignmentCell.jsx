import { useState } from 'react';
import { Calendar, Play, Pause, Trash2, Edit, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function AssignmentCell({ 
  task, 
  child, 
  assignment, 
  onCreateAssignment, 
  onEditAssignment, 
  onDeleteAssignment, 
  onToggleAssignment 
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDateRange = (startDate, endDate) => {
    const start = format(new Date(startDate), 'dd MMM', { locale: fr });
    const end = format(new Date(endDate), 'dd MMM', { locale: fr });
    return `${start} - ${end}`;
  };

  const getStatusColor = (isActive) => {
    return isActive ? 'bg-green-100 border-green-300' : 'bg-yellow-100 border-yellow-300';
  };

  const getStatusText = (isActive) => {
    return isActive ? 'Actif' : 'Inactif';
  };

  const getStatusIcon = (isActive) => {
    return isActive ? '🟢' : '🟡';
  };

  const isAssignmentActive = (assignment) => {
    if (!assignment) return false;
    const now = new Date();
    const startDate = new Date(assignment.startDate);
    const endDate = new Date(assignment.endDate);
    return assignment.isActive && now >= startDate && now <= endDate;
  };

  if (!assignment) {
    // Pas d'assignation - case grise avec bouton pour créer
    return (
      <div 
        className="w-full h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors cursor-pointer"
        onClick={onCreateAssignment}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Plus className={`w-6 h-6 text-gray-400 transition-colors ${isHovered ? 'text-gray-600' : ''}`} />
        <span className="text-xs text-gray-500 mt-1">Assigner</span>
      </div>
    );
  }

  const assignmentIsCurrentlyActive = isAssignmentActive(assignment);

  return (
    <div 
      className={`w-full h-24 ${getStatusColor(assignmentIsCurrentlyActive)} border-2 rounded-lg p-2 flex flex-col justify-between hover:shadow-md transition-all`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Informations principales */}
      <div className="flex-1">
        <div className="text-xs font-medium text-gray-700 mb-1">
          {formatDateRange(assignment.startDate, assignment.endDate)}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs">{getStatusIcon(assignmentIsCurrentlyActive)}</span>
            <span className="text-xs font-medium">{getStatusText(assignmentIsCurrentlyActive)}</span>
          </div>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className={`flex items-center justify-end gap-1 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditAssignment(assignment);
          }}
          className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
          title="Modifier l'assignation"
        >
          <Edit className="w-3 h-3 text-gray-600" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleAssignment(assignment.id, assignment.isActive);
          }}
          className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
          title={assignment.isActive ? 'Désactiver' : 'Activer'}
        >
          {assignment.isActive ? (
            <Pause className="w-3 h-3 text-orange-600" />
          ) : (
            <Play className="w-3 h-3 text-green-600" />
          )}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteAssignment(assignment.id);
          }}
          className="p-1 hover:bg-white hover:bg-opacity-50 rounded transition-colors"
          title="Supprimer l'assignation"
        >
          <Trash2 className="w-3 h-3 text-red-600" />
        </button>
      </div>
    </div>
  );
}
