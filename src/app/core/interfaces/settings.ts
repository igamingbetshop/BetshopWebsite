import { Language } from "./language";
import {Menu} from "./menu";

export interface Settings
{
  [key: string]: any;
  Version:number;
  AllowAge:number;
  ApiUrl:string;
  SocketUrl:string;
  PrinterUrl:string;
  DefaultLanguage:string;
  Languages:Language[];
  GeneralMenu:any[];
  SettingsMenu:any[];
  AccountsMenu:any[];
  PaymentsMenu:any[];
  ReportsMenu:any[];
  Menus:Menu[];
  MobileCodes:any[];
}
