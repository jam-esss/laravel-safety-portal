import {Head, Link} from '@inertiajs/react';
import {create, edit, index as templateIndex} from '@/routes/client/templates';
import {Button} from "@/components/ui/button";
import {FileUp, Pencil, Upload} from "lucide-react";

type Template = {
    id: number;
    name: string;
    description: string | null;
    document_type: string;
    variables_count: number;
    created_at: string;
    updated_at: string;
};

export default function Index({templates}: { templates: Template[] }) {
    return (
        <>
            <Head title="Templates"/>

            <div className="space-y-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">
                        Templates
                    </h1>
                    <Button asChild>
                        <Link href={create.url()}>
                            Upload template
                        </Link>
                    </Button>
                </div>

                {templates.length === 0 && (
                    <p className="text-gray-600">
                        No templates yet.
                    </p>
                )}

                {templates.map((template) => (
                    <div
                        key={template.id}
                        className="flex items-center justify-between rounded border p-3"
                    >
                        <div>
                            <p className="font-medium">
                                {template.name}
                            </p>
                            <p className="text-sm text-gray-600">
                                {template.document_type}
                            </p>
                            <p className="text-sm text-gray-600">
                                {template.variables_count} variables
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="me-2">
                                    <Upload className="inline-block w-3 h-3 mr-1"/>
                                    {new Date(template.created_at).toLocaleDateString('en-GB')}
                                </span>
                                <span className="me-2">
                                    <Pencil className="inline-block w-3 h-3 mr-1"/>
                                    {new Date(template.updated_at).toLocaleDateString('en-GB')}
                                </span>
                            </p>
                        </div>
                        <Button asChild>
                            <Link href={edit.url(template.id)}>
                                <Pencil/>
                            </Link>
                        </Button>
                    </div>
                ))}
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
