<?php

namespace App\Providers;

use Spatie\LaravelTypeScriptTransformer\Transformers\LaravelAttributedClassTransformer;
use Spatie\LaravelTypeScriptTransformer\TypeScriptTransformerApplicationServiceProvider as BaseTypeScriptTransformerServiceProvider;
use Spatie\TypeScriptTransformer\Transformers\EnumTransformer;
use Spatie\TypeScriptTransformer\TypeScriptTransformerConfigFactory;
use Spatie\TypeScriptTransformer\Writers\GlobalNamespaceWriter;

class TypeScriptTransformerServiceProvider extends BaseTypeScriptTransformerServiceProvider
{
    protected function configure(TypeScriptTransformerConfigFactory $config): void
    {
        $config
            ->outputDirectory(resource_path('js/types'))
            ->writer(new GlobalNamespaceWriter('generated.d.ts'))
            ->transformer(LaravelAttributedClassTransformer::class)
            ->transformer(EnumTransformer::class)
            ->transformDirectories(
                app_path('Http/Resources'),
                app_path('Enums'),
            );
    }
}
