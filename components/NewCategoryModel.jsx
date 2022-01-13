import { cloneDeep } from 'lodash';
import React, { memo, useState } from 'react';
import { getModule } from '@vizality/webpack';

import { forceUpdatePrivateChannelsList, DefaultSettings, Class } from '../constants';

const Modal = getModule(m => m.ModalRoot);
const Header = getModule(m => m.displayName === 'Header' && m.Sizes);
const FormItem = getModule(m => m.displayName === 'FormItem');
const TextInput = getModule(m => m.displayName === 'TextInput');
const y = getModule(m => m.BorderColors);

const { alignCenter, vertical } = getModule(m => m.alignCenter && m.vertical);

export default memo(({ transitionState, onClose, settingsGet, settingsSet, channelId }) => {
  const { header, modalTitle, closeButton, modalContent, marginBottom20 } = getModule(m => m.header && m.modalTitle) ?? Class.header;

  const [ newCategory, setNewCategory ] = useState('');

  return <Modal.ModalRoot transitionState={transitionState} size={Modal.ModalSize.SMALL}>
    <Modal.ModalHeader className={header} align={alignCenter} direction={vertical}>
      <Header className={modalTitle} size={Header.Sizes.SIZE_24} tag={Header.Tags.H2}>{'Create Category'}</Header>
      <Modal.ModalCloseButton className={closeButton} onClick={onClose} />
    </Modal.ModalHeader>
    <Modal.ModalContent className={modalContent}>
      <FormItem className={marginBottom20} title={'Category Name'}><TextInput autoFocus={true} placeholder={'New category'} onChange={setNewCategory} /></FormItem>
    </Modal.ModalContent>
    <Modal.ModalFooter>{[
      React.createElement(y, { onClick: () => {
        const newSettingCategories = cloneDeep(settingsGet('Categories', DefaultSettings.Categories));
        newSettingCategories[channelId] = newCategory;
        settingsSet('Categories', newSettingCategories);

        const newSetting_Categories = cloneDeep(settingsGet('_Categories', DefaultSettings._Categories));
        newSetting_Categories[newCategory] = [];
        settingsSet('_Categories', newSetting_Categories);

        onClose();
        forceUpdatePrivateChannelsList();
      } }, 'Create Category'),
      React.createElement(y, { color: y.Colors.PRIMARY, look: y.Looks.LINK, onClick: onClose }, 'Cancel')
    ]}</Modal.ModalFooter>
  </Modal.ModalRoot>;
});
