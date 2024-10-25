export interface Cashier
{
  Id:number;
  UserId:number;
  ParentId:number;
  PartnerId:number;
  CashDeskId:number;
  CashierId:number;
  Balance:number;
  BetShopId:number;
  CurrentLimit:number;
  State:number;
  CashDeskName:string;
  CashierFirstName:string;
  CashierLastName:string;
  BetShopName:string;
  BetShopAddress:string;
  BetShopCurrencyId:string;
  Token:string;
  PrintLogo:boolean;
  PaymentSystems:any[]
}
