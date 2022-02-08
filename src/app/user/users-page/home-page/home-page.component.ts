import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Post } from '../../../shared/interfaces/interfaces';
import { PostService } from '../../../shared/services/post.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  public users$: Observable<Post[]>

  constructor(
    private userService: PostService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.users$ = this.userService.getAll()
  }

}
