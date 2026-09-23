import AppButton from './components/AppButton';
import InputField from './components/InputField';

function App() {
  return (
    <div className="container my-5" style={{ maxWidth: 500 }}>
      <h3 className="mb-4">Bài 6: AppButton và InputField</h3>
      <InputField
        id="contactEmail"
        label="Email liên hệ"
        type="email"
        placeholder="name@example.com"
        required
        helpText="Chúng tôi không bao giờ chia sẻ email của bạn."
      />
      <InputField
        id="contactPhone"
        label="Số điện thoại"
        type="tel"
        placeholder="09xx xxx xxx"
      />
      <div className="d-flex gap-2 mt-3">
        <AppButton>Mặc định</AppButton>
        <AppButton variant="danger" size="sm">Nút Danger nhỏ</AppButton>
        <AppButton disabled>Nút khóa</AppButton>
      </div>
    </div>
  );
}

export default App;