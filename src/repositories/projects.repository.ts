import { sql } from "../db";
import type { Project, CreateProjectRequest } from "../types";

interface ProjectFilters {
  scope?: string;
  category?: string;
  featured?: boolean;
  search?: string;
}

export class ProjectsRepository {
  static async findAll(filters?: ProjectFilters): Promise<Project[]> {
    let query = sql`SELECT * FROM projects WHERE 1=1`;

    if (filters?.scope) {
      query = sql`${query} AND scope = ${filters.scope}`;
    }

    if (filters?.category) {
      query = sql`${query} AND category = ${filters.category}`;
    }

    if (filters?.featured !== undefined) {
      query = sql`${query} AND featured = ${filters.featured}`;
    }

    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      query = sql`${query} AND (
        LOWER(title) LIKE LOWER(${searchTerm}) OR 
        LOWER(description) LIKE LOWER(${searchTerm})
      )`;
    }

    query = sql`${query} ORDER BY created_at DESC`;

    return await query;
  }

  static async findById(id: number): Promise<Project | null> {
    const result = await sql<Project[]>`
      SELECT 
        p.*,
        COALESCE(
          json_agg(
            json_build_object(
              'tech_stack_id', ts.tech_stack_id,
              'tech_stack_name', ts.tech_stack_name,
              'tech_stack_description', ts.tech_stack_description,
              'icon_url', ts.icon_url,
              'created_at', ts.created_at,
              'updated_at', ts.updated_at
            )
          ) FILTER (WHERE ts.tech_stack_id IS NOT NULL),
          '[]'
        ) as tech_stacks
      FROM projects p
      LEFT JOIN project_tech_stack pts ON p.id = pts.project_id
      LEFT JOIN tech_stack ts ON pts.tech_stack_id = ts.tech_stack_id
      WHERE p.id = ${id}
      GROUP BY p.id
    `;
    return result[0] || null;
  }

  static async create(data: CreateProjectRequest): Promise<Project> {
    const result = await sql.begin(async (sql) => {
      const projectResult = await sql<Project[]>`
        INSERT INTO projects (
          title, description, owner, url, category, scope, 
          thumbnail, images, featured, tag_id, testimonial
        )
        VALUES (
          ${data.title}, 
          ${data.description}, 
          ${data.owner}, 
          ${data.url}, 
          ${data.category}, 
          ${data.scope},
          ${data.thumbnail || null}, 
          ${data.images ? sql.array(data.images) : null}, 
          ${data.featured || false}, 
          ${data.tag_id || null}, 
          ${data.testimonial || null}
        )
        RETURNING *
      `;

      const project = projectResult[0];

      if (data.tech_stack_ids && data.tech_stack_ids.length > 0) {
        for (const techStackId of data.tech_stack_ids) {
          await sql`
            INSERT INTO project_tech_stack (project_id, tech_stack_id)
            VALUES (${project.id}, ${techStackId})
          `;
        }
      }

      return project;
    });

    return (await this.findById(result.id))!;
  }

  static async update(id: number, data: Partial<CreateProjectRequest>): Promise<Project | null> {
    await sql.begin(async (sql) => {
      await sql`
        UPDATE projects 
        SET title = COALESCE(${data.title}, title),
          description = COALESCE(${data.description}, description),
          owner = COALESCE(${data.owner}, owner),
          url = COALESCE(${data.url}, url),
          category = COALESCE(${data.category}, category),
          scope = COALESCE(${data.scope}, scope),
          thumbnail = COALESCE(${data.thumbnail}, thumbnail),
          images = COALESCE(${data.images ? sql.array(data.images) : undefined}, images),
          featured = COALESCE(${data.featured}, featured),
          tag_id = COALESCE(${data.tag_id}, tag_id),
          testimonial = COALESCE(${data.testimonial}, testimonial),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id}
      `;

      if (data.tech_stack_ids !== undefined) {
        await sql`DELETE FROM project_tech_stack WHERE project_id = ${id}`;

        if (data.tech_stack_ids.length > 0) {
          for (const techStackId of data.tech_stack_ids) {
            await sql`
              INSERT INTO project_tech_stack (project_id, tech_stack_id)
              VALUES (${id}, ${techStackId})
            `;
          }
        }
      }
    });

    return await this.findById(id);
  }

  static async delete(id: number): Promise<boolean> {
    const result = await sql`DELETE FROM projects WHERE id = ${id}`;
    return result.count > 0;
  }
}
