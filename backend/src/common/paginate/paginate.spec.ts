// paginate.spec.ts
import {
  EntityManager,
  EntityTarget,
  FindManyOptions,
  Repository,
} from 'typeorm';
import paginate from './paginate';
import { vi } from 'vitest';

describe('paginate', () => {
  let repository: Repository<any>;
  const entityManager: EntityManager = {} as EntityManager;
  const target: EntityTarget<any> = {} as EntityTarget<any>;

  beforeEach(() => {
    repository = new Repository(
      target,
      entityManager,
    ) as unknown as Repository<any>;
  });

  it('should paginate results', async () => {
    const options = { page: 1, limit: 10 };
    const queryOptions: FindManyOptions = {
      where: { active: true },
      order: { id: 'ASC' },
    };
    const result = [{ id: 1 }, { id: 2 }];
    const total = 20;

    vi.spyOn(repository, 'findAndCount').mockResolvedValueOnce([result, total]);

    const paginatedResult = await paginate(repository, options, queryOptions);

    expect(paginatedResult).toEqual({
      items: result,
      total,
      page: options.page,
      limit: options.limit,
    });

    expect(repository.findAndCount).toHaveBeenCalledWith({
      ...queryOptions,
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    });
  });
});
