export interface ILoginUser {
  email: string;
  password: string;
}

export interface IChangeUserPassword {
  oldPassword: string;
  newPassword: string;
}
