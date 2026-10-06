'use client';
import { MY_STACK } from '@/lib/data';
import StackIcon from './StackIcon';

const allTech = MY_STACK.flatMap((group) => group.items);

// Double the list so the seamless-loop trick works (translate -50% = one full copy)
const doubled = [...allTech, ...allTech];

// ~2s per item keeps the scroll speed steady however long the stack list gets
const DURATION = `${allTech.length * 2}s`;

const Marquee = () => {
    return (
        <div className="w-full overflow-hidden py-6 border-y border-border/50 bg-background-light/60 backdrop-blur-sm select-none">
            <div
                className="flex animate-marquee w-max gap-14"
                style={{ animationDuration: DURATION }}
            >
                {doubled.map((item, idx) => (
                    <div
                        key={`${item.name}-${idx}`}
                        className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
                    >
                        <StackIcon
                            item={item}
                            size={18}
                            bare
                            className="w-[18px] h-[18px] opacity-60"
                        />
                        <span className="text-xs font-medium tracking-widest uppercase">
                            {item.name}
                        </span>
                        <span className="ml-6 text-border/80 text-lg leading-none">
                            ·
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
