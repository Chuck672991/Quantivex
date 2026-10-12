'use client';
import { useNavHidden } from '@/lib/scroll/navHidden';
import { cn } from '@/lib/utils';
import { motion, useScroll } from 'framer-motion';

const ScrollProgressIndicator = () => {
    // Lenis already eases the scroll, so no spring (a spring keeps a rAF loop alive)
    const { scrollYProgress } = useScroll();
    // Comes in with the navbar, once the hero's opening has played
    const hidden = useNavHidden();

    return (
        <motion.div
            aria-hidden
            style={{ scaleX: scrollYProgress }}
            className={cn(
                'fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-primary to-accent transition-opacity duration-500',
                hidden && 'opacity-0',
            )}
        />
    );
};

export default ScrollProgressIndicator;
