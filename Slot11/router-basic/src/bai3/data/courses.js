export const COURSES = [
  {
    code: 'PRF192',
    name: 'Programming Fundamentals',
    credits: 3,
    semester: 'Kỳ 1',
    desc: 'Môn học nền tảng về tư duy lập trình và giải thuật cơ bản sử dụng ngôn ngữ C.',
  },
  {
    code: 'WED201c',
    name: 'Web Design',
    credits: 3,
    semester: 'Kỳ 2',
    desc: 'Thiết kế giao diện website hiện đại chuẩn Responsive với HTML5, CSS3 và Bootstrap.',
  },
  {
    code: 'PRO192',
    name: 'Object-Oriented Programming',
    credits: 3,
    semester: 'Kỳ 2',
    desc: 'Lập trình hướng đối tượng nâng cao, cấu trúc dữ liệu và xử lý ngoại lệ với Java.',
  },
  {
    code: 'FER202',
    name: 'Front-End Web Development with React',
    credits: 3,
    semester: 'Kỳ 5',
    desc: 'Xây dựng ứng dụng SPA chuyên nghiệp với ReactJS, Hooks, Context API và React Router.',
  },
  {
    code: 'SWP391',
    name: 'Software Development Project',
    credits: 3,
    semester: 'Kỳ 5',
    desc: 'Dự án thực tế làm việc nhóm theo quy trình Agile/Scrum phát triển phần mềm hoàn chỉnh.',
  },
];

export const findCourse = (code) => {
  if (!code) return null;
  return COURSES.find((c) => c.code.toLowerCase() === code.toLowerCase()) ?? null;
};
