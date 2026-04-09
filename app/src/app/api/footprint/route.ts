import { NextRequest, NextResponse } from "next/server";

const PROVIDER_WUE: Record<string, { wue: number; source: string }> = {
  google: { wue: 1.1, source: "Google 2024 Environmental Report" },
  microsoft: { wue: 1.8, source: "Microsoft 2024 Sustainability Report" },
  meta: { wue: 0.9, source: "Meta 2024 Sustainability Report" },
  openai: { wue: 1.8, source: "Estimated from Microsoft Azure WUE" },
  anthropic: { wue: 1.5, source: "Estimated from GCP/AWS averages" },
  amazon: { wue: 1.4, source: "AWS 2024 Sustainability Report" },
};

const MODEL_ENERGY: Record<string, number> = {
  "gpt-4": 0.005,
  "gpt-4o": 0.003,
  "gpt-3.5-turbo": 0.001,
  "claude-opus": 0.005,
  "claude-sonnet": 0.003,
  "claude-haiku": 0.001,
  "gemini-pro": 0.004,
  "gemini-flash": 0.001,
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const provider = params.get("provider") ?? "openai";
  const model = params.get("model") ?? "gpt-4";
  const queries = parseInt(params.get("queries") ?? "1000");

  if (isNaN(queries) || queries < 0 || queries > 10_000_000) {
    return NextResponse.json({ error: "Invalid queries parameter" }, { status: 400 });
  }

  const wueData = PROVIDER_WUE[provider.toLowerCase()] ?? { wue: 1.5, source: "Industry average" };
  const energyPerQuery = MODEL_ENERGY[model.toLowerCase()] ?? 0.003;

  const totalKwh = energyPerQuery * queries;
  const liters = totalKwh * wueData.wue;
  const gallons = liters * 0.264172;

  return NextResponse.json({
    provider,
    model,
    queries_per_month: queries,
    water_liters_monthly: Math.round(liters * 100) / 100,
    water_gallons_monthly: Math.round(gallons * 100) / 100,
    water_liters_annual: Math.round(liters * 12 * 100) / 100,
    water_gallons_annual: Math.round(gallons * 12 * 100) / 100,
    offset_cost_usd_monthly: Math.round((gallons / 1000) * 100) / 100,
    context: {
      equivalent_showers: Math.round((liters / 65) * 10) / 10,
      equivalent_drinking_days: Math.round((liters / 2) * 10) / 10,
    },
    methodology: {
      wue_l_per_kwh: wueData.wue,
      source: wueData.source,
    },
  });
}
