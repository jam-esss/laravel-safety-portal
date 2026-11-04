<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class PruneDocumentPdfs extends Command
{
    protected $signature = 'documents:prune-pdfs {--days=7}';

    protected $description = 'Delete cached PDF previews older than the given number of days';

    public function handle(): int
    {
        $cutoff = now()->subDays((int) $this->option('days'))->getTimestamp();
        $deleted = 0;

        foreach (Storage::files('pdf-cache') as $file) {
            if (Storage::lastModified($file) < $cutoff) {
                Storage::delete($file);
                $deleted++;
            }
        }

        $this->info("Deleted {$deleted} cached PDF(s).");

        return self::SUCCESS;
    }
}
