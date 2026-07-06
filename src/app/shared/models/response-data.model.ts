export interface ResponseData<T> {
  data: T;
  showMessage: boolean;
  message: string;
}

export interface ResponseDataPaginate<T> {
  data: T;
  // statusCode: number;
  message: string;
}

export interface Pagination<T> {
  elements: T;
  totalRecords: number;
  totalPage: number;
  pageSize: number;
  page: number;
}
