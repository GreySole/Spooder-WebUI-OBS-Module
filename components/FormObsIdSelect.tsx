import { faExclamationTriangle, faKeyboard, faListUl } from '@fortawesome/free-solid-svg-icons';
import { Button, FormSelectDropdown, FormTextInput, TypeFace } from '@spooder/webui-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { SelectOption } from '@spooder/webui-module-sdk';

// Mirrors Discord's FIELD_BUTTON_STYLE/FIELD_BUTTON_ICON_SIZE (DiscordNodePickers) - sized for
// the same 26px .node-inline-field row, kept local since nothing else in this module shares it.
const FIELD_BUTTON_STYLE: React.CSSProperties = {
  flex: '0 0 auto',
  alignSelf: 'stretch',
  minWidth: 36,
  padding: '0 10px',
};
const FIELD_BUTTON_ICON_SIZE = 'medium';

interface FormObsIdSelectProps {
  formKey: string;
  label?: string;
  options: SelectOption[];
  // True while the list is still in flight: the value can't be checked against the options
  // yet, so the control mustn't decide it is unknown (see below).
  isLoading?: boolean;
  // Shown on the toggle button when there's nothing to pick from.
  emptyMessage: string;
  manualPlaceholder: string;
}

// One OBS name (a scene, an input, a scene item), picked from what OBS currently reports or
// typed in by hand.
//
// OBS being offline can't leave the node uneditable - so the dropdown is a convenience over a
// plain text value, never a cage around it. With nothing to pick from, the control falls back to
// manual entry on its own. A value that doesn't match anything in a list that *did* load - OBS
// is connected, but a scene got renamed or removed since this node was set up - does the same,
// and is flagged with a warning icon rather than silently falling back to 'Select Scene'.
export default function FormObsIdSelect(props: FormObsIdSelectProps) {
  const { formKey, label, options, isLoading, emptyMessage, manualPlaceholder } = props;
  const { watch, setValue } = useFormContext();
  const [preferManual, setPreferManual] = useState(false);
  const value = watch(formKey, '') ?? '';

  const hasOptions = options.length > 1;
  const known = options.some((option) => option.value === value);
  // Only meaningful once a real list has loaded - with nothing fetched, every value looks
  // unknown, and that is a "can't tell" state (OBS not connected), not a stale one.
  const stale = hasOptions && !isLoading && value !== '' && !known;
  const showManual = preferManual || stale || !hasOptions;

  function toggleManual() {
    // Leaving manual mode with a name the list doesn't contain would show the placeholder while
    // the field still held that name - clearing it keeps the control and the value in sync.
    if (showManual && !known) {
      setValue(formKey, '', { shouldDirty: true });
    }
    setPreferManual(!showManual);
  }

  return (
    <div>
      {label ? <TypeFace>{label}</TypeFace> : null}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          {showManual ? (
            <FormTextInput formKey={formKey} placeholder={manualPlaceholder} />
          ) : (
            <FormSelectDropdown formKey={formKey} options={options} />
          )}
        </div>
        {stale ? (
          <Button
            icon={faExclamationTriangle}
            iconSize={FIELD_BUTTON_ICON_SIZE}
            style={FIELD_BUTTON_STYLE}
            disabled
            onClick={() => {}}
            tooltipText={`'${value}' wasn't found in OBS - it may have been renamed or removed.`}
          />
        ) : null}
        <Button
          icon={showManual || !hasOptions ? faListUl : faKeyboard}
          iconSize={FIELD_BUTTON_ICON_SIZE}
          style={FIELD_BUTTON_STYLE}
          disabled={!hasOptions}
          tooltipText={
            !hasOptions
              ? emptyMessage
              : showManual
                ? 'Pick from the list instead'
                : 'Enter the name manually'
          }
          onClick={toggleManual}
        />
      </div>
    </div>
  );
}
