import z from "zod";

enum Priority {
  p4,
  p3,
  p2,
  p1,
}

const commentSchema = z.array(z.object({
    content: z.string(),
    userId: z.string().uuid(),
    todoId: z.string().uuid()
}))

const todoSchema = z.object({
    id: z.string().uuid(),
    title: z.string().min(1, "Title is required"), 
    description: z.string().nullable(), 
    createdAt: z.string().datetime(), 
    done: z.boolean().default(false),
    dueDate: z.string().datetime().nullable(), 
    priority: z.number().int().max(5),
    comments: commentSchema,
    reminder: z.string().datetime().nullable(), 
    projectId: z.string().uuid().nullable(), 
    userId: z.string().uuid(),
});

export const createTodoSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().nullable(),
    dueDate: z.string().datetime().nullable(),
    priority: z.nativeEnum(Priority),
    reminder: z.string().datetime().nullable(),
    projectId: z.string().nullable(),
});

export type TcreateTodoTypes = z.infer<typeof createTodoSchema>




export type TtodoSchema = z.infer<typeof todoSchema>