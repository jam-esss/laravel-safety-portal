import { Head, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';

import AssetForm from '@/components/asset-form';
import type {
    AssetFormData,
    CompanyOption,
    Option,
} from '@/components/asset-form';
import { Button } from '@/components/ui/button';
import { index as assetsIndex, store } from '@/routes/client/assets';

export default function Create({
                                   statuses,
                                   types,
                                   companies,
                                   defaultType,
                               }: {
    statuses: Option[];
    types: Option[];
    companies: CompanyOption[] | null;
    defaultType: string | null;
}) {
    const { data, setData, post, processing, errors } =
        useForm<AssetFormData>({
            company_id: '',
            asset_type: defaultType ?? '',
            make: '',
            model: '',
            description: '',
            asset_tag: '',
            serial_number: '',
            status: 'active',
            purchase_date: '',
            purchase_price: '',
            location: '',
        });

    function submit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        post(store.url());
    }

    return (
        <>
            <Head title="New asset" />

            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        New asset
                    </h1>
                    <p className="text-muted-foreground">
                        Complete the fields below to add an asset.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <AssetForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        statuses={statuses}
                        types={types}
                        companies={companies}
                    />

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create asset'}
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
            title: 'Assets',
            href: assetsIndex(),
        },
        {
            title: 'Create Asset',
            href: '#',
        },
    ],
};
