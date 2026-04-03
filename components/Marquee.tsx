'use client';
import { MY_STACK } from '@/lib/data';
import Image from 'next/image';

const allTech = [
    ...MY_STACK.frontend,
    ...MY_STACK.backend,
    ...MY_STACK.database,
    ...MY_STACK.tools,
];

// Double the list so the seamless-loop trick works (translate -50% = one full copy)
const doubled = [...allTech, ...allTech];

const Marquee = () => {
    return (
        <div className="w-full overflow-hidden py-6 border-y border-border/50 bg-background-light/60 backdrop-blur-sm select-none">
            <div className="flex animate-marquee w-max gap-14">
                {doubled.map((item, idx) => (
                    <div
                        key={`${item.name}-${idx}`}
                        className="flex items-center gap-2.5 text-muted-foreground hover:text-foreground transition-colors duration-300 whitespace-nowrap"
                    >
                        <Image
                            src={item.icon}
                            alt={item.name}
                            width={18}
                            height={18}
                            className="w-[18px] h-[18px] opacity-60 group-hover:opacity-100"
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
