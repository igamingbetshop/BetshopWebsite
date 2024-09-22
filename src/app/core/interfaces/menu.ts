export interface Menu
{
  [key: string]: any;
  Id:number;
  Name:string;
  Href:string;
  HasChildren:boolean;
  RouterLink:string;
  Group:string;
  SubMenu:any[];
}
