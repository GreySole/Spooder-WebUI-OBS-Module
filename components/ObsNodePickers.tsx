import React from 'react';
import { useFormContext } from 'react-hook-form';
import { CustomFieldRendererProps } from '@spooder/webui-module-sdk';
import useOBS from '../useOBS';
import { inputOptions, sceneItemOptions, sceneOptions, siblingFormKey } from './obsPickerOptions';
import FormObsIdSelect from './FormObsIdSelect';

const OBS_NOT_CONNECTED = 'OBS is not connected. Enter the name manually, or connect OBS to pick from a list.';

export function FormObsSceneSelect(props: CustomFieldRendererProps) {
  const { formKey, label } = props;
  const { getScenes } = useOBS();
  const { data, isLoading } = getScenes();

  return (
    <FormObsIdSelect
      formKey={formKey}
      label={label}
      options={sceneOptions(data)}
      isLoading={isLoading}
      emptyMessage={OBS_NOT_CONNECTED}
      manualPlaceholder='Scene Name'
    />
  );
}

export function FormObsInputSelect(props: CustomFieldRendererProps) {
  const { formKey, label } = props;
  const { getScenes } = useOBS();
  const { data, isLoading } = getScenes();

  return (
    <FormObsIdSelect
      formKey={formKey}
      label={label}
      options={inputOptions(data)}
      isLoading={isLoading}
      emptyMessage={OBS_NOT_CONNECTED}
      manualPlaceholder='Input Name'
    />
  );
}

export function FormObsSceneItemSelect(props: CustomFieldRendererProps) {
  const { formKey, label, field } = props;
  const { getScenes } = useOBS();
  const { data, isLoading } = getScenes();
  const { watch } = useFormContext();
  // Which sibling field holds the scene this item belongs to. Watched rather than read once, so
  // changing the scene re-lists its items immediately.
  const sceneName = watch(siblingFormKey(formKey, field.options?.sceneField ?? 'scene'), '') ?? '';

  return (
    <FormObsIdSelect
      formKey={formKey}
      label={label}
      options={sceneItemOptions(data, sceneName)}
      isLoading={isLoading}
      emptyMessage={sceneName ? OBS_NOT_CONNECTED : 'Select a scene first.'}
      manualPlaceholder='Scene Item ID'
    />
  );
}
