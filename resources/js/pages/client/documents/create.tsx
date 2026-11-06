import { Head, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { store } from '@/routes/client/documents';
import { Checkbox } from '@/components/ui/checkbox';
import {create, index as documentsIndex} from "@/routes/client/documents";

type Variable = {
    id: number;
    title: string;
    description: string | null;
    data_type: string;
    input_type: string;
    is_required: boolean;
};

type Template = {
    id: number;
    name: string;
    variables: Variable[];
};

export default function Create({ template }: { template: Template }) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        values: Record<string, string>;
    }>({
        title: '',
        values: Object.fromEntries(
            template.variables.map((variable) => [
                variable.id,
                variable.input_type === 'checkbox' ? 'No' : '',
            ]),
        ),
    });

    function setValue(id: number, value: string) {
        setData('values', {
            ...data.values,
            [id]: value,
        });
    }

    function submit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        post(store.url(template.id));
    }

    const errorFor = (key: string) =>
        (errors as Record<string, string>)[key];

    return (
        <>
            <Head title={`New ${template.name}`} />

            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        New Document Based on Template '{template.name}'
                    </h1>
                    <p className="text-muted-foreground">
                        Complete the fields below to create your document.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <section className="space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-lg font-medium">
                                Document details
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Give your document a title.
                            </p>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="title">
                                Document title
                                <span className="text-destructive"> *</span>
                            </Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                placeholder="Enter document title"
                                aria-invalid={!!errors.title}
                                required
                            />
                            <InputError message={errors.title} />
                        </div>
                    </section>

                    {template.variables.length > 0 && (
                        <>
                            <div className="border-t" />

                            <section className="space-y-6">
                                <div className="space-y-1">
                                    <h2 className="text-lg font-medium">
                                        Variables
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Fill out the variables to populate the document.
                                    </p>
                                </div>

                                {template.variables.map((variable) => {
                                    const id = `variable-${variable.id}`;
                                    const error = errorFor(
                                        `values.${variable.id}`,
                                    );

                                    return (
                                        <div
                                            key={variable.id}
                                            className="grid gap-2"
                                        >
                                            <Label htmlFor={id}>
                                                {variable.title}
                                                {variable.is_required && (
                                                    <span className="text-destructive">
                                                        {' '}*
                                                    </span>
                                                )}
                                            </Label>

                                            {variable.input_type === 'textarea' && (
                                                <Textarea
                                                    id={id}
                                                    value={data.values[variable.id]}
                                                    onChange={(e) => setValue(variable.id, e.target.value)}
                                                    aria-invalid={!!error}
                                                    required={variable.is_required}
                                                    rows={4}
                                                />
                                            )}

                                            {variable.input_type === 'checkbox' && (
                                                <div className="flex items-center gap-2">
                                                    <Checkbox
                                                        id={id}
                                                        checked={data.values[variable.id] === 'Yes'}
                                                        onCheckedChange={(checked) =>
                                                            setValue(variable.id, checked === true ? 'Yes' : 'No')
                                                        }
                                                    />
                                                    <span className="text-sm text-muted-foreground">Tick for Yes</span>
                                                </div>
                                            )}

                                            {variable.input_type !== 'textarea' && variable.input_type !== 'checkbox' && (
                                                <Input
                                                    id={id}
                                                    type={variable.input_type}
                                                    value={data.values[variable.id]}
                                                    onChange={(e) => setValue(variable.id, e.target.value)}
                                                    aria-invalid={!!error}
                                                    required={variable.is_required}
                                                />
                                            )}

                                            {variable.description && (
                                                <p className="text-sm text-muted-foreground">
                                                    {variable.description}
                                                </p>
                                            )}

                                            <InputError message={error} />
                                        </div>
                                    );
                                })}
                            </section>
                        </>
                    )}

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create document'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        {
            title: 'Documents',
            href: documentsIndex(),
        },
        {
            title: 'Create Document',
            href: '#',
        },
    ],
};
