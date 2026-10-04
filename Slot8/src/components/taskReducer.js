export const COLUMNS = [
  { key: 'todo', title: 'Cần làm' },
  { key: 'doing', title: 'Đang làm' },
  { key: 'done', title: 'Hoàn thành' },
];

const ORDER = ['todo', 'doing', 'done'];

export const TASK_ACTIONS = {
  ADD: 'tasks/add',
  MOVE: 'tasks/move',
  RENAME: 'tasks/rename',
  DELETE: 'tasks/delete',
  CLEAR_DONE: 'tasks/clearDone',
};

export const initialTaskState = {
  nextId: 4,
  tasks: [
    { id: 1, title: 'Đọc lý thuyết useReducer', priority: 'high', column: 'done' },
    { id: 2, title: 'Làm bài Kanban', priority: 'high', column: 'doing' },
    { id: 3, title: 'Ôn lại spread operator', priority: 'low', column: 'todo' },
  ],
};

// Action creators: gom việc tạoo action vào một chỗ
export const addTask = (title, priority) => ({
  type: TASK_ACTIONS.ADD,
  payload: { title, priority },
});

export const moveTask = (id, direction) => ({
  type: TASK_ACTIONS.MOVE,
  payload: { id, direction },
});

export const renameTask = (id, title) => ({
  type: TASK_ACTIONS.RENAME,
  payload: { id, title },
});

export const deleteTask = (id) => ({
  type: TASK_ACTIONS.DELETE,
  payload: id,
});

export const clearDone = () => ({ type: TASK_ACTIONS.CLEAR_DONE });

export const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.ADD: {
      const title = action.payload.title.trim();
      if (!title) return state;
      const task = { id: state.nextId, title, priority: action.payload.priority, column: 'todo' };
      return { nextId: state.nextId + 1, tasks: [...state.tasks, task] };
    }
    case TASK_ACTIONS.MOVE: {
      const { id, direction } = action.payload;
      return {
        ...state,
        tasks: state.tasks.map((t) => {
          if (t.id !== id) return t;
          const nextIndex = ORDER.indexOf(t.column) + direction;
          if (nextIndex < 0 || nextIndex >= ORDER.length) return t;
          return { ...t, column: ORDER[nextIndex] };
        }),
      };
    }
    case TASK_ACTIONS.RENAME: {
      const title = action.payload.title.trim();
      if (!title) return state;
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? { ...t, title } : t)),
      };
    }
    case TASK_ACTIONS.DELETE:
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case TASK_ACTIONS.CLEAR_DONE:
      return { ...state, tasks: state.tasks.filter((t) => t.column !== 'done') };
    default:
      throw new Error(`Action không hợp lệ: ${action.type}`);
  }
};
