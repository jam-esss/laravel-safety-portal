import { Head, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { index as templateIndex, update } from '@/routes/client/templates';

type Option = {
    value: string;
    label: string;
};

type Variable = {
    id: number;
    placeholder: string;
    title: string;
    description: string | null;
    data_type: string;
    is_required: boolean;
    is_system: boolean;
};

type Template = {
    id: number;
    name: string;
    variables: Variable[];
};

export default function Edit({
                                 template,
                                 dataTypes,
                             }: {
    template: Template;
    dataTypes: Option[];
}) {
    const { data, setData, put, processing, errors } = useForm({
        variables: template.variables,
    });

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
                <h1 className="text-2xl font-semibold">Edit {template.name}</h1>

                {data.variables.map((variable, index) => (
                    <div
                        key={variable.id}
                        className="grid grid-cols-1 gap-4 rounded border p-3 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <div className="col-span-full flex items-center gap-2">
                            <p className="font-mono text-sm text-primary">
                                {'${' + variable.placeholder + '}'}
                            </p>
                            {variable.is_system && <Badge variant="secondary">Built-in</Badge>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`title-${variable.id}`}>Title</Label>
                            <Input
                                id={`title-${variable.id}`}
                                value={variable.title}
                                onChange={(e) => change(index, 'title', e.target.value)}
                            />
                            <InputError message={errorFor(index, 'title')} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`description-${variable.id}`}>Description</Label>
                            <Input
                                id={`description-${variable.id}`}
                                value={variable.description ?? ''}
                                onChange={(e) => change(index, 'description', e.target.value)}
                                placeholder="What is the variable for?"
                            />
                            <InputError message={errorFor(index, 'description')} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor={`data-type-${variable.id}`}>Data type</Label>
                            <Select
                                value={variable.data_type}
                                onValueChange={(value) => change(index, 'data_type', value)}
                                disabled={variable.is_system}
                            >
                                <SelectTrigger id={`data-type-${variable.id}`}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataTypes.map((type) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errorFor(index, 'data_type')} />
                        </div>

                        <div className="col-span-full flex items-center gap-2">
                            <Checkbox
                                id={`required-${variable.id}`}
                                checked={variable.is_required}
                                onCheckedChange={(checked) => change(index, 'is_required', checked === true)}
                                disabled={variable.is_system}
                            />
                            <Label htmlFor={`required-${variable.id}`}>Required</Label>
                        </div>
                    </div>
                ))}

                <Button type="submit" disabled={processing}>
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
    ],
};
