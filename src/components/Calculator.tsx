import { CalculatorIcon, Clock3, Layers3, Moon, Plus, Sun, Wrench } from "lucide-react";
import { useCallback, useState } from "react";
import { type Filament, FilamentCard } from "#/components/FilamentCard.tsx";
import { Button } from "#/components/ui/button.tsx";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "#/components/ui/card.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import { formatBRL } from "#/lib/format.ts";
import { useTheme } from "#/lib/theme.tsx";
import { usePersistedNumber } from "#/lib/use-local-storage.ts";

let nextFilamentId = 1;

const createFilament = (): Filament => ({
	id: `fil-${nextFilamentId++}`,
	pricePerKg: 0,
	grams: 0,
});

const DEFAULT_FILAMENTS: Filament[] = [createFilament()];

const summaryItems = (
	filamentCost: number,
	timeCost: number,
	maintenanceValue: number,
	baseCost: number,
	markupMultiplier: number,
) => [
	{ label: "Preco de custo do filamento", value: formatBRL(filamentCost) },
	{ label: "Custo de tempo", value: formatBRL(timeCost) },
	{ label: "Manutencao", value: formatBRL(maintenanceValue) },
	{ label: "Base antes do lucro", value: formatBRL(baseCost) },
	{ label: "Multiplicador", value: `x ${markupMultiplier.toFixed(2)}` },
];

