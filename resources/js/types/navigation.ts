import type { InertiaLinkProps } from '@inertiajs/vue3';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavSubItem = {
    title: string;
    href: string;
    key?: string;
    icon?: any;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: any;
    isActive?: boolean;
    items?: NavSubItem[];
};
