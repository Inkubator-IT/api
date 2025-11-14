import { ProjectsRepository } from "../repositories";
import type { Project, CreateProjectRequest } from "../types";

interface ProjectFilters {
  scope?: string;
  category?: string;
  featured?: boolean;
  search?: string;
}

export class ProjectsService {
  static async getAllProjects(filters?: ProjectFilters): Promise<Project[]> {
    return await ProjectsRepository.findAll(filters);
  }

  static async getProjectById(id: number): Promise<Project | null> {
    if (!id || id <= 0) {
      throw new Error("Invalid project ID");
    }
    return await ProjectsRepository.findById(id);
  }

  static async createProject(data: CreateProjectRequest): Promise<Project> {
    if (!data.title || data.title.trim().length === 0) {
      throw new Error("Project title is required");
    }
    if (!data.owner || data.owner.trim().length === 0) {
      throw new Error("Project owner is required");
    }
    return await ProjectsRepository.create(data);
  }

  static async updateProject(
    id: number,
    data: Partial<CreateProjectRequest>,
  ): Promise<Project | null> {
    if (!id || id <= 0) {
      throw new Error("Invalid project ID");
    }
    return await ProjectsRepository.update(id, data);
  }

  static async deleteProject(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error("Invalid project ID");
    }
    return await ProjectsRepository.delete(id);
  }
}