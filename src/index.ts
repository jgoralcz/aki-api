import * as fs from 'fs';
import * as https from 'https';
https.globalAgent.options.ca = fs.readFileSync('node_modules/node_extra_ca_certs_mozilla_bundle/ca_bundle/ca_intermediate_root_bundle.pem');

import Aki, { answers } from './Akinator';
import { regions, region } from './constants/Client';

export {
  Aki,
  regions,
  region,
  answers
}
