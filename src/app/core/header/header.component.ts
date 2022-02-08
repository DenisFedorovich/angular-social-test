import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.services';
import { LanguageService } from '../services/language.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public language: string = '';

  constructor(private router: Router,
    public auth: AuthService,
    public translate: TranslateService,
    private languageService: LanguageService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit(): void {}

  public translateLanguageTo(lang: string) {
    this.translate.use(lang);
    this.languageService.setLang(lang);
  }

  public logout(event: Event): void {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['/', 'login']);
  }
}
