import { ProjectsRepository } from "../repositories";
import { mapMediaArray, toPublicUrl } from "../utils/media";
import type { Project, CreateProjectRequest } from "../types";

interface ProjectFilters {
	scope?: string;
	category?: string;
	featured?: boolean;
	search?: string;
}

export class ProjectsService {
	private static withPublicMedia(project: Project | null): Project | null {
		if (!project) return project;

		const thumbnail = (toPublicUrl(project.thumbnail) ??
			project.thumbnail) as Project["thumbnail"];
		const images = mapMediaArray(
			(project.images ?? []) as string[] | null,
		) as Project["images"];

		return {
			...project,
			thumbnail,
			images,
		};
	}

	static async getAllProjects(filters?: ProjectFilters): Promise<Project[]> {
		const projects = await ProjectsRepository.findAll(filters);
		return projects.map(
			(project) => this.withPublicMedia(project)!,
		) as Project[];
	}

	static async getProjectById(id: number): Promise<Project | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid project ID");
		}
		const project = await ProjectsRepository.findById(id);
		return this.withPublicMedia(project);
	}

	static async createProject(data: CreateProjectRequest): Promise<Project> {
		if (!data.title || data.title.trim().length === 0) {
			throw new Error("Project title is required");
		}
		if (!data.owner || data.owner.trim().length === 0) {
			throw new Error("Project owner is required");
		}
		const project = await ProjectsRepository.create(data);
		return this.withPublicMedia(project)!;
	}

	static async updateProject(
		id: number,
		data: Partial<CreateProjectRequest>,
	): Promise<Project | null> {
		if (!id || id <= 0) {
			throw new Error("Invalid project ID");
		}
		const project = await ProjectsRepository.update(id, data);
		return this.withPublicMedia(project);
	}

	static async deleteProject(id: number): Promise<boolean> {
		if (!id || id <= 0) {
			throw new Error("Invalid project ID");
		}
		return await ProjectsRepository.delete(id);
	}
}
