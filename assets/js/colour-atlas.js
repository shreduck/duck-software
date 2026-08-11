(() => {
  const epoch = "2026-08-01";
  const families = ["red", "orange", "yellow", "green", "cyan", "blue", "violet", "magenta", "pink", "brown", "neutral", "white", "black"];
  const hash = (value) => [...value].reduce((seed, character) => BigInt.asUintN(64, (seed ^ BigInt(character.codePointAt(0))) * 1099511628211n), 14695981039346656037n);
  const mixed = (index, seed) => {
    let value = BigInt.asUintN(64, BigInt(index) + seed);
    value = BigInt.asUintN(64, (value ^ (value >> 30n)) * 0xBF58476D1CE4E5B9n);
    value = BigInt.asUintN(64, (value ^ (value >> 27n)) * 0x94D049BB133111EBn);
    return BigInt.asUintN(64, value ^ (value >> 31n));
  };
  const ordered = (entries, version) => {
    const buckets = Object.groupBy(entries, ({ family }) => family);
    for (const family of Object.keys(buckets)) {
      buckets[family] = buckets[family].sort((a, b) => a.id.localeCompare(b.id)).map((entry, index) => ({ entry, index })).sort((a, b) => mixed(a.index, hash(version) ^ hash(family)) < mixed(b.index, hash(version) ^ hash(family)) ? -1 : 1).map(({ entry }) => entry);
    }
    const result = [], offsets = Object.fromEntries(families.map((family) => [family, 0]));
    while (result.length < entries.length) {
      let appended = false;
      for (const family of families) {
        const entry = buckets[family]?.[offsets[family]];
        if (entry) { result.push(entry); offsets[family] += 1; appended = true; }
      }
      if (!appended) break;
    }
    return result;
  };
  const dayDistance = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const start = new Date(2026, 7, 1);
    return Math.round((today - start) / 86400000);
  };
  const renderCard = (node, entry, sheetURL) => {
    node.hidden = false;
    node.querySelector("[data-colour-swatch]").style.background = entry.hex;
    node.querySelector("[data-colour-name]").textContent = entry.name;
    node.querySelector("[data-colour-family]").textContent = entry.family;
    node.querySelector("[data-colour-hex]").textContent = entry.hex;
    node.querySelector("[data-colour-sheet]").href = `${sheetURL}#${entry.id}`;
  };
  const start = async () => {
    for (const node of document.querySelectorAll("[data-colour-of-day]")) {
      try {
        const response = await fetch(node.dataset.colourAtlas);
        if (!response.ok) throw new Error("atlas unavailable");
        const atlas = await response.json();
        const choices = ordered(atlas.entries, atlas.catalogueVersion);
        const index = ((dayDistance() % choices.length) + choices.length) % choices.length;
        renderCard(node, choices[index], node.dataset.colourSheet);
      } catch { node.hidden = true; }
    }
  };
  document.addEventListener("DOMContentLoaded", start);
})();
