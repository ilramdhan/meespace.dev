import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 bg-white dark:bg-[#1e1e1e] transition-colors duration-200">
            <div className="max-w-[1200px] mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-text-muted dark:text-gray-500">
                    © {new Date().getFullYear()} Sarah Jenkins. All rights reserved.
                </p>
                <div className="flex items-center gap-6">
                    <Link
                        href="#"
                        aria-label="LinkedIn"
                        className="text-text-muted hover:text-primary-dark transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </Link>
                    <Link
                        href="#"
                        aria-label="GitHub"
                        className="text-text-muted hover:text-primary-dark transition-colors"
                    >
                        <Github className="w-5 h-5" />
                    </Link>
                    <a
                        href="mailto:hello@sarahjenkins.com"
                        className="text-text-muted hover:text-primary-dark transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        <Mail className="w-5 h-5 inline mr-1" />
                        hello@sarahjenkins.com
                    </a>
                </div>
            </div>
        </footer>
    );
}
