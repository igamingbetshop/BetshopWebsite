import { Injectable } from '@angular/core';
import {Menu, Settings} from "../interfaces";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  settings!:Settings;

  load()
  {
    return fetch("assets/config.json",{method:"GET", headers:{
        "Content-Type": "application/json",
      }}).then(response => {
        return response.json();
    }).then(data => {
      this.settings = data as Settings;
    //  this.settings.Menus = this.getMappedMenus(this.settings.Menus);
    }, error => {
    });
  }

  /*getMappedMenus(menus:Menu[]):Menu[]
  {
    menus.map((menu:Menu) => {
      menu.HasChildren = menu.SubMenu.length > 1;

      if (menu.SubMenu.length > 0) {
        menu.RouterLink = `/${menu.Group}/${menu.Href}/${menu.SubMenu[0].Id}`;
      } else {
        menu.RouterLink = `/${menu.Group}/${menu.Href}`;
      }
      menu.SubMenu = menu.SubMenu.map((subMenu:any) => {
        subMenu.RouterLink = menu.Group
          ? `/${menu.Group}/${menu.Href}/${subMenu.Href}`
          : menu.Href ? `/${menu.Href}/${subMenu.Href}`
            : `/${subMenu.Href}`;
        if(subMenu.Icon)
          subMenu.Icon = `assets/images/${subMenu.Icon}.svg`;
        return subMenu;
      });
      return menu;
    });
    return menus;
  }*/
}
