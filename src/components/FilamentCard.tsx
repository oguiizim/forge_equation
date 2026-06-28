import { Trash2 } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";

export interface Filament {
	id: string;
	pricePerKg: number;
	grams: number;
}

interface FilamentCardProps {
	index: number;
	filament: Filament;
	onChange: (index: number, field: keyof Filament, value: number) => void;
	onRemove: (index: number) => void;
}

export function FilamentCard({
	index,
	filament,
	onChange,
	onRemove,
}: FilamentCardProps) {
	const filamentCost = (filament.pricePerKg / 1000) * filament.grams;

	return (
		<div className="rounded-[26px] border border-amber-200 bg-amber-50/75 p-4 shadow-[0_18px_35px_rgba(15,23,42,0.05)] dark:border-slate-800 dark:bg-slate-950/55">
			<div className="mb-4 flex items-center justify-between">
				<div>
					<p className="text-[0.7rem] font-bold tracking-[0.22em] text-amber-700 uppercase dark:text-amber-300">
						Material
					</p>
					<span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
						Filamento {index + 1}
					</span>
				</div>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={() => onRemove(index)}
					className="text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
				>
					<Trash2 />
				</Button>
			</div>
			<div className="grid gap-3 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label className="text-xs text-slate-500 dark:text-slate-400">
						Preco/kg (R$)
					</Label>
					<Input
						type="number"
						min="0"
						step="0.01"
						placeholder="85"
						value={filament.pricePerKg || ""}
						onChange={(e) =>
							onChange(index, "pricePerKg", parseFloat(e.target.value) || 0)
						}
					/>
				</div>
				<div className="space-y-1.5">
					<Label className="text-xs text-slate-500 dark:text-slate-400">
						Gramas
					</Label>
					<Input
						type="number"
						min="0"
						step="0.1"
						placeholder="50"
						value={filament.grams || ""}
						onChange={(e) =>
							onChange(index, "grams", parseFloat(e.target.value) || 0)
						}
					/>
				</div>
			</div>
			<div className="mt-4 flex items-center justify-between rounded-2xl border border-amber-200/80 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
				<span className="text-slate-500 dark:text-slate-400">
					Custo deste filamento
				</span>
				<span className="font-semibold tabular-nums text-slate-900 dark:text-slate-50">
					R$ {filamentCost.toFixed(2).replace(".", ",")}
				</span>
			</div>
		</div>
	);
}
