import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

type SharedProps = {
    auth: { company: { colour: string } | null };
};

const variables = ['--primary', '--ring', '--sidebar-primary'];

export function useCompanyTheme(): void {
    const { auth } = usePage<SharedProps>().props;
    const colour = auth.company?.colour;

    useEffect(() => {
        const root = document.documentElement;

        if (colour) {
            variables.forEach((name) => root.style.setProperty(name, colour));
        }

        return () => {
            variables.forEach((name) => root.style.removeProperty(name));
        };
    }, [colour]);
}
