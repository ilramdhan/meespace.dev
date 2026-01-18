"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { BentoCard } from "./BentoCard";

interface Tool {
    id: string;
    name: string;
    icon?: string;
    icon_url?: string;
    color?: string;
}

interface TechMarqueeProps {
    tools: Tool[];
}

export function TechMarquee({ tools }: TechMarqueeProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollPosRef = useRef(0);
    const isPausedRef = useRef(false);
    const animationIdRef = useRef<number | null>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer || tools.length === 0) return;

        const speed = 0.3; // slower speed

        const animate = () => {
            if (!isPausedRef.current && scrollContainer) {
                scrollPosRef.current += speed;

                // Get the width of one set of tools
                const singleSetWidth = scrollContainer.scrollWidth / 3;

                // Reset seamlessly when we've scrolled past one complete set
                if (scrollPosRef.current >= singleSetWidth) {
                    scrollPosRef.current = 0;
                }

                scrollContainer.style.transform = `translateX(-${scrollPosRef.current}px)`;
            }
            animationIdRef.current = requestAnimationFrame(animate);
        };

        animationIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
        };
    }, [tools]);

    const handleMouseEnter = () => {
        isPausedRef.current = true;
    };

    const handleMouseLeave = () => {
        isPausedRef.current = false;
    };

    if (tools.length === 0) return null;

    // Triple the tools array for smoother seamless loop
    const triplicatedTools = [...tools, ...tools, ...tools];

    return (
        <div className="col-span-1 md:col-span-4 mt-2">
            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4 pl-1">
                Tools & Technologies
            </h3>
            <div
                className="overflow-hidden"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    ref={scrollRef}
                    className="flex gap-4"
                    style={{ width: 'max-content' }}
                >
                    {triplicatedTools.map((tool, index) => (
                        <BentoCard
                            key={`${tool.id}-${index}`}
                            className="p-4 flex flex-col items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors shrink-0"
                            style={{ width: '120px' }}
                        >
                            {tool.icon_url ? (
                                <Image
                                    src={tool.icon_url}
                                    alt={tool.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 object-contain"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-text-main dark:text-white">
                                    <span className="material-symbols-outlined">{tool.icon || 'code'}</span>
                                </div>
                            )}
                            <span className="text-xs font-semibold text-text-muted dark:text-gray-400 text-center">
                                {tool.name}
                            </span>
                        </BentoCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
