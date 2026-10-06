import Image from 'next/image';
import {
    Bell,
    Bot,
    Box,
    BrainCircuit,
    Braces,
    Cable,
    CreditCard,
    Flame,
    GitBranch,
    Globe,
    Layers,
    MapPin,
    MessagesSquare,
    Mic,
    Network,
    Plug,
    Radio,
    Rocket,
    Route,
    ShieldCheck,
    Sparkles,
    Terminal,
    Triangle,
    UserCheck,
    Webhook,
    Workflow,
    Wrench,
    Zap,
    type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { IStackItem, StackGlyph } from '@/types';

const GLYPHS: Record<StackGlyph, LucideIcon> = {
    bot: Bot,
    wrench: Wrench,
    cable: Cable,
    layers: Layers,
    route: Route,
    braces: Braces,
    terminal: Terminal,
    'user-check': UserCheck,
    shield: ShieldCheck,
    brain: BrainCircuit,
    sparkles: Sparkles,
    mic: Mic,
    triangle: Triangle,
    workflow: Workflow,
    webhook: Webhook,
    radio: Radio,
    zap: Zap,
    box: Box,
    flame: Flame,
    plug: Plug,
    globe: Globe,
    network: Network,
    'git-branch': GitBranch,
    rocket: Rocket,
    'credit-card': CreditCard,
    'map-pin': MapPin,
    bell: Bell,
    messages: MessagesSquare,
};

interface Props {
    item: Pick<IStackItem, 'icon' | 'glyph'>;
    /** Box size in px. */
    size?: number;
    /** Glyphs render without the tinted tile (used by the marquee). */
    bare?: boolean;
    className?: string;
}

/** Decorative: the skill name is always rendered next to it. */
const StackIcon = ({ item, size = 32, bare = false, className }: Props) => {
    if (item.icon) {
        return (
            <Image
                src={item.icon}
                alt=""
                width={size}
                height={size}
                className={cn('object-contain', className)}
                style={{ width: size, height: size }}
            />
        );
    }

    const Glyph = GLYPHS[item.glyph ?? 'sparkles'];

    if (bare) {
        return (
            <Glyph
                size={size}
                strokeWidth={1.7}
                className={className}
                aria-hidden
            />
        );
    }

    return (
        <span
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary',
                className,
            )}
            style={{ width: size, height: size }}
            aria-hidden
        >
            <Glyph size={Math.round(size * 0.56)} strokeWidth={1.7} />
        </span>
    );
};

export default StackIcon;
