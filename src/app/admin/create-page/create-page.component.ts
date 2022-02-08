import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Post } from 'src/app/shared/interfaces/interfaces';
import { shouldBeLess, setErrorsDate } from 'src/app/shared/validators/my.validotors';
import {
  numberOne,
  numberTwentyFive,
  numberTwo,
  NAME_PATTERN,
  numberOneHundreedSixtyEight,
} from '../../../assets/constants/constants';
import { PostService } from 'src/app/shared/services/post.service';
import { MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
  providers: [MessageService]
})

export class CreatePageComponent implements OnInit, OnDestroy {
  @Input() isCreateMode: boolean;
  @ViewChild("fileDropRef", { static: false }) fileDropRef: ElementRef

  public form: FormGroup;
  public schools: FormArray;
  public universities: FormArray;
  public selectedFile: File;
  public base64: string | ArrayBuffer | null = '';
  public submitted: boolean = false;
  private langSub: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private PostService: PostService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private languageService: LanguageService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      photo: ['',
        [
          Validators.required,
        ]],
      name: ['',
        [
          Validators.minLength(numberTwo),
          Validators.maxLength(numberTwentyFive),
          Validators.pattern(NAME_PATTERN),
          Validators.required,
        ]],
      surname: ['',
        [
          Validators.minLength(numberTwo),
          Validators.maxLength(numberTwentyFive),
          Validators.pattern(NAME_PATTERN),
          Validators.required,
        ]],
      text: ['',
        [
          Validators.minLength(numberTwo),
          Validators.required,
        ]],
      birthday: ['',
        [
          Validators.required,
          setErrorsDate
        ]],
      city: ['',
        [
          Validators.minLength(numberOne),
          Validators.maxLength(numberOneHundreedSixtyEight),
          Validators.required,
        ]],
      schools: this.formBuilder.array([],),
      universities: this.formBuilder.array([],),
    });
    this.langSub = this.languageService.language.subscribe((language: string) => {
      this.translate.use(language);
    })
  }

  ngOnDestroy(): void {
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

  //delete education methods

  public deleteEducation(type: string, i: number): void {
    const control: any = new FormControl('', Validators.required);
    (this.form.get(type) as FormArray).removeAt(i)
  }

  //submit method

  public onFileSelected(event: Event): void {
    // @ts-ignore
    this.form.get('photo')?.setValue((event.target as HTMLInputElement).files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      this.base64 = reader.result;
    };
    // @ts-ignore
    reader.readAsDataURL((event.target as HTMLInputElement).files[0]);
    // console.log("THIS PHOTO VALUE BEFORE", this.form.get('photo'))
  }

  public submit(): any {

    if (this.form.invalid) {
      return
    }

    this.submitted = true

    const post: Post = {
      photo: this.base64,
      name: this.form.value.name,
      surname: this.form.value.surname,
      text: this.form.value.text,
      date: new Date(),
      id: '',
      birthday: this.form.value.birthday,
      city: this.form.value.city,
      schools: [
        this.form.value.schools
      ],
      universities: [
        this.form.value.universities
      ]
    }

    this.PostService.create(post).subscribe(() => {
      this.form.reset();
      this.toastr.success('Сongratulations!', 'User was created!');
      this.base64 = '';
      (document.getElementById('fileDropRef') as HTMLInputElement).value = '';
      this.submitted = false;
      this.router.navigate(['/admin', 'dashboard']);
    })
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

  //drag and drop methods

  public removeImg(): void {
    this.base64 = '';
    this.fileDropRef.nativeElement.value = ''
  }

}



