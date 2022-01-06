export default (oldFunction, name, newFunction, before = false) => {
  const _Name = oldFunction?.[name];
  if (!_Name || typeof _Name !== 'function') return;

  oldFunction[name] = (...args) => {
    return newFunction
      ? newFunction(before ? _Name : _Name(...args), ...args) ?? _Name(...args)
      : _Name(...args);
  };
  oldFunction[name].displayName = _Name.displayName ?? null;
};
