export function entityFromEvent<T = unknown>(e, modelName): T | undefined {
  const item = e.getSource();
  if (!item) {
    console.warn('No item could be retrieved from the event source.', e);
    return undefined;
  }

  const bindingContext = item.getBindingContext(modelName);
  console.log(bindingContext);
  if (!bindingContext) {
    console.warn(`No binding context could be retrieved from the item. modelName: ${modelName}`, e, item);
    return undefined;
  }

  const path = bindingContext.getPath();
  if (!path) {
    console.warn('A binding existed, but no path could be retrieved.', bindingContext);
    return undefined;
  }

  return bindingContext.getModel().getProperty(path);
}
