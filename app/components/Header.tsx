import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-8">
            <div className="glass mx-auto max-w-7xl rounded-full px-6 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-1.5 rounded-lg group-hover:scale-105 transition-transform duration-300">
                        <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        InstaDL
                    </span>
                </Link>

                <nav>
                    {/* Add nav items if needed, keeping it simple for now */}
                    <a
                        href="https://github.com/IbrahimHamid2002?tab=repositories"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                        GitHub
                    </a>
                </nav>
            </div>
        </header>
    );
}
