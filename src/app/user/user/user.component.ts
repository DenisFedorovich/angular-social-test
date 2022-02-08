import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/core/services/language.service';
import { Post } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {
  @Input() user: Post;
  private langSub: Subscription;

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.langSub = this.languageService.language.subscribe((language: string) => {
      this.translate.use(language);
    })
  }

  ngOnDestroy(): void {
    this.langSub.unsubscribe()
  }
}