export function Calculator() {
	const { theme, toggleTheme } = useTheme();

	const minutes = usePersistedNumber("forge-minutes", 0);
	const priceH = usePersistedNumber("forge-priceH", 0);
	const maintenance = usePersistedNumber("forge-maintenance", 0);
	const markup = usePersistedNumber("forge-markup", 0);

	const [filaments, setFilaments] = useState<Filament[]>(DEFAULT_FILAMENTS);

	const handleFilamentChange = useCallback(
		(index: number, field: keyof Filament, value: number) => {
			setFilaments((prev) =>
				prev.map((filament, currentIndex) =>
					currentIndex === index ? { ...filament, [field]: value } : filament,
				),
			);
		},
		[],
	);

	const addFilament = useCallback(() => {
		setFilaments((prev) => [...prev, createFilament()]);
	}, []);

	const removeFilament = useCallback((index: number) => {
		setFilaments((prev) => {
			if (prev.length === 1) {
				return prev;
			}

			return prev.filter((_, currentIndex) => currentIndex !== index);
		});
	}, []);

	const timePricePerMinute = priceH.value / 60;
	const filamentCost = filaments.reduce(
		(total, filament) => total + (filament.pricePerKg / 1000) * filament.grams,
		0,
	);
	const timeCost = minutes.value * timePricePerMinute;
	const baseCost = timeCost + filamentCost + maintenance.value;
	const markupMultiplier = markup.value / 100 + 1;
	const total = baseCost * markupMultiplier;
	const filledFields = filaments.filter(
		(filament) => filament.pricePerKg > 0 || filament.grams > 0,
	).length;

	return (
		<div className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
			<div className="animate-[rise-in_700ms_cubic-bezier(0.16,1,0.3,1)_both]">
				<section className="relative overflow-hidden rounded-[34px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-100 p-6 shadow-[0_30px_80px_rgba(249,115,22,0.16)] dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 sm:p-8">
					<div className="absolute inset-y-0 right-0 hidden w-80 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.28),transparent_62%)] lg:block dark:bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.14),transparent_62%)]" />
					<div className="relative flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
						<div className="max-w-3xl space-y-5">
							<div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-xs font-bold tracking-[0.24em] text-amber-700 uppercase dark:border-slate-700 dark:bg-slate-900/80 dark:text-amber-300">
								<CalculatorIcon className="size-4" />
								Forge Equation
							</div>
							<div className="space-y-3">
								<h1 className="font-['Fraunces',Georgia,serif] text-4xl leading-none font-bold text-slate-900 sm:text-5xl dark:text-white">
									Calculadora de preco para impressao 3D
								</h1>
								<p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base dark:text-slate-300">
									Insira material, tempo e manutencao. O valor final segue a
									formula do arquivo <code>eq.cpp</code> com lucro aplicado no
									final.
								</p>
							</div>
							<div className="grid gap-3 sm:grid-cols-3">
								<MetricPill
									icon={Layers3}
									label="Filamentos ativos"
									value={`${filledFields}/${filaments.length}`}
								/>
								<MetricPill
									icon={Clock3}
									label="Tempo"
									value={`${minutes.value || 0} min`}
								/>
								<MetricPill
									icon={Wrench}
									label="Preco final"
									value={formatBRL(total)}
								/>
							</div>
						</div>
						<Button
							variant="outline"
							size="icon"
							onClick={toggleTheme}
							className="self-start"
						>
							{theme === "dark" ? <Sun /> : <Moon />}
						</Button>
					</div>
				</section>

				<div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_380px]">
					<div className="space-y-6">
						<Card>
							<CardHeader className="pb-0">
								<CardTitle className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
									Tempo de Impressao
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_190px] sm:items-end">
									<div className="space-y-2">
										<Label className="text-slate-700 dark:text-slate-200">
											Minutos de impressao
										</Label>
										<Input
											type="number"
											min="0"
											step="1"
											placeholder="Ex: 120"
											value={minutes.displayValue}
											onChange={minutes.onChange}
										/>
									</div>
									<div className="rounded-[24px] border border-amber-200 bg-amber-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-950">
										<p className="text-xs font-bold tracking-[0.18em] text-amber-700 uppercase dark:text-amber-300">
											Custo por minuto
										</p>
										<p className="mt-2 text-2xl font-bold tabular-nums text-slate-900 dark:text-white">
											{formatBRL(timePricePerMinute)}
										</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-0">
								<CardTitle className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
									Custos Operacionais
								</CardTitle>
							</CardHeader>
							<CardContent className="grid gap-4 sm:grid-cols-2">
								<div className="space-y-2">
									<Label className="text-slate-700 dark:text-slate-200">
										Preco da hora (R$)
									</Label>
									<Input
										type="number"
										min="0"
										step="0.01"
										placeholder="Ex: 15"
										value={priceH.displayValue}
										onChange={priceH.onChange}
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-slate-700 dark:text-slate-200">
										Manutencao (R$)
									</Label>
									<Input
										type="number"
										min="0"
										step="0.01"
										placeholder="Ex: 5"
										value={maintenance.displayValue}
										onChange={maintenance.onChange}
									/>
								</div>
								<div className="space-y-2 sm:col-span-2">
									<Label className="text-slate-700 dark:text-slate-200">
										Lucro (%)
									</Label>
									<Input
										type="number"
										min="0"
										step="0.1"
										placeholder="Ex: 30"
										value={markup.displayValue}
										onChange={markup.onChange}
									/>
								</div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader className="pb-0">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<CardTitle className="text-sm font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-300">
											Filamentos
										</CardTitle>
										<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
											Adicione os materiais usados para compor o custo real da
											peca.
										</p>
									</div>
									<Button variant="default" onClick={addFilament}>
										<Plus className="size-4" />
										Adicionar Filamento
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								{filaments.map((filament, index) => (
									<FilamentCard
										key={filament.id}
										index={index}
										filament={filament}
										onChange={handleFilamentChange}
										onRemove={removeFilament}
									/>
								))}
							</CardContent>
						</Card>
					</div>

					<aside className="xl:sticky xl:top-6 xl:self-start">
						<div className="overflow-hidden rounded-[32px] border border-amber-300 bg-gradient-to-b from-amber-400 via-orange-400 to-orange-500 p-1 shadow-[0_30px_90px_rgba(249,115,22,0.28)] dark:border-amber-500/20 dark:from-amber-500 dark:via-orange-500 dark:to-rose-500">
							<div className="rounded-[28px] bg-white/96 p-5 dark:bg-slate-950/96">
								<div className="mb-5">
									<p className="text-[0.72rem] font-bold tracking-[0.24em] text-amber-700 uppercase dark:text-amber-300">
										Resumo
									</p>
									<h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">
										{formatBRL(total)}
									</h2>
									<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
										Preco final estimado da peca
									</p>
								</div>

								<div className="space-y-2">
									{summaryItems(
										filamentCost,
										timeCost,
										maintenance.value,
										baseCost,
										markupMultiplier,
									).map((item) => (
										<div
											key={item.label}
											className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900"
										>
											<span className="text-sm text-slate-500 dark:text-slate-400">
												{item.label}
											</span>
											<span className="font-semibold tabular-nums text-slate-900 dark:text-white">
												{item.value}
											</span>
										</div>
									))}
								</div>

								<div className="mt-5 rounded-[24px] bg-slate-950 px-4 py-4 text-white dark:bg-slate-900">
									<p className="text-xs font-bold tracking-[0.18em] text-amber-300 uppercase">
										Formula aplicada
									</p>
									<p className="mt-2 text-sm leading-6 text-slate-200">
										(<span className="font-semibold">tempo x preco/min</span> +{" "}
										<span className="font-semibold">filamentos</span> +{" "}
										<span className="font-semibold">manutencao</span>) x{" "}
										<span className="font-semibold">lucro</span>
									</p>
								</div>
							</div>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

function MetricPill({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof Layers3;
	label: string;
	value: string;
}) {
	return (
		<div className="rounded-[24px] border border-amber-200 bg-white/90 px-4 py-4 shadow-[0_14px_30px_rgba(15,23,42,0.06)] dark:border-slate-800 dark:bg-slate-900/90">
			<div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
				<Icon className="size-4" />
				<span className="text-[0.68rem] font-bold tracking-[0.18em] uppercase">
					{label}
				</span>
			</div>
			<p className="mt-2 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
				{value}
			</p>
		</div>
	);
}
