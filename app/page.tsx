import { configureStore } from "@reduxjs/toolkit"; 
import {
	todoApi,
} from "../lib/features/todos/todoApi"; 
import Todo from "@/component/todo";
export const revalidate = 2;

// Fungsi untuk fetching data awal di Server Component
async function getInitialTodos() {
	const start = 0;
	const limit = 10;

	// Membuat instance store sementara untuk fetching data di server
	const tempStore = configureStore({
		reducer: {
			[todoApi.reducerPath]: todoApi.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(todoApi.middleware),
	});

	// Melakukan fetching data menggunakan dispatch dari store sementara
	await tempStore.dispatch(
		todoApi.endpoints.getTodos.initiate({ start, limit }),
	);

	// Menunggu hingga fetching selesai
	await Promise.all(tempStore.dispatch(todoApi.util.getRunningQueriesThunk()));

	// Mengambil data dari cache store sementara
	const { data: initialTodos } = todoApi.endpoints.getTodos.select({
		start,
		limit,
	})(tempStore.getState());


  return initialTodos ? [...initialTodos] : [];}

// Komponen halaman utama (Server Component)
export default async function Home() {
	const initialTodos = await getInitialTodos();

	return (
		// Render komponen klien yang akan menangani interaksi dan revalidasi
		<Todo initialTodos={initialTodos} initialPage={0} />
	);
}