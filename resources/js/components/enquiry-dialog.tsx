import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageCircleQuestion } from "lucide-react";

export default function EnquiryDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button type="button" variant="outline" className="w-full">
                    <MessageCircleQuestion />
                    Enquire
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Make an enquiry
                    </DialogTitle>
                    <DialogDescription>
                        Please fill in the form below and we'll get back to you.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="flex flex-col gap-4"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="enquiry-name">
                            Name
                        </Label>
                        <Input
                            id="enquiry-name"
                            name="name"
                            placeholder="Your name"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="enquiry-email">
                            Email address
                        </Label>
                        <Input
                            id="enquiry-email"
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="enquiry-message">
                            Message
                        </Label>
                        <textarea
                            id="enquiry-message"
                            name="message"
                            rows={4}
                            placeholder="What would you like to ask?"
                            className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                    </div>

                    <Button type="submit">
                        Send enquiry
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
