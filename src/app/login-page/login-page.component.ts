import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/interfaces/interfaces';
import { numberOne, numberTwentyFive, numberTwo, EMAIL_PATTERN, NAME_PATTERN, numberOneHundreedSixtyEight, PASSWORD_PATTERN } from '../../assets/constants/constants';
import { LanguageService } from '../core/services/language.service';
import { AuthService } from '../shared/services/auth.services';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent implements OnInit, OnDestroy {

  public passwordType: string = 'password';
  public form: FormGroup;
  public submitted: boolean = false; //block submit btn flag
  public message: string;
  private langSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      if (params['loginAgain']) {
        this.message = 'Please, enter data'
      } else if (params['authFailed']) {
        this.message = 'Session expired, enter data again'
      }
    })

    this.form = this.formBuilder.group({
      email: ['',
        [
          Validators.pattern(EMAIL_PATTERN),
          Validators.required,

        ]],
      password: ['',
        [
          Validators.pattern(PASSWORD_PATTERN),
          Validators.required,
        ]]
    });
    this.langSub = this.languageService.language.subscribe((language: string) => {
      this.translate.use(language);
    })
  }

  public togglePasswordType(): void {
    this.passwordType === 'password' ? this.passwordType = 'text' : this.passwordType = 'password';
  }

  public submit(): void {
    if (this.form.invalid) {
      return
    }
    this.submitted = true;

    const user: User = {
      email: this.form.value.email as string,
      password: this.form.value.password as string,
    }

    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['/admin', 'dashboard']);
      this.submitted = false;
    },
      () => {
        this.submitted = false
      }
    )
  }

  public setErrorsEmail(): string | null {
    const selectedError = this.form?.get('email')?.errors;
    if (selectedError?.['required']) {
      return 'the field cannot be empty.'
    } else if (selectedError?.['pattern']) {
      return `email ${this.form?.get("email")?.value} is not correct`
    } else if (selectedError?.['restrictedEmail']) {
      return `${this.form?.get("email")?.value} is already taken`
    } else {
      return null
    }
  }

  public setErrorsPassword(password: string): string | null {
    const selectedError = this.form?.get(password)?.errors;
    if (selectedError?.['required']) {
      return `the field cannot be empty.`
    } else if (selectedError?.['pattern']) {
      return `Minimum eight characters, at least one uppercase letter, one lowercase
      letter, one number and one special character!`
    } else {
      return null
    }
  }
  ngOnDestroy(): void {
    this.langSub.unsubscribe()
  }
}
