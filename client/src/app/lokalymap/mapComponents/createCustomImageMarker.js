import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { CustomImageMarker } from './CustomImageMarker';


export function createCustomImageMarker(businessTypeKey) {
  const htmlString = ReactDOMServer.renderToString(
    <CustomImageMarker businessTypeKey={businessTypeKey} />
  );

  const container = document.createElement('div');
  container.innerHTML = htmlString;
  return container.firstChild;
}
