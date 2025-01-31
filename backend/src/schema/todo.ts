
import { z } from 'zod';


export const updateSubTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  done: z.boolean().optional()
});

export const createSubTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
});

export const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  done: z.boolean().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  priority: z.number().optional(),
  reminder: z.string().datetime().nullable().optional(),
  projectId: z.string().nullable().optional(),
});

export const createTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable(),
  done: z.boolean().optional(),
  dueDate: z.string().datetime().nullable(),
  priority: z.number(),
  reminder: z.string().datetime().nullable(),
  projectId: z.string().nullable(),
})
