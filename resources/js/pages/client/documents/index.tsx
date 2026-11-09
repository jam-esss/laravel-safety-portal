import { Head, Link } from '@inertiajs/react';
import { Download } from 'lucide-react';
import DataTable from '@/components/data-table';
import DocumentPreviewDialog from '@/components/document-preview-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { download, index as documentIndex } from '@/routes/client/documents';
import { index as templateIndex } from '@/routes/client/templates';

type DocumentRecord = {
    id: number;
    title: string;
    created_at: string;
    template: {
        name: string;
    };
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-GB');

const options = {
    columnControl: ['order', 'searchDropdown'] as any,
    ordering: { indicators: false, handler: false },
    responsive: true,
};

const columns = [
    { data: 'title', title: 'Title' },
    { data: 'template.name', title: 'Template' },
    {
        data: 'created_at',
        title: 'Created',
        render: (value: string, type: string) =>
            type === 'display' ? formatDate(value) : value,
    },
    { data: null, title: '', orderable: false, searchable: false, columnControl: [], responsivePriority: 1 },
];

const slots = {
    3: (_data: unknown, row: DocumentRecord) => (
        <div className="flex justify-end gap-2">
            <DocumentPreviewDialog id={row.id} title={row.title} />
            <Button asChild size="sm">
                <a href={download.url(row.id)}>
                    <Download />
                    Download
                </a>
            </Button>
        </div>
    ),
};

export default function Index({ documents }: { documents: DocumentRecord[] }) {
    return (
        <>
            <Head title="Documents" />

            <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Documents
                    </h1>
                    <p className="text-muted-foreground">
                        Preview or download the documents you have created.
                    </p>
                </div>

                {documents.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                            <p className="font-medium">No documents yet</p>
                            <p className="text-sm text-muted-foreground">
                                Pick a template to create your first document.
                            </p>
                            <Button asChild variant="outline">
                                <Link href={templateIndex.url()}>
                                    Browse templates
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <DataTable
                        options={options}
                        data={documents}
                        columns={columns}
                        slots={slots}
                        className="display"
                    />
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Documents',
            href: documentIndex(),
        },
    ],
};
