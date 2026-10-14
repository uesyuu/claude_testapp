export const random_element = arr => {
  return arr[Math.floor(Math.random() * arr.length)];
}

// shuffles array in place
export const shuffle = arr => {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// "H H4 OsA" -> "H4 O/A" (COLL names already include the OLL name)
export const formatZbllKey = key => {
    const [, coll, zbll] = key.split(' ');
    return `${coll} ${zbll.replace('s', '/')}`;
}

export function areSetsEqual(setA, setB) {
    return setA.size === setB.size && [...setA].every(item => setB.has(item));
}