import { GitFork, Star } from 'lucide-react';

interface RepoStats {
    stargazers_count: number;
    forks_count: number;
}

const Footer = async () => {
    const repoStats = await fetch(
        'https://api.github.com/repos/Chuck672991',
        {
            next: {
                revalidate: 60 * 60, // 1 hour
            },
        },
    );

    const { stargazers_count, forks_count } =
        (await repoStats.json()) as RepoStats;

    return (
        <footer
            className="border-t border-border/40 py-6 text-sm text-muted-foreground"
            id="footer"
        >
            <div className="container flex flex-col sm:flex-row items-center justify-between gap-3">
                <p>© {new Date().getFullYear()} Haider Ali. All rights reserved.</p>

                <a
                    href="https://github.com/Chuck672991"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 hover:text-foreground transition-colors duration-200"
                >
                    <span className="flex items-center gap-1.5">
                        <Star size={13} />
                        {stargazers_count}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <GitFork size={13} />
                        {forks_count}
                    </span>
                    <span>Design &amp; built by Haider Ali</span>
                </a>
            </div>
        </footer>
    );
};

export default Footer;
