import {ChangeDetectionStrategy, Component, output} from '@angular/core';
import {NgFor, NgOptimizedImage} from '@angular/common';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {BaseNavigation} from "../base-navigation";
import {BalanceLimitComponent} from "../../balance-limit/balance-limit.component";
import {DocumentsComponent} from "../../documents/documents.component";
import {ActionsComponent} from "../../actions/actions.component";
import {CollapseDirective} from "../../../shared/directives/collapse-directive";

@Component({
  selector: 'bs-navigation',
  standalone: true,
  imports: [NgFor, RouterLink, RouterLinkActive, BalanceLimitComponent, DocumentsComponent, ActionsComponent, CollapseDirective, NgOptimizedImage],
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class NavigationComponent extends BaseNavigation
{
  onSelectionChange = output<boolean>({alias:"selectionChange"});
  override selectionChange(event:MouseEvent, url:string)
  {
    event.stopPropagation();
    super.selectionChange(event, url);
    this.onSelectionChange.emit(true);
  }
}
