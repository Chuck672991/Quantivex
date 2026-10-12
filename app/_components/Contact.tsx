'use client';
import Button from '@/components/Button';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { BRAND, SOCIAL_LINKS } from '@/lib/brand';
import { cn } from '@/lib/utils';
import { ArrowUpRight, Check } from 'lucide-react';
import { useId, useState, type FormEvent } from 'react';

const PROJECT_TYPES = [
    'Web platform',
    'Mobile app',
    'AI solution',
    'SaaS platform',
    'Custom software',
    'Something else',
];

const NEXT_STEPS = [
    'You send a short note about the product and what you want it to do.',
    'We reply with questions, or a call to talk it through.',
    'If we are a good fit, we scope the work together.',
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Field = 'name' | 'email' | 'message';
type Errors = Partial<Record<Field, string>>;

const inputClass = (invalid: boolean) =>
    cn(
        'w-full rounded-xl border bg-background px-4 text-[15px] text-foreground transition-colors duration-200 placeholder:text-muted-foreground/70',
        'focus-visible:border-primary focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15',
        invalid
            ? 'border-destructive'
            : 'border-border hover:border-foreground/30',
    );

const Contact = () => {
    const uid = useId();
    const [errors, setErrors] = useState<Errors>({});
    const [sentLink, setSentLink] = useState<string | null>(null);

    const idFor = (field: string) => `${uid}-${field}`;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const value = (key: string) => String(data.get(key) ?? '').trim();

        const name = value('name');
        const email = value('email');
        const company = value('company');
        const type = value('type');
        const message = value('message');

        const next: Errors = {};
        if (!name) next.name = 'Please tell us your name.';
        if (!EMAIL_PATTERN.test(email))
            next.email = 'Enter a valid email address.';
        if (message.length < 10)
            next.message =
                'A sentence or two about the project helps us reply well.';

        setErrors(next);
        setSentLink(null);

        const firstInvalid = (['name', 'email', 'message'] as Field[]).find(
            (field) => next[field],
        );
        if (firstInvalid) {
            document.getElementById(idFor(firstInvalid))?.focus();
            return;
        }

        const subject = `${BRAND.emailSubject}${
            company ? ` (${company})` : ''
        }`;
        const details = [
            `Name: ${name}`,
            `Email: ${email}`,
            company ? `Company: ${company}` : null,
            type ? `Looking for: ${type}` : null,
        ].filter((line): line is string => Boolean(line));
        const body = [message, '', '—', ...details].join('\n');

        const link = `mailto:${BRAND.email}?subject=${encodeURIComponent(
            subject,
        )}&body=${encodeURIComponent(body)}`;
        setSentLink(link);
        window.location.href = link;
    };

    return (
        <section id="contact" className="py-24 md:py-36">
            <div className="container grid gap-16 lg:grid-cols-12 lg:gap-10">
                <div className="lg:col-span-5">
                    <SectionHeading
                        index="08"
                        label="Contact"
                        title={
                            <>
                                Tell us what you are{' '}
                                <span className="text-gradient">building</span>
                            </>
                        }
                    >
                        <p>
                            Share a few details and your email app will open
                            with the message ready to send. {BRAND.responseNote}
                        </p>
                    </SectionHeading>

                    <Reveal delay={0.1} className="mt-12">
                        <dl className="divide-y divide-border border-y border-border text-[15px]">
                            <div className="flex items-center justify-between gap-6 py-4">
                                <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                    Email
                                </dt>
                                <dd>
                                    <a
                                        href={`mailto:${BRAND.email}`}
                                        className="underline decoration-foreground/25 underline-offset-[6px] transition-colors hover:decoration-primary"
                                    >
                                        {BRAND.email}
                                    </a>
                                </dd>
                            </div>
                            {SOCIAL_LINKS.map((link) => (
                                <div
                                    key={link.name}
                                    className="flex items-center justify-between gap-6 py-4"
                                >
                                    <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                        {link.name}
                                    </dt>
                                    <dd>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group inline-flex items-center gap-1.5 transition-colors hover:text-primary"
                                        >
                                            Visit profile
                                            <ArrowUpRight
                                                size={15}
                                                aria-hidden
                                                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                            />
                                        </a>
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </Reveal>

                    <Reveal delay={0.18} className="mt-12">
                        <h3 className="mb-5 font-mono text-[11px] font-normal uppercase tracking-[0.2em] text-muted-foreground">
                            What happens next
                        </h3>
                        <ol className="space-y-4">
                            {NEXT_STEPS.map((step, i) => (
                                <li
                                    key={step}
                                    className="flex gap-4 text-[15px] leading-snug"
                                >
                                    <span className="grid size-6 shrink-0 place-items-center rounded-full border border-border font-mono text-[11px]">
                                        {i + 1}
                                    </span>
                                    <span className="pt-0.5 text-foreground/85">
                                        {step}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    </Reveal>
                </div>

                <Reveal className="lg:col-span-7" amount={0.1}>
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        aria-label="Project inquiry"
                        className="rounded-[28px] border border-border bg-background p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] sm:p-10"
                    >
                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor={idFor('name')}
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Name{' '}
                                    <span aria-hidden className="text-primary">
                                        *
                                    </span>
                                </label>
                                <input
                                    id={idFor('name')}
                                    name="name"
                                    autoComplete="name"
                                    required
                                    aria-required="true"
                                    aria-invalid={Boolean(errors.name)}
                                    aria-describedby={
                                        errors.name
                                            ? `${idFor('name')}-error`
                                            : undefined
                                    }
                                    placeholder="Your name"
                                    className={cn(
                                        inputClass(Boolean(errors.name)),
                                        'h-12',
                                    )}
                                />
                                {errors.name && (
                                    <p
                                        id={`${idFor('name')}-error`}
                                        role="alert"
                                        className="mt-2 text-[13px] text-destructive"
                                    >
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor={idFor('email')}
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Email{' '}
                                    <span aria-hidden className="text-primary">
                                        *
                                    </span>
                                </label>
                                <input
                                    id={idFor('email')}
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    aria-required="true"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={
                                        errors.email
                                            ? `${idFor('email')}-error`
                                            : undefined
                                    }
                                    placeholder="you@company.com"
                                    className={cn(
                                        inputClass(Boolean(errors.email)),
                                        'h-12',
                                    )}
                                />
                                {errors.email && (
                                    <p
                                        id={`${idFor('email')}-error`}
                                        role="alert"
                                        className="mt-2 text-[13px] text-destructive"
                                    >
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor={idFor('company')}
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Company{' '}
                                    <span className="font-normal text-muted-foreground">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    id={idFor('company')}
                                    name="company"
                                    autoComplete="organization"
                                    placeholder="Where you work"
                                    className={cn(inputClass(false), 'h-12')}
                                />
                            </div>

                            <fieldset className="sm:col-span-2">
                                <legend className="mb-3 text-sm font-medium">
                                    What do you need?{' '}
                                    <span className="font-normal text-muted-foreground">
                                        (optional)
                                    </span>
                                </legend>
                                <div className="flex flex-wrap gap-2">
                                    {PROJECT_TYPES.map((type) => (
                                        <label
                                            key={type}
                                            className="cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={type}
                                                className="peer sr-only"
                                            />
                                            <span className="inline-flex h-10 items-center rounded-full border border-border px-4 text-sm text-foreground/80 transition-colors duration-200 hover:border-foreground/40 peer-checked:border-foreground peer-checked:bg-foreground peer-checked:text-background peer-focus-visible:ring-4 peer-focus-visible:ring-primary/25">
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor={idFor('message')}
                                    className="mb-2 block text-sm font-medium"
                                >
                                    Project details{' '}
                                    <span aria-hidden className="text-primary">
                                        *
                                    </span>
                                </label>
                                <textarea
                                    id={idFor('message')}
                                    name="message"
                                    rows={5}
                                    required
                                    aria-required="true"
                                    aria-invalid={Boolean(errors.message)}
                                    aria-describedby={
                                        errors.message
                                            ? `${idFor('message')}-error`
                                            : undefined
                                    }
                                    placeholder="What are you building, and what does success look like?"
                                    className={cn(
                                        inputClass(Boolean(errors.message)),
                                        'resize-y py-3.5 leading-relaxed',
                                    )}
                                />
                                {errors.message && (
                                    <p
                                        id={`${idFor('message')}-error`}
                                        role="alert"
                                        className="mt-2 text-[13px] text-destructive"
                                    >
                                        {errors.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                            <Button type="submit" variant="ink" size="lg" arrow>
                                Send inquiry
                            </Button>
                            <p className="text-[13px] text-muted-foreground">
                                Opens your email app with the message ready to
                                send.
                            </p>
                        </div>

                        <div role="status" aria-live="polite">
                            {sentLink && (
                                <div className="mt-6 flex gap-3 rounded-xl border border-primary/25 bg-primary/5 p-4 text-[14px] leading-snug">
                                    <Check
                                        size={18}
                                        aria-hidden
                                        className="mt-px shrink-0 text-primary"
                                    />
                                    <p>
                                        Your email app should be opening with
                                        your message. If nothing happened,{' '}
                                        <a
                                            href={sentLink}
                                            className="font-medium underline underline-offset-4"
                                        >
                                            open it again
                                        </a>{' '}
                                        or write to{' '}
                                        <a
                                            href={`mailto:${BRAND.email}`}
                                            className="font-medium underline underline-offset-4"
                                        >
                                            {BRAND.email}
                                        </a>
                                        .
                                    </p>
                                </div>
                            )}
                        </div>
                    </form>
                </Reveal>
            </div>
        </section>
    );
};

export default Contact;
