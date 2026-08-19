export interface AppRoute {
  id: string;
  path: string;
  label: string;
  isInitial?: boolean;
}

export interface AppNavLink {
  fromRouteId: string;
  toRouteId: string;
  label?: string;
  sourceHandle?: string;
}

export interface AppRouteManifest {
  appId: string;
  routes: AppRoute[];
  links: AppNavLink[];
}

export type PreviewCanvasViewMode = 'play' | 'single' | 'interactive' | 'grid';
