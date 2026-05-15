import { access, copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const matesDir = path.join(repoRoot, "data", "mates");
const backupDir = path.join(matesDir, "legacy-split");

const sourceModes = [
  "base",
  "sacred",
  "ace",
  "goner",
  "costumes",
  "ncanon"
];

const modeRank = new Map(sourceModes.map((mode, index) => [mode, index]));
const formOrder = ["base", "sacred", "ace", "costumes", "ncanon"];

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

function cleanName(value) {
  return String(value || "").trim();
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function getReferenceName(mate) {
  const explicitRef = cleanName(mate.ref);
  if (explicitRef) return explicitRef;
  return cleanName(mate.name);
}

function getFamilyId(mate, mode) {
  return getReferenceName(mate);
}

function getDisplayName(id, forms) {
  for (const mode of formOrder) {
    const modeForms = forms[mode] || [];
    const nonModeForm = modeForms.find(form => form.rarity !== "Mode");
    if (nonModeForm?.ref) return cleanName(nonModeForm.ref);
    if (nonModeForm?.name) return cleanName(nonModeForm.name);
  }

  return id.replace(/^npc:/, "");
}

function sortGroups(a, b) {
  const rankDiff = (modeRank.get(a._first.mode) ?? 999) - (modeRank.get(b._first.mode) ?? 999);
  if (rankDiff !== 0) return rankDiff;
  return a._first.index - b._first.index;
}

function normalizeGroup(group) {
  const forms = {};

  Object.entries(group.forms).forEach(([mode, modeForms]) => {
    if (!Array.isArray(modeForms) || !modeForms.length) return;
    const outputMode = mode === "goner" ? "base" : mode;

    modeForms.forEach(form => {
      const cleaned = cleanFormForMode(form, outputMode);
      if (!forms[outputMode]) forms[outputMode] = [];
      forms[outputMode].push(cleaned);
    });
  });

  if (!Object.keys(forms).length) return null;

  return {
    name: getDisplayName(group.id, forms),
    forms: orderFormSections(forms)
  };
}

function cleanFormForMode(form) {
  const cleaned = clone(form);
  delete cleaned._source;
  delete cleaned.ref;

  return cleaned;
}

function stringifyGroupedData(groups) {
  const lines = ["["];

  groups.forEach((group, groupIndex) => {
    lines.push("  {");
    lines.push(`    "name": ${JSON.stringify(group.name)},`);
    lines.push(`    "forms": ${stringifyFormSections(group.forms, 4)}`);
    lines.push(`  }${groupIndex === groups.length - 1 ? "" : ","}`);
  });

  lines.push("]");
  return `${lines.join("\n")}\n`;
}

function stringifyFormSections(sections, indentSize) {
  const sectionEntries = Object.entries(orderFormSections(sections || {}));
  const pad = " ".repeat(indentSize);
  const innerPad = " ".repeat(indentSize + 2);
  const itemPad = " ".repeat(indentSize + 4);
  const lines = ["{"];

  sectionEntries.forEach(([sectionName, forms], sectionIndex) => {
    lines.push(`${innerPad}${JSON.stringify(sectionName)}: [`);
    forms.forEach((form, formIndex) => {
      lines.push(`${itemPad}${JSON.stringify(form)}${formIndex === forms.length - 1 ? "" : ","}`);
    });
    lines.push(`${innerPad}]${sectionIndex === sectionEntries.length - 1 ? "" : ","}`);
  });

  lines.push(`${pad}}`);
  return lines.join("\n");
}

function orderFormSections(sections) {
  const ordered = {};
  formOrder.forEach(mode => {
    if (Array.isArray(sections[mode]) && sections[mode].length) {
      ordered[mode] = sections[mode];
    }
  });
  return ordered;
}

async function backUpCurrentFiles() {
  await mkdir(backupDir, { recursive: true });
  await Promise.all(sourceModes.map(async mode => {
    const sourcePath = path.join(matesDir, `${mode}.json`);
    const backupPath = path.join(backupDir, `${mode}.json`);
    try {
      await access(backupPath);
      return;
    } catch {
      // No backup exists yet, so preserve the current source file.
    }
    await copyFile(sourcePath, backupPath);
  }));
}

async function buildGroups() {
  const grouped = new Map();
  const sourceCounts = {};

  for (const mode of sourceModes) {
    const sourcePath = path.join(backupDir, `${mode}.json`);
    const mates = await readJson(sourcePath);

    if (!Array.isArray(mates)) {
      throw new Error(`${mode}.json must contain an array`);
    }

    sourceCounts[mode] = mates.length;

    mates.forEach((mate, index) => {
      const id = getFamilyId(mate, mode);
      if (!grouped.has(id)) {
        grouped.set(id, {
          id,
          _first: { mode, index },
          forms: {}
        });
      }

      const group = grouped.get(id);
      if (!group.forms[mode]) group.forms[mode] = [];
      group.forms[mode].push(clone(mate));
    });
  }

  return {
    sourceCounts,
    groups: Array.from(grouped.values()).sort(sortGroups)
  };
}

async function readGonerOrder() {
  const goner = await readJson(path.join(backupDir, "goner.json"));
  const ranks = new Map();

  goner.forEach((mate, index) => {
    const id = getFamilyId(mate, "goner");
    if (id && !ranks.has(id)) ranks.set(id, index);
  });

  return ranks;
}

function countForms(groups) {
  return groups.reduce((total, group) => {
    return total + Object.values(group.forms || {}).reduce((inner, forms) => inner + forms.length, 0);
  }, 0);
}

async function main() {
  await backUpCurrentFiles();
  const { sourceCounts, groups } = await buildGroups();
  const gonerOrder = await readGonerOrder();

  const baseGroups = [];
  const lostGroups = [];

  groups.forEach(group => {
    const normalized = normalizeGroup(group);
    if (!normalized) return;

    if (Array.isArray(group.forms.base) && group.forms.base.length) {
      baseGroups.push(normalized);
    } else {
      lostGroups.push(normalized);
    }
  });

  lostGroups.sort((a, b) => {
    const aRank = gonerOrder.has(a.name) ? gonerOrder.get(a.name) : Number.MAX_SAFE_INTEGER;
    const bRank = gonerOrder.has(b.name) ? gonerOrder.get(b.name) : Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return 0;
  });

  const sourceTotal = Object.values(sourceCounts).reduce((sum, count) => sum + count, 0);
  const splitTotal = countForms(baseGroups) + countForms(lostGroups);

  if (sourceTotal !== splitTotal) {
    throw new Error(`Count mismatch: source ${sourceTotal}, split ${splitTotal}`);
  }

  await writeFile(path.join(matesDir, "base.json"), stringifyGroupedData(baseGroups), "utf8");
  await writeFile(path.join(matesDir, "lost.json"), stringifyGroupedData(lostGroups), "utf8");
  await copyFile(path.join(backupDir, "npc.json"), path.join(matesDir, "npc.json"));

  console.log(`Backed up original split files to data/mates/legacy-split.`);
  console.log(`Wrote ${countForms(baseGroups)} forms into base.json across ${baseGroups.length} legacy-base animates.`);
  console.log(`Wrote ${countForms(lostGroups)} forms into lost.json across ${lostGroups.length} lost-only animates.`);
  console.log(`Verified ${splitTotal} split forms against ${sourceTotal} source entries.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
