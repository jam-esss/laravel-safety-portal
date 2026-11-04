import {Head, Link} from '@inertiajs/react';
import {Calendar, Download, FileText} from 'lucide-react';
import DocumentPreviewDialog from '@/components/document-preview-dialog';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import {download, index as documentIndex} from '@/routes/client/documents';
import {index as templateIndex} from '@/routes/client/templates';

type DocumentRecord = {
    id: number;
    title: string;
    created_at: string;
    template: {
        name: string;
    };
};

export default function Index({documents}: { documents: DocumentRecord[] }) {
    const formatDate = (value: string) =>
        new Date(value).toLocaleDateString('en-GB');

    return (
        <>
            <Head title="Documents"/>

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
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {documents.map((doc) => (
                            <Card key={doc.id} className="flex flex-col">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 leading-snug">
                                            {doc.title}
                                        </CardTitle>
                                        <FileText className="size-5 shrink-0 text-muted-foreground"/>
                                    </div>
                                    <Badge variant="secondary" className="w-fit">
                                        {doc.template.name}
                                    </Badge>
                                </CardHeader>

                                <CardContent className="mt-auto text-sm text-muted-foreground">
                                    <p className="flex items-center gap-2">
                                        <Calendar className="size-4"/>
                                        Created {formatDate(doc.created_at)}
                                    </p>
                                </CardContent>

                                <CardFooter className="gap-2">
                                    <DocumentPreviewDialog
                                        id={doc.id}
                                        title={doc.title}
                                        className="flex-1"
                                    />
                                    <Button asChild className="flex-1">
                                        <a href={download.url(doc.id)}>
                                            <Download/>
                                            Download
                                        </a>
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
            title: 'Documents',
            href: documentIndex(),
        },
    ],
};
