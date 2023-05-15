/**
 * Config source: https://git.io/Jfefl
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import { AssetsConfig } from '@ioc:Adonis/Core/Static'

const staticConfig: AssetsConfig = {
  enabled: true,
  dotFiles: 'ignore',
  etag: true,
  lastModified: true,
  maxAge: 0,
  immutable: false,
}

export default staticConfig
