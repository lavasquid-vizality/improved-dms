import { getModule } from '@vizality/webpack';
import { getOwnerInstance } from '@vizality/util/react';

const { scroller } = getModule(m => m.privateChannelsHeaderContainer);

export const forceUpdatePrivateChannelsList = () => getOwnerInstance(document.querySelector(`.${scroller}`)).forceUpdate();

export const SectionDragged = null;
export const AllPinnedDMs = {};
export const DMSectionLengths = {};

export const DefaultSettings = Object.freeze({
  Groups: false,
  Friends: false,
  Categories: {},
  Pinned: [],
  SectionCollapsed: {},
  _Categories: { Groups: [], Friends: [] }
});

export const Class = {
  header: {
    marginBottom20: 'marginBottom20-315RVT',
    marginTop8: 'marginTop8-24uXGp',
    marginReset: 'marginReset-28ZZyF',
    marginTop4: 'marginTop4-2JFJJI',
    modal: 'modal-1Kmy_E',
    modalContent: 'modalContent-33IoUE',
    footer: 'footer-3Qw_YA',
    description: 'description-3_aBgC marginBottom20-315RVT',
    name: 'name-2pGuEz marginBottom20-315RVT',
    type: 'type-170HeD marginBottom20-315RVT',
    cloneInfo: 'cloneInfo-1J6F5H marginTop8-24uXGp',
    icon: 'icon-1ykL9s',
    error: 'error-fZAH7V marginTop8-24uXGp',
    header: 'header-o8wV_s',
    headerSubtitle: 'headerSubtitle-di5fY5',
    headerSubtitleIcon: 'headerSubtitleIcon-6KxpXM',
    closeButton: 'closeButton-32emop',
    modalTitle: 'modalTitle-3_QDTE',
    sectionTitle: 'sectionTitle-34s8y3',
    clone: 'clone-2btwuL marginTop4-2JFJJI',
    permissionsTitle: 'permissionsTitle-3JkXB8 marginBottom20-315RVT',
    foreground: 'foreground-1dSmCM',
    background: 'background-2neGeL',
    inputWrapper: 'inputWrapper-BB4B-o',
    inputInner: 'inputInner-vW14RT',
    inputPrefix: 'inputPrefix-1HHwWv',
    switchIcon: 'switchIcon-3IwSZ_',
    channelTypeDescription: 'channelTypeDescription-2q6SPz',
    storeChannelOptionSelector: 'storeChannelOptionSelector-3aLfuI',
    username: 'username-Hafp6V',
    emptyRoles: 'emptyRoles-2uplak',
    owner: 'owner-2I4jtz',
    addMembersContainer: 'addMembersContainer-1q4XUy',
    addMemberError: 'addMemberError-2oYLeR',
    createError: 'createError-1RrkXR',
    subtitle: 'subtitle-3Lv1uG',
    radioText: 'radioText-3Mv1MY'
  }
};
