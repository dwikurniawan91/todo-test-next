import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const todoApi = createApi({
  reducerPath: 'todoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com/' }),
  tagTypes: ['Todos'],
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], { start: number; limit: number }>({
      query: ({ start, limit }) => `todos?_start=${start}&_limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Todos' as const, id: String(id) })),
              { type: 'Todos' as const, id: 'LIST' },
            ]
          : [{ type: 'Todos' as const, id: 'LIST' }],
    }),
    addTodo: builder.mutation<Todo, Omit<Todo, 'id' | 'completed'>>({
      query: (newTodo) => ({
        url: 'todos',
        method: 'POST',
        body: newTodo,
      }),
      async onQueryStarted(newTodoData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          todoApi.util.updateQueryData('getTodos', { start: 0, limit: 10 }, (draft) => {
            const optimisticId = Math.random(); 
            const optimisticTodo: Todo = { ...newTodoData, id: optimisticId, completed: false };
            draft.unshift(optimisticTodo); 

            if (draft.length > 10) {
              draft.pop();
            }
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();
          console.error('Gagal menambahkan todo secara optimistis:', error);
        }
      },
      invalidatesTags: [{ type: 'Todos' as const, id: 'LIST' }],
    }),
  }),
});

export const { useGetTodosQuery, useAddTodoMutation } = todoApi;
