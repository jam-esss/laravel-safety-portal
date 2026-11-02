import { Head, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { create, index as templateIndex, store } from '@/routes/client/templates';

type Option = {
    value: string;
    label: string;
};

export default function Create({ documentTypes }: { documentTypes: Option[] }) {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        document_type: string;
        file: File | null;
    }>({
        name: '',
        description: '',
        document_type: documentTypes[0].value,
        file: null,
    });

    function submit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        post(store.url());
    }

    return (
        <>
            <Head title="Create Template" />

            <form onSubmit={submit} className="space-y-4 p-6">
                <h1 className="text-2xl font-semibold">Create Template</h1>

                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                    />
                    <InputError message={errors.description} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="document_type">Document type</Label>
                    <Select
                        value={data.document_type}
                        onValueChange={(value) => setData('document_type', value)}
                    >
                        <SelectTrigger id="document_type">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {documentTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.document_type} />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="file">Word document (.docx)</Label>
                    <Input
                        id="file"
                        type="file"
                        accept=".docx"
                        onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                    />
                    <InputError message={errors.file} />
                </div>

                <Button type="submit" disabled={processing}>
                    Upload
                </Button>
            </form>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Templates',
            href: templateIndex(),
        },
        {
            title: 'Create Template',
            href: create(),
        },
    ],
};
