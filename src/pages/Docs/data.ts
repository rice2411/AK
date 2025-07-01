export interface AccountData {
  name: string;
  email: string;
  password: string;
  slack: string;
  git: string;
  googleAccount: string;
  ref: string;
}

export const accountList: AccountData[] = [
  {
    name: "Lê Hữu Phúc",
    email: "phuclh@rikkeisoft.com",
    password: "Rikkei091024#@",
    slack: "Rikkei091024#@",
    git: "Rikkei070823#@",
    googleAccount: "Rikkei091024#@",
    ref: "minhtta",
  },
  {
    name: "Võ Văn An",
    email: "anvv1@rikkeisoft.com",
    password: "Rikkei260824#@",
    slack: "Rikkei231023#@",
    git: "Rikkei231023#@",
    googleAccount: "Rikkei260824#@",
    ref: "nhanht2",
  },
];
