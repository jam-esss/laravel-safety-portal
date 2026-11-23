import {Head, Link, router} from '@inertiajs/react';
import {Pencil, Plus, Trash2} from 'lucide-react';
import DataTable from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {create, destroy, edit} from '@/routes/client/assets';
import { index as fleetIndex } from '@/routes/client/fleet';

type VehicleRecord = {
    id: number;
    make: string;
    model: string;
    asset_tag: string;
    serial_number: string | null;
    status: 'active' | 'inactive';
    location: string | null;
};

const options = {
    columnControl: ['order', 'searchDropdown'] as any,
    ordering: { indicators: false, handler: false },
    responsive: true,
};

const columns = [
    { data: 'asset_tag', title: 'Fleet tag', responsivePriority: 1 },
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
    6: (_data: unknown, row: VehicleRecord) => (
        <div className="flex justify-end gap-2">
            <Button asChild size="sm" variant="outline">
                <Link href={edit.url(row.id)}>
                    <Pencil />
                    Edit
                </Link>
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                    if (
                        confirm(
                            `Delete ${row.asset_tag}? It will be permanently removed after 30 days.`,
                        )
                    ) {
                        router.delete(destroy.url(row.id));
                    }
                }}
            >
                <Trash2 />
                Delete
            </Button>
        </div>
    ),
};

export default function Index({ vehicles }: { vehicles: VehicleRecord[] }) {
    return (
        <>
            <Head title="Fleet management" />

            <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Fleet management
                        </h1>
                        <p className="text-muted-foreground">
                            Vehicles your company keeps track of.
                        </p>
                    </div>

                    <Button asChild>
                        <Link href={create.url({ query: { asset_type: 'vehicle' } })}>
                            <Plus />
                            New vehicle
                        </Link>
                    </Button>
                </div>

                {vehicles.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                            <p className="font-medium">No vehicles yet</p>
                            <p className="text-sm text-muted-foreground">
                                Vehicles you add will appear here.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <DataTable
                        options={options}
                        data={vehicles}
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
            title: 'Fleet management',
            href: fleetIndex(),
        },
    ],
};
