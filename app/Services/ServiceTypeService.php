<?php

namespace App\Services;

use App\Models\ServiceAgreement;
use App\Models\ServiceAgreementItem;
use App\Models\ServiceType;

class ServiceTypeService
{
    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): ServiceType
    {
        return ServiceType::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(ServiceType $serviceType, array $data): ServiceType
    {
        $serviceType->update($data);

        return $serviceType->fresh();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function createAgreement(array $data): ServiceAgreement
    {
        return ServiceAgreement::create([
            ...$data,
            'tenant_id' => app('tenant')->id,
        ]);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function addAgreementItem(ServiceAgreement $agreement, array $data): ServiceAgreementItem
    {
        return $agreement->items()->create($data);
    }
}
