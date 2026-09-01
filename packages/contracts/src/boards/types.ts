import type { CardDto } from '../cards/types.js';
import type { ColumnDto } from '../columns/types.js';
import type { PaginationMeta } from '../common/types.js';

export interface BoardDto {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface BoardViewColumnDto extends ColumnDto {
  cards: CardDto[];
}

export interface BoardViewDto extends BoardDto {
  columns: BoardViewColumnDto[];
}

export interface ListBoardsResponse {
  data: BoardDto[];
  meta: PaginationMeta;
}
