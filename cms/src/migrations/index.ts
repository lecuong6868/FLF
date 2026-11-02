import * as migration_20261102_065818_init from './20261102_065818_init';

export const migrations = [
  {
    up: migration_20261102_065818_init.up,
    down: migration_20261102_065818_init.down,
    name: '20261102_065818_init'
  },
];
