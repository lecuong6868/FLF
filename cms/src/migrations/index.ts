import * as migration_20261102_065818_init from './20261102_065818_init';
import * as migration_20261102_080539_site_blocks from './20261102_080539_site_blocks';
import * as migration_20261102_100021_visual_edit from './20261102_100021_visual_edit';
import * as migration_20261102_102449_contact_requests from './20261102_102449_contact_requests';

export const migrations = [
  {
    up: migration_20261102_065818_init.up,
    down: migration_20261102_065818_init.down,
    name: '20261102_065818_init',
  },
  {
    up: migration_20261102_080539_site_blocks.up,
    down: migration_20261102_080539_site_blocks.down,
    name: '20261102_080539_site_blocks',
  },
  {
    up: migration_20261102_100021_visual_edit.up,
    down: migration_20261102_100021_visual_edit.down,
    name: '20261102_100021_visual_edit',
  },
  {
    up: migration_20261102_102449_contact_requests.up,
    down: migration_20261102_102449_contact_requests.down,
    name: '20261102_102449_contact_requests'
  },
];
