import { Head, Link } from '@inertiajs/react';
import { Calendar, Download, FileText } from 'lucide-react';
import DocumentPreviewDialog from '@/components/document-preview-dialog';
import { Badge } from '@/components/ui/badge';
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

export default function Index({ documents }: { documents: DocumentRecord[] }) {
    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('en-GB');

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
                                <Link href={templateIndex.url()}>Browse templates</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <Card key={doc.id}>
                                <CardContent className="flex items-center justify-between gap-4">
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="rounded-md bg-muted p-2">
                                            <FileText className="size-5 text-muted-foreground" />
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <p className="truncate font-medium">
                                                {doc.title}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                                <Badge variant="secondary">
                                                    {doc.template.name}
                                                </Badge>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="size-3.5" />
                                                    {formatDate(doc.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 gap-2">
                                        <DocumentPreviewDialog id={doc.id} title={doc.title} />
                                        <Button asChild>
                                            <a href={download.url(doc.id)}>
                                                <Download />
                                                Download
                                            </a>
                                        </Button>
                                    </div>
                                </CardContent>
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
            title: 'Documents',
            href: documentIndex(),
        },
    ],
};
