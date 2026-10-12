'use client';
import { cn } from '@/lib/utils';
import { useAnchorScroll } from '@/lib/useAnchorScroll';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    MouseEvent,
    ReactNode,
} from 'react';

type Variant = 'ink' | 'outline' | 'cobalt' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
    // Solid pill, the reference's primary action
    ink: 'bg-foreground text-background hover:bg-primary hover:text-primary-foreground',
    // Outlined pill, the reference's secondary action
    outline:
        'border border-foreground/80 bg-background text-foreground hover:bg-foreground hover:text-background',
    cobalt: 'bg-primary text-primary-foreground hover:bg-foreground hover:text-background',
    ghost: 'text-foreground hover:text-primary',
};

const SIZES: Record<Size, string> = {
    sm: 'h-9 px-4 text-[13px]',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-7 text-[15px]',
};

interface BaseProps {
    variant?: Variant;
    size?: Size;
    /** Show the diagonal arrow that nudges on hover. */
    arrow?: boolean;
    className?: string;
    children: ReactNode;
}

type LinkProps = BaseProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'className'> & {
        href: string;
    };

type ButtonProps = BaseProps &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
        href?: undefined;
    };

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** Pill button for every call to action: a link, an external link or a real button. */
const Button = (props: LinkProps | ButtonProps) => {
    const scrollToAnchor = useAnchorScroll();
    const {
        variant = 'ink',
        size = 'md',
        arrow = false,
        className,
        children,
    } = props;

    const classes = cn(
        'group relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        variant !== 'ghost' && SIZES[size],
        className,
    );

    const content = (
        <>
            {children}
            {arrow && (
                <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
            )}
        </>
    );

    if (props.href === undefined) {
        const {
            variant: _v,
            size: _s,
            arrow: _a,
            className: _c,
            children: _ch,
            href: _h,
            ...rest
        } = props as ButtonProps;
        return (
            <button type="button" className={classes} {...rest}>
                {content}
            </button>
        );
    }

    const {
        variant: _v,
        size: _s,
        arrow: _a,
        className: _c,
        children: _ch,
        href,
        onClick,
        ...rest
    } = props as LinkProps;

    if (isExternal(href)) {
        const newTab = href.startsWith('http');
        return (
            <a
                href={href}
                className={classes}
                {...(newTab && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                })}
                onClick={onClick}
                {...rest}
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            href={href}
            className={classes}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                onClick?.(event);
                scrollToAnchor(event, href);
            }}
            {...rest}
        >
            {content}
        </Link>
    );
};

export default Button;
