#!/usr/bin/env node
/**
 * Internal KPI report for franciscoalencar.com.
 *
 * Pulls Vercel Web Analytics via `vercel metrics` (which reuses the CLI's
 * existing auth — no token needed in .env), archives the raw numbers, and
 * writes a human-readable report saying what is working and what needs
 * attention.
 *
 *   npm run report              # last 30 days
 *   npm run report -- --since 7d
 *
 * Why the archive matters: the Vercel Hobby plan only retains a rolling
 * 1-month window, so period-over-period comparison is impossible from the
 * API alone. Every run snapshots its numbers to reports/data/, and from the
 * second run onward the report can compare against the previous snapshot.
 * Those snapshots are committed — they are the only long-term history.
 */

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { readFile, writeFile, readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "reports", "data");
const METRIC = "vercel.analytics.page_view.count";

// ─── CLI args ───────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};
const SINCE = getArg("--since", "30d");
// --sample renders the report against synthetic numbers. Lets you check
// formatting and tune thresholds without waiting on live traffic; writes
// to reports/SAMPLE.md and never touches the real archive.
const SAMPLE = args.includes("--sample");

// ─── Thresholds (calibrated for a 100–1000 visitor/month portfolio) ─────
const T = {
  growthGood: 10, // % period-over-period
  growthBad: -15,
  ownedTrafficGood: 40, // % direct + search — name-search working
  internationalGood: 30, // % non-BR — international reach
  meetConversionGood: 25, // % of home visitors who reach /meet
  brandCutCandidate: 2, // % share below which a brand is a cut candidate
  ptShareSurfaces: 35, // % PT that argues for PT-first surfaces
};

// ─── Vercel metrics ─────────────────────────────────────────────────────

/**
 * Run one `vercel metrics` query and return its parsed rows.
 * Returns [] rather than throwing when a dimension has no data, so a quiet
 * month produces an honest empty report instead of a crash.
 */
async function query({ groupBy, aggregation = "count", limit = 20 }) {
  const argv = ["--yes", "vercel@latest", "metrics", METRIC, "--since", SINCE, "--prod", "--json", "--limit", String(limit)];
  if (aggregation) argv.push("--aggregation", aggregation);
  // `unique/<dim>` already names its dimension inline; adding --group-by
  // on top of it is rejected as UNSUPPORTED_AGGREGATION.
  if (groupBy && !aggregation.startsWith("unique/")) argv.push("--group-by", groupBy);

  try {
    const { stdout } = await execFileAsync("npx", argv, {
      cwd: ROOT,
      maxBuffer: 20 * 1024 * 1024,
      timeout: 180_000,
    });
    // The CLI prints progress lines before the JSON body; take from the
    // first brace onward.
    const start = stdout.indexOf("{");
    if (start === -1) return [];
    const parsed = JSON.parse(stdout.slice(start));
    return normalize(parsed, groupBy);
  } catch (err) {
    console.error(`  ! query failed (groupBy=${groupBy ?? "none"}): ${err.message.split("\n")[0]}`);
    return [];
  }
}

/**
 * Flatten the CLI's time-bucketed response into { key, value } totals.
 * Buckets are summed because we want the period total, not a time series.
 */
function normalize(parsed, groupBy) {
  const totals = new Map();

  for (const bucket of parsed.data ?? []) {
    for (const row of bucket.values ?? bucket.groups ?? []) {
      const key = groupBy ? (row[groupBy] ?? row.key ?? row.group ?? "(none)") : "total";
      const value = Number(row.value ?? row.count ?? 0);
      totals.set(key, (totals.get(key) ?? 0) + value);
    }
  }

  // Ungrouped queries may only populate `summary`.
  if (totals.size === 0 && parsed.summary?.length) {
    const value = Number(parsed.summary[0]?.value ?? parsed.summary[0]?.count ?? 0);
    if (value) totals.set("total", value);
  }

  return [...totals.entries()]
    .map(([key, value]) => ({ key, value }))
    .sort((a, b) => b.value - a.value);
}

