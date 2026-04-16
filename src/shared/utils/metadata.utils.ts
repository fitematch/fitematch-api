import { Injectable } from '@nestjs/common';
import ResultPaginationInterface from '@src/shared/contracts/pagination/result-pagination.interface';

@Injectable()
export default class MetadataUtils {
  /**
   * Returns pagination metadata for paginated responses.
   *
   * @param {number} totalItems - Total number of items
   * @param {number} itemCount - Number of items on the current page
   * @param {number} limit - Number of items per page
   * @param {number} currentPage - Current page
   * @param {string} url - Base URL for constructing pagination links
   */
  getPaginationData(
    totalItems: number,
    itemCount: number,
    limit: number,
    currentPage: number,
    url: string,
  ): ResultPaginationInterface {
    const totalPages = Math.ceil(totalItems / limit);
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    return {
      totalItems,
      itemCount,
      itemsPerPage: limit,
      totalPages,
      currentPage,
      hasNextPage,
      hasPreviousPage,
      links: {
        first: `${url}?limit=${limit}`,
        previous: hasPreviousPage
          ? `${url}?page=${currentPage - 1}&limit=${limit}`
          : '',
        next: hasNextPage
          ? `${url}?page=${currentPage + 1}&limit=${limit}`
          : '',
        last: `${url}?page=${totalPages}&limit=${limit}`,
      },
    };
  }
}
