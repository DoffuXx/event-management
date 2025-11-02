<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    protected $fillable = [
        'name',
        'duration',
        'event_date',
        'description',
        'location',
        'address',
        'city',
        'country',
        'postal_code',
        'capacity',
        'whitelist_capacity',
        'status',
    ];

    protected $casts = [
        'event_date' => 'datetime',
    ];

    public function registrations()
    {
        return $this->hasMany(EventRegistration::class);
    }

    public function scopePublished($query)
    {
    return $query->where('status', 'published');
    }

    public function hasCapacity()
    {
        $registeredCount = $this->registrations()
            ->where('status', 'registered')
            ->count();

        return $registeredCount < $this->capacity;
    }

    public function hasWhitelistCapacity()
    {
        $whitelistedCount = $this->registrations()
            ->where('status', 'waitlist')
            ->count();

        return $whitelistedCount < $this->whitelist_capacity;
    }

    public function isUserRegistered($userId)
    {
        return $this->registrations()
            ->where('user_id', $userId)
            ->where('status', 'registered')
            ->exists();
    }

    public function registeredCount()
    {
        return $this->registrations()
            ->where('status', 'registered')
            ->count();
    }

    public function waitlistCount()
    {
        return $this->registrations()
            ->where('status', 'waitlist')
            ->count();
    }

}
