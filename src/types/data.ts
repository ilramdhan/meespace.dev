export interface Profile {
    name: string;
    role: string;
    tagline: string;
    bio: string;
    status: string;
    avatar: string;
    email: string;
    location: string;
    socials: {
        linkedin: string;
        github: string;
    };
}

export interface Stat {
    label: string;
    value: string;
    icon: string;
    color: string;
}

export interface Tool {
    name: string;
    icon: string;
    color: string;
}

export interface Skill {
    icon: string;
    title: string;
    desc: string;
}

export interface Project {
    title: string;
    year: string;
    description: string;
    tags: string[];
    icon: string;
    color: string;
}

export interface Post {
    title: string;
    excerpt: string;
    readTime: string;
    icon: string;
    color: string;
}
