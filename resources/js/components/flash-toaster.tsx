import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

type Flash = {
    success?: string | null;
    error?: string | null;
};

export default function FlashToaster() {
    const { flash } = usePage<{ flash: Flash }>().props;

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, { id: flash.success });
        }

        if (flash.error) {
            toast.error(flash.error, { id: flash.error });
        }
    }, [flash.success, flash.error]);

    return <Toaster />;
}
