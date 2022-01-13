import { cloneDeep } from 'lodash';
import React, { memo } from 'react';
import { getModule } from '@vizality/webpack';

import NewCategoryModel from './NewCategoryModel';

import { forceUpdatePrivateChannelsList, DefaultSettings } from '../constants';

const Menu = getModule(m => m.displayName === 'Menu');
const { MenuGroup, MenuItem } = getModule(m => m.MenuItem);

const { closeContextMenu } = getModule(m => m.closeContextMenu);
const { openModalLazy } = getModule(m => m.openModalLazy);

export const ContextMenu = memo(({ onSelect, settingsGet, settingsSet, value }) => {
  return <Menu onSelect={onSelect} navId={'dm-category-context'} onClose={closeContextMenu}>
    <MenuItem action={() => {
      const newSettingCategories = cloneDeep(settingsGet('Categories', DefaultSettings.Categories));
      for (const [ id, category ] of Object.entries(newSettingCategories)) {
        if (category === value) delete newSettingCategories[id];
      }
      settingsSet('Categories', newSettingCategories);

      const newSettingSectionCollapsed = cloneDeep(settingsGet('SectionCollapsed', DefaultSettings.SectionCollapsed));
      delete newSettingSectionCollapsed[value];
      settingsSet('SectionCollapsed', newSettingSectionCollapsed);

      const newSetting_Categories = cloneDeep(settingsGet('_Categories', DefaultSettings._Categories));
      delete newSetting_Categories[value];
      settingsSet('_Categories', newSetting_Categories);

      forceUpdatePrivateChannelsList();
    }} id={'delete-category'} label={'Delete Category'} color={MenuItem.Colors.DANGER} />
  </Menu>;
});

export function Pin (settingsGet, settingsSet, channelId) {
  const sections = Object.keys(settingsGet('_Categories', DefaultSettings._Categories)).filter(category => category !== 'Groups' && category !== 'Friends');

  return <MenuItem action={() => {
    const newSettingPinned = cloneDeep(settingsGet('Pinned', DefaultSettings.Pinned));
    newSettingPinned.push(channelId);
    settingsSet('Pinned', newSettingPinned);

    forceUpdatePrivateChannelsList();
  }} id={'pin-dm'} label={'Pin DM'} hasSubmenu={true}>
    <MenuGroup>{sections.map(category => <MenuItem action={() => {
      const newSettingCategories = cloneDeep(settingsGet('Categories', DefaultSettings.Categories));
      newSettingCategories[channelId] = category;
      settingsSet('Categories', newSettingCategories);

      forceUpdatePrivateChannelsList();
    }} id={`pin-dm-${category}`} label={category} />)}</MenuGroup>
    <MenuGroup><MenuItem action={() => openModalLazy(() => ModalArgs => <NewCategoryModel {...ModalArgs} settingsGet={settingsGet} settingsSet={settingsSet} channelId={channelId} />)} id={'new-category'} label={'New Category'} color={MenuItem.Colors.GREEN} /></MenuGroup>
  </MenuItem>;
}

export function Unpin (settingsGet, settingsSet, section, channelId) {
  return <MenuItem action={() => {
    if (section === 'Pinned') {
      const newSettingPinned = cloneDeep(settingsGet('Pinned', DefaultSettings.Pinned));
      newSettingPinned.splice(newSettingPinned.findIndex(element => element === channelId), 1);
      settingsSet('Pinned', newSettingPinned);
    } else {
      const newSettingCategories = cloneDeep(settingsGet('Categories', DefaultSettings.Categories));
      delete newSettingCategories[channelId];
      settingsSet('Categories', newSettingCategories);
    }

    forceUpdatePrivateChannelsList();
  }} id={'unpin-dm'} label={'Unpin DM'} />;
}
