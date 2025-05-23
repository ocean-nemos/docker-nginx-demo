from abc import ABC, abstractmethod
from typing import List, Optional
from src.models.data import Project, ProjectCreate, Task, TaskCreate

class Service(ABC):
    """
    Abstract base class defining the interface for project and task management services.
    This interface should be implemented by concrete service classes like DBService and MockService.
    """
    
    # Project operations
    @abstractmethod
    def get_projects(self) -> List[Project]:
        """Get all projects"""
        pass
    
    @abstractmethod
    def get_project(self, project_id: int) -> Optional[Project]:
        """Get a project by ID"""
        pass
    
    @abstractmethod
    def create_project(self, project: ProjectCreate) -> Project:
        """Create a new project"""
        pass
    
    @abstractmethod
    def update_project(self, project_id: int, project_data: Project) -> Optional[Project]:
        """Update an existing project"""
        pass
    
    @abstractmethod
    def delete_project(self, project_id: int) -> bool:
        """Delete a project"""
        pass
    
    # Task operations
    @abstractmethod
    def get_tasks(self, project_id: int) -> List[Task]:
        """Get all tasks for a project"""
        pass
    
    @abstractmethod
    def get_task(self, project_id: int, task_id: int) -> Optional[Task]:
        """Get a specific task from a project"""
        pass
    
    @abstractmethod
    def create_task(self, project_id: int, task: TaskCreate) -> Task:
        """Create a new task in a project"""
        pass
    
    @abstractmethod
    def update_task(self, project_id: int, task_id: int, task_data: Task) -> Optional[Task]:
        """Update an existing task"""
        pass
    
    @abstractmethod
    def delete_task(self, project_id: int, task_id: int) -> bool:
        """Delete a task from a project"""
        pass