"use client";

import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [targetIncome, setTargetIncome] = useState(40000);
  const [weeklyHours, setWeeklyHours] = useState(30);
  const [vacationWeeks, setVacationWeeks] = useState(4);
  const [taxRate, setTaxRate] = useState(25);
  const [monthlyExpenses, setMonthlyExpenses] = useState(300);
  const [billableTime, setBillableTime] = useState(70);
  const [profitMargin, setProfitMargin] = useState(20);

  const results = useMemo(() => {
    const safeWeeklyHours = Math.max(0, weeklyHours);
    const safeVacationWeeks = Math.min(Math.max(0, vacationWeeks), 52);
    const safeBillableTime = Math.min(Math.max(0, billableTime), 100);
    const safeProfitMargin = Math.max(0, profitMargin);
    const safeMonthlyExpenses = Math.max(0, monthlyExpenses);
    const safeTargetIncome = Math.max(0, targetIncome);
    const safeTaxRate = Math.min(Math.max(0, taxRate), 100);

    const yearlyExpenses = safeMonthlyExpenses * 12;
    const billableHours =
      safeWeeklyHours *
      (52 - safeVacationWeeks) *
      (safeBillableTime / 100);

    const minimumHourlyRate =
      billableHours > 0
        ? (safeTargetIncome + yearlyExpenses) / billableHours
        : 0;

    const recommendedHourlyRate =
      minimumHourlyRate * (1 + safeProfitMargin / 100);

    const dailyRate = recommendedHourlyRate * 8;
    const projectedYearlyRevenue = recommendedHourlyRate * billableHours;
    const projectedMonthlyRevenue = projectedYearlyRevenue / 12;
    const afterTaxMonthly =
      projectedMonthlyRevenue * (1 - safeTaxRate / 100);
    const afterTaxYearly = projectedYearlyRevenue * (1 - safeTaxRate / 100);

    return {
      billableHours,
      minimumHourlyRate,
      recommendedHourlyRate,
      dailyRate,
      projectedYearlyRevenue,
      projectedMonthlyRevenue,
      afterTaxMonthly,
      afterTaxYearly,
    };
  }, [
    targetIncome,
    weeklyHours,
    vacationWeeks,
    taxRate,
    monthlyExpenses,
    billableTime,
    profitMargin,
  ]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="mb-8 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Freelance pricing
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                Freelance Rate Calculator for Developers
              </h1>
              <div className="mt-6 flex gap-4">
                <a
                  href="#"
                  className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black hover:bg-cyan-400 transition"
                >
                  Get the Pro Version - $15
                </a>

                <span className="flex items-center text-sm text-slate-400">
                  Interactive demo below
                </span>
              </div>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                Find the hourly rate you actually need based on income goals,
                realistic billable time, taxes, expenses and margin. Built for
                freelance developers who want a fast pricing decision without
                spreadsheets.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Badge text="Instant pricing estimate" />
                <Badge text="Tax-aware projections" />
                <Badge text="Built for dev freelancers" />
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <MiniStat
                label="Recommended rate"
                value={formatCurrency(results.recommendedHourlyRate)}
              />
              <MiniStat
                label="Day rate"
                value={formatCurrency(results.dailyRate)}
              />
              <MiniStat
                label="Billable hours/year"
                value={results.billableHours.toFixed(0)}
              />
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                Your assumptions
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Adjust the inputs to reflect your real freelance setup. The
                calculator updates instantly.
              </p>
            </div>


            <div className="space-y-6">
              <SmartNumberInput
                label="Target yearly income ($)"
                value={targetIncome}
                onChange={setTargetIncome}
              />

              <SliderInput
                label="Working hours per week"
                value={weeklyHours}
                onChange={setWeeklyHours}
                min={1}
                max={60}
                step={1}
              />

              <SliderInput
                label="Vacation weeks per year"
                value={vacationWeeks}
                onChange={setVacationWeeks}
                min={0}
                max={12}
                step={1}
              />

              <SliderInput
                label="Estimated tax rate (%)"
                value={taxRate}
                onChange={setTaxRate}
                min={0}
                max={60}
                step={1}
              />

              <SmartNumberInput
                label="Monthly business expenses ($)"
                value={monthlyExpenses}
                onChange={setMonthlyExpenses}
              />

              <SliderInput
                label="Billable time (%)"
                value={billableTime}
                onChange={setBillableTime}
                min={10}
                max={100}
                step={1}
              />

              <SliderInput
                label="Profit margin (%)"
                value={profitMargin}
                onChange={setProfitMargin}
                min={0}
                max={100}
                step={1}
              />
            </div>
          </section>

          <section className="space-y-4">
            <ResultCard
              title="Minimum hourly rate"
              value={formatCurrency(results.minimumHourlyRate)}
              description="Your break-even rate based on income target and expenses."
            />
            <ResultCard
              title="Recommended hourly rate"
              value={formatCurrency(results.recommendedHourlyRate)}
              description="Your sustainable rate including the profit margin you selected."
            />
            <ResultCard
              title="Recommended day rate"
              value={formatCurrency(results.dailyRate)}
              description="A simple 8-hour day-rate projection for proposals and quotes."
            />
            <ResultCard
              title="Projected monthly revenue"
              value={formatCurrency(results.projectedMonthlyRevenue)}
              description="Estimated gross monthly revenue if you consistently hit your billable time assumptions."
            />
            <ResultCard
              title="Projected yearly revenue"
              value={formatCurrency(results.projectedYearlyRevenue)}
              description="Estimated gross yearly revenue at your recommended rate."
            />
            <ResultCard
              title="After-tax monthly income"
              value={formatCurrency(results.afterTaxMonthly)}
              description="Estimated monthly income after applying your chosen tax rate."
            />
            <ResultCard
              title="After-tax yearly income"
              value={formatCurrency(results.afterTaxYearly)}
              description="Estimated yearly income after taxes."
            />
            <ResultCard
              title="Billable hours per year"
              value={results.billableHours.toFixed(0)}
              description="A realistic estimate of the hours you can actually invoice."
            />
          </section>
        </div>

          <section className="mt-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl">
            <div className="grid gap-6 md:grid-cols-3">
              <InfoBlock
                title="Who this is for"
                text="Freelance developers, indie consultants and technical contractors who need a fast and defensible pricing baseline."
              />
              <InfoBlock
                title="What it helps you do"
                text="Set a realistic hourly rate, define your day rate and understand the income impact of your availability, taxes and expenses."
              />
              <InfoBlock
                title="Why it is useful"
                text="Most freelancers undercharge because they price from intuition. This calculator gives a quick, structured number in under a minute."
              />
            </div>
          </section>

          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-6">
              More tools for developers
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <ToolCard
                title="Freelance Rate Calculator"
                description="Calculate the hourly rate you actually need as a freelance developer."
                link="#"
              />

              <ToolCard
                title="Project Price Calculator"
                description="Estimate the correct price for freelance projects."
                link="#"
              />

              <ToolCard
                title="SaaS MRR Calculator"
                description="Estimate revenue growth for your SaaS product."
                link="#"
              />
            </div>
          </section>

      </div>
    </main>
  );
}

type SmartNumberInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

function SmartNumberInput({
  label,
  value,
  onChange,
}: SmartNumberInputProps) {
  const [text, setText] = useState(String(value));

  useEffect(() => {
    setText(String(value));
  }, [value]);

  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{label}</span>
      </div>
      <input
        type="text"
        inputMode="decimal"
        value={text}
        onChange={(e) => {
          const raw = e.target.value;
          setText(raw);

          if (raw.trim() === "") return;

          const normalized = raw.replace(",", ".");
          const parsed = Number(normalized);

          if (!Number.isNaN(parsed)) {
            onChange(parsed);
          }
        }}
        onBlur={() => {
          if (text.trim() === "") {
            setText(String(value));
            return;
          }

          const normalized = text.replace(",", ".");
          const parsed = Number(normalized);

          if (Number.isNaN(parsed)) {
            setText(String(value));
            return;
          }

          const safeValue = Math.max(0, parsed);
          onChange(safeValue);
          setText(String(safeValue));
        }}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
      />
    </label>
  );
}

type SliderInputProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
};

function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: SliderInputProps) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-200">{label}</span>
        <span className="text-sm font-semibold text-cyan-300">{value}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700"
      />
    </label>
  );
}

type ResultCardProps = {
  title: string;
  value: string;
  description: string;
};

function ResultCard({ title, value, description }: ResultCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 shadow-lg">
      <p className="text-sm font-medium text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-white">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
      {text}
    </span>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </div>
  );
}

function ToolCard({
  title,
  description,
  link,
}: {
  title: string
  description: string
  link: string
}) {
  return (
    <a
      href={link}
      className="block rounded-2xl border border-white/10 bg-slate-900 p-5 hover:bg-slate-800 transition"
    >
      <h3 className="text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-400">
        {description}
      </p>

      <span className="mt-4 inline-block text-cyan-400">
        Open tool →
      </span>
    </a>
  )
}

