import { OscProvider } from '@spooder/webui-component-library';
import React from 'react';
import { useServer } from '@spooder/webui-module-sdk';
import { PageCircleLoader } from '@spooder/webui-module-sdk';
import OBSDeck from './OBSDeck';

// OBS talks to the webui over its own OSC socket rather than the shared one: tag='obs' points
// the provider at /osc/obs, which the backend OBS module opens for itself. Volume meters alone
// arrive at frame rate, and on the shared socket every open page - dashboard, OSC monitor, mod
// UI - had to receive and discard them.
//
// The provider lives here, inside the deck, so the socket only exists while the deck is on
// screen. App renders one tab at a time, so switching away unmounts this and closes the
// connection; the backend then has nobody subscribed and the stream costs nothing.
export default function ObsDeckRoot() {
  const { getServerState } = useServer();
  const { data, isLoading, error } = getServerState();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  if (error) {
    return <h1>Can't reach Spooder to open the OBS socket.</h1>;
  }

  return (
    <OscProvider host={data.host} port={data.port} tag='obs'>
      <OBSDeck />
    </OscProvider>
  );
}
