import { Injectable } from '@angular/core';
import {Menu} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  menus:Menu[] = [];
  constructor() { }
  load()
  {
    return fetch("assets/json/menu.json",{method:"GET", headers:{
        "Content-Type": "application/json",
      }}).then(response => {
      return response.json();
    }).then(data => {
      this.menus = this.getMappedMenus(data.Items);
    }, error => {
    });
  }

  getMappedMenus(items:any[]):Menu[]
  {
   const menus = items.map((item:any) => {
      const menu:Menu = {Id:0, Href:"", SubMenu:[], Name:"", RouterLink:"", Group:"", HasChildren:false};
      menu.HasChildren = item.SubMenu.length > 1;
      menu.Href = item.Href;
      menu.Group = item.Type;
      menu.Name = item.Title;
      menu.Id = item.Id;
      menu.SubMenu = item.SubMenu.map((subMenu:any) => {
        const mappedSubMenu:any = {};
        mappedSubMenu.Id = subMenu.Type;
        mappedSubMenu.Icon = subMenu.Icon;
        mappedSubMenu.Name = subMenu.Title;

        if(subMenu.Href)
        {
          const refs = JSON.parse(subMenu.Href);
          mappedSubMenu.Href = refs.Href;
          mappedSubMenu.CashierUrl = refs.CashierUrl;
          mappedSubMenu.MonitorUrl = refs.MonitorUrl;
        }

        if(subMenu.StyleType)
        {
          const config = JSON.parse(subMenu.StyleType);
          mappedSubMenu.ExternalId = config.ExternalId;
          mappedSubMenu.ProviderId = config.ProviderId;
          mappedSubMenu.SystemBet = config.SystemBet;
          mappedSubMenu.ExpressBet = config.ExpressBet;
        }

        mappedSubMenu.RouterLink = menu.Group
          ? `/${menu.Group}/${menu.Href}/${mappedSubMenu.Href}`
          : menu.Href ? `/${menu.Href}/${mappedSubMenu.Href}`
            : `/${mappedSubMenu.Href}`;
        if(mappedSubMenu.Icon)
          mappedSubMenu.Icon = `assets/images/${mappedSubMenu.Icon}.svg`;
        return mappedSubMenu;
      });
     if (menu.SubMenu.length > 0) {
       menu.RouterLink = `/${menu.Group}/${menu.Href}/${menu.SubMenu[0].Id}`;
     } else {
       menu.RouterLink = `/${menu.Group}/${menu.Href}`;
     }
      return menu;
    });
    return menus;
  }

}
