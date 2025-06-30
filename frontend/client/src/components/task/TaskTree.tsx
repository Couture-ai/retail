import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  Calendar, 
  Filter, 
  Clock, 
  CheckSquare, 
  List, 
  AlertCircle, 
  Search, 
  MoreVertical,
  Tag,
  Github,
  Folder,
  User
} from "lucide-react";

// Sprint data
const sprints = [
  { id: 'current', name: 'Current Sprint (May 20 - June 3)' },
  { id: 'next', name: 'Next Sprint (June 4 - June 17)' },
  { id: 'backlog', name: 'Backlog' },
  { id: 'sprint-23-4', name: 'Sprint 23.4 (May 6 - May 19)' },
  { id: 'sprint-23-3', name: 'Sprint 23.3 (Apr 22 - May 5)' },
];

// Dummy task data with expanded information
const tasks = [
  {
    id: 'task-1',
    title: 'Implement user authentication flow',
    description: 'Create login, registration, and password reset flows',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-06-15',
    tags: ['Frontend', 'Security'],
    repo: 'user-service',
    folder: 'auth',
    assignee: 'Swift Eagle'
  },
  {
    id: 'task-2',
    title: 'Fix API response caching bug',
    description: 'Debug and fix cache invalidation issues',
    status: 'in-progress',
    priority: 'urgent',
    dueDate: '2023-06-10',
    tags: ['Backend', 'Bug'],
    repo: 'api-gateway',
    folder: 'cache',
    assignee: 'Creative Owl'
  },
  {
    id: 'task-3',
    title: 'Update documentation for v2 API',
    description: 'Create comprehensive documentation for API v2',
    status: 'done',
    priority: 'medium',
    dueDate: '2023-06-05',
    tags: ['Documentation'],
    repo: 'docs',
    folder: 'api/v2',
    assignee: 'Precise Deer'
  },
  {
    id: 'task-4',
    title: 'Optimize database queries',
    description: 'Improve performance of slow-running queries',
    status: 'review',
    priority: 'high',
    dueDate: '2023-06-12',
    tags: ['Backend', 'Performance'],
    repo: 'db-service',
    folder: 'queries',
    assignee: 'Clever Fox'
  },
  {
    id: 'task-5',
    title: 'Design new dashboard layout',
    description: 'Create wireframes and mockups for the dashboard',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-06-20',
    tags: ['Design', 'UI'],
    repo: 'frontend',
    folder: 'dashboard',
    assignee: 'Creative Owl'
  },
  {
    id: 'task-6',
    title: 'Implement real-time notifications',
    description: 'Add WebSocket support for instant notifications',
    status: 'todo',
    priority: 'low',
    dueDate: '2023-06-25',
    tags: ['Frontend', 'Backend'],
    repo: 'notifications-service',
    folder: 'websocket',
    assignee: 'Swift Eagle'
  },
  {
    id: 'task-7',
    title: 'Refactor authentication middleware',
    description: 'Improve code quality and add tests',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2023-06-14',
    tags: ['Backend', 'Security'],
    repo: 'api-gateway',
    folder: 'middleware',
    assignee: 'Precise Deer'
  },
  {
    id: 'task-8',
    title: 'Add dark mode support',
    description: 'Implement theme switching functionality',
    status: 'review',
    priority: 'low',
    dueDate: '2023-06-18',
    tags: ['Frontend', 'UI'],
    repo: 'frontend',
    folder: 'themes',
    assignee: 'Creative Owl'
  },
  {
    id: 'task-9',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment',
    status: 'done',
    priority: 'high',
    dueDate: '2023-06-08',
    tags: ['DevOps'],
    repo: 'ci-config',
    folder: 'pipelines',
    assignee: 'Clever Fox'
  },
  {
    id: 'task-10',
    title: 'Implement file upload feature',
    description: 'Add support for file uploads with progress tracking',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-06-22',
    tags: ['Frontend', 'Backend'],
    repo: 'file-service',
    folder: 'uploads',
    assignee: 'Swift Eagle'
  },
  {
    id: 'task-11',
    title: 'Create user analytics dashboard',
    description: 'Implement charts and metrics for user activity',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-06-16',
    tags: ['Analytics', 'Frontend'],
    repo: 'analytics-service',
    folder: 'dashboard',
    assignee: 'Precise Deer'
  },
  {
    id: 'task-12',
    title: 'Fix mobile layout issues',
    description: 'Resolve responsive design problems on small screens',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2023-06-11',
    tags: ['Frontend', 'Bug'],
    repo: 'frontend',
    folder: 'responsive',
    assignee: 'Creative Owl'
  },
  {
    id: 'task-13',
    title: 'Implement search functionality',
    description: 'Add full-text search across all content',
    status: 'review',
    priority: 'medium',
    dueDate: '2023-06-17',
    tags: ['Backend', 'Search'],
    repo: 'search-service',
    folder: 'indexing',
    assignee: 'Clever Fox'
  },
  {
    id: 'task-14',
    title: 'Add multi-language support',
    description: 'Implement i18n framework for translations',
    status: 'todo',
    priority: 'low',
    dueDate: '2023-06-30',
    tags: ['Frontend', 'I18n'],
    repo: 'frontend',
    folder: 'i18n',
    assignee: 'Swift Eagle'
  },
  {
    id: 'task-15',
    title: 'Optimize image loading',
    description: 'Implement lazy loading and image compression',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2023-06-19',
    tags: ['Frontend', 'Performance'],
    repo: 'frontend',
    folder: 'media',
    assignee: 'Creative Owl'
  },
  {
    id: 'task-16',
    title: 'Refactor data access layer',
    description: 'Improve database connection handling',
    status: 'todo',
    priority: 'high',
    dueDate: '2023-06-24',
    tags: ['Backend', 'Refactoring'],
    repo: 'db-service',
    folder: 'connections',
    assignee: 'Precise Deer'
  },
  {
    id: 'task-17',
    title: 'Implement social login',
    description: 'Add Google, Facebook, and Twitter login options',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-06-26',
    tags: ['Auth', 'Frontend'],
    repo: 'user-service',
    folder: 'social-auth',
    assignee: 'Swift Eagle'
  },
  {
    id: 'task-18',
    title: 'Update API documentation',
    description: 'Update Swagger docs for new endpoints',
    status: 'in-progress',
    priority: 'low',
    dueDate: '2023-06-13',
    tags: ['Documentation', 'API'],
    repo: 'docs',
    folder: 'swagger',
    assignee: 'Clever Fox'
  },
  {
    id: 'task-19',
    title: 'Security audit and fixes',
    description: 'Address vulnerabilities found in security scan',
    status: 'todo',
    priority: 'urgent',
    dueDate: '2023-06-09',
    tags: ['Security', 'Bug'],
    repo: 'security',
    folder: 'audits',
    assignee: 'Precise Deer'
  },
  {
    id: 'task-20',
    title: 'Implement user onboarding flow',
    description: 'Create guided tour for new users',
    status: 'review',
    priority: 'medium',
    dueDate: '2023-06-21',
    tags: ['Frontend', 'UX'],
    repo: 'frontend',
    folder: 'onboarding',
    assignee: 'Creative Owl'
  }
];

