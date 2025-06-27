'use client';

import TodoItem from './TodoItem';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (todo: Todo) => void;
}

export default function TodoList({ todos, onToggleTodo }: TodoListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <ul className="space-y-3">
        {todos.map((todo, index) => (
          <TodoItem 
            key={todo._id || index} 
            todo={todo} 
            onToggle={onToggleTodo} 
          />
        ))}
      </ul>
    </div>
  );
}
