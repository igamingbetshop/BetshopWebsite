import {ChangeDetectionStrategy, Component, inject, signal, WritableSignal} from '@angular/core';
import {MatMenuModule} from "@angular/material/menu";
import {ApiService} from "../../core/services/api.service";
import {Methods} from "../../core/enums";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {DocumentMenu} from "../../core/interfaces/document-menu";
import {DocumentItemComponent} from "./document-item/document-item.component";
import {getDomain} from "../../core/utils";

@Component({
  selector: 'bs-documents',
  standalone: true,
  imports: [MatMenuModule, DocumentItemComponent],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentsComponent {

  documents:WritableSignal<DocumentMenu[]> = signal([]);
  apiService = inject(ApiService);
  constructor()
  {
    this.apiService.apiCall(Methods.GET_DOCUMENTS).pipe(takeUntilDestroyed()).subscribe(data => {
      if(data.ResponseCode === 0)
      {
        const d = data.ResponseObject.map((menu:DocumentMenu) => {
          menu.Documents.map(document => {
            document.Path = `https://resources.${getDomain()}/resources/documents/${document.Path}`;
            return document
          });
          return menu;
        });
        this.documents.set(d);
      }
    });
  }
}
