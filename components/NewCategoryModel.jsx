import { cloneDeep } from 'lodash';
import React, { memo, useState } from 'react';
import { close } from '@vizality/modal';
import { Modal } from '@vizality/components';
import { getModule } from '@vizality/webpack';

import { forceUpdatePrivateChannelsList, DefaultSettings } from '../constants';

const Header = getModule(m => m.displayName === 'Header' && m.Sizes);
const FormItem = getModule(m => m.displayName === 'FormItem');
const TextInput = getModule(m => m.displayName === 'TextInput');
const y = getModule(m => m.BorderColors);

const { header, modalTitle, closeButton, modalContent, marginBottom20 } = getModule(m => m.header && m.modalTitle);
const { alignCenter, vertical } = getModule(m => m.alignCenter && m.vertical);

export default memo(({ settingsGet, settingsSet, channelId }) => {
  const [ newCategory, setNewCategory ] = useState('');

  return <Modal size={Modal.Sizes.SMALL}>
    <Modal.Header className={header} align={alignCenter} direction={vertical}>
      <Header className={modalTitle} size={Header.Sizes.SIZE_24} tag={Header.Tags.H2}>{'Create Category'}</Header>
      <Modal.CloseButton className={closeButton} onClick={close} />
    </Modal.Header>
    <Modal.Content className={modalContent}>
      <FormItem className={marginBottom20} title={'Category Name'}><TextInput autoFocus={true} placeholder={'New category'} onChange={setNewCategory} /></FormItem>
    </Modal.Content>
    <Modal.Footer>{[
      React.createElement(y, { onClick: () => {
        const newSettingCategories = cloneDeep(settingsGet('Categories', DefaultSettings.Categories));
        newSettingCategories[channelId] = newCategory;
        settingsSet('Categories', newSettingCategories);

        const newSetting_Categories = cloneDeep(settingsGet('_Categories', DefaultSettings._Categories));
        newSetting_Categories[newCategory] = [];
        settingsSet('_Categories', newSetting_Categories);

        close();
        forceUpdatePrivateChannelsList();
      } }, 'Create Category'),
      React.createElement(y, { color: y.Colors.PRIMARY, look: y.Looks.LINK, onClick: close }, 'Cancel')
    ]}</Modal.Footer>
  </Modal>;
});
