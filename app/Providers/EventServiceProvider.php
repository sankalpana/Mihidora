<?php

namespace App\Providers;

use App\Events\UserCreated;
use App\Events\TopicCreated;
use App\Listeners\SendUserCreatedNotifications;
use App\Listeners\SendTopicCreatedNotification;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        UserCreated::class => [
            SendUserCreatedNotifications::class,
        ],
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        TopicCreated::class => [
            SendTopicCreatedNotification::class,
        ]
        
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     *
     * @return bool
     */
    public function shouldDiscoverEvents()
    {
        return false;
    }
}
