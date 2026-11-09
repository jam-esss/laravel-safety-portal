import { Head, Link } from '@inertiajs/react';
import { Download, FilePlus, Pencil, Plus } from 'lucide-react';
import { useMemo } from 'react';
import DataTable from '@/components/data-table';
import DeleteTemplateDialog from '@/components/delete-template-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePermissions } from '@/hooks/use-permissions';
import { create as createDocument } from '@/routes/client/documents';
import {
    create,
    download,
    edit,
    index as templateIndex,
} from '@/routes/client/templates';

type Template = {
    id: number;
    name: string;
    description: string | null;
    document_type: string;
    variables_count: number;
    created_at: string;
    updated_at: string;
};

type Option = {
    value: string;
    label: string;
};

const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-GB');

const options = {
    columnControl: ['order', 'searchDropdown'] as any,
    ordering: { indicators: false, handler: false },
    responsive: true,
};

function TemplateActions({ template }: { template: Template }) {
    const can = usePermissions();

    return (
        <div className="flex flex-wrap justify-end gap-2">
            {can.manageDocuments && (
                <Button asChild size="sm">
                    <Link href={createDocument.url(template.id)}>
                        <FilePlus />
                        New document
                    </Link>
                </Button>
            )}
            {can.manageTemplates && (
                <Button
                    asChild
                    variant="outline"
                    size="icon"
                    aria-label="Edit template"
                >
                    <Link href={edit.url(template.id)}>
                        <Pencil />
                    </Link>
                </Button>
            )}
            <Button
                asChild
                variant="outline"
                size="icon"
                aria-label="Download template"
            >
                <a href={download.url(template.id)}>
                    <Download />
                </a>
            </Button>
            {can.manageTemplates && (
                <DeleteTemplateDialog id={template.id} name={template.name} />
            )}
        </div>
    );
}

const slots = {
    6: (_data: unknown, row: Template) => <TemplateActions template={row} />,
};

export default function Index({
                                  templates,
                                  documentTypes,
                              }: {
    templates: Template[];
    documentTypes: Option[];
}) {
    const can = usePermissions();

    const columns = useMemo(() => {
        const typeLabel = (value: string) =>
            documentTypes.find((type) => type.value === value)?.label ?? value;

        return [
            { data: 'name', title: 'Name', responsivePriority: 2 },
            {
                data: 'description',
                title: 'Description',
                render: (value: string | null, type: string) =>
                    type === 'display' ? value || 'No description' : value ?? '',
            },
            {
                data: 'document_type',
                title: 'Type',
                render: (value: string, type: string) =>
                    type === 'display' || type === 'filter'
                        ? typeLabel(value)
                        : value,
            },
            { data: 'variables_count', title: 'Variables' },
            {
                data: 'created_at',
                title: 'Uploaded',
                render: (value: string, type: string) =>
                    type === 'display' || type === 'filter'
                        ? formatDate(value)
                        : value,
            },
            {
                data: 'updated_at',
                title: 'Updated',
                render: (value: string, type: string) =>
                    type === 'display' || type === 'filter'
                        ? formatDate(value)
                        : value,
            },
            {
                data: null,
                title: '',
                orderable: false,
                searchable: false,
                columnControl: [],
                responsivePriority: 1,
            },
        ];
    }, [documentTypes]);

    return (
        <>
            <Head title="Templates" />

            <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight">
                            Templates
                        </h1>
                        <p className="text-muted-foreground">
                            Choose a template to create a document, or upload a
                            new one.
                        </p>
                    </div>
                    {can.manageTemplates && (
                        <Button asChild>
                            <Link href={create.url()}>
                                <Plus />
                                Upload template
                            </Link>
                        </Button>
                    )}
                </div>

                {templates.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                            <p className="font-medium">No templates yet</p>
                            <p className="text-sm text-muted-foreground">
                                Upload a Word document containing placeholders
                                to get started.
                            </p>
                            {can.manageTemplates && (
                                <Button asChild variant="outline">
                                    <Link href={create.url()}>
                                        Upload your first template
                                    </Link>
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="overflow-x-auto">
                        <DataTable
                            data={templates}
                            columns={columns}
                            slots={slots}
                            options={options}
                            className="display"
                        />
                    </div>
                )}
            </div>
        </>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Templates',
            href: templateIndex(),
        },
    ],
};
