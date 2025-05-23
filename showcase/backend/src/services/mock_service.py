from typing import List, Optional, Dict
from src.models.data import Project, ProjectCreate, Task, TaskCreate
from src.interfaces.service import Service
from datetime import date as Date
import json

class MockService(Service):
    """
    Mock implementation of the Service interface.
    Uses in-memory data structures for testing and development.
    """
    
    def __init__(self):
        self.datapath: str = "mock/data.json"
        self.projects: Dict[int, Project] = self.extract_raw_data()
        self.next_project_id: int = max([project.id for project in self.projects.values()]) + 1 if self.projects else 1

        self.next_task_id: int = 1
        for project in self.projects.values():
            if project.tasks:
                self.next_task_id = max([task.id for task in project.tasks]) + 1
            else:
                self.next_task_id = 1

    # I/O functions

    def extract_raw_data(self) -> Dict[int, Project]:
        # data.json is an object, on which the keys are the ids of the projects and the values are the project objects which dont contain an id field
        with open(self.datapath, "r") as file:
            data = json.load(file)
        projects = {}
        for project_id, project_data in data.items():
            project_data["id"] = int(project_id)  # Add the ID to the project data
            project = Project(**project_data)
            projects[project.id] = project
        return projects 
    
    def save_data(self) -> None:
        # Save the projects to the JSON file
        with open(self.datapath, "w") as file:
            # Use model_dump with by_alias=True, exclude_unset=False to ensure all fields are included
            data = {}
            for project in self.projects.values():
                # Convert project to dict, handling date serialization with .isoformat()
                project_dict = project.model_dump(mode='json')
                data[str(project.id)] = project_dict
            
            json.dump(data, file, indent=4)

    # I/O end ~ ~ ~ 
    
    def get_projects(self) -> List[Project]:
        return list(self.projects.values())
    
    def get_project(self, project_id: int) -> Optional[Project]:
        return self.projects.get(project_id)
    
    def create_project(self, project_data: ProjectCreate) -> Project:
        # Convert ProjectCreate to Project
        project = Project(
            id=self.next_project_id,
            name=project_data.name,
            description=project_data.description,
            created_at=Date.today(),
            tasks=project_data.tasks,
        )
        self.next_project_id += 1
        self.projects[project.id] = project
        return project
    
    def update_project(self, project_id: int, project_data: Project) -> Optional[Project]:
        if project_id not in self.projects:
            return None
        project_data.id = project_id
        self.projects[project_id] = project_data
        return project_data
    
    def delete_project(self, project_id: int) -> bool:
        if project_id not in self.projects:
            return False
        del self.projects[project_id]
        return True
    
    def get_tasks(self, project_id: int) -> List[Task]:
        if project_id not in self.projects:
            return []
        return self.projects[project_id].tasks
    
    def get_task(self, project_id: int, task_id: int) -> Optional[Task]:
        if project_id not in self.projects:
            return None
        for task in self.projects[project_id].tasks:
            if task.id == task_id:
                return task
        return None
    
    def create_task(self, project_id: int, task_data: TaskCreate) -> Task:
        if project_id not in self.projects:
            return None
        task = Task(
            id=self.next_task_id,
            title=task_data.title,
            description=task_data.description,
            created_at=Date.today(),
            due_at=task_data.due_at,
            completed=task_data.completed,
            tags=task_data.tags,
            type=task_data.type
        )
        self.next_task_id += 1
        self.projects[project_id].tasks.append(task)
        return task
    
    def update_task(self, project_id: int, task_id: int, task_data: Task) -> Optional[Task]:
        if project_id not in self.projects:
            return None
        for i, task in enumerate(self.projects[project_id].tasks):
            if task.id == task_id:
                task_data.id = task_id
                self.projects[project_id].tasks[i] = task_data
                return task_data
        return None
    
    def delete_task(self, project_id: int, task_id: int) -> bool:
        if project_id not in self.projects:
            return False
        for i, task in enumerate(self.projects[project_id].tasks):
            if task.id == task_id:
                self.projects[project_id].tasks.pop(i)
                return True
        return False