import { FormControl, FormGroup } from '@angular/forms'
import { eightYears } from '../../../assets/constants/constants';

export function shouldBeLess(controlName: string, matchingControlName: string): (formGroup: FormGroup) => void {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    const controlMilliseconds = Date.parse(control.value);
    const matchingControlMilliseconds = Date.parse(matchingControl.value);

    if (matchingControl.errors && !matchingControl.errors['shouldBeLess']) {
      return;
    }

    if (controlMilliseconds > matchingControlMilliseconds) {
      matchingControl.setErrors({ shouldBeLess: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

export function setErrorsDate(control: FormControl) {
  const controlDate = control.value;
  const date = new Date().getTime();
  const birthday = Date.parse(controlDate);
  const controlDateAge = date - controlDate
  const agePerson = date - eightYears
  if (date < birthday) {
    return { birthdayDate: true }
  } else if (agePerson > controlDateAge) {
    return { birthdayDateAge: true }
  } else {
    return null
  }
}
