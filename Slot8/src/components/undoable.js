const HISTORY_LIMIT = 20;

// Higher-order reducer: nhận một reducer, trả về reducer mới có thêm UNDO/REDO
export const undoable = (reducer) => (state, action) => {
  const { past, present, future } = state;

  switch (action.type) {
    case 'UNDO': {
      if (past.length === 0) return state;
      return {
        past: past.slice(0, -1),
        present: past[past.length - 1],
        future: [present, ...future],
      };
    }
    case 'REDO': {
      if (future.length === 0) return state;
      return {
        past: [...past, present],
        present: future[0],
        future: future.slice(1),
      };
    }
    default: {
      const newPresent = reducer(present, action);
      if (newPresent === present) return state; // action không làm gì → không ghi lịch sử
      return {
        past: [...past, present].slice(-HISTORY_LIMIT),
        present: newPresent,
        future: [], // có thay đổi mới thì bỏ nhánh redo
      };
    }
  }
};

export const createHistory = (present) => ({ past: [], present, future: [] });
