const same = (a, b) => a === b || JSON.stringify(a) === JSON.stringify(b);
const clone = value => value === undefined ? undefined : structuredClone(value);
const record = value => !!value && typeof value === 'object' && !Array.isArray(value);

// Conservar cambios independientes de otras pestañas. Si ambas modifican el
// mismo campo, prevalece el último guardado explícito de ese campo.
export function mergeCampus(base, local, remote) {
  if (same(local, base)) return clone(remote);
  if (same(remote, base) || remote === undefined) return clone(local);
  if (record(local) && record(remote)) {
    const keys = new Set([...Object.keys(remote), ...Object.keys(local)]);
    return Object.fromEntries([...keys].map(key => [key, mergeCampus(base?.[key], local[key], remote[key])]).filter(([, value]) => value !== undefined));
  }
  if (Array.isArray(local) && Array.isArray(remote)) {
    const before = Array.isArray(base) ? base : [];
    if ([...before, ...local, ...remote].every(item => record(item) && typeof item.id === 'string')) {
      const maps = [before, local, remote].map(items => new Map(items.map(item => [item.id, item])));
      const ids = new Set([...remote.map(item => item.id), ...local.map(item => item.id)]);
      return [...ids].map(id => mergeCampus(maps[0].get(id), maps[1].get(id), maps[2].get(id))).filter(item => item !== undefined);
    }
    if (local.length === remote.length && local.every(record) && remote.every(record))
      return local.map((value, i) => mergeCampus(before[i], value, remote[i]));
  }
  return clone(local);
}
