@extends('layouts.auth')

@section('title', 'Inscription')

@section('content')
    <form method="POST" action="{{ route('register') }}">
        @csrf

        <div class="form-group mb-3">
            <label for="name" class="uppercase">Nom complet</label>
            <input id="name" type="text" class="form-control @error('name') is-invalid @enderror" name="name"
                value="{{ old('name') }}" required autocomplete="name" autofocus placeholder="Entrez votre nom complet">

            @error('name')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="form-group mb-3">
            <label for="email" class="uppercase">Adresse e-mail</label>
            <input id="email" type="email" class="form-control @error('email') is-invalid @enderror" name="email"
                value="{{ old('email') }}" required autocomplete="email" placeholder="Entrez votre e-mail">

            @error('email')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="form-group mb-3">
            <label for="password" class="uppercase">Mot de passe</label>
            <input id="password" type="password" class="form-control @error('password') is-invalid @enderror"
                name="password" required autocomplete="new-password" placeholder="Créez un mot de passe">

            @error('password')
                <span class="invalid-feedback" role="alert">
                    <strong>{{ $message }}</strong>
                </span>
            @enderror
        </div>

        <div class="form-group mb-3">
            <label for="password-confirm" class="uppercase">Confirmer le mot de passe</label>
            <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required
                autocomplete="new-password" placeholder="Confirmez votre mot de passe">
        </div>

        <div class="form-group mb-0">
            <button type="submit" class="btn btn-block">
                S'inscrire
            </button>

            <p class="text-center" style="margin-top: 20px;">
                Vous avez déjà un compte ? <a href="{{ route('login') }}"
                    style="color: #ff007a; font-weight: 700;">Connectez-vous
                    ici</a>
            </p>
        </div>
    </form>
@endsection
