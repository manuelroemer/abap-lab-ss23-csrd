export function entityFromEvent<T = unknown>(e, modelName: string): T | undefined {
  return entityFromSource<T>(e.getSource(), modelName);
}

export function entityFromSource<T = unknown>(source: any, modelName: string): T | undefined {
  if (!source) {
    console.warn('No item could be retrieved from the event source.');
    return undefined;
  }

  const bindingContext = source.getBindingContext(modelName);
  if (!bindingContext) {
    console.warn(`No binding context could be retrieved from the source. modelName: ${modelName}`, source);
    return undefined;
  }

  const path = bindingContext.getPath();
  if (!path) {
    console.warn('A binding existed, but no path could be retrieved.', bindingContext);
    return undefined;
  }

  return bindingContext.getModel().getProperty(path);
}
