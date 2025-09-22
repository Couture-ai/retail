import React, { createContext, useContext, useState, useEffect } from 'react';
import { ForecastRepository } from '@/repository/forecast_repository';

interface ProjectContextType {
  selectedProject: string;
  setSelectedProject: (project: string) => void;
  projectOptions: string[];
  projectToSlug: (project: string) => string;
  slugToProject: (slug: string) => string;
  forecastRepository: ForecastRepository;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: React.ReactNode;
  initialSlug?: string;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children, initialSlug }) => {
  const projectOptions = ['Reliance Digital', 'Reliance Jewels', 'Fashion & Lifestyle'];
  
  // Map slug to project name
  const slugToProject = (slug: string) => {
    switch (slug) {
      case 'reliance-digital':
        return 'Reliance Digital';
      case 'reliance-jewels':
        return 'Reliance Jewels';
      case 'fashion-and-lifestyle':
        return 'Fashion & Lifestyle';
      default:
        return 'Reliance Digital';
    }
  };

  // Map project name to slug
  const projectToSlug = (project: string) => {
    switch (project) {
      case 'Reliance Digital':
        return 'reliance-digital';
      case 'Reliance Jewels':
        return 'reliance-jewels';
      case 'Fashion & Lifestyle':
        return 'fashion-and-lifestyle';
      default:
        return 'reliance-digital';
    }
  };
  
  const [selectedProject, setSelectedProject] = useState(
    initialSlug ? slugToProject(initialSlug) : projectOptions[0]
  );

  // Initialize ForecastRepository
  const [forecastRepository, setForecastRepository] = useState(() => 
    new ForecastRepository(
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
      selectedProject
    )
  );

  // Update ForecastRepository when project changes
  useEffect(() => {
    const newRepo = new ForecastRepository(
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
      selectedProject
    );
    setForecastRepository(newRepo);
  }, [selectedProject]);

  const value: ProjectContextType = {
    selectedProject,
    setSelectedProject,
    projectOptions,
    projectToSlug,
    slugToProject,
    forecastRepository,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 