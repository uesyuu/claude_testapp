// One-time migrations of case keys saved in localStorage after cases were renamed
// (images rotated → names changed). Must run before any store reads localStorage,
// so this module is imported first in main.js.
// Each migration runs once per browser (guarded by its own flag); add new ones to the end.

const MIGRATIONS = [
  {
    flag: "zbllHKeysRenamed_v1",
    renames: {
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
    },
  },
  {
    flag: "zbllASKeysRenamed_v1",
    renames: {
    "aS FBBF AsA": "aS FBBF CxO",
    "aS FBBF AsC": "aS FBBF CxC",
    "aS FBBF AsO": "aS FBBF OxO",
    "aS FBBF CsA": "aS FBBF OsO",
    "aS FBBF CsC": "aS FBBF CsO",
    "aS FBBF CsO": "aS FBBF AsO",
    "aS FBBF CxO": "aS FBBF CsA",
    "aS FBBF OsA": "aS FBBF CsC",
    "aS FBBF OsC": "aS FBBF AsC",
    "aS FBBF OsO": "aS FBBF OsC",
    "aS FBBF OxC": "aS FBBF OsA",
    "aS FBBF OxO": "aS FBBF OxC",
    "aS FBFB AsA": "aS FBFB CsA",
    "aS FBFB AsC": "aS FBFB OxC",
    "aS FBFB AsO": "aS FBFB CxO",
    "aS FBFB CsA": "aS FBFB CsO",
    "aS FBFB CsC": "aS FBFB AsO",
    "aS FBFB CsO": "aS FBFB OsO",
    "aS FBFB CxO": "aS FBFB OxO",
    "aS FBFB OsA": "aS FBFB OsC",
    "aS FBFB OsC": "aS FBFB CsC",
    "aS FBFB OsO": "aS FBFB AsC",
    "aS FBFB OxC": "aS FBFB CxC",
    "aS FBFB OxO": "aS FBFB OsA",
    "aS FRFL AsA": "aS FRFL AsO",
    "aS FRFL AsC": "aS FRFL CsC",
    "aS FRFL AsO": "aS FRFL OsO",
    "aS FRFL CsA": "aS FRFL CxC",
    "aS FRFL CsC": "aS FRFL OsA",
    "aS FRFL CsO": "aS FRFL OxC",
    "aS FRFL CxO": "aS FRFL CsO",
    "aS FRFL OsA": "aS FRFL OxO",
    "aS FRFL OsC": "aS FRFL CxO",
    "aS FRFL OsO": "aS FRFL CsA",
    "aS FRFL OxC": "aS FRFL OsC",
    "aS FRFL OxO": "aS FRFL AsC",
    "aS FRLF AsA": "aS FRLF AsC",
    "aS FRLF AsC": "aS FRLF OsO",
    "aS FRLF AsO": "aS FRLF CsC",
    "aS FRLF CsA": "aS FRLF OxO",
    "aS FRLF CsC": "aS FRLF CsA",
    "aS FRLF CsO": "aS FRLF CxO",
    "aS FRLF CxO": "aS FRLF OsC",
    "aS FRLF OsA": "aS FRLF CxC",
    "aS FRLF OsC": "aS FRLF OxC",
    "aS FRLF OsO": "aS FRLF OsA",
    "aS FRLF OxC": "aS FRLF CsO",
    "aS FRLF OxO": "aS FRLF AsO",
    "aS LFRF AsA": "aS LFRF CsC",
    "aS LFRF AsC": "aS LFRF CsO",
    "aS LFRF AsO": "aS LFRF OsC",
    "aS LFRF CsA": "aS LFRF CxO",
    "aS LFRF CsC": "aS LFRF OxO",
    "aS LFRF CsO": "aS LFRF CsA",
    "aS LFRF CxO": "aS LFRF AsC",
    "aS LFRF OsA": "aS LFRF OxC",
    "aS LFRF OsC": "aS LFRF OsA",
    "aS LFRF OsO": "aS LFRF CxC",
    "aS LFRF OxC": "aS LFRF AsO",
    "aS LFRF OxO": "aS LFRF OsO",
    "aS RFFL AsA": "aS RFFL OsO",
    "aS RFFL AsC": "aS RFFL OsC",
    "aS RFFL AsO": "aS RFFL CsO",
    "aS RFFL CsA": "aS RFFL OxC",
    "aS RFFL CsC": "aS RFFL CxC",
    "aS RFFL CsO": "aS RFFL OsA",
    "aS RFFL CxO": "aS RFFL AsO",
    "aS RFFL OsA": "aS RFFL CxO",
    "aS RFFL OsC": "aS RFFL CsA",
    "aS RFFL OsO": "aS RFFL OxO",
    "aS RFFL OxC": "aS RFFL AsC",
    "aS RFFL OxO": "aS RFFL CsC"
    },
  },
  {
    // A/A renamed to CxC in every group that had A/A
    flag: "zbllAAKeysRenamed_v1",
    renames: {
    "H BBFF AsA": "H BBFF CxC",
    "L FBRL AsA": "L FBRL CxC",
    "L LBFF AsA": "L LBFF CxC",
    "L LFFB AsA": "L LFFB CxC",
    "L LFFR AsA": "L LFFR CxC",
    "L LRFF AsA": "L LRFF CxC",
    "L RFBL AsA": "L RFBL CxC",
    "Pi BFFB AsA": "Pi BFFB CxC",
    "Pi FBFB AsA": "Pi FBFB CxC",
    "Pi FRFL AsA": "Pi FRFL CxC",
    "Pi FRLF AsA": "Pi FRLF CxC",
    "Pi LFRF AsA": "Pi LFRF CxC",
    "Pi RFFL AsA": "Pi RFFL CxC",
    "S FBBF AsA": "S FBBF CxC",
    "S FBFB AsA": "S FBFB CxC",
    "S FLFR AsA": "S FLFR CxC",
    "S FLRF AsA": "S FLRF CxC",
    "S LFFR AsA": "S LFFR CxC",
    "S LFRF AsA": "S LFRF CxC",
    "T BBFF AsA": "T BBFF CxC",
    "T FBFB AsA": "T FBFB CxC",
    "T FFLR AsA": "T FFLR CxC",
    "T FLFR AsA": "T FLFR CxC",
    "T RFLF AsA": "T RFLF CxC",
    "T RLFF AsA": "T RLFF CxC",
    "U BBFF AsA": "U BBFF CxC",
    "U BFFB AsA": "U BFFB CxC",
    "U FFLR AsA": "U FFLR CxC",
    "U FRLF AsA": "U FRLF CxC",
    "U LFFR AsA": "U LFFR CxC",
    "U LRFF AsA": "U LRFF CxC"
    },
  },
  {
    // OLL group "aS" renamed to "As"
    flag: "zbllAsOllRenamed_v1",
    renames: {
    "aS FBBF AsC": "As FBBF AsC",
    "aS FBBF AsO": "As FBBF AsO",
    "aS FBBF CsA": "As FBBF CsA",
    "aS FBBF CsC": "As FBBF CsC",
    "aS FBBF CsO": "As FBBF CsO",
    "aS FBBF CxC": "As FBBF CxC",
    "aS FBBF CxO": "As FBBF CxO",
    "aS FBBF OsA": "As FBBF OsA",
    "aS FBBF OsC": "As FBBF OsC",
    "aS FBBF OsO": "As FBBF OsO",
    "aS FBBF OxC": "As FBBF OxC",
    "aS FBBF OxO": "As FBBF OxO",
    "aS FBFB AsC": "As FBFB AsC",
    "aS FBFB AsO": "As FBFB AsO",
    "aS FBFB CsA": "As FBFB CsA",
    "aS FBFB CsC": "As FBFB CsC",
    "aS FBFB CsO": "As FBFB CsO",
    "aS FBFB CxC": "As FBFB CxC",
    "aS FBFB CxO": "As FBFB CxO",
    "aS FBFB OsA": "As FBFB OsA",
    "aS FBFB OsC": "As FBFB OsC",
    "aS FBFB OsO": "As FBFB OsO",
    "aS FBFB OxC": "As FBFB OxC",
    "aS FBFB OxO": "As FBFB OxO",
    "aS FRFL AsC": "As FRFL AsC",
    "aS FRFL AsO": "As FRFL AsO",
    "aS FRFL CsA": "As FRFL CsA",
    "aS FRFL CsC": "As FRFL CsC",
    "aS FRFL CsO": "As FRFL CsO",
    "aS FRFL CxC": "As FRFL CxC",
    "aS FRFL CxO": "As FRFL CxO",
    "aS FRFL OsA": "As FRFL OsA",
    "aS FRFL OsC": "As FRFL OsC",
    "aS FRFL OsO": "As FRFL OsO",
    "aS FRFL OxC": "As FRFL OxC",
    "aS FRFL OxO": "As FRFL OxO",
    "aS FRLF AsC": "As FRLF AsC",
    "aS FRLF AsO": "As FRLF AsO",
    "aS FRLF CsA": "As FRLF CsA",
    "aS FRLF CsC": "As FRLF CsC",
    "aS FRLF CsO": "As FRLF CsO",
    "aS FRLF CxC": "As FRLF CxC",
    "aS FRLF CxO": "As FRLF CxO",
    "aS FRLF OsA": "As FRLF OsA",
    "aS FRLF OsC": "As FRLF OsC",
    "aS FRLF OsO": "As FRLF OsO",
    "aS FRLF OxC": "As FRLF OxC",
    "aS FRLF OxO": "As FRLF OxO",
    "aS LFRF AsC": "As LFRF AsC",
    "aS LFRF AsO": "As LFRF AsO",
    "aS LFRF CsA": "As LFRF CsA",
    "aS LFRF CsC": "As LFRF CsC",
    "aS LFRF CsO": "As LFRF CsO",
    "aS LFRF CxC": "As LFRF CxC",
    "aS LFRF CxO": "As LFRF CxO",
    "aS LFRF OsA": "As LFRF OsA",
    "aS LFRF OsC": "As LFRF OsC",
    "aS LFRF OsO": "As LFRF OsO",
    "aS LFRF OxC": "As LFRF OxC",
    "aS LFRF OxO": "As LFRF OxO",
    "aS RFFL AsC": "As RFFL AsC",
    "aS RFFL AsO": "As RFFL AsO",
    "aS RFFL CsA": "As RFFL CsA",
    "aS RFFL CsC": "As RFFL CsC",
    "aS RFFL CsO": "As RFFL CsO",
    "aS RFFL CxC": "As RFFL CxC",
    "aS RFFL CxO": "As RFFL CxO",
    "aS RFFL OsA": "As RFFL OsA",
    "aS RFFL OsC": "As RFFL OsC",
    "aS RFFL OsO": "As RFFL OsO",
    "aS RFFL OxC": "As RFFL OxC",
    "aS RFFL OxO": "As RFFL OxO"
    },
  },
  {
    // COLL groups renamed to numbers ("T BBFF" -> "T T1" etc.); applied to the "OLL COLL" part of every key
    flag: "zbllCollNumbered_v1",
    collRenames: {
    "T BBFF": "T T1",
    "T FBFB": "T T2",
    "T FFLR": "T T4",
    "T FLFR": "T T5",
    "T RFLF": "T T6",
    "T RLFF": "T T3",
    "U BBFF": "U U3",
    "U BFFB": "U U4",
    "U FFLR": "U U2",
    "U FRLF": "U U5",
    "U LFFR": "U U6",
    "U LRFF": "U U1",
    "L FBRL": "L L2",
    "L LBFF": "L L4",
    "L LFFB": "L L6",
    "L LFFR": "L L5",
    "L LRFF": "L L1",
    "L RFBL": "L L3",
    "H BBFF": "H H1",
    "H FBFB": "H H2",
    "H RFLF": "H H3",
    "H RLFF": "H H4",
    "Pi BFFB": "Pi Pi4",
    "Pi FBFB": "Pi Pi3",
    "Pi FRFL": "Pi Pi2",
    "Pi FRLF": "Pi Pi5",
    "Pi LFRF": "Pi Pi1",
    "Pi RFFL": "Pi Pi6",
    "S FBBF": "S S5",
    "S FBFB": "S S6",
    "S FLFR": "S S1",
    "S FLRF": "S S3",
    "S LFFR": "S S4",
    "S LFRF": "S S2",
    "As FBBF": "As As5",
    "As FBFB": "As As6",
    "As FRFL": "As As2",
    "As FRLF": "As As4",
    "As LFRF": "As As1",
    "As RFFL": "As As3"
    },
  },
]

