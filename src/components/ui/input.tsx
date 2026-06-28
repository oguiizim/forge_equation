import type * as React from "react";

import { cn } from "#/lib/utils.ts";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"h-12 w-full min-w-0 rounded-2xl border border-amber-200 bg-white px-4 py-2 text-base text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-[color,box-shadow,background-color,border-color] outline-none placeholder:text-slate-400 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus:border-amber-400 focus:ring-4 focus:ring-amber-200/50 md:text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-amber-400 dark:focus:ring-amber-500/20",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
