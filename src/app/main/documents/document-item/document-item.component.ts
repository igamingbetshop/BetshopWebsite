import {ChangeDetectionStrategy, Component, Input, input, OnInit, ViewChild} from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {DocumentMenu} from "../../../core/interfaces";
import {NgFor} from "@angular/common";

@Component({
  selector: 'bs-document-item',
  standalone: true,
  imports: [
    MatMenuModule
  ],
  templateUrl: './document-item.component.html',
  styleUrl: './document-item.component.scss',
  changeDetection: ChangeDetectionStrategy.Default
})
export class DocumentItemComponent implements OnInit{
  @ViewChild('childMenu') public childMenu:any;
  documentMenu = input.required<DocumentMenu>();

  ngOnInit()
  {
    let t = this.documentMenu().Documents;
  }
}