const sum = (rows) => rows.reduce((n, r) => n + r.value, 0);
const pct = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);
const fmtPct = (n) => `${n.toFixed(1)}%`;
const fmtDelta = (n) => (n === null ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(1)}%`);

// ─── Snapshot archive ───────────────────────────────────────────────────

async function loadPreviousSnapshot(todayFile) {
  try {
    const files = (await readdir(DATA_DIR))
      .filter((f) => f.endsWith(".json") && f !== todayFile)
      .sort();
    if (!files.length) return null;
    const raw = await readFile(path.join(DATA_DIR, files.at(-1)), "utf8");
    return { file: files.at(-1), ...JSON.parse(raw) };
  } catch {
    return null;
  }
}

// ─── Report ─────────────────────────────────────────────────────────────

function verdict(snap, prev) {
  const working = [];
  const needs = [];

  const growth = prev ? pct(snap.visitors - prev.visitors, prev.visitors) : null;
  if (growth !== null) {
    if (growth >= T.growthGood) working.push(`Traffic up ${fmtDelta(growth)} vs. previous period.`);
    else if (growth <= T.growthBad) needs.push(`Traffic down ${fmtDelta(growth)} — check whether a referral source dried up.`);
  }

  if (snap.ownedShare >= T.ownedTrafficGood)
    working.push(`${fmtPct(snap.ownedShare)} direct + search — people are finding you by name.`);
  else if (snap.visitors > 0)
    needs.push(`Only ${fmtPct(snap.ownedShare)} direct + search (target ${T.ownedTrafficGood}%) — name recognition still thin; most traffic is borrowed from referrers.`);

  if (snap.internationalShare >= T.internationalGood)
    working.push(`${fmtPct(snap.internationalShare)} international traffic — reach beyond Brazil is real.`);
  else if (snap.visitors > 0)
    needs.push(`International traffic at ${fmtPct(snap.internationalShare)} (target ${T.internationalGood}%) — the site is not yet landing outside Brazil.`);

  if (snap.meetConversion >= T.meetConversionGood)
    working.push(`${fmtPct(snap.meetConversion)} of home visitors reach /meet — the funnel is pulling.`);
  else if (snap.homeViews > 0)
    needs.push(`Only ${fmtPct(snap.meetConversion)} of home visitors reach /meet (target ${T.meetConversionGood}%) — the path to contact is leaking.`);

  const weakBrands = snap.brands.filter((b) => pct(b.value, sum(snap.brands)) < T.brandCutCandidate);
  if (weakBrands.length)
    needs.push(`Cut candidates (<${T.brandCutCandidate}% share): ${weakBrands.map((b) => b.key).join(", ")}. Density > volume — confirm across two periods before removing.`);

  return { working: working.slice(0, 3), needs: needs.slice(0, 3) };
}

function render(snap, prev) {
  const L = [];
  const growth = prev ? pct(snap.visitors - prev.visitors, prev.visitors) : null;
  const v = verdict(snap, prev);
  const totalBrand = sum(snap.brands);

  L.push(`# KPI report — franciscoalencar.com`);
  L.push("");
  L.push(`**Period:** last ${snap.since} · generated ${snap.date}`);
  L.push(prev ? `**Compared against:** ${prev.date} (${prev.since})` : `**Compared against:** no prior snapshot — this is the baseline.`);
  L.push("");

  if (snap.visitors === 0 && snap.pageviews === 0) {
    L.push("> **No data returned for this period.**");
    L.push(">");
    L.push("> Most likely Web Analytics is not yet enabled for the project, or no");
    L.push("> traffic has been recorded since it was. Enable it under");
    L.push("> Vercel → champs-portfolio → Analytics, then re-run after the site");
    L.push("> has taken some traffic.");
    L.push("");
    return L.join("\n");
  }

  L.push(`## Headline`);
  L.push("");
  L.push(`| Metric | Value | vs. previous |`);
  L.push(`|---|---:|---:|`);
  L.push(`| Unique visitors | ${snap.visitors.toLocaleString()} | ${fmtDelta(growth)} |`);
  L.push(`| Pageviews | ${snap.pageviews.toLocaleString()} | ${fmtDelta(prev ? pct(snap.pageviews - prev.pageviews, prev.pageviews) : null)} |`);
  L.push(`| Pages per visitor | ${snap.visitors ? (snap.pageviews / snap.visitors).toFixed(2) : "—"} | |`);
  L.push("");

  const section = (title, rows, note) => {
    L.push(`## ${title}`);
    L.push("");
    if (!rows.length) {
      L.push("_No data._");
      L.push("");
      return;
    }
    const total = sum(rows);
    L.push(`| | Views | Share |`);
    L.push(`|---|---:|---:|`);
    for (const r of rows.slice(0, 10)) {
      L.push(`| ${r.key} | ${r.value.toLocaleString()} | ${fmtPct(pct(r.value, total))} |`);
    }
    if (note) {
      L.push("");
      L.push(note);
    }
    L.push("");
  };

  section("Discovery — where they come from", snap.referrers,
    `Direct + search share: **${fmtPct(snap.ownedShare)}** (target ≥${T.ownedTrafficGood}% — means name-search is working rather than borrowed traffic).`);

  section("Geography", snap.countries,
    `International (non-BR): **${fmtPct(snap.internationalShare)}** (target ≥${T.internationalGood}%).`);

  section("Top pages", snap.routes);

  section("Work — which brands get opened", snap.brands,
    totalBrand ? `Any brand under **${T.brandCutCandidate}%** for two consecutive periods is a cut candidate.` : null);

  section("Devices", snap.devices);

  if (snap.utmSources.length) section("Campaign attribution (UTM)", snap.utmSources);

  L.push(`## Contact intent`);
  L.push("");
  L.push(`\`/meet\` reached by **${fmtPct(snap.meetConversion)}** of home visitors (target ≥${T.meetConversionGood}%).`);
  L.push("");
  L.push(`This is the closest available proxy for hiring intent. Actual conversion`);
  L.push(`(Calendly bookings, email clicks) needs custom events, which require a`);
  L.push(`Vercel Pro plan — currently on Hobby.`);
  L.push("");

  L.push(`## Language`);
  L.push("");
  L.push(`PT share: **${fmtPct(snap.ptShare)}**${snap.ptShare > T.ptShareSurfaces ? ` — above ${T.ptShareSurfaces}%, worth considering PT-first surfaces.` : "."}`);
  L.push("");

  L.push(`## Verdict`);
  L.push("");
  L.push(`### Working`);
  L.push("");
  if (v.working.length) v.working.forEach((s) => L.push(`- ${s}`));
  else L.push(`- _Nothing cleared the thresholds this period._`);
  L.push("");
  L.push(`### Needs improvement`);
  L.push("");
  if (v.needs.length) v.needs.forEach((s) => L.push(`- ${s}`));
  else L.push(`- _Everything measured is within target._`);
  L.push("");

  return L.join("\n");
}


