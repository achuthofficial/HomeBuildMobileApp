"""Example resource showing the Firebase-auth + Supabase-storage combination.

Expects a ``projects`` table in Supabase:

    create table public.projects (
      id uuid primary key default gen_random_uuid(),
      owner_uid text not null,
      name text not null,
      address text,
      status text not null default 'planning',
      created_at timestamptz not null default now()
    );
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from app.deps import CurrentUserDep
from app.services.supabase import get_supabase

router = APIRouter(prefix="/projects", tags=["projects"])

TABLE = "projects"


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    address: str | None = None
    status: str = "planning"


class Project(ProjectCreate):
    id: str
    owner_uid: str
    created_at: str | None = None


@router.get("", response_model=list[Project])
async def list_projects(user: CurrentUserDep) -> list[Project]:
    response = (
        get_supabase()
        .table(TABLE)
        .select("*")
        .eq("owner_uid", user.uid)
        .order("created_at", desc=True)
        .execute()
    )
    return [Project(**row) for row in response.data]


@router.post("", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(payload: ProjectCreate, user: CurrentUserDep) -> Project:
    response = (
        get_supabase()
        .table(TABLE)
        .insert({**payload.model_dump(), "owner_uid": user.uid})
        .execute()
    )
    if not response.data:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Supabase did not return the inserted row",
        )
    return Project(**response.data[0])


@router.get("/{project_id}", response_model=Project)
async def get_project(project_id: str, user: CurrentUserDep) -> Project:
    response = (
        get_supabase()
        .table(TABLE)
        .select("*")
        .eq("id", project_id)
        .eq("owner_uid", user.uid)
        .limit(1)
        .execute()
    )
    if not response.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    return Project(**response.data[0])
