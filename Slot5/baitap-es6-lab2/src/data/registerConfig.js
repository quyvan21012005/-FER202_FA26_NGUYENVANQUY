export const fields = [
  { id: 'fullName', label: 'Họ và tên', type: 'text', placeholder: 'Nguyễn Văn A', required: true },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'name@example.com', required: true },
  { id: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Ít nhất 8 ký tự', required: true, helpText: 'Dùng cả chữ và số' },
  { id: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: '09xx xxx xxx' },
  { id: 'birthday', label: 'Ngày sinh', type: 'date' },
  { id: 'address', label: 'Địa chỉ', type: 'text' },
];

export const genders = ['Nam', 'Nữ', 'Khác'];
export const majors = ['Software Engineering', 'Artificial Intelligence', 'Digital Marketing'] ;