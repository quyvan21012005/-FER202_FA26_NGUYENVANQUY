export const initialCart = { items: [] }; // item: { id, name, price, qty }

export function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const exist = state.items.find((i) => i.id === action.payload.id);
      if (exist) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.payload.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: 1 }] };
    }
    case "DECREASE":
      return {
        ...state,
        items: state.items
          .map((i) => (i.id === action.payload ? { ...i, qty: i.qty - 1 } : i))
          .filter((i) => i.qty > 0),
      };
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "CLEAR":
      return initialCart;
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
}
