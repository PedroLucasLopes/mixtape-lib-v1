import { type FunctionalComponent, h } from 'vue';
import type { IconOptions, IconProps, IconSet } from 'vuetify';
import { aliases } from 'vuetify/iconsets/mdi-svg';
import { MIXTAPE_ICON_PATHS } from './icons.generated';

export interface IconShape {
  path: string;
  viewBox: string;
}

export type IconPaths = Readonly<Record<string, string | IconShape>>;

export const MIXTAPE_ICON_SET = 'mx';

const MDI_VIEW_BOX = '0 0 24 24';

export function createIconSet(paths: IconPaths): IconSet {
  const MxSvgIcon: FunctionalComponent<IconProps> = (props, { attrs }) => {
    const entry = typeof props.icon === 'string' ? paths[props.icon] : undefined;
    const shape = typeof entry === 'string' ? { path: entry, viewBox: MDI_VIEW_BOX } : entry;
    return h(props.tag, { ...attrs, style: null }, [
      h(
        'svg',
        { class: 'v-icon__svg', xmlns: 'http://www.w3.org/2000/svg', viewBox: shape?.viewBox ?? MDI_VIEW_BOX, role: 'img', 'aria-hidden': 'true' },
        shape ? [h('path', { d: shape.path })] : [],
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
