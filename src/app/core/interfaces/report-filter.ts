export interface ReportFilter {
  FromDate?:Date | null;
  ToDate?:Date | null;
  FilterBy:string;
  Barcode:string;
  LastShiftsNumber?:number | null;
  ProductId:number | null;
  State:number | null;
  GameId:number | null;
  SkipCount?:number | null;
  TakeCount?:number | null;
}
