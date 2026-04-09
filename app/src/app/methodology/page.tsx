export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Methodology</h1>
      <p className="text-zinc-400 mb-10">
        How Water Pulse scores are calculated. Transparent, reproducible, open-source.
      </p>

      <div className="prose prose-invert prose-zinc max-w-none space-y-10">
        <Section title="Water Health Score">
          <p>
            The overall Water Health Score is a weighted composite of three components,
            each scored 0-100 (higher = better):
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 text-zinc-300">Component</th>
                <th className="text-left py-2 text-zinc-300">Weight</th>
                <th className="text-left py-2 text-zinc-300">Source</th>
              </tr>
            </thead>
            <tbody className="text-zinc-400">
              <tr className="border-b border-zinc-800/50">
                <td className="py-2">Water Quality</td>
                <td className="py-2">45%</td>
                <td className="py-2">EPA ECHO (violations, contaminants)</td>
              </tr>
              <tr className="border-b border-zinc-800/50">
                <td className="py-2">Drought Risk</td>
                <td className="py-2">30%</td>
                <td className="py-2">US Drought Monitor (D0-D4 scale)</td>
              </tr>
              <tr>
                <td className="py-2">Flood Risk</td>
                <td className="py-2">25%</td>
                <td className="py-2">NOAA NWPS (gauge flood categories)</td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Section title="Water Quality Scoring">
          <p>
            Quality scores are derived from EPA ECHO drinking water system data
            within a 25-mile radius. The score starts at 85 and is reduced based
            on the number of active violations and contaminants exceeding EPA
            Maximum Contaminant Levels (MCLs).
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>0 violations: 85/100 (Good)</li>
            <li>1-2 violations: 60-70/100 (Fair)</li>
            <li>3+ violations: 10-50/100 (Poor)</li>
          </ul>
          <p className="text-zinc-500 text-sm">
            PFAS detection is flagged separately when PFOS/PFOA appear in test results.
          </p>
        </Section>

        <Section title="Drought Scoring">
          <p>
            Drought data comes from the US Drought Monitor, which classifies conditions
            on a D0-D4 scale at the county level. The drought score is converted to
            a 0-100 scale (higher = better, less drought):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>None (D-None): 100/100</li>
            <li>Abnormally Dry (D0): 80/100</li>
            <li>Moderate Drought (D1): 60/100</li>
            <li>Severe Drought (D2): 40/100</li>
            <li>Extreme Drought (D3): 20/100</li>
            <li>Exceptional Drought (D4): 0/100</li>
          </ul>
        </Section>

        <Section title="Flood Risk Scoring">
          <p>
            Flood risk uses NOAA National Water Prediction Service gauge data within
            50 miles. The highest active flood category across nearby gauges determines
            the score:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>No flooding: 0 risk score (100/100 health score)</li>
            <li>Action stage: 30 risk score (70/100 health score)</li>
            <li>Minor flooding: 50 risk score (50/100 health score)</li>
            <li>Moderate flooding: 70 risk score (30/100 health score)</li>
            <li>Major flooding: 90 risk score (10/100 health score)</li>
          </ul>
        </Section>

        <Section title="AI Water Footprint">
          <p>
            AI water footprint estimates use the Water Usage Effectiveness (WUE)
            metric — liters of water consumed per kilowatt-hour of electricity.
            WUE values are sourced from published sustainability reports by major
            cloud providers.
          </p>
          <p>The calculation:</p>
          <code className="block bg-zinc-900 p-4 rounded-lg text-sm text-zinc-300">
            water_liters = energy_per_query_kwh × queries_per_month × wue_l_per_kwh
          </code>
          <p className="text-zinc-500 text-sm mt-2">
            Energy-per-query estimates are based on model architecture, published
            benchmarks, and industry analysis. These are estimates — actual water
            usage varies by data center location, cooling technology, and time of year.
          </p>
        </Section>

        <Section title="Limitations">
          <ul className="list-disc pl-5 space-y-2 text-zinc-400">
            <li>
              Water quality data may lag real-time conditions. EPA data reflects
              the most recent compliance period, not today.
            </li>
            <li>
              Drought data is updated weekly by the USDM. Rapid onset drought events
              may not appear immediately.
            </li>
            <li>
              Flood risk is based on gauged waterways. Not all flood-prone areas have
              NOAA gauges.
            </li>
            <li>
              AI water footprint estimates are approximations. Exact values require
              per-facility, per-hour data that providers do not disclose.
            </li>
            <li>
              Coverage is currently US-only. International expansion uses WHO/UNICEF
              and World Bank data (lower resolution).
            </li>
          </ul>
        </Section>

        <Section title="Open Source">
          <p>
            The scoring algorithm, data fetching, and all methodology are open-source
            under the MIT license. Review, critique, and contribute:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-400">
            <li>
              <a
                href="https://github.com/akiyaani2/Alcub3-Impact/tree/main/waterwatch"
                className="text-water hover:underline"
              >
                WaterWatch Python Library
              </a>
            </li>
            <li>
              <a
                href="https://github.com/akiyaani2/Alcub3-Impact/blob/main/app/src/lib/water-data.ts"
                className="text-water hover:underline"
              >
                Water Pulse scoring (TypeScript)
              </a>
            </li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-zinc-100 mb-3">{title}</h2>
      <div className="space-y-3 text-sm text-zinc-400">{children}</div>
    </section>
  );
}
