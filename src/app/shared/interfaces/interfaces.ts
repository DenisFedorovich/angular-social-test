export interface User {
  email: string
  password: string
  returnSecureToken?: boolean
}

export interface FBAuthToken {
  idToken: string
  expiresIn: string
}

export interface Post {
  photo: any
  id: string
  name: string
  surname: string
  birthday: string
  text: string
  city: string
  schools: any
  universities: any
  date: Date
}

export interface FBCreateResponse {
  name: string
}
