export class User {
  constructor(
      public email: string,
      public password: string,
      public confirmPassword?: string,
      public userName?: string
  ) {}
}

export interface UserLocal {
  token: string;
  userId: string;
  userName: string;
}
