import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ITodo } from "@/types/types";

export const todoApi = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://jsonplaceholder.typicode.com/",
	}),
	tagTypes: ["Todo"],
	endpoints: (builder) => ({
		getTodos: builder.query<ITodo[], { start: number; limit: number }>({
			query: ({ start, limit }) => `/todos?_start=${start}&_limit=${limit}`,
			providesTags: (result, error, { start, limit }) =>
				result
					? [
							...result.map(({ id }) => ({ type: "Todo" as const, id })),
							{ type: "Todo", id: "LIST" },
						]
					: [{ type: "Todo", id: "LIST" }],
		}),
		addTodo: builder.mutation<ITodo, Omit<ITodo, "id" | "completed">>({
			query: (newTodo) => ({
				url: "todos",
				method: "POST",
				body: newTodo,
			}),
			invalidatesTags: [{ type: "Todo", id: "LIST" }],
		}),
	}),
});

// Export the auto-generated hooks
export const { useGetTodosQuery, useAddTodoMutation } = todoApi;
