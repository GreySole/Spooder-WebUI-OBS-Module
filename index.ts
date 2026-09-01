import { faGamepad } from '@fortawesome/free-solid-svg-icons';
import type { ModuleDefinition } from '@spooder/webui-module-sdk';
import FormOBSSceneItemSelect from './components/FormOBSSceneItemSelect';
import OBSSceneItemSelect from './components/OBSSceneItemSelect';
import ObsDeckRoot from './obsDeck/ObsDeckRoot';
import { obsControlApi } from './obsControlSlice';
import { obsFetchApi } from './obsFetchSlice';
import { obsApi } from './obsSlice';

const ObsModule: ModuleDefinition = {
  key: 'obs',
  tabConfig: {
    label: 'OBS Remote',
    icon: faGamepad,
    // Sits with the decks (OSC Monitor, Mod UI), as module tabs do by default.
    parentTab: 'deck',
  },
  Component: ObsDeckRoot,
  // The backend splits OBS over three route prefixes (/obs, /obs/fetch, /obs/control),
  // one RTK Query api each.
  api: [obsApi, obsFetchApi, obsControlApi],
  // Plugin settings fields of `type: 'obs'` - a scene plus one of its items.
  pluginInputs: {
    obs: { form: FormOBSSceneItemSelect, controlled: OBSSceneItemSelect },
  },
};

export default ObsModule;
