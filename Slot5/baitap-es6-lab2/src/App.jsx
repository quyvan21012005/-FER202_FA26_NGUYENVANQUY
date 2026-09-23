import StudentCard from './components/StudentCard';

const students = [
  {
    id: 'SE1701',
    name: 'Nguyễn Văn An',
    major: 'Software Engineering',
    gpa: 8.5,
    avatar: 'https://i.pravatar.cc/200?img=12',
    contact: { email: 'an.nv@fpt.edu.vn', phone: '0901 234 567' },
  },
  {
    id: 'SE1702',
    name: 'Trần Thị Bình',
    major: 'Artificial Intelligence',
    gpa: 8.8,
    avatar: 'https://i.pravatar.cc/200?img=5',
    contact: { email: 'binh.tt@fpt.edu.vn', phone: '0912 345 678' },
  },
  {
    id: 'SE1703',
    name: 'Lê Hoàng Cường',
    major: 'Digital Marketing',
    gpa: 7.9,
    avatar: 'https://i.pravatar.cc/200?img=8',
    contact: { email: 'cuong.lh@fpt.edu.vn', phone: '0987 654 321' },
  },
];

function App() {
  return (
    <div className="container my-5">
      <h3 className="mb-4">Danh sách sinh viên (Bài 2)</h3>
      <div className="d-flex gap-3 flex-wrap">
        {students.map((st) => (
          <StudentCard key={st.id} student={st} />
        ))}
      </div>
    </div>
  );
}

export default App;