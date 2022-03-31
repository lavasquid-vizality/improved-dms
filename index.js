import { cloneDeep } from 'lodash';
import React from 'react';
import react from '@vizality/react';
import { Plugin } from '@vizality/entities';
import { patch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';

import { Pin, Unpin } from './components/MenuItems';
import { SectionDragDrop, SectionDrop } from './components/Section';

import TempPatch from './modules/TempPatch';

import { SectionDragged, AllPinnedDMs, DMSectionLengths, DefaultSettings } from './constants';

const { MenuGroup } = getModule(m => m.MenuItem);
const DropdownArrow = getModule(m => m.displayName === 'DropdownArrow');
const { NumberBadge } = getModule(m => m.NumberBadge);
const PinIcon = getModule(m => m.displayName === 'Pin');

const Constants = getModule(m => m.API_HOST);
const { getPrivateChannelIds } = getModule(m => m.getPrivateChannelIds);
const { getRelationships } = getModule(m => m.getRelationships);
const { getMentionCount } = getModule(m => m.getMentionCount);

const { collapsed, icon } = getModule('clickable', 'collapsed');

export default class ImprovedDMs extends Plugin {
  start () {
    this.injectStyles('./style.css');
    this.patch();
  }

  patch () {
    Promise.resolve(react.getComponent('PrivateChannelsList')).then(({ component: PrivateChannelsList }) => {
      patch(getModule(m => m.displayName === 'AnalyticsContext').prototype, 'renderProvider', (args, res) => {
        if (res.props.value.location.object !== 'Context Menu') return res;
        if (res.props.children.type.displayName !== 'DMUserContextMenu' && res.props.children.type.displayName !== 'GroupDMContextMenu') return res;

        TempPatch(res.props.children, 'type', Type => {
          const { id: channelId } = res.props.children.props.channel;
          const section = AllPinnedDMs[channelId];

          Type.props.children.unshift(<MenuGroup>{
            !section || section === 'Groups' || section === 'Friends'
              ? Pin(this.settings.get, this.settings.set, channelId)
              : Unpin(this.settings.get, this.settings.set, section, channelId)
          }</MenuGroup>);
          return Type;
        });

        return res;
      });

      patch(PrivateChannelsList.prototype, 'render', (args, res, _this) => {
        const { channels, selectedChannelId } = _this.props;

        const GroupSection = this.settings.get('Groups', DefaultSettings.Groups);
        const FriendSection = this.settings.get('Friends', DefaultSettings.Friends);
        const Categories = this.settings.get('Categories', DefaultSettings.Categories);
        const Pinned = this.settings.get('Pinned', DefaultSettings.Pinned);
        const SectionCollapsed = this.settings.get('SectionCollapsed', DefaultSettings.SectionCollapsed);

        AllPinnedDMs = {};
        const CategoryDMs = cloneDeep(this.settings.get('_Categories', DefaultSettings._Categories));
        const PinnedDMs = [];
        const OtherDMs = [];
        for (const privateChannelId of getPrivateChannelIds()) {
          const channel = channels[privateChannelId];

          if (channel) {
            const categoryDMs = Categories[privateChannelId];
            if (CategoryDMs[categoryDMs]) {
              CategoryDMs[categoryDMs].push(selectedChannelId !== channel.id && SectionCollapsed[categoryDMs] || SectionDragged ? null : privateChannelId);
              AllPinnedDMs[privateChannelId] = categoryDMs;
            } else if (Pinned.includes(privateChannelId)) {
              PinnedDMs.push(privateChannelId);
              AllPinnedDMs[privateChannelId] = 'Pinned';
            } else if (GroupSection && channel.isGroupDM()) {
              CategoryDMs.Groups.push(selectedChannelId !== channel.id && SectionCollapsed.Groups || SectionDragged ? null : privateChannelId);
              AllPinnedDMs[privateChannelId] = 'Groups';
            } else if (FriendSection && channel.isDM() && getRelationships()[channel.recipients[0]] === Constants.RelationshipTypes.FRIEND) {
              CategoryDMs.Friends.push(selectedChannelId !== channel.id && SectionCollapsed.Friends || SectionDragged ? null : privateChannelId);
              AllPinnedDMs[privateChannelId] = 'Friends';
            } else OtherDMs.push(privateChannelId);
          }
        }
        _this.props.privateChannelIds = [ ...Object.values(CategoryDMs).flat(), ...PinnedDMs, ...OtherDMs ];

        DMSectionLengths = {};
        for (const [ name, value ] of Object.entries(CategoryDMs)) {
          DMSectionLengths[name] = value.length;
        }
        DMSectionLengths.Others = PinnedDMs.length + OtherDMs.length;

        TempPatch(res.props, 'children', Children => {
          TempPatch(Children.props, 'children', Children => {
            const { sections } = Children.props;
            sections.pop();
            sections.push(...Object.values(DMSectionLengths));

            TempPatch(Children.props, 'rowHeight', (_RowHeight, section, row) => {
              const { privateChannelIds } = _this.props;
              if (section > 1) {
                for (let index = section - 1; index >= 1; index--) {
                  row += sections[index];
                }
              }

              const name = Object.keys(DMSectionLengths)[section - 1];
              if (SectionCollapsed[name] && (privateChannelIds[row] !== selectedChannelId || privateChannelIds[row] === null) || SectionDragged && name && name !== 'Others') return 0;
            }, true);

            TempPatch(Children.props, 'renderSection', RenderSection => {
              if (!RenderSection) return RenderSection;

              const keys = [ ...Object.keys(DMSectionLengths) ];
              keys.pop();

              const value = keys[RenderSection.key - 1];
              if (value) {
                const { props } = RenderSection;

                props.children[0].props = {
                  ...props.children[0].props,
                  children: value
                };

                RenderSection.props = {
                  ...props,
                  className: `${props.className}${SectionCollapsed[value] ? ` ${collapsed}` : ''}`,
                  children: [
                    <DropdownArrow className={`IDM-DropdownArrow ${icon}`} />,
                    props.children[0],
                    <NumberBadge count={Object.values(DMSectionLengths)[RenderSection.key - 1]} color={Constants.Colors.BRAND} />
                  ]
                };

                return <SectionDragDrop keys={keys} value={value} RenderSection={RenderSection} settingsGet={this.settings.get} settingsSet={this.settings.set} />;
              }
              return <SectionDrop RenderSection={RenderSection} />;
            });

            TempPatch(Children.props, 'renderRow', (_RenderRow, Args) => {
              if (Args.section > 1) {
                for (let index = Args.section - 2; index >= 0; index--) {
                  Args.row += Object.values(DMSectionLengths)[index];
                }
              }
            }, true);
            return Children;
          });
          return Children;
        });

        return res;
      });
    });

    patch(getModule(m => m.displayName === 'PrivateChannel').prototype, 'render', (args, res, _this) => {
      TempPatch(res, 'type', Type => {
        const { id } = _this.props.channel;

        const Pinned = this.settings.get('Pinned', DefaultSettings.Pinned);
        const mentionCount = getMentionCount(id);

        Type.props.children.props.children.splice(1, 0, <>
          {!!mentionCount && <NumberBadge className={'IDM-DMIcons'} count={mentionCount} />}
          {Pinned.includes(id) && <PinIcon className={'IDM-DMIcons'} />}
        </>);
        return Type;
      });
    });
  }
}
