# Next.js Todo App with RTKQ and ISR

This repository contains a simple Todo application built using Next.js, Redux Toolkit Query (RTKQ), and TypeScript.  
The application is designed to display a list of tasks, allow adding new tasks, and change task completion status, focusing on a fast and efficient user experience.

---

## Features

- **Next.js App Router**: Utilizes the latest Next.js routing model for optimized performance with Server and Client Components.
- **Incremental Static Regeneration (ISR)**: Implemented for fast page loads and fresh content without full rebuilds.
- **Redux Toolkit Query (RTKQ)**: Manages client-side data state and data fetching, handling caching, loading states, and error handling automatically.
- **Optimistic Updates**: Provides instant user feedback for adding and updating tasks by immediately applying changes to the client-side cache.
- **Pagination**: Displays tasks in paginated format, fetching 10 items per page.
- **TypeScript**: Ensures type safety and improves code quality.
- **Tailwind CSS**: Used for all styling, enabling rapid and responsive UI development.

---

## Implementation Approach

### Next.js App Router:

- The application leverages the App Router, allowing a mix of Server Components and Client Components for efficient data fetching and rendering.
- The main page (`app/page.tsx`) is a Server Component responsible for pre-rendering initial data.

### Incremental Static Regeneration (ISR):

- ISR is enabled by `export const revalidate = 60;` in `app/page.tsx`.  
  This ensures the HTML page is generated at build time and then regenerated in the background at most every 60 seconds (or the specified interval) on subsequent requests.  
  This reduces server load and provides fresh content.

### Redux Toolkit Query (RTKQ):

- RTKQ is the core for client-side data management, interacting with `https://jsonplaceholder.typicode.com/` for CRUD operations.
- An API Slice (`lib/features/todos/todoApi.ts`) defines `getTodos` (query) and `addTodo`, `updateTodo` (mutations).
- `providesTags` and `invalidatesTags` are used for intelligent cache management, ensuring the UI reflects the latest data.

### Optimistic Updates:

- For `addTodo` and `updateTodo` mutations, `onQueryStarted` is used to immediately update the client-side cache before the API response.  
  This provides instant visual feedback.

> **Note on Mock API**:  
> Since `jsonplaceholder.typicode.com` is a mock API and does not persist data, optimistically added tasks will disappear on a full refetch (if `invalidatesTags` were enabled for `addTodo`).  
> For demonstration purposes of optimistic updates, `invalidatesTags` for `addTodo` is commented out.  
> In a real-world application with a persistent backend, `invalidatesTags` should be re-enabled to ensure data consistency.

### Pagination:

- The API supports `_start` and `_limit` query parameters for pagination, fetching 10 items per page.
- Client-side state manages the current page, triggering new data fetches via RTKQ.

---

## Project Structure

```
.
├── app/
│   ├── layout.tsx             # Root application layout, provides Redux StoreProvider
│   ├── StoreProvider.tsx      # Client component wrapping app with Redux Provider
│   └── page.tsx               # Main page (Server Component), initial data fetching & renders HomePageClient
├── lib/
│   ├── features/
│   │   └── todos/
│   │       └── todoApi.ts     # RTKQ API slice for all todo operations
│   ├── hooks.ts               # Custom hooks for useAppDispatch and useAppSelector
│   └── store.ts               # Redux store configuration
├── .env.local                 # Environment variables (e.g., NEXT_PRIVATE_DEBUG_CACHE)
├── next.config.ts
├── package.json
├── tsconfig.json
└── ... (other Next.js files)
```

---

## How to Run the Project

### Clone the Repository

```bash
git clone https://github.com/dwikurniawan91/-DwiKurniawan-_FrontEndTest_EZV.git
cd -DwiKurniawan-_FrontEndTest_EZV
```

### Install Dependencies

```bash
npm install
# or
yarn
```

### Add Environment Variable (Optional, for ISR Debugging)

Create a `.env.local` file in the root of your project and add:

```env
NEXT_PRIVATE_DEBUG_CACHE=1
```

### Run the Application

#### For Development:

```bash
npm run dev
```

(This will run the development server, which might not fully demonstrate ISR behavior as in production).

#### For Production Mode (to test ISR behavior fully):

```bash
npm run build
npm run start
```

Access the application at [http://localhost:3000](http://localhost:3000) after running the command.
