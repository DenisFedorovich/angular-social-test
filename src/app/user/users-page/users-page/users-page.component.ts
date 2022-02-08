import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription, switchMap } from 'rxjs';
import { LanguageService } from 'src/app/core/services/language.service';
import { Post } from '../../../shared/interfaces/interfaces';
import { PostService } from '../../../shared/services/post.service';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrls: ['./users-page.component.scss']
})

export class UsersPageComponent implements OnInit, OnDestroy {
  public user$: Observable<Post>
  private langSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: PostService,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.user$ = this.route.params
      .pipe(switchMap((params: Params) => {
        return this.userService.getById(params['id'])
      }))
    this.langSub = this.languageService.language.subscribe((language: string) => {
      this.translate.use(language);
    })
  }
  ngOnDestroy(): void {
    this.langSub.unsubscribe()
  }
}
