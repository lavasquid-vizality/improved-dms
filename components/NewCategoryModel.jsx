import { cloneDeep } from 'lodash';
import React, { memo, useState } from 'react';
import { getModule } from '@vizality/webpack';

import { forceUpdatePrivateChannelsList, DefaultSettings, Class } from '../constants';

const Modal = getModule(m => m.ModalRoot);
const { Heading } = getModule(m => m.Heading?.displayName === 'Heading');
const FormItem = getModule(m => m.displayName === 'FormItem');
const TextInput = getModule(m => m.displayName === 'TextInput');
const A = getModule(m => m.BorderColors);

const { header, closeButton, modalContent, marginBottom20 } = Class.header;
const { alignCenter, vertical } = getModule(m => m.alignCenter && m.vertical);

export default memo(({ transitionState, onClose, settingsGet, settingsSet, channelId }) => {
  const [ newCategory, setNewCategory ] = useState('');

  const createNewCategory = () => {
    const newSettingCategories = cloneDeep(settingsGet('Categories', DefaultSettings.Categories));
    newSettingCategories[channelId] = newCategory;
    settingsSet('Categories', newSettingCategories);

    const newSetting_Categories = cloneDeep(settingsGet('_Categories', DefaultSettings._Categories));
    newSetting_Categories[newCategory] = [];
    settingsSet('_Categories', newSetting_Categories);

    onClose();
    forceUpdatePrivateChannelsList();
  };

  return <Modal.ModalRoot transitionState={transitionState} size={Modal.ModalSize.SMALL} aria-label={'DM Create Category Modal'}>
    <Modal.ModalHeader className={header} align={alignCenter} direction={vertical} separator={false}>
      <Heading variant={'heading-lg/medium'}>{'Create Category'}</Heading>
      <Modal.ModalCloseButton className={closeButton} onClick={onClose} />
    </Modal.ModalHeader>
    <Modal.ModalContent className={modalContent}>
      <FormItem className={marginBottom20} title={'Category Name'}><TextInput autoFocus={true} placeholder={'New category'} onChange={setNewCategory} onKeyDown={e => {
        if (e.key === 'Enter') createNewCategory();
      }} /></FormItem>
    </Modal.ModalContent>
    <Modal.ModalFooter>{[
      <A onClick={createNewCategory}>{'Create Category'}</A>,
      <A color={A.Colors.PRIMARY} look={A.Looks.LINK} onClick={onClose}>{'Cancel'}</A>
    ]}</Modal.ModalFooter>
  </Modal.ModalRoot>;
});
