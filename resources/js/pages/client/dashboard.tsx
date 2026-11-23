import {Head, Link} from '@inertiajs/react';
import {dashboard} from '@/routes/client';
import {create as createAsset} from '@/routes/client/assets';
import {create as createDocumentTemplate} from '@/routes/client/templates';
import {
    PlusCircle,
    FilePlus,
    UserPlus,
    FolderPlus,
    ArrowUpRight,
} from 'lucide-react';

type Company = {
    name: string;
    logo: string | null;
    colour: string | null;
    users_count: number;
};

type Props = {
    company: Company | null;
};

const quickActions = [
    {
        title: 'Add Asset / Vehicle',
        description: 'Create a new asset or vehicle.',
        href: createAsset(),
        icon: PlusCircle,
    },
    {
        title: 'Add Document Template',
        description: 'Upload a new document template.',
        href: createDocumentTemplate(),
        icon: FilePlus,
    },
];

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

                <div className="grid gap-4 lg:grid-cols-3">

                    <div className="rounded-xl border border-sidebar-border/70 p-6 lg:col-span-2 dark:border-sidebar-border">
                        <div className="flex items-center gap-4">
                            {company.logo && (
                                <img
                                    src={company.logo}
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

                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <div className="mb-5">
                        <h2 className="text-lg font-semibold">
                            Quick Actions
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            Quickly access common tasks.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link key={action.title}
                                      href={action.href}
                                      className="group flex items-center justify-between gap-3 rounded-lg border border-sidebar-border/70 p-4 transition-colors hover:bg-muted/50 dark:border-sidebar-border"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                                            <Icon className="size-5 text-muted-foreground"/>
                                        </div>

                                        <div>
                                            <p className="text-sm font-medium">
                                                {action.title}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {action.description}
                                            </p>
                                        </div>
                                    </div>

                                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/>
                                </Link>
                            );
                        })}
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
