import type { Metadata } from "next";
import { QuizLoader } from "@/components/QuizLoader";

export const metadata: Metadata = { title: "診断" };

export default function QuizPage() {
  return <QuizLoader />;
}
