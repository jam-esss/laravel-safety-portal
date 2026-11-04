import { router } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { destroy } from '@/routes/client/templates';

export default function DeleteTemplateDialog({ id, name }: { id: number; name: string }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon" aria-label={`Delete ${name}`}>
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{name}"?</AlertDialogTitle>
                    <AlertDialogDescription>
                        The template will no longer be available for new documents.
                        Documents already created from it are not affected.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => router.delete(destroy.url(id))}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
