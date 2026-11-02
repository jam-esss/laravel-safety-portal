import { Head, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import {index as templateIndex, store} from '@/routes/client/templates';
import Index from "@/pages/client/templates/index";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import InputError from "@/components/input-error";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        description: string;
        document_type: string;
        file: File | null;
    }>({
        name: '',
        description: '',
        document_type: 'risk_assessment',
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
                <h1 className="text-2xl font-semibold">
                    Create Template
                </h1>

                <div>
                    <Label htmlFor="name">
                        Name
                    </Label>
                    <Input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    <InputError message={errors.name}/>
                </div>

                <div>
                    <Label htmlFor="description">
                        Description
                    </Label>
                    <textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="w-full rounded border p-2"
                    />
                    <InputError message={errors.description}/>
                </div>

                <div>
                    <Label htmlFor="document_type">
                        Document type
                    </Label>
                    <select
                        value={data.document_type}
                        onChange={(e) => setData('document_type', e.target.value)}
                        className="w-full rounded border p-2"
                    >
                        <option value="risk_assessment">
                            Risk Assessment
                        </option>
                        <option value="coshh">
                            COSHH Assessment
                        </option>
                    </select>
                    <InputError message={errors.document_type}/>
                </div>

                <div>
                    <label htmlFor="file" className="block mb-2">
                        Word document (.docx)
                    </label>
                    <Button asChild>
                        <input
                            id="file"
                            type="file"
                            accept=".docx"
                            onChange={(e) => setData('file', e.target.files?.[0] ?? null)}
                        />
                    </Button>
                    <InputError message={errors.file}/>
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                >
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
            href: Create,
        }
    ],
};

// TODO change all <input> etc to use the components in resources/js/components/ui, and add error messages to all fields
