import Button from '@/components/Button';
import { WORK_LINKS } from '@/lib/brand';
import Link from 'next/link';

export default function NotFound() {
    return (
        <section className="bg-lattice relative isolate flex min-h-[100svh] items-center overflow-hidden bg-background-light pb-16 pt-32">
            <div className="container">
                <p className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    <span aria-hidden className="size-1.5 bg-primary" />
                    Error 404
                </p>
                <h1 className="max-w-3xl text-balance text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-0.05em]">
                    That page isn&apos;t{' '}
                    <span className="text-gradient">in the build</span>
                </h1>
                <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                    The link may be out of date, or the page may have moved.
                    Here is a way back.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                    <Button href="/" variant="ink" size="lg" arrow>
                        Back to home
                    </Button>
                    <Button href="/#contact" variant="outline" size="lg">
                        Start a project
                    </Button>
                </div>
                <nav aria-label="Popular pages" className="mt-14">
                    <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
                        {WORK_LINKS.map((link) => (
                            <li key={link.href}>
                                <Link
                                    href={link.href}
                                    className="text-foreground/80 underline decoration-foreground/25 underline-offset-[6px] transition-colors hover:text-foreground hover:decoration-primary"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </section>
    );
}
