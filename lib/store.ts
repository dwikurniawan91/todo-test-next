import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { todoApi } from "./features/todos/todoApi";
export const store = configureStore({
	reducer: {
		[todoApi.reducerPath]: todoApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(todoApi.middleware),
});

// Menyiapkan listener untuk RTKQ
setupListeners(store.dispatch);

// Mendefinisikan RootState dan AppDispatch untuk tipe yang lebih baik
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
