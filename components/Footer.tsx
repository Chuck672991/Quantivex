import { GitFork, Star } from 'lucide-react';

interface RepoStats {
    stargazers_count: number;
    forks_count: number;
}

const Footer = async () => {
    let stargazers_count = 0;
    let forks_count = 0;

    try {
        const repoStats = await fetch(
            'https://api.github.com/repos/Chuck672991/Portfolio-v2',
            {
                next: {
                    revalidate: 60 * 60, // 1 hour
                },
            },
        );

        if (repoStats.ok) {
            const data = (await repoStats.json()) as RepoStats;
            stargazers_count = data.stargazers_count ?? 0;
            forks_count = data.forks_count ?? 0;
        }
    } catch {
        // Build/offline: keep zeros
    }

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