const update = (storageKey, fn) => {
  const raw = localStorage.getItem(storageKey)
  if (raw === null) return
  try {
    localStorage.setItem(storageKey, JSON.stringify(fn(JSON.parse(raw))))
  } catch (e) {
    console.error("migration failed for", storageKey, e)
  }
}

const runMigration = ({renames = {}, collRenames = {}}) => {
  const ren = key => {
    if (typeof key !== "string") return key
    if (key in renames) return renames[key]
    const parts = key.split(" ")
    if (parts.length === 3) {
      const coll = `${parts[0]} ${parts[1]}`
      if (coll in collRenames) return `${collRenames[coll]} ${parts[2]}`
    }
    return key
  }
  const renameObjectKeys = obj => {
    if (!obj || typeof obj !== "object") return obj
    const result = {}
    for (const k in obj) result[ren(k)] = obj[k]
    return result
  }
  const renameStats = stats => Array.isArray(stats) ? stats.map(s => (s && s.key) ? {...s, key: ren(s.key)} : s) : stats

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
}

try {
  for (const migration of MIGRATIONS) {
    if (!localStorage.getItem(migration.flag)) {
      runMigration(migration)
      localStorage.setItem(migration.flag, "1")
    }
  }
} catch (e) {
  console.error("case key migration error", e)
}
