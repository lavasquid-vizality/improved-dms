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
