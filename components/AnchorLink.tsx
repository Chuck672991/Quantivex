'use client';
import { useAnchorScroll } from '@/lib/useAnchorScroll';
import Link from 'next/link';
import type { ComponentProps, MouseEvent } from 'react';

/** next/link that smooth-scrolls to same-page hashes (see useAnchorScroll). */
const AnchorLink = ({
    href,
    onClick,
    ...rest
}: ComponentProps<typeof Link>) => {
    const scrollToAnchor = useAnchorScroll();

    return (
        <Link
            href={href}
            onClick={(event: MouseEvent<HTMLAnchorElement>) => {
                onClick?.(event);
                scrollToAnchor(event, href.toString());
            }}
            {...rest}
        />
    );
};

export default AnchorLink;
