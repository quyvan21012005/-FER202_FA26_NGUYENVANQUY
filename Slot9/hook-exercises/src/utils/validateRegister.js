const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^0\d{9}$/;

export const validateRegister = (values) => {
  const errors = {};
  const fullName = values.fullName.trim();

  if (!fullName) errors.fullName = 'Vui lòng nhập họ tên';
  else if (fullName.length < 3) errors.fullName = 'Họ tên phải có ít nhất 3 ký tự';

  if (!values.email.trim()) errors.email = 'Vui lòng nhập email';
  else if (!EMAIL_REGEX.test(values.email)) errors.email = 'Email không đúng định dạng';

  if (!values.password) errors.password = 'Vui lòng nhập mật khẩu';
  else if (values.password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
    errors.password = 'Mật khẩu phải có cả chữ và số';

  if (!values.confirmPassword) errors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
  else if (values.confirmPassword !== values.password)
    errors.confirmPassword = 'Mật khẩu nhập lại không khớp';

  // Không bắt buộc: chỉ kiểm tra khi người dùng có nhập
  const phone = values.phone.replace(/\s/g, '');
  if (phone && !PHONE_REGEX.test(phone)) errors.phone = 'Số điện thoại gồm 10 số, bắt đầu bằng 0';

  if (values.birthday) {
    const age = new Date().getFullYear() - new Date(values.birthday).getFullYear();
    if (age < 16) errors.birthday = 'Bạn phải từ 16 tuổi trở lên';
  }

  if (!values.major) errors.major = 'Vui lòng chọn chuyên ngành';
  if (!values.agree) errors.agree = 'Bạn cần đồng ý điều khoản';

  return errors;
};
