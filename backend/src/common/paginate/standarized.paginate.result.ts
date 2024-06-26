/**
 * StandardizedPaginateResult
 * @description Standardized response for paginated results.
 */
export default class StandardizedPaginateResult<T> {
  page: number;
  limit: number;
  total: number;
  items: T[];
  constructor({
    page,
    limit,
    total,
    items,
  }: {
    page: number;
    limit: number;
    total: number;
    items: T[];
  }) {
    this.page = +page;
    this.limit = +limit;
    this.total = total;
    this.items = items;
  }
}
