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
    name: "Nguyễn Đăng Quang",
    email: "quangnd3@rikkeisoft.com",
    password: "Rikkei231023#@",
    slack: "Rikkei231023#@",
    git: "Rikkei231023#@",
    googleAccount: "Rikkei231023#@",
    ref: "nhanht2",
  },
];


export const tools = [
  {
    name: "Taiga",
    img: "/taiga.png",
    url: "https://taiga.io/",
    description: "Nền tảng quản lý dự án Agile với các tính năng quản lý task, sprint và theo dõi tiến độ dự án.",
  },
  {
    name: "Gitlab",
    img: "/gitlab.svg",
    url: "https://gitlab.com/",
    description: "Hệ thống quản lý mã nguồn và CI/CD tích hợp, hỗ trợ version control và deployment tự động.",
  },
  {
    name: "SmallerVideo",
    img: "/videoSmaller.svg",
    url: "https://smaller.video/",
    description: "Công cụ nén video trực tuyến giúp giảm kích thước file video mà vẫn duy trì chất lượng.",
  },
  {
    name: "Slack",
    img: "/slack.svg",
    url: "https://slack.com/",
    description: "Nền tảng giao tiếp nhóm với chat, chia sẻ file và tích hợp với các công cụ phát triển.",
  },
  {
    name: "RecordScreen IO",
    img: "/recordscreenio.png",
    url: "https://recordscreen.io/",
    description: "Công cụ ghi màn hình trực tuyến để tạo video hướng dẫn và demo sản phẩm.",
  },
  {
    name: "HCL Volt MX",
    img: "/voltmx.png",
    url: "https://voltmx.com/",
    description: "Công cụ tạo app mobile và web dựa trên các thành phần UI/UX đã có sẵn.",
  },
  {
    name: "Android Studio",
    img: "/androidstudio.png",
    url: "https://developer.android.com/studio",
    description: "Công cụ phát triển ứng dụng Android chính thức từ Google.",
  },
  {
    name: "Xcode",
    img: "/xcode.png",
    url: "https://developer.apple.com/xcode/",
    description: "Công cụ phát triển ứng dụng iOS chính thức từ Apple.",
  },
];

export interface ProjectData {
  name: string;
  popularity: number;
  username?: string;
  password?: string;
  foundry?: string;
  screenMap?: string;
  document?: string;
}

export const projects: ProjectData[] = [
  {
    name: "outMSteam",
    popularity: 3,
    username: "phuonglnd@rikkeisoft.com",
    password: "q~A2Ub60Ej7,",
    foundry: "",
    screenMap: "",
    document: "",
  },
  {
    name: "jreast",
    popularity: 2,
    username: "longdh@twinger.vn",
    password: "Pass123!",
    foundry: "https://sbp301s.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "kyokeisai",
    popularity: 2,
    username: "LongDH@twinger.vn",
    password: "Rikkei260824#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "LINK",
    document: "LINK",
  },
  {
    name: "office",
    popularity: 2,
    username: "LongDH@twinger.vn",
    password: "Rikkei260824#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "",
    document: "",
  },
  {
    name: "yoda",
    popularity: 3,
    username: "LongDH@twinger.vn",
    password: "Rikkei260824#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "",
    document: "",
  },
  {
    name: "isuzu",
    popularity: 1,
    username: "LongDH@twinger.vn",
    password: "Rikkei260824#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "",
    document: "",
  },
  {
    name: "quotionmypage",
    popularity: 1,
    username: "LongDH@twinger.vn",
    password: "Rikkei260824#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "",
    document: "",
  },
  {
    name: "InspectorWeb",
    popularity: 1,
    username: "LongDH@twinger.vn",
    password: "Rikkei260824#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "metaverse",
    popularity: 3,
    username: "developer@kony.com",
    password: "Kony123!",
    foundry: "https://console-flextest.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "linebousai",
    popularity: 1,
    username: "developer@kony.com",
    password: "Kony123!",
    foundry: "https://console-flextest.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "SafeHub",
    popularity: 1,
    username: "developer@kony.com",
    password: "Kony123!",
    foundry: "https://console-flextest.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "ShelterCheckin",
    popularity: 1,
    username: "developer@kony.com",
    password: "Kony123!",
    foundry: "https://console-flextest.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "hokuden",
    popularity: 2,
    username: "developer@kony.com",
    password: "Kony123!",
    foundry: "https://console-flextest.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "office_ph2",
    popularity: 1,
    username: "quandha@rikkeisoft.com",
    password: "Pass123!",
    foundry: "https://console-firefighting02.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "firefighting",
    popularity: 1,
    username: "LongDH@twinger.vn",
    password: "Pass123!",
    foundry: "https://console-koasbp202shared.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "multicooker",
    popularity: 1,
    username: "LongDH@twinger.vn",
    password: "Pass123!",
    foundry: "https://console-koasbp202shared.madp.tm.softbank.jp",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "jrhm",
    popularity: 3,
    username: "LongDH@twinger.vn",
    password: "Rikkei231023#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "LINK",
    document: "",
  },
  {
    name: "Skill Matching",
    popularity: 3,
    username: "LongDH@twinger.vn",
    password: "Rikkei231023#@",
    foundry: "https://manage.hclvoltmx.com",
    screenMap: "LINK",
    document: "",
  },
];