// ─── Sample data (for --sample) ─────────────────────────────────────────

function sampleSnapshot() {
  const routes = [
    { key: "/", value: 820 },
    { key: "/branded", value: 310 },
    { key: "/meet", value: 240 },
    { key: "/branded/google", value: 155 },
    { key: "/entertainment", value: 130 },
    { key: "/ai", value: 96 },
    { key: "/branded/youtube", value: 74 },
    { key: "/?lang=pt", value: 61 },
    { key: "/branded/netflix", value: 12 },
    { key: "/branded/waze", value: 5 },
  ];
  const referrers = [
    { key: "(none)", value: 610 },
    { key: "linkedin.com", value: 430 },
    { key: "google.com", value: 240 },
    { key: "instagram.com", value: 92 },
  ];
  const countries = [
    { key: "BR", value: 780 },
    { key: "US", value: 420 },
    { key: "GB", value: 96 },
    { key: "PT", value: 62 },
  ];
  const brands = routes.filter((r) => /^\/branded\/.+/.test(r.key));
  const pageviews = sum(routes);
  const homeViews = 820;
  const meetViews = 240;
  const totalRef = sum(referrers);
  const owned = 610 + 240;
  const totalCountry = sum(countries);

  return {
    date: new Date().toISOString().slice(0, 10),
    since: SINCE,
    pageviews,
    visitors: 940,
    homeViews,
    meetViews,
    routes,
    referrers,
    countries,
    devices: [
      { key: "mobile", value: 690 },
      { key: "desktop", value: 540 },
      { key: "tablet", value: 40 },
    ],
    utmSources: [{ key: "linkedin", value: 180 }],
    brands,
    ownedShare: pct(owned, totalRef),
    internationalShare: pct(totalCountry - 780, totalCountry),
    meetConversion: pct(meetViews, homeViews),
    ptShare: pct(61, pageviews),
  };
}

