// utils/pagination.util.ts
import { FindManyOptions, Repository } from 'typeorm';

interface PaginationOptions {
  page: number;
  limit: number;
}

export default async function paginate<T>(
  repository: Repository<T>,
  options: PaginationOptions,
  queryOptions?: FindManyOptions<T>,
): Promise<{ items: T[]; total: number; page: number; limit: number }> {
  const { page, limit } = options;
  const [result, total] = await repository.findAndCount({
    ...queryOptions,
    skip: (page - 1) * limit,
    take: limit,
  });

  return {
    items: result,
    total,
    page,
    limit,
  };
}
