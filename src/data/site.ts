// Thông tin lấy từ CV. Điện thoại, ngày sinh, địa chỉ cố ý không đưa lên trang công khai.
export const profile = {
  name: "Võ Viết Minh",
  title: "Full-stack Developer",
  roles: ["Full-stack Developer", "Web Application Builder", "AI Agent Explorer"],
  headline: "Biến ý tưởng thành sản phẩm công nghệ.",
  intro:
    "Tôi yêu thích xây dựng những sản phẩm công nghệ hữu ích, từ giao diện người dùng đến hệ thống phía máy chủ. Không ngừng học hỏi, thử nghiệm và biến ý tưởng thành sản phẩm thực tế.",
  email: "vovietminh2005@gmail.com",
  github: "https://github.com/0971772997",
  linkedin: "https://www.linkedin.com/in/minh-vo-viet-7a19183ba",
  cv: "/documents/cv.pdf",
};

export const about = [
  { t: "Định hướng", d: "Full-stack Developer, quan tâm cả Frontend lẫn Backend." },
  { t: "Xây dựng", d: "Phát triển ứng dụng web từ giao diện đến API và cơ sở dữ liệu." },
  { t: "Tư duy", d: "Chia nhỏ vấn đề, thử nghiệm nhanh và học từ kết quả." },
  { t: "Quan tâm", d: "AI, Deep Learning và các hệ thống AI Agent." },
];

export const skills: { group: string; items: string[] }[] = [
  { group: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "React Query", "Redux Toolkit"] },
  { group: "Backend", items: ["Node.js", "NestJS", "Python", "Django", "Express.js", "REST API", "JWT"] },
  { group: "Database", items: ["PostgreSQL", "MySQL", "Prisma", "MongoDB"] },
  { group: "Mobile", items: ["Flutter", "React Native"] },
  { group: "Tools", items: ["Git", "GitHub", "Docker", "VS Code"] },
  { group: "AI & Research", items: ["Python", "Deep Learning", "NLP", "ASR", "LLM", "AI Agent"] },
];

export type CustomLink = {
  label: string;
  url: string;
};

export type Project = {
  id?: string;
  image?: string | null;
  images?: string[];
  links?: CustomLink[];
  slug: string;
  name: string;
  summary: string;
  tech: string[];
  role: string;
  features: string[];
  repo: string | null;
  demo: string | null;
  sort?: number;
  created_at?: string;
};

export const projects: Project[] = [
  { slug: "pawbound", name: "Pawbound",
    summary: "Đang cập nhật mô tả.",
    tech: ["Đang cập nhật"], role: "Đang cập nhật",
    features: ["Đang cập nhật"], repo: null, demo: null, images: [], links: [] },
  { slug: "ecommerce", name: "Ecommerce Platform",
    summary: "Hệ thống thương mại điện tử với Backend xây dựng bằng NestJS.",
    tech: ["NestJS", "Prisma", "PostgreSQL", "Docker"], role: "Thiết kế và phát triển Backend",
    features: ["Authentication và Authorization", "Quản lý người dùng và phân quyền", "Quản lý danh mục, thương hiệu", "Quản lý sản phẩm", "Upload hình ảnh", "API quản lý dữ liệu"],
    repo: null, demo: null, images: [], links: [] },
  { slug: "ai-software-company", name: "AI Software Company",
    summary: "Hệ thống AI Agent hỗ trợ tự động hóa quy trình phát triển phần mềm.",
    tech: ["Python", "LiteLLM", "LLM", "Multi-Agent"], role: "Thiết kế kiến trúc và phát triển",
    features: ["AI Orchestrator", "Phân chia nhiệm vụ", "AI Agent Collaboration", "Quản lý quy trình", "Kiểm thử và đánh giá kết quả"],
    repo: null, demo: null, images: [], links: [] },
  { slug: "ai-youtube", name: "AI Youtube",
    summary: "Đang cập nhật mô tả.",
    tech: ["Đang cập nhật"], role: "Đang cập nhật",
    features: ["Đang cập nhật"], repo: null, demo: null, images: [], links: [] },
  { slug: "maxping-media", name: "Công ty Maxping Media",
    summary: "Website doanh nghiệp và giải pháp truyền thông số cho Công ty Maxping Media.",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"], role: "Phát triển Web & Triển khai",
    features: ["Giới thiệu dịch vụ và hồ sơ năng lực", "Tối ưu tốc độ tải trang và trải nghiệm người dùng", "Tương thích đa thiết bị"],
    repo: "https://github.com/0971772997/Cong-ty-MAXPING-Media",
    demo: "http://maxping-media.duckdns.org/",
    images: [],
    links: [] },
  { slug: "event-booking", name: "Event Booking App",
    summary: "Đang cập nhật mô tả.",
    tech: ["Đang cập nhật"], role: "Đang cập nhật",
    features: ["Đang cập nhật"], repo: null, demo: null, images: [], links: [] },
];

