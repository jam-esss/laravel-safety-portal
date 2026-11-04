import { Eye, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { preview } from '@/routes/client/documents';

export default function DocumentPreviewDialog({ id, title }: { id: number; title: string }) {
    const [loading, setLoading] = useState(true);

    return (
        <Dialog onOpenChange={(open) => open && setLoading(true)}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Eye />
                </Button>
            </DialogTrigger>

            <DialogContent
                className="flex h-[90vh] flex-col sm:max-w-5xl"
                aria-describedby={undefined}
            >
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                </DialogHeader>

                <div className="relative flex-1">
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="size-8 animate-spin" />
                            <p className="text-sm">
                                Preparing preview…
                                Depending on file size this may take a while.
                                Thank you for your patience.
                            </p>
                        </div>
                    )}

                    <iframe
                        src={preview.url(id)}
                        title={title}
                        onLoad={() => setLoading(false)}
                        className="h-full w-full rounded border"
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
