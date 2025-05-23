from pydantic import BaseModel
from typing import List, Optional
from enum import Enum
from datetime import date as Date

class TaskType(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"

# Base models (shared fields)
class TaskBase(BaseModel):
    title: str
    description: str
    completed: bool = False
    due_at: Optional[Date] = None
    type: TaskType = TaskType.TODO
    tags: List[str] = []

class ProjectBase(BaseModel):
    name: str
    description: str

# Create models (for POST requests - without ID)
class TaskCreate(TaskBase):
    pass

class ProjectCreate(ProjectBase):
    tasks: List[TaskCreate] = []

# Complete models (with ID - for responses and database)
class Task(TaskBase):
    id: int
    created_at: Optional[Date] = None

class Project(ProjectBase):
    id: int
    tasks: List[Task] = []
    created_at: Optional[Date] = None