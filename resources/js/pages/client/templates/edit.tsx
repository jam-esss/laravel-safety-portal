import { Head, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import {index as templateIndex, update} from '@/routes/client/templates';
import {Button} from "@/components/ui/button";
import Create from "@/pages/client/templates/create";

type Variable = {
    id: number;
    placeholder: string;
    title: string;
    description: string | null;
    data_type: string;
    is_required: boolean;
};

type Template = {
    id: number;
    name: string;
    variables: Variable[];
};

export default function Edit({ template }: { template: Template }) {
    const { data, setData, put, processing, errors } = useForm({
        variables: template.variables,
    });

    // Change one field on one variable, leaving the others untouched
    function change(index: number, field: keyof Variable, value: string | boolean) {
        setData(
            'variables',
            data.variables.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
        );
    }

    function submit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        put(update.url(template.id));
    }

    const errorFor = (index: number, field: string) =>
        (errors as Record<string, string>)[`variables.${index}.${field}`];

    return (
        <>
            <Head title={`Edit ${template.name}`} />

            <form onSubmit={submit} className="space-y-4 p-6">
                <h1 className="text-2xl font-semibold">
                    Edit {template.name}
                </h1>

                {data.variables.map((variable, index) => (
                    <div
                        key={variable.id}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 rounded border p-3"
                    >
                        <p className="col-span-full font-mono text-sm text-primary">
                            {'${' + variable.placeholder + '}'}
                        </p>

                        <div>
                            <label className="block text-sm mb-1 font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                value={variable.title}
                                onChange={(e) => change(index, 'title', e.target.value)}
                                className="w-full rounded border p-2"
                                placeholder={'${' + variable.placeholder + '}'}
                            />
                            {errorFor(index, 'title') && (
                                <p className="text-sm text-red-600">
                                    {errorFor(index, 'title')}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1 font-medium">
                                Description
                            </label>
                            <input
                                type="text"
                                value={variable.description ?? ''}
                                onChange={(e) => change(index, 'description', e.target.value)}
                                className="w-full rounded border p-2"
                                placeholder="What is the variable for?"
                            />
                            {errorFor(index, 'description') && (
                                <p className="text-sm text-red-600">
                                    {errorFor(index, 'description')}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm mb-1 font-medium">
                                Data type
                            </label>
                            <select
                                value={variable.data_type}
                                onChange={(e) => change(index, 'data_type', e.target.value)}
                                className="w-full rounded border p-2"
                            >
                                <option value="text">Text</option>
                                <option value="textarea">Long Text</option>
                                <option value="number">Number</option>
                                <option value="date">Date</option>
                            </select>
                        </div>

                        <div className="col-span-full">
                            <label className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={variable.is_required}
                                    onChange={(e) => change(index, 'is_required', e.target.checked)}
                                    className="accent-primary"
                                />
                                Required
                            </label>
                        </div>
                    </div>
                ))}

                <Button
                    type="submit"
                    disabled={processing}
                >
                    Update
                </Button>
            </form>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Templates',
            href: templateIndex(),
        },
        {
            title: 'Edit Template',
            href: Edit,
        }
    ],
};
