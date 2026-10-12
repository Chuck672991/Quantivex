import Button from '@/components/Button';

const AIProjectsClosing = () => (
    <section className="relative overflow-hidden border-t border-border/60 px-6 py-28 text-center lg:py-36">
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
                background:
                    'radial-gradient(45% 55% at 50% 50%, hsl(var(--primary) / 0.12), transparent 70%)',
            }}
        />
        <div className="relative z-10 mx-auto max-w-2xl">
            <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                Work with us
            </p>
            <h2 className="text-balance font-display text-[clamp(2rem,6vw,3.75rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-foreground">
                Have an AI product in mind?
            </h2>
            <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
                Agents, retrieval and automation pipelines — designed and
                shipped alongside the web and mobile product around them.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Button href="/#contact" variant="ink" size="lg" arrow>
                    Start a project
                </Button>
                <Button href="/#work" variant="outline" size="lg">
                    See all work
                </Button>
            </div>
        </div>
    </section>
);

export default AIProjectsClosing;
