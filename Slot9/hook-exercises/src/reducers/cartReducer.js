import { getFinalPrice } from '../utils/format';

export const MAX_QUANTITY = 10;

export const CART_ACTIONS = {
  ADD: 'cart/add',
  INCREASE: 'cart/increase',
  DECREASE: 'cart/decrease',
  REMOVE: 'cart/remove',
  CLEAR: 'cart/clear',
};

export const initialCart = { items: [] };

export const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
              : item,
          ),
        };
      }
      const newItem = {
        id: product.id,
        name: product.name,
        price: getFinalPrice(product),
        quantity: 1,
      };
      return { ...state, items: [...state.items, newItem] };
    }

    case CART_ACTIONS.INCREASE:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? { ...item, quantity: Math.min(item.quantity + 1, MAX_QUANTITY) }
            : item,
        ),
      };

    case CART_ACTIONS.DECREASE:
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0), // giảm về 0 thì tự xóa
      };

    case CART_ACTIONS.REMOVE:
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };

    case CART_ACTIONS.CLEAR:
      return initialCart;

    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};

// Selector: tính số liệu từ state, không lưu vào state
export const getCartTotals = ({ items }) => ({
  totalQuantity: items.reduce((sum, { quantity }) => sum + quantity, 0),
  totalPrice: items.reduce((sum, { price, quantity }) => sum + price * quantity, 0),
});
