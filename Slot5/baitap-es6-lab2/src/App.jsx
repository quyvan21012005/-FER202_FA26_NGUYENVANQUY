import {
  Layout,
  WelcomeCard,
  StudentCard,
  CartTable,
  RegisterForm,
  AppButton,
  InputField,
} from './components';
import HomePage from './pages/HomePage';

const sampleStudents = [
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
    <Layout title="Cửa hàng mini - Lab 2 ES6">
      {/* 1. HomePage tổng hợp (Bài 10) */}
      <HomePage />

      <hr className="my-5" />

      {/* 2. Bài 1: Welcome Card */}
      <h3 className="mb-3">Bài 1: WelcomeCard</h3>
      <div className="mb-5">
        <WelcomeCard />
      </div>

      <hr className="my-5" />

      {/* 3. Bài 2: Student Cards */}
      <h3 className="mb-3">Bài 2: StudentCard (Destructuring props)</h3>
      <div className="d-flex gap-3 flex-wrap mb-5">
        {sampleStudents.map((st) => (
          <StudentCard key={st.id} student={st} />
        ))}
      </div>

      <hr className="my-5" />

      {/* 4. Bài 6: AppButton và InputField */}
      <h3 className="mb-3">Bài 6: AppButton và InputField (Spread & Rest)</h3>
      <div className="card p-4 mb-5 shadow-sm" style={{ maxWidth: 500 }}>
        <InputField
          id="contactEmail"
          label="Email liên hệ"
          type="email"
          placeholder="name@example.com"
          required
          helpText="Chúng tôi không bao giờ chia sẻ email của bạn cho người khác."
        />
        <InputField
          id="contactPhone"
          label="Số điện thoại"
          type="tel"
          placeholder="09xx xxx xxx"
        />
        <div className="d-flex gap-2 mt-2">
          <AppButton>Nút mặc định</AppButton>
          <AppButton variant="danger" size="sm">Nút Danger nhỏ</AppButton>
          <AppButton disabled>Nút Disabled</AppButton>
        </div>
      </div>

      <hr className="my-5" />

      {/* 5. Bài 7: Bảng giỏ hàng */}
      <h3 className="mb-3">Bài 7: CartTable (Filter, Sort, Reduce)</h3>
      <CartTable />

      <hr className="my-5"  />

      {/* 6. Bài 8: Form đăng ký */}
      <h3 className="mb-3">Bài 8: RegisterForm (Spread props, Dynamic) </h3>
      <RegisterForm />
    </Layout>
  );
}

export default  App;