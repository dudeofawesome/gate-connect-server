import { QueryFailedError } from 'typeorm';

export class QueryFailedErrorFull extends QueryFailedError {
  length: number;
  severity: string;
  code: string;
  detail: string;
  // TODO: figure out this type
  hint: any;
  // TODO: figure out this type
  position: any;
  // TODO: figure out this type
  internalPosition: any;
  // TODO: figure out this type
  internalQuery: any;
  // TODO: figure out this type
  where: any;
  schema: string;
  table: string;
  // TODO: figure out this type
  column: any;
  // TODO: figure out this type
  dataType: any;
  constraint: string;
  file: string;
  line: string;
  routine: string;
  query: string;
  parameters: string[];
}
