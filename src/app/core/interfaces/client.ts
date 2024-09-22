import { ClientAccount } from "./client-account";
import { ClientSettings } from "./client-settings";

export interface Client {
  Id:number;
  Gender:number;
  Email:string;
  UserName:string;
  FirstName:string;
  LastName:string;
  GenderName:string;
  CurrencyId:string;
  BirthDate:string;
  Address:string;
  MobileNumber:string;
  DocumentNumber:string;
  ZipCode:string;
  CreationTime:string;
  Info:string;
  Accounts:ClientAccount[];
  Settings:ClientSettings;
  StatusName:string;
  Allowed:string;
}
