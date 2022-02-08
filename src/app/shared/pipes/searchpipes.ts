import { Pipe, PipeTransform } from "@angular/core";
import { Post } from "../interfaces/interfaces";

@Pipe({
  name: 'searchUser'
})

export class SearchPipe implements PipeTransform {
  transform(users: Post[], search = ''): Post[] {
    let regexp: boolean = /^[a-z0-9]+$/i.test(search);
    if (!search.trim() || !regexp) {
      return users
    }

    let arr = users.filter((user) => {
      const names = user.name.toLocaleLowerCase().includes(search.toLocaleLowerCase());
      const surnames = user.surname.toLocaleLowerCase().includes(search.toLocaleLowerCase());
      const city = user.city.toLocaleLowerCase().includes(search.toLocaleLowerCase());
      return (names || surnames || city);
    })

    return arr
    
  }

}


