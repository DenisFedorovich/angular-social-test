import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namepipe'
})

export class NamePipe implements PipeTransform {
  transform(name: string): string {
    return `${name.slice(0,1).toUpperCase()}.`
  }
}

