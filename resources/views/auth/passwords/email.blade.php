@extends('layouts.auth')

@section('title', 'Reset Password')

@section('content')
    @if (session('status'))
        <div class="alert alert-success" role="alert"
            style="background: #e6fffa; color: #2c7a7b; border: 1px solid #81e6d9; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
            {{ session('status') }}
        </div>
    @endif

    <form method="POST" action="{{ route('password.email') }}">
        @csrf

        <div class="form-group mb-4">
            <label for="email" class="uppercase">{{ __('Email Address') }}</label>
            <p style="font-size: 14px; color: #666; margin-bottom: 15px;">Enter your email address and we'll send you a link
                to reset your password.</p>
            <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email"
                value="{{ old('email') }}" required autocomplete="email" autofocus placeholder="Enter your email">

            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="form-group mb-0">
            <button type="submit" class="btn btn-block">
                {{ __('Send Password Reset Link') }}
            </button>

            <p class="text-center" style="margin-top: 20px;">
                Remember your password? <a href="{{ route('login') }}" style="color: #ff007a; font-weight: 700;">Login
                    here</a>
            </p>
        </div>
    </form>
@endsection
