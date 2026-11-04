<?php

namespace App\Services;

use App\Models\Document;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use RuntimeException;

class DocumentPdfConverter
{
    /**
     * Returns the storage path of the document's PDF,
     * converting it first if there isn't a cached copy.
     */
    public function pathFor(Document $document): string
    {
        $pdfPath = 'pdf-cache/' . pathinfo($document->file_path, PATHINFO_FILENAME) . '.pdf';

        if (Storage::exists($pdfPath)) {
            return $pdfPath;
        }

        Storage::makeDirectory('pdf-cache');

        $profileDir = storage_path('app/libreoffice-profile');
        File::ensureDirectoryExists($profileDir);

        $result = Process::timeout(60)
            ->env(array_filter([
                'SystemRoot' => getenv('SystemRoot') ?: 'C:\\Windows',
                'TEMP' => sys_get_temp_dir(),
                'TMP' => sys_get_temp_dir(),
                'APPDATA' => getenv('APPDATA') ?: null,
                'USERPROFILE' => getenv('USERPROFILE') ?: null,
                'HOME' => sys_get_temp_dir(),
            ]))
            ->run([
                config('services.libreoffice.binary'),
                '--headless',
                '-env:UserInstallation=' . $this->toFileUri($profileDir),
                '--convert-to', 'pdf',
                '--outdir', Storage::path('pdf-cache'),
                Storage::path($document->file_path),
            ]);

        if ($result->failed() || !Storage::exists($pdfPath)) {
            throw new RuntimeException(sprintf(
                "PDF conversion failed.\nExit code: %s\nCommand: %s\nStdout: %s\nStderr: %s\nPDF exists: %s",
                $result->exitCode(),
                config('services.libreoffice.binary'),
                $result->output() ?: '(none)',
                $result->errorOutput() ?: '(none)',
                Storage::exists($pdfPath) ? 'yes' : 'no',
            ));
        }

        return $pdfPath;
    }

    private function toFileUri(string $path): string
    {
        $path = str_replace('\\', '/', $path);
        $path = implode('/', array_map('rawurlencode', explode('/', $path)));
        $path = preg_replace('/^([A-Za-z])%3A/', '$1:', $path);
        return 'file://' . (str_starts_with($path, '/') ? '' : '/') . $path;
    }
}
