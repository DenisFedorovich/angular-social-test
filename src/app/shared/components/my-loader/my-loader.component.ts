import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/core/services/language.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-my-loader',
  templateUrl: './my-loader.component.html',
  styleUrls: ['./my-loader.component.scss']
})

export class MyLoaderComponent implements OnInit, OnDestroy {

  public loading: boolean;
  private langSub: Subscription;
  private loader: Subscription;

  constructor(
    private loaderService: LoaderService,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) {

  }
  ngOnInit() {
    this.loader = this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;
    });
    this.langSub = this.languageService.language.subscribe((language: string) => {
      this.translate.use(language);
    })
  }

  ngOnDestroy() {
    this.loader.unsubscribe();
    this.langSub.unsubscribe();
  }

}
