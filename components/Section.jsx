import { cloneDeep } from 'lodash';
import React, { memo } from 'react';
import { getModule } from '@vizality/webpack';
import { sleep } from '@vizality/util/time';

import { ContextMenu } from './MenuItems';

// eslint-disable-next-line no-unused-vars
import { forceUpdatePrivateChannelsList, SectionDragged, DefaultSettings } from '../constants';

const Clickable = getModule(m => m.displayName === 'Clickable');

const { openContextMenu } = getModule(m => m.openContextMenu);
const { DropTarget, DragSource } = getModule(m => m.DropTarget && m.DragSource);

const { clickable } = getModule('clickable', 'collapsed');
const { containerDefault, containerDragBefore } = getModule(m => m.containerDefault && m.icon);

const SectionDragSource = {
  beginDrag: props => {
    SectionDragged = props.value;
    sleep(1).then(forceUpdatePrivateChannelsList);
    return { key: props.RenderSection.key };
  },
  endDrag: (props, monitor) => {
    SectionDragged = null;
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      const _categories = cloneDeep(props.keys);
      _categories.splice(_categories.indexOf(props.value), 1);
      _categories.splice(dropResult.value ? _categories.indexOf(dropResult.value) : _categories.length, 0, props.value);
      props.settingsSet('_Categories', _categories.reduce((current, value) => ({ ...current, [value]: [] }), {}));
    }
    forceUpdatePrivateChannelsList();
  }
};
const SectionDragCollect = connect => ({
  connectDragSource: connect.dragSource()
});

const SectionDropSource = {
  drop: props => {
    return { value: props.value };
  },
  hover: (props, monitor) => {
    const item =  monitor.getItem();
    switch (props.RenderSection.key - item.key) {
      case 0: {
        props.className = containerDragBefore;
        break;
      }
      case 1: {
        props.className = containerDefault;
        break;
      }
      default: {
        props.className = containerDragBefore;
      }
    }
  },
  canDrop: (props, monitor) => {
    const item =  monitor.getItem();
    const positionDifference = props.RenderSection.key - item.key;
    return positionDifference !== 0 && positionDifference !== 1;
  }
};
const SectionDropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver()
});

const Section = memo(({ value, RenderSection, settingsGet, settingsSet, className, isOver, connectDragSource, connectDropTarget }) => {
  return connectDropTarget(connectDragSource(<div className={isOver ? className : containerDefault} draggable={true} onContextMenu={e =>
    value !== 'Groups' && value !== 'Friends'
      ? openContextMenu(e, e => <ContextMenu {...e} settingsGet={settingsGet} settingsSet={settingsSet} value={value} />)
      : void 0
  }>
    <Clickable className={clickable} onClick={() => {
      const SectionCollapsed = settingsGet('SectionCollapsed', DefaultSettings.SectionCollapsed);
      SectionCollapsed[value] = !SectionCollapsed[value];
      settingsSet('SectionCollapsed', SectionCollapsed);
      forceUpdatePrivateChannelsList();
    }}>{RenderSection}</Clickable>
  </div>));
});

const SectionDrag = DragSource('dmsection', SectionDragSource, SectionDragCollect)(Section);
export const SectionDragDrop = DropTarget('dmsection', SectionDropSource, SectionDropCollect)(SectionDrag);

export const SectionDrop = DropTarget('dmsection', SectionDropSource, SectionDropCollect)(
  memo(({ RenderSection, className, isOver, connectDropTarget }) => connectDropTarget(
    <div className={isOver ? className : containerDefault}>{RenderSection}</div>)
  )
);
