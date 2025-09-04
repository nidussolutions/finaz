export interface SignupBody {
  name?: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  token: string;
}

export interface LoginBody {
  email: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}
