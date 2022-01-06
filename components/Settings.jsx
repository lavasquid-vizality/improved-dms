import React, { memo } from 'react';
import { Category, SwitchItem } from '@vizality/components/settings';

import { DefaultSettings } from '../constants';

export default memo(({ getSetting, updateSetting, toggleSetting }) => {
  return <>
    <Category
      title={'Predefined Categories'}
      opened
    >
      <SwitchItem
        value={getSetting('Groups', DefaultSettings.Groups)}
        onChange={() => toggleSetting('Groups')}
      >
        {'Groups'}
      </SwitchItem>
      <SwitchItem
        value={getSetting('Friends', DefaultSettings.Friends)}
        onChange={() => toggleSetting('Friends')}
      >
        {'Friends'}
      </SwitchItem>
    </Category>
  </>;
});
