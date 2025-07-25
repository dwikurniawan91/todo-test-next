"use client"; // Ini adalah komponen klien

import { Provider } from "react-redux";
import { store } from "../lib/store";

export function StoreProvider({ children }: { children: React.ReactNode }) {
	return <Provider store={store}>{children}</Provider>;
}