// Advanced filter options
const filterOptions = [
  { id: 'all', name: 'All Tasks', icon: <List size={14} /> },
  { id: 'active', name: 'Active', icon: <CheckSquare size={14} /> },
  { id: 'priority', name: 'Priority', icon: <AlertCircle size={14} /> },
  { id: 'upcoming', name: 'Upcoming', icon: <Clock size={14} /> }
];

interface TaskTreeProps {
  onTaskOpen?: (taskId: string) => void;
}

const TaskTree: React.FC<TaskTreeProps> = ({ onTaskOpen }) => {
  const [selectedSprint, setSelectedSprint] = useState(sprints[0].id);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Function to open the timeline view in a tab
  const handleOpenTimeline = () => {
    // The timeline-view is a special ID that will be recognized
    // to load the Timeline component in the content panel
    if (onTaskOpen) {
      onTaskOpen('timeline-view');
    }
  };
  
  // Filter tasks based on selectedFilter and search
  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // Apply filter selection
    switch (selectedFilter) {
      case 'active':
        filtered = filtered.filter(t => t.status === 'todo' || t.status === 'in-progress');
        break;
      case 'priority':
        filtered = filtered.filter(t => t.priority === 'high' || t.priority === 'urgent');
        break;
      case 'upcoming':
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        filtered = filtered.filter(t => {
          if (!t.dueDate) return false;
          const dueDate = new Date(t.dueDate);
          return dueDate <= nextWeek && dueDate >= new Date();
        });
        break;
    }
    
    // Apply search filter
    if (searchValue.trim() !== '') {
      const searchLower = searchValue.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.assignee.toLowerCase().includes(searchLower) ||
        task.repo.toLowerCase().includes(searchLower) ||
        task.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    return filtered;
  };

  const handleTaskClick = (task: any) => {
    if (onTaskOpen) {
      onTaskOpen(task.id);
    }
  };

  const handleTaskDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ id: taskId, type: 'task' }));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Function to determine color based on priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-500';
      case 'medium': return 'bg-green-500';
      case 'high': return 'bg-yellow-500';
      case 'urgent': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Function to determine color based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-blue-500';
      case 'in-progress': return 'bg-purple-500';
      case 'review': return 'bg-yellow-500';
      case 'done': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Function to format dates
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col h-full bg-[hsl(var(--dark-8))] text-white">
      {/* Header with title */}
      <div className="bg-[hsl(var(--dark-9))] border-b border-[hsl(var(--dark-6))] py-3 px-4">
        <h2 className="text-lg font-semibold text-white">Task Management</h2>
      </div>
      
      {/* Sprint Selector */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <select 
            className="w-full bg-[hsl(var(--dark-7))] border border-[hsl(var(--dark-6))] rounded-md py-1.5 px-3 text-sm text-white appearance-none"
            value={selectedSprint}
            onChange={(e) => setSelectedSprint(e.target.value)}
          >
            {sprints.map(sprint => (
              <option key={sprint.id} value={sprint.id}>{sprint.name}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <ChevronDown size={16} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Search bar */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full bg-[hsl(var(--dark-7))] border border-[hsl(var(--dark-6))] rounded-md py-1.5 pl-8 pr-3 text-sm"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
            <Search size={14} className="text-gray-400" />
          </div>
        </div>
      </div>
      
      {/* Quick actions bar */}
      <div className="flex items-center px-4 py-2 border-b border-[hsl(var(--dark-6))]">
        {/* Timeline button (replacing Calendar button) */}
        <button 
          className="py-1.5 px-3 rounded-md text-sm font-medium mr-2 bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))/90] text-white transition-colors"
          onClick={handleOpenTimeline}
          title="View agent timeline"
        >
          Timeline
        </button>
        
        {/* Filter dropdown */}
        <div className="relative">
          <button 
            className={`p-1.5 rounded-md mr-2 flex items-center ${isFilterMenuOpen ? 'bg-[hsl(var(--dark-6))]' : 'hover:bg-[hsl(var(--dark-7))]'}`}
            onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
            title="Filter tasks"
          >
            <Filter size={16} className="text-gray-300" />
          </button>
          
          {isFilterMenuOpen && (
            <div className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-[hsl(var(--dark-7))] border border-[hsl(var(--dark-6))] z-10">
              <div className="py-1">
                {filterOptions.map(filter => (
                  <div 
                    key={filter.id}
                    className={`flex items-center px-3 py-2 text-sm cursor-pointer ${selectedFilter === filter.id ? 'bg-[hsl(var(--dark-6))]' : 'hover:bg-[hsl(var(--dark-6))]'}`}
                    onClick={() => {
                      setSelectedFilter(filter.id);
                      setIsFilterMenuOpen(false);
                    }}
                  >
                    <span className="mr-2">{filter.icon}</span>
                    <span>{filter.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Advanced options */}
        <button 
          className="p-1.5 rounded-md hover:bg-[hsl(var(--dark-7))] ml-auto"
          title="More options"
        >
          <MoreVertical size={16} className="text-gray-300" />
        </button>
      </div>
      
      {/* Tasks list */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {getFilteredTasks().length > 0 ? (
          <div className="space-y-2">
            {getFilteredTasks().map(task => (
              <div 
                key={task.id}
                className={`rounded-md p-3 cursor-pointer transition-all
                  ${task.status === 'in-progress' ? 
                    'bg-[hsl(var(--dark-7))] border border-[hsl(var(--primary))] in-progress-task' : 
                    'bg-[hsl(var(--dark-7))] border border-transparent hover:border-[hsl(var(--dark-5))]'
                  }`}
                onClick={() => handleTaskClick(task)}
                draggable
                onDragStart={(e) => handleTaskDragStart(e, task.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium truncate flex-1 pr-2">{task.title}</h3>
                  <div className={`h-2 w-2 rounded-full flex-shrink-0 ${getStatusColor(task.status)}`}></div>
                </div>
                
                <div className="flex items-center text-xs text-gray-400 mb-1.5">
                  <Github size={12} className="mr-1" />
                  <span className="mr-3">{task.repo}</span>
                  <Folder size={12} className="mr-1" />
                  <span>{task.folder}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs">
                    <div className={`w-1.5 h-1.5 rounded-full mr-1 ${getPriorityColor(task.priority)}`}></div>
                    <span className="mr-3 capitalize">{task.priority}</span>
                    
                    {task.dueDate && (
                      <span className="text-gray-400">{formatDate(task.dueDate)}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center text-xs">
                    <User size={12} className="mr-1 text-gray-400" />
                    <span className="text-gray-300">{task.assignee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-4">
            No tasks match your filters
          </div>
        )}
      </div>
      
      {/* CSS for the animated border effect */}
      <style jsx>{`
        .in-progress-task {
          position: relative;
          background-size: 200% 100%;
          animation: pulse 2s infinite;
          border-image: linear-gradient(45deg, var(--primary), var(--primary-light), var(--primary)) 1;
          border-image-slice: 1;
        }
        @keyframes pulse {
          0% { border-color: hsl(var(--primary)); }
          50% { border-color: hsl(var(--primary) / 0.5); }
          100% { border-color: hsl(var(--primary)); }
        }
      `}</style>
    </div>
  );
};

export default TaskTree; 