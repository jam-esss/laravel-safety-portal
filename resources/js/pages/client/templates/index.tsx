import { Head, Link } from '@inertiajs/react';
import { Clock, FilePlus, ListChecks, Pencil, Plus, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import { create as createDocument } from '@/routes/client/documents';
import { create, edit, index as templateIndex } from '@/routes/client/templates';

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

export default function Index({
                                  templates,
                                  documentTypes,
                              }: {
    templates: Template[];
    documentTypes: Option[];
}) {
    const typeLabel = (value: string) =>
        documentTypes.find((type) => type.value === value)?.label ?? value;

    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('en-GB');

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
                            Choose a template to create a document, or upload a new one.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href={create.url()}>
                            <Plus />
                            Upload template
                        </Link>
                    </Button>
                </div>

                {templates.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                            <p className="font-medium">No templates yet</p>
                            <p className="text-sm text-muted-foreground">
                                Upload a Word document containing placeholders to get started.
                            </p>
                            <Button asChild variant="outline">
                                <Link href={create.url()}>Upload your first template</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {templates.map((template) => (
                            <Card key={template.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="leading-snug">
                                            {template.name}
                                        </CardTitle>
                                        <Badge variant="secondary" className="shrink-0">
                                            {typeLabel(template.document_type)}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {template.description || 'No description'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="mt-auto space-y-1 text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <ListChecks className="size-4" />
                                        {template.variables_count}{' '}
                                        {template.variables_count === 1 ? 'variable' : 'variables'}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Upload className="size-4" />
                                        Uploaded {formatDate(template.created_at)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock className="size-4" />
                                        Updated {formatDate(template.updated_at)}
                                    </p>
                                </CardContent>

                                <CardFooter className="gap-2">
                                    <Button asChild className="flex-1">
                                        <Link href={createDocument.url(template.id)}>
                                            <FilePlus />
                                            New document
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={edit.url(template.id)}>
                                            <Pencil />
                                            Edit
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
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
