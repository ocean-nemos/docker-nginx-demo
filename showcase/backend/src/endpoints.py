from fastapi import APIRouter, HTTPException, Response, status, Depends
from src.controllers.controller import Controller
from src.models.data import Project, ProjectCreate, Task, TaskCreate
from typing import List

router = APIRouter()
controller = Controller()

# Project endpoints
@router.get("/projects", response_model=List[Project], tags=["Projects"])
async def get_projects():
    """
    Get all projects
    """
    return controller.get_projects()

@router.get("/projects/{project_id}", response_model=Project, tags=["Projects"])
async def get_project(project_id: int):
    """
    Get a specific project by ID
    """
    project = controller.get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return project

@router.post("/projects", response_model=Project, status_code=status.HTTP_201_CREATED, tags=["Projects"])
async def create_project(project: ProjectCreate):
    """
    Create a new project
    """
    return controller.create_project(project)

@router.put("/projects/{project_id}", response_model=Project, tags=["Projects"])
async def update_project(project_id: int, project: Project):
    """
    Update an existing project
    """
    updated_project = controller.update_project(project_id, project)
    if updated_project is None:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return updated_project

@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Projects"])
async def delete_project(project_id: int):
    """
    Delete a project
    """
    success = controller.delete_project(project_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# Task endpoints
@router.get("/projects/{project_id}/tasks", response_model=List[Task], tags=["Tasks"])
async def get_tasks(project_id: int):
    """
    Get all tasks for a specific project
    """
    project = controller.get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return controller.get_tasks(project_id)

@router.get("/projects/{project_id}/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def get_task(project_id: int, task_id: int):
    """
    Get a specific task from a project
    """
    task = controller.get_task(project_id, task_id)
    if task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found in project {project_id}")
    return task

@router.post("/projects/{project_id}/tasks", response_model=Task, status_code=status.HTTP_201_CREATED, tags=["Tasks"])
async def create_task(project_id: int, task: TaskCreate):
    """
    Create a new task in a project
    """
    project = controller.get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail=f"Project {project_id} not found")
    return controller.create_task(project_id, task)

@router.put("/projects/{project_id}/tasks/{task_id}", response_model=Task, tags=["Tasks"])
async def update_task(project_id: int, task_id: int, task: Task):
    """
    Update an existing task
    """
    updated_task = controller.update_task(project_id, task_id, task)
    if updated_task is None:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found in project {project_id}")
    return updated_task

@router.delete("/projects/{project_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["Tasks"])
async def delete_task(project_id: int, task_id: int):
    """
    Delete a task from a project
    """
    success = controller.delete_task(project_id, task_id)
    if not success:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found in project {project_id}")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

# I/O functions for mock data

@router.post("/admin/save", status_code=status.HTTP_200_OK, tags=["Admin"])
async def save_mock_data():
    """
    Save current data to the mock data file.
    This endpoint only works when using the mock service.
    """
    if not controller.use_mock:
        raise HTTPException(status_code=400, detail="This operation is only available when using mock service")
    
    controller.mock_service.save_data()
    return {"message": "Data saved successfully to mock/data.json"}