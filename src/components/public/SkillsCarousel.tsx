"use client";

import { useState, useRef, useEffect } from "react";
import { BentoCard } from "./BentoCard";

interface Skill {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface SkillsCarouselProps {
    skills: Skill[];
}

export function SkillsCarousel({ skills }: SkillsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [visibleCount, setVisibleCount] = useState(4);

    useEffect(() => {
        const updateVisibleCount = () => {
            if (window.innerWidth < 640) {
                setVisibleCount(1);
            } else if (window.innerWidth < 768) {
                setVisibleCount(2);
            } else {
                setVisibleCount(4);
            }
        };

        updateVisibleCount();
        window.addEventListener('resize', updateVisibleCount);
        return () => window.removeEventListener('resize', updateVisibleCount);
    }, []);

    const maxIndex = Math.max(0, skills.length - visibleCount);

    const scrollPrev = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const scrollNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };

    const canScrollPrev = currentIndex > 0;
    const canScrollNext = currentIndex < maxIndex;

    if (skills.length === 0) return null;

    return (
        <div className="col-span-1 md:col-span-4 mt-8">
            <div className="flex items-center gap-4 mb-4">
                <h3 className="text-xl font-bold text-text-main dark:text-white">
                    Core Expertise
                </h3>
                <div className="h-[1px] flex-1 bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex gap-2">
                    <button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className={`size-8 rounded-full flex items-center justify-center transition-colors ${canScrollPrev
                                ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-main dark:text-white cursor-pointer'
                                : 'bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </button>
                    <button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className={`size-8 rounded-full flex items-center justify-center transition-colors ${canScrollNext
                                ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-text-main dark:text-white cursor-pointer'
                                : 'bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="overflow-hidden" ref={containerRef}>
                <div
                    className="flex gap-4 transition-transform duration-300 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / visibleCount + 1)}%)`,
                    }}
                >
                    {skills.map((skill) => (
                        <div
                            key={skill.id}
                            className="shrink-0"
                            style={{ width: `calc(${100 / visibleCount}% - ${((visibleCount - 1) * 16) / visibleCount}px)` }}
                        >
                            <BentoCard className="p-5 flex flex-col gap-3 h-full">
                                <div className="size-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-text-main dark:text-white">
                                    <span className="material-symbols-outlined">{skill.icon || 'star'}</span>
                                </div>
                                <div>
                                    <h4 className="font-bold text-text-main dark:text-white">{skill.title}</h4>
                                    <p className="text-xs text-text-muted dark:text-gray-400 mt-1">{skill.description}</p>
                                </div>
                            </BentoCard>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots indicator */}
            {skills.length > visibleCount && (
                <div className="flex justify-center gap-1.5 mt-4">
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`size-2 rounded-full transition-colors ${idx === currentIndex
                                    ? 'bg-primary-dark'
                                    : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
