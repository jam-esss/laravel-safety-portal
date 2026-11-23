import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export type Option = {
    value: string;
    label: string;
};

export type CompanyOption = {
    id: number;
    name: string;
};

export type AssetFormData = {
    company_id: string;
    asset_type: string;
    make: string;
    model: string;
    description: string;
    asset_tag: string;
    serial_number: string;
    status: string;
    purchase_date: string;
    purchase_price: string;
    location: string;
};

type Props = {
    data: AssetFormData;
    setData: <K extends keyof AssetFormData>(
        key: K,
        value: AssetFormData[K],
    ) => void;
    errors: Partial<Record<keyof AssetFormData, string>>;
    statuses: Option[];
    types: Option[];
    companies?: CompanyOption[] | null;
};

const selectClasses =
    'border-input bg-background h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50';

export default function AssetForm({
                                      data,
                                      setData,
                                      errors,
                                      statuses,
                                      types,
                                      companies,
                                  }: Props) {
    return (
        <>
            <section className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-medium">Details</h2>
                    <p className="text-sm text-muted-foreground">
                        What the asset is and how to identify it.
                    </p>
                </div>

                {companies && (
                    <div className="grid gap-2">
                        <Label htmlFor="company_id">
                            Company
                            <span className="text-destructive"> *</span>
                        </Label>
                        <select
                            id="company_id"
                            className={selectClasses}
                            value={data.company_id}
                            onChange={(e) =>
                                setData('company_id', e.target.value)
                            }
                            aria-invalid={!!errors.company_id}
                            required
                        >
                            <option value="">Select a company</option>
                            {companies.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.company_id} />
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="asset_type">
                        Asset type
                        <span className="text-destructive"> *</span>
                    </Label>
                    <select
                        id="asset_type"
                        className={selectClasses}
                        value={data.asset_type}
                        onChange={(e) => setData('asset_type', e.target.value)}
                        aria-invalid={!!errors.asset_type}
                        required
                    >
                        <option value="">Select a type</option>
                        {types.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.asset_type} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="make">
                            Make
                            <span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="make"
                            value={data.make}
                            onChange={(e) => setData('make', e.target.value)}
                            aria-invalid={!!errors.make}
                            required
                        />
                        <InputError message={errors.make} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="model">
                            Model
                            <span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="model"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                            aria-invalid={!!errors.model}
                            required
                        />
                        <InputError message={errors.model} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="asset_tag">
                            Asset tag
                            <span className="text-destructive"> *</span>
                        </Label>
                        <Input
                            id="asset_tag"
                            value={data.asset_tag}
                            onChange={(e) =>
                                setData('asset_tag', e.target.value)
                            }
                            aria-invalid={!!errors.asset_tag}
                            required
                        />
                        <InputError message={errors.asset_tag} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="serial_number">Serial number</Label>
                        <Input
                            id="serial_number"
                            value={data.serial_number}
                            onChange={(e) =>
                                setData('serial_number', e.target.value)
                            }
                            aria-invalid={!!errors.serial_number}
                        />
                        <InputError message={errors.serial_number} />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) =>
                            setData('description', e.target.value)
                        }
                        aria-invalid={!!errors.description}
                        rows={4}
                    />
                    <InputError message={errors.description} />
                </div>
            </section>

            <div className="border-t" />

            <section className="space-y-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-medium">Status and purchase</h2>
                    <p className="text-sm text-muted-foreground">
                        Where it is, whether it's in use, and what it cost.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="status">
                            Status
                            <span className="text-destructive"> *</span>
                        </Label>
                        <select
                            id="status"
                            className={selectClasses}
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            aria-invalid={!!errors.status}
                            required
                        >
                            {statuses.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.status} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            value={data.location}
                            onChange={(e) =>
                                setData('location', e.target.value)
                            }
                            aria-invalid={!!errors.location}
                        />
                        <InputError message={errors.location} />
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor="purchase_date">Purchase date</Label>
                        <Input
                            id="purchase_date"
                            type="date"
                            value={data.purchase_date}
                            onChange={(e) =>
                                setData('purchase_date', e.target.value)
                            }
                            aria-invalid={!!errors.purchase_date}
                        />
                        <InputError message={errors.purchase_date} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="purchase_price">
                            Purchase price (£)
                        </Label>
                        <Input
                            id="purchase_price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={data.purchase_price}
                            onChange={(e) =>
                                setData('purchase_price', e.target.value)
                            }
                            aria-invalid={!!errors.purchase_price}
                        />
                        <InputError message={errors.purchase_price} />
                    </div>
                </div>
            </section>
        </>
    );
}
