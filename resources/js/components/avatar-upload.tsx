import { router, usePage } from '@inertiajs/react';
import { Trash2, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useRef, useState } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/input-error';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useInitials } from '@/hooks/use-initials';

export default function AvatarUpload() {
    const { auth } = usePage().props;
    const getInitials = useInitials();
    const fileInput = useRef<HTMLInputElement>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string>();

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

        router.post(
            ProfileController.updateAvatar.url(),
            { avatar: file },
            {
                preserveScroll: true,
                onStart: () => {
                    setProcessing(true);
                    setError(undefined);
                },
                onError: (errors) => setError(errors.avatar),
                onFinish: () => setProcessing(false),
            },
        );

        // Clear the input so choosing the same file again still triggers onChange.
        e.target.value = '';
    }

    function handleRemove() {
        router.delete(ProfileController.destroyAvatar.url(), {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <div className="flex items-center gap-6">
            <Avatar className="size-20">
                <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                <AvatarFallback className="bg-neutral-200 text-xl text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(auth.user.name)}
                </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={processing}
                        onClick={() => fileInput.current?.click()}
                    >
                        <Upload />
                        {auth.user.avatar ? 'Change picture' : 'Upload picture'}
                    </Button>

                    {auth.user.avatar && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={processing}
                            onClick={handleRemove}
                        >
                            <Trash2 />
                            Remove
                        </Button>
                    )}
                </div>

                <p className="text-xs text-muted-foreground">
                    JPG, PNG or WebP. Maximum 2MB.
                </p>

                <InputError message={error} />
            </div>

            <input
                ref={fileInput}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
}
