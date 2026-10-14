// One-time migration of case keys saved in localStorage after the H cases were renamed
// (images rotated → names changed). Must run before any store reads localStorage,
// so this module is imported first in main.js.

const MIGRATION_FLAG = "zbllHKeysRenamed_v1"

export const H_KEY_RENAMES = {
  "H BBFF AsA": "H BBFF AsA",
  "H BBFF AsC": "H BBFF CxO",
  "H BBFF AsO": "H BBFF OxC",
  "H BBFF CsC": "H BBFF OsO",
  "H BBFF CsO": "H BBFF AsO",
  "H BBFF CxO": "H BBFF OsA",
  "H BBFF OsO": "H BBFF CsC",
  "H BBFF OxO": "H BBFF OxO",
  "H FBFB AsA": "H FBFB CsA",
  "H FBFB AsC": "H FBFB CxC",
  "H FBFB AsO": "H FBFB OxO",
  "H FBFB CsO": "H FBFB OsC",
  "H FBFB CxO": "H FBFB CxO",
  "H FBFB OsC": "H FBFB CsO",
  "H FBFB OsO": "H FBFB AsO",
  "H FBFB OxC": "H FBFB OxC",
  "H RFLF AsA": "H RFLF OxO",
  "H RFLF AsC": "H RFLF CsO",
  "H RFLF AsO": "H RFLF OsC",
  "H RFLF CsA": "H RFLF CxO",
  "H RFLF CsC": "H RFLF CsC",
  "H RFLF CsO": "H RFLF OsA",
  "H RFLF CxO": "H RFLF AsO",
  "H RFLF OsA": "H RFLF OxC",
  "H RFLF OsC": "H RFLF CsA",
  "H RFLF OsO": "H RFLF OsO",
  "H RFLF OxC": "H RFLF AsC",
  "H RFLF OxO": "H RFLF CxC",
  "H RLFF AsA": "H RLFF OsA",
  "H RLFF AsC": "H RLFF OxC",
  "H RLFF AsO": "H RLFF CxO",
  "H RLFF CsA": "H RLFF CsO",
  "H RLFF CsC": "H RLFF AsC",
  "H RLFF CsO": "H RLFF CxC",
  "H RLFF CxO": "H RLFF CsC",
  "H RLFF OsA": "H RLFF OsC",
  "H RLFF OsC": "H RLFF OxO",
  "H RLFF OsO": "H RLFF AsO",
  "H RLFF OxC": "H RLFF OsO",
  "H RLFF OxO": "H RLFF CsA"
}

const ren = key => (typeof key === "string" && key in H_KEY_RENAMES) ? H_KEY_RENAMES[key] : key

const update = (storageKey, fn) => {
  const raw = localStorage.getItem(storageKey)
  if (raw === null) return
  try {
    localStorage.setItem(storageKey, JSON.stringify(fn(JSON.parse(raw))))
  } catch (e) {
    console.error("migration failed for", storageKey, e)
  }
}

const renameObjectKeys = obj => {
  if (!obj || typeof obj !== "object") return obj
  const result = {}
  for (const k in obj) result[ren(k)] = obj[k]
  return result
}

const renameStats = stats => Array.isArray(stats) ? stats.map(s => (s && s.key) ? {...s, key: ren(s.key)} : s) : stats

try {
  if (!localStorage.getItem(MIGRATION_FLAG)) {
    // selected cases
    update("currentZbllArray", arr => Array.isArray(arr) ? arr.map(ren) : arr)
    // presets {name: [keys]}
    update("zbll2_presets_arrays", map => {
      for (const name in map) if (Array.isArray(map[name])) map[name] = map[name].map(ren)
      return map
    })
    // notes {key: text}
    update("zbllTrainerNotes", renameObjectKeys)
    // timer session
    update("zbll_store", s => {
      if (!s || typeof s !== "object") return s
      if (Array.isArray(s.keys)) s.keys = s.keys.map(ren)
      s.keysCount = renameObjectKeys(s.keysCount)
      s.currentKey = ren(s.currentKey)
      s.stats = renameStats(s.stats)
      return s
    })
    update("zbll_stats_array", renameStats)
    localStorage.setItem(MIGRATION_FLAG, "1")
  }
} catch (e) {
  console.error("H key migration error", e)
}
