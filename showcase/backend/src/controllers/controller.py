from src.services.db_service import DBService
from src.services.mock_service import MockService
from src.interfaces.service import Service
from src.models.data import Project, ProjectCreate, Task, TaskCreate
from typing import List, Optional


class Controller:

    def __init__(self):
        self.use_mock = True

        # services init
        self.mock_service = MockService()
        self.db_service = DBService()
        
        self.service: Service = self.mock_service if self.use_mock else self.db_service

    # Project operations
    def get_projects(self) -> List[Project]:
        """
        Get all projects.
        """
        return self.service.get_projects()
    
    def get_project(self, project_id: int) -> Optional[Project]:
        """
        Get a project by ID.
        """
        return self.service.get_project(project_id)
    
    def create_project(self, project: ProjectCreate) -> Project:
        """
        Create a new project.
        """
        return self.service.create_project(project)
    
    def update_project(self, project_id: int, project_data: Project) -> Optional[Project]:
        """
        Update an existing project.
        """
        return self.service.update_project(project_id, project_data)
    
    def delete_project(self, project_id: int) -> bool:
        """
        Delete a project.
        """
        return self.service.delete_project(project_id)
    
    # Task operations
    def get_tasks(self, project_id: int) -> List[Task]:
        """
        Get all tasks for a project.
        """
        return self.service.get_tasks(project_id)
    
    def get_task(self, project_id: int, task_id: int) -> Optional[Task]:
        """
        Get a specific task from a project.
        """
        return self.service.get_task(project_id, task_id)
    
    def create_task(self, project_id: int, task: Task) -> Task:
        """
        Create a new task in a project.
        """
        return self.service.create_task(project_id, task)
    
    def update_task(self, project_id: int, task_id: int, task_data: Task) -> Optional[Task]:
        """
        Update an existing task.
        """
        return self.service.update_task(project_id, task_id, task_data)
    
    def delete_task(self, project_id: int, task_id: int) -> bool:
        """
        Delete a task from a project.
        """
        return self.service.delete_task(project_id, task_id)