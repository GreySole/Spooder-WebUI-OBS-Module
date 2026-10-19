import { KeyedObject, SelectOption } from '@spooder/webui-module-sdk';

// /obs/get_scenes answers { status: 'notconnected' } instead of erroring when OBS isn't hooked
// up, so a disconnected OBS looks like an empty list rather than a failed query - which is what
// lets the node field fall back to manual entry instead of breaking.
export function sceneOptions(data?: KeyedObject): SelectOption[] {
  const options: SelectOption[] = [{ value: '', label: 'Select Scene' }];
  for (const index in data?.scenes ?? {}) {
    options.push({ value: data!.scenes[index].sceneName, label: data!.scenes[index].sceneName });
  }
  return options;
}

export function inputOptions(data?: KeyedObject): SelectOption[] {
  const options: SelectOption[] = [{ value: '', label: 'Select Input' }];
  for (const input of data?.inputs ?? []) {
    options.push({ value: input.inputName, label: input.inputName });
  }
  return options;
}

// Scene items are only in the payload keyed by scene *index*, so the chosen scene's name has to
// be resolved back to its index first.
export function sceneItemOptions(data: KeyedObject | undefined, sceneName: string): SelectOption[] {
  const options: SelectOption[] = [{ value: '', label: 'Select Item' }];
  if (!sceneName) {
    return options;
  }
  const sceneIndex = Object.keys(data?.scenes ?? {}).find(
    (index) => data!.scenes[index].sceneName === sceneName,
  );
  if (sceneIndex == null) {
    return options;
  }
  const items = data?.sceneItems?.[sceneIndex] ?? {};
  for (const itemId in items) {
    options.push({ value: String(items[itemId].sceneItemId), label: items[itemId].sourceName });
  }
  return options;
}

// A scene item picker is scoped to whichever sibling field holds the scene name. The field def
// names that sibling by its path under the node's values (options.sceneField), and the two share
// everything up to the last segment of the form key - `...nodes.3.values.item` ->
// `...values.scene` - the same convention Discord's channel/role pickers use for their guild
// field (see DiscordNodePickers).
export function siblingFormKey(formKey: string, siblingPath: string): string {
  return formKey.replace(/[^.]+$/, siblingPath);
}
