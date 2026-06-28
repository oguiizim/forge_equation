import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "#/components/Calculator.tsx";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return <Calculator />;
}
