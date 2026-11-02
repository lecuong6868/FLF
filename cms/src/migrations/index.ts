import * as migration_20261102_065818_init from './20261102_065818_init';
import * as migration_20261102_080539_site_blocks from './20261102_080539_site_blocks';

export const migrations = [
  {
    up: migration_20261102_065818_init.up,
    down: migration_20261102_065818_init.down,
    name: '20261102_065818_init',
  },
  {
    up: migration_20261102_080539_site_blocks.up,
    down: migration_20261102_080539_site_blocks.down,
    name: '20261102_080539_site_blocks'
  },
];
