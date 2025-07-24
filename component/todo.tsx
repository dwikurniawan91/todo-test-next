"use client";
import {  useState } from "react";
import {
	useAddTodoMutation,
	useGetTodosQuery,
} from "@/lib/features/todos/todoApi";
import type { ITodo } from "@/types/types";

export default function Todo({
	initialTodos,
	initialPage,
}: {
	initialTodos: ITodo[];
	initialPage: number;
}) {
	const [page, setPage] = useState<number>(initialPage || 0);
	const limit = 10;

	const {
		data: todos,
		error,
		isLoading,
		isFetching,
	} = useGetTodosQuery(
		{ start: page * limit, limit },
		{
			selectFromResult: ({ data, ...rest }) => ({
				data: data || initialTodos,
				...rest,
			}),
		},
	);

	const [addTodo, { isLoading: isAdding }] = useAddTodoMutation();
	const [newTodoTitle, setNewTodoTitle] = useState<string>("");
	const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	const handleAddTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoTitle.trim()) {
			setErrorMessage("Judul todo tidak boleh kosong.");
			setShowErrorModal(true);
			return;
		}
		try {
			await addTodo({
				title: newTodoTitle,
				userId: 1,
			}).unwrap();
			setNewTodoTitle("");
		} catch (err: any) {
			setErrorMessage("Gagal menambahkan todo. Silakan coba lagi.");
			setShowErrorModal(true);
			console.error("Failed to add todo:", err);
		}
	};

	const handleNextPage = () => {
		setPage((prevPage) => prevPage + 1);
	};

	const handlePrevPage = () => {
		setPage((prevPage) => Math.max(0, prevPage - 1));
	};

	
  const showSpinner = isFetching && (page !== initialPage || !todos || todos.length === 0);

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 font-inter">
			<div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 space-y-8">
				<h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
					Todo List
				</h1>

				<form
					onSubmit={handleAddTodo}
					className="flex flex-col sm:flex-row gap-4 mb-8"
				>
					<input
						type="text"
						id="newTodoTitle"
						value={newTodoTitle}
						onChange={(e) => setNewTodoTitle(e.target.value)}
						className="flex-grow px-5 text-gray-800 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-lg placeholder-gray-500"
						placeholder="Add new todo..."
						disabled={isAdding}
					/>
					<button
						type="submit"
						className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold text-lg rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={isAdding}
					>
						{isAdding ? "Adding..." : "Add"}
					</button>
				</form>

				{(showSpinner) && (
					<div className="flex justify-center items-center py-10">
						<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
						<p className="ml-4 text-xl text-gray-600">Memuat tugas...</p>
					</div>
				)}

				{error && (
					<div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative text-center text-lg shadow-md">
						<strong className="font-bold">Error!</strong>
						<span className="block sm:inline ml-2">
							Gagal memuat tugas: "Terjadi kesalahan."
						</span>
					</div>
				)}

				{!showSpinner && todos && todos.length > 0 && (
					<ul className="space-y-4">
						{todos.map((todo) => (
							<li
								key={todo.id}
								className="flex items-center justify-between p-5 bg-gray-50 rounded-lg shadow-md hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1"
							>
								<span
									className={`text-xl font-medium ${
										todo.completed
											? "line-through text-gray-500"
											: "text-gray-800"
									}`}
								>
									{todo.title}
								</span>
								<span
									className={`px-4 py-2 rounded-full text-sm font-semibold ${
										todo.completed
											? "bg-green-200 text-green-800"
											: ""
									}`}
								>
									{todo.completed ? "Completed" : ""}
								</span>
							</li>
						))}
					</ul>
				)}

				{!showSpinner && (!todos || todos.length === 0) && (
					<div className="text-center text-gray-600 text-xl py-10">
						'(Empty todo list)'
					</div>
				)}

				<div className="flex justify-between items-center mt-8">
					<button
						onClick={handlePrevPage}
						disabled={page === 0 || isLoading || isFetching}
						className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						Previous
					</button>
					<span className="text-xl font-semibold text-gray-700">
						Page {page + 1}
					</span>
					<button
						onClick={handleNextPage}
						disabled={isLoading || isFetching}
						className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300"
					>
						Next
					</button>
				</div>
			</div>

			{showErrorModal && (
				<div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
					<div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md space-y-6 transform scale-100 transition-transform duration-300 ease-out">
						<h2 className="text-3xl font-bold text-red-600 text-center">
							Error!
						</h2>
						<p className="text-lg text-gray-700 text-center">{errorMessage}</p>
						<div className="flex justify-center">
							<button
								onClick={() => setShowErrorModal(false)}
								className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-red-300"
							>
								Tutup
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