export type ExperienceItem = {
  id?: string;
  period: string;
  place: string;
  role: string;
  points: string[];
  images?: string[];
  links?: CustomLink[];
  sort?: number;
  created_at?: string;
};

export const timeline: ExperienceItem[] = [
  { period: "03/2026 – nay", place: "Tinfiniq AI Studio (Seoul, Hàn Quốc)", role: "Cộng tác viên dữ liệu AI (Crowd)",
    points: ["Xử lý bộ dữ liệu 3D phức tạp (như Mobis_BEV_OD) để huấn luyện mô hình AI, đạt độ chính xác 95%.", "Tối ưu quy trình xử lý dữ liệu, tăng hiệu suất của nhóm 25%."],
    images: [], links: [] },
  { period: "05/2026 – 08/2026", place: "AZ Homes Business Development Consulting", role: "Thực tập, phát triển web",
    points: ["Xây dựng website giới thiệu công ty, khóa đào tạo, tuyển dụng và dịch vụ số.", "Phát triển tính năng quản lý hồ sơ học viên, khóa học, tuyển dụng và tin tức."],
    images: [], links: [] },
  { period: "07/2025 – 08/2025", place: "TNHH Lisod Việt Nam (Hà Nội)", role: "Web Developer",
    points: ["Cùng nhóm Agile 5 người thiết kế và phát triển nền tảng thương mại điện tử.", "Tối ưu điều hướng, tăng thời gian phiên truy cập trung bình 20% trong 2 tháng."],
    images: [], links: [] },
  { period: "05/2025 – 07/2025", place: "Nam Việt Software Company (Đà Nẵng)", role: "Web Developer",
    points: ["Xây dựng và ra mắt website doanh nghiệp bằng WordPress, tăng tốc độ tải trang 30%.", "Kết hợp UI với chiến lược bán hàng, góp phần tăng 15% khách hàng tiềm năng."],
    images: [], links: [] },
  { period: "03/2024 – 07/2025", place: "BEEWORK AI (Hà Nội)", role: "Team Lead, cộng tác viên dữ liệu AI",
    points: ["Dẫn dắt và đào tạo nhóm hơn 5 người trong 3 dự án gán nhãn dữ liệu.", "Hoàn thành 100% mốc tiến độ, giữ độ chính xác dữ liệu 98%."],
    images: [], links: [] },
  { period: "2023 – 2027 (dự kiến)", place: "Đại học Đông Á", role: "Sinh viên Kỹ thuật phần mềm",
    points: ["Cấu trúc dữ liệu và giải thuật, OOP, cơ sở dữ liệu, kiến trúc phần mềm, lập trình di động."],
    images: [], links: [] },
];

export type CertificateItem = {
  id?: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  desc?: string;
  image: string;
  link?: string | null;
  sort?: number;
  created_at?: string;
  w?: number;
  h?: number;
};

export const certificates: CertificateItem[] = [
  { title: "Thành viên đạt KPI xanh", issuer: "AZ Media (AZ Homes), Đà Nẵng", date: "25/07/2026",
    description: "Được ghi nhận và tuyên dương vì đóng góp tích cực, tinh thần trách nhiệm cao và hoàn thành tốt nhiệm vụ được giao trong kỳ thực tập.",
    desc: "Được ghi nhận và tuyên dương vì đóng góp tích cực, tinh thần trách nhiệm cao và hoàn thành tốt nhiệm vụ được giao trong kỳ thực tập.",
    image: "/images/certificates/az-media-kpi-xanh.png", link: null, w: 904, h: 1280 },
];
