import { Head, useForm } from '@inertiajs/react';
import type { SubmitEvent } from 'react';

import AssetForm from '@/components/asset-form';
import type { AssetFormData, Option } from '@/components/asset-form';
import { Button } from '@/components/ui/button';
import { index as assetsIndex, update } from '@/routes/client/assets';

type AssetRecord = {
    id: number;
    asset_type: string;
    make: string;
    model: string;
    description: string | null;
    asset_tag: string;
    serial_number: string | null;
    status: string;
    purchase_date: string | null;
    purchase_price: string | null;
    location: string | null;
};

export default function Edit({
                                 asset,
                                 statuses,
                                 types,
                             }: {
    asset: AssetRecord;
    statuses: Option[];
    types: Option[];
}) {
    const { data, setData, put, processing, errors } =
        useForm<AssetFormData>({
            company_id: '',
            asset_type: asset.asset_type,
            make: asset.make,
            model: asset.model,
            description: asset.description ?? '',
            asset_tag: asset.asset_tag,
            serial_number: asset.serial_number ?? '',
            status: asset.status,
            purchase_date: asset.purchase_date ?? '',
            purchase_price: asset.purchase_price ?? '',
            location: asset.location ?? '',
        });

    function submit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        put(update.url(asset.id));
    }

    return (
        <>
            <Head title={`Edit ${asset.asset_tag}`} />

            <div className="mx-auto w-full max-w-3xl px-6 py-10">
                <div className="mb-8 space-y-2">
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Edit asset
                    </h1>
                    <p className="text-muted-foreground">
                        Update the details for {asset.make} {asset.model} (
                        {asset.asset_tag}).
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    <AssetForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        statuses={statuses}
                        types={types}
                    />

                    <div className="flex items-center justify-end gap-3 border-t pt-6">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = {
    breadcrumbs: [
        {
            title: 'Assets',
            href: assetsIndex(),
        },
        {
            title: 'Edit Asset',
            href: '#',
        },
    ],
};
