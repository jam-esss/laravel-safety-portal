import {Head} from '@inertiajs/react';
import {dashboard} from '@/routes/client';

type Company = {
    name: string;
    logo: string | null;
    colour: string | null;
    users_count: number;
};

type Props = {
    company: Company | null;
};

export default function Dashboard({company}: Props) {
    if (!company) {
        return (
            <>
                <Head title="Dashboard"/>
                <div className="p-4">
                    <p className="text-muted-foreground">
                        Your account isn't linked to a company yet.
                    </p>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Dashboard"/>
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="rounded-xl border border-sidebar-border/70 p-6 md:col-span-2 dark:border-sidebar-border">
                        <div className="flex items-center gap-4">
                            {company.logo && (
                                <img src={`${company.logo}`}
                                     alt={`${company.name} logo`}
                                     className="size-16 rounded-lg object-contain"
                                />
                            )}
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Company
                                </p>
                                <h1 className="text-2xl font-semibold">
                                    {company.name}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                        <p className="text-sm text-muted-foreground">
                            Users
                        </p>
                        <p className="mt-2 text-4xl font-bold">
                            {company.users_count}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
