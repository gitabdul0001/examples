'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { modelenceQuery, modelenceMutation } from 'modelence/client';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

export default function Home() {
  const { data: todos, refetch: refetchTodos, isFetching, error } = useQuery(modelenceQuery<Todo[]>('todos.getAll'));
  const { mutateAsync: setCompleted } = useMutation(modelenceMutation('todos.setCompleted'));

  if (isFetching) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!todos) return <div>No todos found</div>;

  const toggleTodo = async (todo: Todo) => {
    await setCompleted({ id: todo._id, completed: !todo.completed });
    refetchTodos();
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-foreground">My Todo List</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <ul className="space-y-3">
            {todos.map((todo, index) => (
              <li 
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                    {todo.title}
                  </span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  todo.completed 
                    ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                }`}>
                  {todo.completed ? 'Completed' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
