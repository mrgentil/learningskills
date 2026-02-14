@extends('layouts.auth')

@section('title', 'Verify Your Email')

@section('content')
    <div class="text-center">
        @if (session('resent'))
            <div class="alert alert-success" role="alert"
                style="background: #e6fffa; color: #2c7a7b; border: 1px solid #81e6d9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                {{ __('A fresh verification link has been sent to your email address.') }}
            </div>
        @endif

        <p style="font-size: 16px; color: #666; margin-bottom: 20px;">
            {{ __('Before proceeding, please check your email for a verification link.') }}
            {{ __('If you did not receive the email') }},
        </p>

        <form class="d-inline cbx-form" method="POST" action="{{ route('verification.resend') }}">
            @csrf
            <button type="submit" class="btn btn-block"
                style="background: #6a11cb;">{{ __('Click here to request another') }}</button>
        </form>
    </div>
@endsection
