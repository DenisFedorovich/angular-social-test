import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public date: Date = new Date();
  constructor(
    public translate: TranslateService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
  }

}
