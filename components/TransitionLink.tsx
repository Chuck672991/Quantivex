'use client';
import gsap from 'gsap';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<typeof Link> {
    back?: boolean;
}

const TransitionLink = ({
    href,
    onClick,
    children,
    back = false,
    ...rest
}: Props) => {
    const router = useRouter();

    const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        gsap.set('.page-transition', { yPercent: 100 });
        gsap.set('.page-transition--inner', { yPercent: 100 });

        const tl = gsap.timeline();

        tl.to('.page-transition', {
            yPercent: 0,
            duration: 0.3,
        });

        tl.then(() => {
            if (back) {
                router.back();
            } else if (href) {
                router.push(href.toString());
            } else if (onClick) {
                onClick(e);
            }
        });
    };

    return (
        <Link href={href} {...rest} onClick={handleLinkClick}>
            {children}
        </Link>
    );
};

export default TransitionLink;
