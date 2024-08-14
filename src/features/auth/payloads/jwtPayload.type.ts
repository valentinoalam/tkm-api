export type JwtPayload = {
  sub: string;
  username: string;
  role: string;
  iat?: any;
  exp?: any;
};
