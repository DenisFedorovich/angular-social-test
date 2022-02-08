import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/shared/interfaces/interfaces';
import { PostService } from 'src/app/shared/services/post.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';


@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  providers: [MessageService, ConfirmationService]
})

export class DashboardPageComponent implements OnInit, OnDestroy {
  public posts: Post[] = [];
  public pSub: Subscription;
  public dSub: Subscription;
  public searchStr: string = '';
  private langSub: Subscription;

  constructor(
    private postsService: PostService,
    private confirmationService: ConfirmationService,
    private primengConfig: PrimeNGConfig,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.pSub = this.postsService.getAll().subscribe(
      posts => {
        this.posts = posts;
      }
    );
    this.langSub = this.languageService.language.subscribe((language: string) => {
      this.translate.use(language);
    })
  }

  public filterValidation(): string | null {
    let regexp = /^[a-z0-9]+$/i.test(this.searchStr);
    if (!regexp && this.searchStr.length > 0) {
      return "ERRORS.SPECSYMBOL"
    } else {
      return null
    }
  }

  public confirm2(id: string): void {
    this.confirmationService.confirm({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.dSub = this.postsService.remove(id).subscribe(() => {
          this.posts = this.posts.filter(post => post.id != id)
          this.toastr.error('Post was deleted!', 'Attention!!!!');
        })

      },
      reject: () => {
        this.toastr.warning('You refused to delete the post','Attention!!!!');
      },
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe()
    }
    if (this.dSub) {
      this.dSub.unsubscribe()
    }
    this.langSub.unsubscribe()
  }
}
