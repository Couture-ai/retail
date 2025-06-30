import React, { useState } from 'react';
import { TreeNode } from '@/types';
import { 
  Calendar, 
  Clock, 
  Tag, 
  CheckSquare, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  Flag
} from 'lucide-react';

interface TaskTabProps {
  node: TreeNode;
  panelId: string;
}

const TaskTab: React.FC<TaskTabProps> = ({ node, panelId }) => {
  // Parse task information from the node
  const task = node.content ? JSON.parse(node.content) : {
    id: node.id,
    title: node.name || 'Untitled Task',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: null,
    tags: [],
    subtasks: [],
    assignee: null,
  };

  const [expandedSections, setExpandedSections] = useState({
    subtasks: true,
    description: true,
    schedule: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Status colors
  const statusColors = {
    todo: 'bg-blue-500',
    'in-progress': 'bg-yellow-500',
    review: 'bg-purple-500',
    done: 'bg-green-500',
    blocked: 'bg-red-500'
  };

  // Priority labels and colors
  const priorityLabels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent'
  };
  
  const priorityColors = {
    low: 'text-blue-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    urgent: 'text-red-400'
  };

  // Format date for display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full overflow-auto bg-[hsl(var(--dark-9))] p-4 text-white">
      {/* Task Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{task.title}</h1>
          <div className={`px-2 py-1 rounded text-sm ${statusColors[task.status] || 'bg-gray-500'}`}>
            {task.status === 'todo' ? 'To Do' : 
             task.status === 'in-progress' ? 'In Progress' : 
             task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </div>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2">
          {task.dueDate && (
            <div className="flex items-center text-sm text-gray-300">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <Flag size={14} className={`mr-1 ${priorityColors[task.priority] || 'text-gray-400'}`} />
            <span className={priorityColors[task.priority] || 'text-gray-400'}>
              {priorityLabels[task.priority] || 'Medium'} Priority
            </span>
          </div>
          
          {task.assignee && (
            <div className="flex items-center text-sm text-gray-300">
              <span className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center text-xs mr-1">
                {task.assignee.charAt(0).toUpperCase()}
              </span>
              <span>{task.assignee}</span>
            </div>
          )}
        </div>
        
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {task.tags.map((tag: string, index: number) => (
              <div key={index} className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">
                {tag}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Description Section */}
      <div className="mb-4">
        <div 
          className="flex items-center cursor-pointer mb-2"
          onClick={() => toggleSection('description')}
        >
          {expandedSections.description ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <h2 className="text-md font-medium">Description</h2>
        </div>
        
        {expandedSections.description && (
          <div className="pl-6 text-gray-300 whitespace-pre-line">
            {task.description || 'No description provided.'}
          </div>
        )}
      </div>
      
      {/* Subtasks Section */}
      <div className="mb-4">
        <div 
          className="flex items-center cursor-pointer mb-2"
          onClick={() => toggleSection('subtasks')}
        >
          {expandedSections.subtasks ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <h2 className="text-md font-medium">Subtasks</h2>
          {task.subtasks && (
            <span className="text-xs text-gray-400 ml-2">
              ({task.subtasks.filter((st: any) => st.completed).length}/{task.subtasks.length})
            </span>
          )}
        </div>
        
        {expandedSections.subtasks && (
          <div className="pl-6">
            {task.subtasks && task.subtasks.length > 0 ? (
              <ul className="space-y-2">
                {task.subtasks.map((subtask: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <div className={`w-4 h-4 mt-1 mr-2 rounded-sm border flex items-center justify-center
                                    ${subtask.completed ? 'bg-green-500 border-green-500' : 'border-gray-500'}`}>
                      {subtask.completed && <CheckSquare size={12} className="text-white" />}
                    </div>
                    <span className={subtask.completed ? 'line-through text-gray-500' : ''}>{subtask.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No subtasks</div>
            )}
          </div>
        )}
      </div>
      
      {/* Schedule Section */}
      <div className="mb-4">
        <div 
          className="flex items-center cursor-pointer mb-2"
          onClick={() => toggleSection('schedule')}
        >
          {expandedSections.schedule ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <h2 className="text-md font-medium">Schedule</h2>
        </div>
        
        {expandedSections.schedule && (
          <div className="pl-6">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center text-sm">
                <Calendar size={14} className="mr-2 text-gray-400" />
                <span className="w-24 text-gray-400">Due Date:</span>
                <span>{task.dueDate ? formatDate(task.dueDate) : 'Not set'}</span>
              </div>
              
              {task.createdDate && (
                <div className="flex items-center text-sm">
                  <Clock size={14} className="mr-2 text-gray-400" />
                  <span className="w-24 text-gray-400">Created:</span>
                  <span>{formatDate(task.createdDate)}</span>
                </div>
              )}
              
              {task.updatedDate && (
                <div className="flex items-center text-sm">
                  <Clock size={14} className="mr-2 text-gray-400" />
                  <span className="w-24 text-gray-400">Updated:</span>
                  <span>{formatDate(task.updatedDate)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskTab; 