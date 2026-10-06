import { type FunctionalComponent, h } from 'vue';
import type { IconOptions, IconProps, IconSet } from 'vuetify';
import { aliases } from 'vuetify/iconsets/mdi-svg';
import { MIXTAPE_ICON_PATHS } from './icons.generated';

export type IconPaths = Readonly<Record<string, string>>;

export const MIXTAPE_ICON_SET = 'mx';

export function createIconSet(paths: IconPaths): IconSet {
  const MxSvgIcon: FunctionalComponent<IconProps> = (props, { attrs }) => {
    const path = typeof props.icon === 'string' ? paths[props.icon] : undefined;
    return h(props.tag, { ...attrs, style: null }, [
      h(
        'svg',
        { class: 'v-icon__svg', xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', role: 'img', 'aria-hidden': 'true' },
        path ? [h('path', { d: path })] : [],
      ),
    ]);
  };
  MxSvgIcon.props = ['tag', 'icon', 'disabled'];
  return { component: MxSvgIcon };
}

export function mixtapeIcons(extra: IconPaths = {}): IconOptions {
  return {
    defaultSet: MIXTAPE_ICON_SET,
    aliases,
    sets: { [MIXTAPE_ICON_SET]: createIconSet({ ...MIXTAPE_ICON_PATHS, ...extra }) },
  };
}
