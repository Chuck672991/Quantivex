export type Next_Page_Url = string;
// UrlObject;
// | __next_route_internal_types__.StaticRoutes
// | __next_route_internal_types__.DynamicRoutes;

export interface IProject {
    title: string;
    year: number;
    description: string;
    role: string;
    techStack: string[];
    thumbnail: string;
    longThumbnail: string;
    images: string[];
    slug: string;
    liveUrl?: string;
    sourceCode?: string;
    hidden?: boolean;
}

/** Keys for the lucide glyph shown when a skill has no logo in /public/logo. */
export type StackGlyph =
    | 'bot'
    | 'wrench'
    | 'cable'
    | 'layers'
    | 'route'
    | 'braces'
    | 'terminal'
    | 'user-check'
    | 'shield'
    | 'brain'
    | 'sparkles'
    | 'mic'
    | 'triangle'
    | 'workflow'
    | 'webhook'
    | 'radio'
    | 'zap'
    | 'box'
    | 'flame'
    | 'plug'
    | 'globe'
    | 'network'
    | 'git-branch'
    | 'rocket'
    | 'credit-card'
    | 'map-pin'
    | 'bell'
    | 'messages';

export interface IStackItem {
    name: string;
    /** Qualifier lifted from the CV, e.g. "Aggregation Pipelines". */
    detail?: string;
    /** Logo path under /public. Omit it to fall back to `glyph`. */
    icon?: string;
    glyph?: StackGlyph;
}

export interface IStackGroup {
    key: string;
    label: string;
    /** Marks the AI-focused groups so the UI can flag them. */
    ai?: boolean;
    items: IStackItem[];
}