// ─── Main ───────────────────────────────────────────────────────────────

async function main() {
  if (SAMPLE) {
    const snap = sampleSnapshot();
    const out = path.join(ROOT, "reports", "SAMPLE.md");
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, render(snap, { ...snap, visitors: 780, pageviews: 1500, date: "(previous)", since: SINCE }));
    console.log(`  sample report  reports/SAMPLE.md`);
    return;
  }

  console.log(`Pulling Vercel Web Analytics (last ${SINCE})…`);
  await mkdir(DATA_DIR, { recursive: true });

  const [pageviewRows, visitorRows, routes, referrers, countries, devices, utmSources] =
    await Promise.all([
      query({ groupBy: null }),
      query({ groupBy: null, aggregation: "unique/visitorId", limit: 1 }),
      query({ groupBy: "route" }),
      query({ groupBy: "referrerHostname" }),
      query({ groupBy: "country" }),
      query({ groupBy: "deviceType" }),
      query({ groupBy: "utmSource" }),
    ]);

  const pageviews = sum(pageviewRows);
  // `unique` on visitorId yields the distinct-visitor count.
  const visitors = sum(visitorRows) || 0;

  const totalRef = sum(referrers);
  const owned = referrers
    .filter((r) => /^(\(none\)|direct|google\.|bing\.|duckduckgo\.|search)/i.test(r.key))
    .reduce((n, r) => n + r.value, 0);

  const totalCountry = sum(countries);
  const international = countries
    .filter((c) => !/^(BR|Brazil)$/i.test(c.key))
    .reduce((n, c) => n + c.value, 0);

  const homeViews = routes.find((r) => r.key === "/" || r.key === "/index")?.value ?? 0;
  const meetViews = routes.find((r) => r.key === "/meet")?.value ?? 0;

  // /branded/[brand] rolls every brand into one route, so fall back to the
  // per-brand paths when the grouped route hides them.
  const brands = routes.filter((r) => /^\/branded\/.+/.test(r.key));

  const ptViews = routes.filter((r) => /lang=pt/.test(r.key)).reduce((n, r) => n + r.value, 0);

  const snapshot = {
    date: new Date().toISOString().slice(0, 10),
    since: SINCE,
    pageviews,
    visitors,
    homeViews,
    meetViews,
    routes,
    referrers,
    countries,
    devices,
    utmSources,
    brands,
    ownedShare: pct(owned, totalRef),
    internationalShare: pct(international, totalCountry),
    meetConversion: pct(meetViews, homeViews),
    ptShare: pct(ptViews, pageviews),
  };

  const fileName = `${snapshot.date}.json`;
  const prev = await loadPreviousSnapshot(fileName);

  await writeFile(path.join(DATA_DIR, fileName), JSON.stringify(snapshot, null, 2));
  const reportPath = path.join(ROOT, "reports", `${snapshot.date}.md`);
  await writeFile(reportPath, render(snapshot, prev));

  console.log(`\n  snapshot  reports/data/${fileName}`);
  console.log(`  report    reports/${snapshot.date}.md`);
  console.log(`\n  ${visitors.toLocaleString()} visitors · ${pageviews.toLocaleString()} pageviews`);
  if (!prev) console.log(`  (baseline run — period-over-period starts next time)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
