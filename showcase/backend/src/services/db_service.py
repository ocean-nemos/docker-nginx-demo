from typing import List, Optional
from src.models.data import Project, ProjectCreate, Task, TaskCreate
from src.interfaces.service import Service

class DBService(Service):
    """
    Database implementation of the Service interface.
    Handles CRUD operations using a database connection.
    """
    
    def __init__(self):
        pass
    
    def get_projects(self) -> List[Project]:
        # Database implementation to fetch all projects
        pass
    
    def get_project(self, project_id: int) -> Optional[Project]:
        # Database implementation to fetch a specific project
        pass
    
    def create_project(self, project: ProjectCreate) -> Project:
        # Database implementation to create a project
        pass
    
    def update_project(self, project_id: int, project_data: Project) -> Optional[Project]:
        # Database implementation to update a project
        pass
    
    def delete_project(self, project_id: int) -> bool:
        # Database implementation to delete a project
        pass
    
    def get_tasks(self, project_id: int) -> List[Task]:
        # Database implementation to fetch all tasks for a project
        pass
    
    def get_task(self, project_id: int, task_id: int) -> Optional[Task]:
        # Database implementation to fetch a specific task
        pass
    
    def create_task(self, project_id: int, task: TaskCreate) -> Task:
        # Database implementation to create a task
        pass
    
    def update_task(self, project_id: int, task_id: int, task_data: Task) -> Optional[Task]:
        # Database implementation to update a task
        pass
    
    def delete_task(self, project_id: int, task_id: int) -> bool:
        # Database implementation to delete a task
        pass