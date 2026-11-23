import { Head, Link } from '@inertiajs/react';
import { Pencil, Plus } from 'lucide-react';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { create, edit, index as assetIndex } from '@/routes/client/assets';

type AssetRecord = {
    id: number;
    make: string;
    model: string;
    asset_tag: string;
    serial_number: string | null;
    status: 'active' | 'inactive';
    location: string | null;
    company: {
        name: string;
    };
};

const options = {
    columnControl: ['order', 'searchDropdown'] as any,
    ordering: { indicators: false, handler: false },
    responsive: true,
};

const columns = [
    { data: 'asset_tag', title: 'Asset tag', responsivePriority: 1 },
    { data: 'make', title: 'Make' },
    { data: 'model', title: 'Model' },
    { data: 'serial_number', title: 'Serial number' },
    { data: 'location', title: 'Location' },
    { data: 'status', title: 'Status' },
    {
        data: null,
        title: '',
        orderable: false,
        searchable: false,
        columnControl: [],
        responsivePriority: 1,
    },
];

const slots = {
    6: (_data: unknown, row: AssetRecord) => (
        <div className="flex justify-end">
            <Button asChild size="sm" variant="outline">
                <Link href={edit.url(row.id)}>
                    <Pencil />
                    Edit
                </Link>
            </Button>
        </div>
    ),
};

export default function Index({ assets }: { assets: AssetRecord[] }) {
    return (
        <>
            <Head title="Assets" />

            <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Assets
                        </h1>
                        <p className="text-muted-foreground">
                            Equipment and items your company keeps track of.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            New asset
                        </Link>
                    </Button>
                </div>

                {assets.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                            <p className="font-medium">No assets yet</p>
                            <p className="text-sm text-muted-foreground">
                                Assets you add will appear here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <DataTable
                        options={options}
                        data={assets}
                        columns={columns}
                        className="display"
                        slots={slots}
                    />
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Assets',
            href: assetIndex(),
        },
    ],
};
