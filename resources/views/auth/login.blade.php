@extends('layouts.auth')

@section('title', 'Connexion')

@section('content')
    <form method="POST" action="{{ route('login') }}">
        @csrf
        <input type="hidden" name="academy_slug" value="{{ $tenant->slug ?? '' }}">

        <div class="form-group mb-3">
            <label for="email" class="uppercase">Adresse e-mail</label>
            <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email"
                value="{{ old('email') }}" required autocomplete="email" autofocus placeholder="Entrez votre e-mail">

            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="form-group mb-3">
            <label for="password" class="uppercase">Mot de passe</label>
            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror"
                name="password" required autocomplete="current-password" placeholder="Entrez votre mot de passe">

            @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="form-group mb-3">
            <div class="checkbox">
                <label>
                    <input type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>
                    Se souvenir de moi
                </label>
            </div>
        </div>

        <div class="form-group mb-0">
            <button type="submit" class="btn btn-block">
                Connexion
            </button>

            @if (Route::has('password.request'))
                <p class="text-center" style="margin-top: 15px;">
                    <a class="btn-link" href="{{ route('password.request', ['academy' => $tenant->slug ?? '']) }}"
                        style="color: var(--primary);">
                        Mot de passe oublié ?
                    </a>
                </p>
            @endif

            <p class="text-center" style="margin-top: 10px;">
                Vous n'avez pas de compte ? <a href="{{ route('register', ['academy' => $tenant->slug ?? '']) }}"
                    style="color: var(--primary); font-weight: 700;">Inscrivez-vous
                    ici</a>
            </p>
        </div>
    </form>
@endsection
