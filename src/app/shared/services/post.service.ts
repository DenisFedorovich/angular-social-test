import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { FBCreateResponse, Post } from "../interfaces/interfaces";

@Injectable({ providedIn: 'root' })

export class PostService {
  constructor(private http: HttpClient) { }

  public create(user: Post): Observable<Post> {
    return this.http.post<Post>(`${environment.fbDbUrl}/users.json`, user)
      .pipe(map((response: FBCreateResponse) => {
        // console.log('USER DATA', user)
        return {
          ...user,
          id: response.name,
          date: new Date(user.date),
        }
      }))
  }

  public getAll(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/users.json`)
      .pipe(map((response: { [key: string]: any }) => {
        return Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          }))
      }))
  }

  public getById(id: string): Observable<Post> {
    return this.http.get<Post>(`${environment.fbDbUrl}/users/${id}.json`)
      .pipe(map((user: Post) => {
        return {
          ...user,
          id,
          date: new Date(user.date)
        }
      }))
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/users/${id}.json`)
  }

  public update(user: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDbUrl}/users/${user.id}.json`, user)
  }
}
