import { z } from "zod";

export const baseEntitySchema = z.object({
  id: z.number(),
  createdAt: z.string(),
});

export const paginatedResponseSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    totalCount: z.number(),
    pageSize: z.number(),
    currentPage: z.number(),
    totalPages: z.number(),
    data: z.array(itemSchema),
  });

export type BaseEntity = z.infer<typeof baseEntitySchema>;

export type PaginatedResponse<T> = Omit<
  z.infer<ReturnType<typeof paginatedResponseSchema>>,
  "data"
> & { data: T[] };
