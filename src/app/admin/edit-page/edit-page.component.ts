import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { NAME_PATTERN, numberOne, numberOneHundreedSixtyEight, numberTwentyFive, numberTwo } from 'src/assets/constants/constants';
import { Post } from 'src/app/shared/interfaces/interfaces';
import { PostService } from 'src/app/shared/services/post.service';
import { CommonService } from '../shared/services/common.service';
import { setErrorsDate, shouldBeLess } from 'src/app/shared/validators/my.validotors';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss'],
  providers: [CommonService]
})

export class EditPageComponent implements OnInit {
  @ViewChild("fileDropRefEdit", {static: false}) fileDropRefEdit: ElementRef

  public form: FormGroup;
  public schools: FormArray;
  public universities: FormArray;
  public user: Post;
  public base64: string | ArrayBuffer | null = '';
  public base64Load: string | ArrayBuffer | null = '';
  public uSub: Subscription;
  public submitted: boolean = false;
  private langSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private userService: PostService,
    private formBuilder: FormBuilder,
    private router: Router,
    public translate: TranslateService,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.userService.getById(params['id'])
      })
    ).subscribe((user: Post) => {
      this.user = user;
      this.form = this.formBuilder.group({
        photo: [this.base64Load = user.photo,
        [
          Validators.required,
        ]],
        name: [user.name,
        [
          Validators.minLength(numberTwo),
          Validators.maxLength(numberTwentyFive),
          Validators.pattern(NAME_PATTERN),
          Validators.required,
        ]],
        surname: [user.surname,
        [
          Validators.minLength(numberTwo),
          Validators.maxLength(numberTwentyFive),
          Validators.pattern(NAME_PATTERN),
          Validators.required,
        ]],
        text: [user.text,
        [
          Validators.minLength(numberTwo),
          Validators.required,
        ]],
        birthday: [new Date(user.birthday),
        [
          Validators.required,
          setErrorsDate
        ]],
        city: [user.city,
        [
          Validators.minLength(numberOne),
          Validators.maxLength(numberOneHundreedSixtyEight),
          Validators.required,
        ]],
        schools: this.formBuilder.array([]),
        universities: this.formBuilder.array([],),

      });
      if (this.user.schools) {
        this.user.schools[0].forEach((school: any) => {
          const schoolArray = this.formBuilder.group({
            school: [school.school],
            startSchoolDate: [new Date(school.startSchoolDate)],
            graduateSchoolDate: [new Date(school.graduateSchoolDate)]
          }, {
            validators: [shouldBeLess('startSchoolDate', 'graduateSchoolDate')],
          });
          (this.form.get('schools') as FormArray).push(schoolArray);
        });
      }

      if (this.user.universities) {
        this.user.universities[0].forEach((university: any) => {
          const schoolArray = this.formBuilder.group({
            university: [university.university],
            startUniversityDate: [new Date(university.startUniversityDate)],
            graduateUniversityDate: [new Date(university.graduateUniversityDate)]
          });
          (this.form.get('universities') as FormArray).push(schoolArray);
        });
      }
    })
    this.langSub = this.languageService.language.subscribe((language: string) => {
      this.translate.use(language);
    })
  }

  ngOnDestroy(): void {
    if (this.uSub) {
      this.uSub.unsubscribe();
    }
    this.langSub.unsubscribe()
  }

  //school array methods

  public createSchoolItem(): FormGroup {
    return this.formBuilder.group({
      school: ['', [Validators.required, Validators.minLength(numberOne)]],
      startSchoolDate: ['', [Validators.required, Validators.minLength(numberTwo)]],
      graduateSchoolDate: ['', [Validators.required, Validators.minLength(numberTwo)]]
    }, {
      validators: [shouldBeLess('startSchoolDate', 'graduateSchoolDate')],
    });
  }

  public addSchoolItem(): void {
    this.schools = this.form.get('schools') as FormArray;
    this.schools.push(this.createSchoolItem());
  }

  // university array methods

  public createUniversityItem(): FormGroup {
    return this.formBuilder.group({
      university: ['', [Validators.required, Validators.minLength(numberOne)]],
      startUniversityDate: ['', [Validators.required, Validators.minLength(numberTwo)]],
      graduateUniversityDate: ['', [Validators.required, Validators.minLength(numberTwo)]]
    }, {
      validators: [shouldBeLess('startUniversityDate', 'graduateUniversityDate')],
    });
  }

  public addUniversityItem(): void {
    this.universities = this.form.get('universities') as FormArray;
    this.universities.push(this.createUniversityItem());
  }

  //submit method

  onFileSelected(event: Event): void {
    // @ts-ignore
    this.form.get('photo')?.setValue((event.target as HTMLInputElement).files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      this.base64 = reader.result;
    };
    // @ts-ignore
    reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
  }

  public removeImg() {
    this.base64 = '';
    this.fileDropRefEdit.nativeElement.value = ''
  }

  public removeImgPrev() {
    this.base64Load = '';
    this.fileDropRefEdit.nativeElement.value = ''
  }

  submit(): any {
    if (this.form.invalid) {
      return null
    }

    this.submitted = true;

    this.uSub = this.userService.update({
      ...this.user,
      photo: this.base64 ? this.base64 : this.base64Load,
      name: this.form.value.name,
      surname: this.form.value.surname,
      birthday: this.form.value.birthday,
      text: this.form.value.text,
      city: this.form.value.city,
      schools: [
        this.form.value.schools
      ],
      universities: [
        this.form.value.universities
      ],
    }).subscribe(() => {
      this.submitted = false;
      this.router.navigate(['/admin', 'dashboard']);
    })


  }

  //delete education methods

  public deleteEducation(type: string, i: number): void {
    const control: any = new FormControl('', Validators.required);
    (this.form.get(type) as FormArray).removeAt(i)
  }


  //get controls

  public getControls(type: string): AbstractControl[] {
    return (this.form.get(type) as FormArray).controls;
  }

  //errors methods

  public getError(control: string, controla: string, i: number): boolean {
    const selectedControl = ((this.form?.controls[control] as FormArray)?.controls[i] as FormGroup).controls[controla];
    return selectedControl?.invalid && selectedControl?.touched;
  }

  public hasError(control: string, controla: string, i: number): string | null {
    const selectedControl = ((this.form?.controls[control] as FormArray)?.controls[i] as FormGroup).controls[controla];
    if (selectedControl?.errors?.['shouldBeLess']) {
      return `the date of admission to an educational institution cannot be later than the graduation date`
    } else if (selectedControl?.errors?.['required']) {
      return `the field cannot be empty.`
    } else {
      return null
    }
  }

  public setErrorsBirthday(): string | null {
    const selectedError = this.form?.get('birthday')?.errors;
    if (selectedError?.['required']) {
      return 'the field cannot be empty.'
    } else if (selectedError?.['birthdayDate']) {
      return `you have to be over 8 years of age to register`
    } else if (selectedError?.['birthdayDateAge']) {
      return `you have to be older than 8 years`
    } else {
      return null
    }
  }

  public setErrorsName(): string | null {
    const selectedError = this.form?.get('name')?.errors;
    if (selectedError?.['required']) {
      return 'the field cannot be empty.'
    } else if (selectedError?.['pattern']) {
      return `name ${this.form?.get("name")?.value} is not correct`
    } else if (selectedError?.['minlength']) {
      return `password cannot be less than
      ${this.form?.get('name')?.errors?.['minlength'].requiredLength}
      characters, now the number of characters is
      ${this.form?.get('name')?.errors?.['minlength'].actualLength}`
    } else if (selectedError?.['maxlength']) {
      return `password cannot be less than
      ${this.form?.get('name')?.errors?.['maxlength'].requiredLength}
      characters. Now the number of characters is
      ${this.form?.get('name')?.errors?.['maxlength'].actualLength}`
    } else {
      return null
    }
  }

  public setErrorsEmpty(smth: string): string | null {
    const selectedError = this.form?.get(smth)?.errors;
    if (selectedError?.['required']) {
      return `the field cannot be empty.`
    } else if (selectedError?.['maxlength']) {
      return `max length name of city is 168 symbols`
    } else {
      return null
    }
  }
}


