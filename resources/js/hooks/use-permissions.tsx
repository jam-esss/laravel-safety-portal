import { usePage } from '@inertiajs/react';

type Permissions = {
    manageDocuments: boolean;
    manageTemplates: boolean;
};

export function usePermissions(): Permissions {
    const { auth } = usePage<{ auth: { can: Permissions } }>().props;

    return auth.can;
}
