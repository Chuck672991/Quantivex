import { TECH_STACK } from '@/lib/data';
import AnimGate from './AnimGate';
import StackIcon from './StackIcon';

const allTech = TECH_STACK.flatMap((group) => group.items);

// Doubled so the loop is seamless (translate -50% = exactly one copy)
const doubled = [...allTech, ...allTech];

// ~2s per item keeps the speed steady however long the list gets
const DURATION = `${allTech.length * 2}s`;

const Marquee = () => (
    <AnimGate
        aria-label="Technologies we work with"
        role="group"
        className="relative overflow-hidden border-b border-border bg-background py-6 select-none"
    >
        {/* Edge fades as plain gradients: a mask on a moving strip repaints it every frame */}
        <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[8%] bg-gradient-to-r from-background to-transparent"
        />
        <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[8%] bg-gradient-to-l from-background to-transparent"
        />
        <div
            className="flex w-max animate-marquee gap-12 motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-x-10 motion-reduce:gap-y-4 motion-reduce:px-6"
            style={{ animationDuration: DURATION }}
        >
            {doubled.map((item, idx) => (
                <div
                    key={`${item.name}-${idx}`}
                    aria-hidden={idx >= allTech.length}
                    className={
                        'flex items-center gap-2.5 whitespace-nowrap text-muted-foreground transition-colors duration-300 hover:text-foreground' +
                        (idx >= allTech.length ? ' motion-reduce:hidden' : '')
                    }
                >
                    <StackIcon
                        item={item}
                        size={17}
                        bare
                        mono="ink"
                        className="size-[17px] opacity-55"
                    />
                    <span className="text-[13px] font-medium tracking-tight">
                        {item.name}
                    </span>
                </div>
            ))}
        </div>
    </AnimGate>
);

export default Marquee;
