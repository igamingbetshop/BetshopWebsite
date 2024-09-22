import { MatFormFieldModule } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component, WritableSignal, inject, signal } from '@angular/core';
import { ConfigService } from 'src/app/core/services/config.service';
import { Language } from 'src/app/core/interfaces/language';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'bs-languages',
  standalone: true,
  imports: [MatFormFieldModule, MatSelectModule],
  templateUrl: './languages.component.html',
  styleUrl: './languages.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguagesComponent
{
  config = inject(ConfigService);
  languages:WritableSignal<Language[]> = signal(this.config.settings.Languages);

  change(lang:Language)
  {
    localStorage.setItem("lang", lang.Code);
    location.href = `/${lang.Locale}`;
  }
}
