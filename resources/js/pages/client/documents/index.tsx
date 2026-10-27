import { Head } from '@inertiajs/react';
import { index as documentIndex } from '@/routes/client/documents';

export default function Index() {
    return (
        <>
            <Head title="Documents" />

            <div className="p-6">
                <h1 className="text-2xl font-semibold">
                    Documents
                </h1>
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
