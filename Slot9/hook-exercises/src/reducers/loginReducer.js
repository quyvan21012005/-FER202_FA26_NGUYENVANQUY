const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateLogin = ({ email = '', password = '' }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Vui lòng nhập email';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Email không đúng định dạng';
  if (!password) errors.password = 'Vui lòng nhập mật khẩu';
  else if (password.length < 8) errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
  return errors;
};

export const initialLoginState = {
  values: { email: '', password: '', remember: false },
  errors: {},
  touched: {},
  status: 'idle', // 'idle' | 'submitting' | 'success' | 'error'
  message: '',
};

export const loginReducer = (state, action) => {
  switch (action.type) {
    case 'CHANGE_FIELD': {
      const { name, value } = action.payload;
      const values = { ...state.values, [name]: value };
      return {
        ...state,
        values,
        errors: validateLogin(values),
        status: state.status === 'error' ? 'idle' : state.status,
        message: '',
      };
    }
    case 'BLUR_FIELD':
      return { ...state, touched: { ...state.touched, [action.payload]: true } };

    case 'SUBMIT': {
      const errors = validateLogin(state.values);
      const hasError = Object.keys(errors).length > 0;
      return {
        ...state,
        errors,
        touched: { email: true, password: true },
        status: hasError ? 'idle' : 'submitting',
      };
    }
    case 'LOGIN_SUCCESS':
      return { ...state, status: 'success', message: `Xin chào ${action.payload}!` };

    case 'LOGIN_FAILURE':
      return { ...state, status: 'error', message: action.payload };

    case 'RESET':
      return initialLoginState;

    default:
      return state;
  }
};
