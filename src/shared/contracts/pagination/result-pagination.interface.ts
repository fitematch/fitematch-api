export default interface ResultPaginationInterface {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  };
}
