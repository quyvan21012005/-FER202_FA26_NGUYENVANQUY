export const COURSES = [
  { id: 'react', name: 'ReactJS cơ bản', fee: 2500000 },
  { id: 'node', name: 'NodeJS & Express', fee: 3000000 },
  { id: 'fullstack', name: 'Fullstack MERN', fee: 5000000 },
];

export const SCHEDULES = ['Sáng 2-4-6', 'Tối 3-5-7', 'Cuối tuần'];

export const STEPS = ['Thông tin', 'Khóa học', 'Xác nhận'];

// Trường thuộc từng bước: NEXT chỉ kiểm tra các trường của bước hiện tại
const STEP_FIELDS = [
  ['fullName', 'email', 'phone'],
  ['courseId', 'schedule'],
  ['agree'],
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateField = (name, values) => {
  const v = values[name];
  switch (name) {
    case 'fullName':
      return v && v.trim().length >= 3 ? '' : 'Họ tên ít nhất 3 ký tự';
    case 'email':
      return v && EMAIL_REGEX.test(v) ? '' : 'Email không hợp lệ';
    case 'phone':
      return v && /^0\d{9}$/.test(v) ? '' : 'Số điện thoại gồm 10 số, bắt đầu bằng 0';
    case 'courseId':
      return v ? '' : 'Chọn một khóa học';
    case 'schedule':
      return v ? '' : 'Chọn lịch học';
    case 'agree':
      return v ? '' : 'Bạn cần xác nhận thông tin';
    default:
      return '';
  }
};

const validateStep = (step, values) =>
  STEP_FIELDS[step].reduce((errors, name) => {
    const message = validateField(name, values);
    return message ? { ...errors, [name]: message } : errors;
  }, {});

export const initWizard = (initialCourseId) => ({
  step: 0,
  maxVisited: 0,
  values: {
    fullName: '',
    email: '',
    phone: '',
    courseId: initialCourseId ?? '',
    schedule: '',
    agree: false,
  },
  errors: {},
  submitted: false,
});

export const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE': {
      const { name, value } = action.payload;
      const nextValues = { ...state.values, [name]: value };
      // Nếu trường đang có lỗi, kiểm tra lại ngay khi người dùng sửa
      const nextErrors = { ...state.errors };
      if (state.errors[name]) {
        const message = validateField(name, nextValues);
        if (message) nextErrors[name] = message;
        else delete nextErrors[name];
      }
      return { ...state, values: nextValues, errors: nextErrors };
    }
    case 'NEXT': {
      const errors = validateStep(state.step, state.values);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      const nextStep = state.step + 1;
      return {
        ...state,
        step: nextStep,
        maxVisited: Math.max(state.maxVisited, nextStep),
        errors: {},
      };
    }
    case 'BACK':
      return { ...state, step: Math.max(0, state.step - 1), errors: {} };
    case 'GO_TO':
      // Chỉ nhảy tới bước đã từng tới
      return action.payload <= state.maxVisited
        ? { ...state, step: action.payload, errors: {} }
        : state;
    case 'SUBMIT': {
      const errors = validateStep(state.step, state.values);
      if (Object.keys(errors).length > 0) return { ...state, errors };
      return { ...state, submitted: true };
    }
    case 'RESET':
      return initWizard(action.payload);
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};
