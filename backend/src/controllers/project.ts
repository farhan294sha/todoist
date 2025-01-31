import { Request, Response } from "express";
import { prisma } from "../db";
import { NotFoundException } from "../exceptions/notFound";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import z from "zod"

export async function getAllProjects(req: Request, res: Response) {
  const projects = await prisma.user.findUnique({
    where: {
      id: req.user,
    },
    select: {
      id: true,
      projects: true,
    },
  });
  if (!projects)
    throw new NotFoundException("projects not found", ErrorCode.NOT_FOUND);
  res.json({
    userId: projects.id,
    projects: projects.projects,
  });
}

export async function getProjectById(req: Request, res: Response) {
  const projectId = req.params.projectId;
  const project = await prisma.project.findUnique({
    where: {
      userId: req.user,
      id: projectId,
    }
  });
  if (!project)
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  res.json({ project });
}

const projectsSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  parentId: z.string().nullable()
});


export async function createProject(req: Request, res: Response) {
  const response = projectsSchema.safeParse(req.body);
  if (!response.success) {
    throw new UnprocessableEntity(
      response.error,
      "Invalid input",
      ErrorCode.BAD_REQUEST
    );
  }
  const newProject = req.body;
  newProject.userId = req.user;
  const createdProject = await prisma.project.create({
    data: newProject,
  });
  if (!createdProject)
    throw new NotFoundException("todos not found", ErrorCode.NOT_FOUND);
  res.json({ createdProject });
}
