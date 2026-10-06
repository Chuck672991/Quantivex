import TransitionLink from '@/components/TransitionLink';
import { GENERAL_INFO } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';

const AIProjectsClosing = () => (
    <section className="relative overflow-hidden border-t border-white/[0.06] px-6 py-28 text-center lg:py-36">
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
                background:
                    'radial-gradient(45% 55% at 50% 50%, rgba(34,211,238,0.1), transparent 70%)',
            }}
        />
        <div className="relative z-10 mx-auto max-w-2xl">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.24em] text-cyan-300/80">
                Next
            </p>
            <h2 className="font-anton text-4xl uppercase leading-[0.95] text-white sm:text-5xl md:text-6xl">
                Have an AI product in mind?
            </h2>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-white/50">
                Agents, retrieval and automation pipelines — designed and
                shipped alongside the web and mobile product around them.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <a
                    href={`mailto:${GENERAL_INFO.email}?subject=${encodeURIComponent('AI project collaboration')}`}
                    className="group inline-flex items-center gap-2 bg-primary px-6 py-3.5 font-anton text-sm uppercase tracking-wider text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
                >
                    Get In Touch
                    <ArrowUpRight
                        size={18}
                        className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                </a>
                <TransitionLink
                    href="/#selected-projects"
                    className="inline-flex items-center gap-2 border border-white/15 px-5 py-3.5 text-sm font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                    All projects
                </TransitionLink>
            </div>
        </div>
    </section>
);

export default AIProjectsClosing;
