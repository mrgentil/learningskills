<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Paiement - {{ $plan->name }} | LearningSkills</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f0c29 0%, #1a1a3e 50%, #24243e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #fff;
        }

        .checkout-container {
            display: flex;
            max-width: 960px;
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
        }

        /* ---- Left Panel: Order Summary ---- */
        .order-summary {
            width: 380px;
            padding: 48px 36px;
            background: linear-gradient(180deg, rgba(255, 0, 122, 0.15) 0%, rgba(255, 0, 122, 0.05) 100%);
            border-right: 1px solid rgba(255, 255, 255, 0.08);
            display: flex;
            flex-direction: column;
        }

        .back-link {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            color: rgba(255, 255, 255, 0.6);
            text-decoration: none;
            font-size: 14px;
            margin-bottom: 32px;
            transition: color 0.2s;
        }

        .back-link:hover {
            color: #fff;
        }

        .back-link svg {
            width: 16px;
            height: 16px;
        }

        .brand {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #ff007a, #ff6b9d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .plan-badge {
            display: inline-block;
            padding: 6px 16px;
            background: rgba(255, 0, 122, 0.2);
            border: 1px solid rgba(255, 0, 122, 0.3);
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #ff6b9d;
            margin-bottom: 16px;
        }

        .plan-name {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .plan-description {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            line-height: 1.6;
            margin-bottom: 32px;
        }

        .features-list {
            list-style: none;
            margin-bottom: 32px;
            flex: 1;
        }

        .features-list li {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.75);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .features-list li:last-child {
            border-bottom: none;
        }

        .check-icon {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: rgba(76, 217, 100, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .check-icon svg {
            width: 12px;
            height: 12px;
            color: #4cd964;
        }

        .price-section {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding-top: 24px;
        }

        .price-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.6);
        }

        .price-row.total {
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 24px;
            font-weight: 700;
            color: #fff;
        }

        .price-row .interval {
            font-size: 14px;
            font-weight: 400;
            color: rgba(255, 255, 255, 0.5);
        }

        /* ---- Right Panel: Payment Form ---- */
        .payment-form-panel {
            flex: 1;
            padding: 48px 40px;
            display: flex;
            flex-direction: column;
        }

        .form-title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
        }

        .form-subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 32px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .form-group input {
            width: 100%;
            padding: 14px 16px;
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            color: #fff;
            font-size: 15px;
            font-family: 'Inter', sans-serif;
            transition: all 0.3s ease;
            outline: none;
        }

        .form-group input::placeholder {
            color: rgba(255, 255, 255, 0.3);
        }

        .form-group input:focus {
            border-color: #ff007a;
            background: rgba(255, 0, 122, 0.05);
            box-shadow: 0 0 0 3px rgba(255, 0, 122, 0.15);
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
        }

        .card-icon-row {
            display: flex;
            gap: 10px;
            margin-bottom: 24px;
        }

        .card-brand {
            width: 46px;
            height: 30px;
            border-radius: 6px;
            background: rgba(255, 255, 255, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            font-weight: 700;
            color: rgba(255, 255, 255, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .card-brand.active {
            border-color: #ff007a;
            background: rgba(255, 0, 122, 0.15);
            color: #ff6b9d;
        }

        .academy-field {
            margin-top: 8px;
            padding: 20px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            margin-bottom: 24px;
        }

        .academy-field .form-group {
            margin-bottom: 0;
        }

        .academy-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 12px;
        }

        .academy-label svg {
            width: 18px;
            height: 18px;
            color: #ff007a;
        }

        .submit-btn {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #ff007a 0%, #ff4da6 100%);
            border: none;
            border-radius: 14px;
            color: #fff;
            font-size: 16px;
            font-weight: 700;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            transition: all 0.3s ease;
            margin-top: auto;
            box-shadow: 0 8px 30px rgba(255, 0, 122, 0.3);
            position: relative;
            overflow: hidden;
        }

        .submit-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 40px rgba(255, 0, 122, 0.4);
        }

        .submit-btn:active {
            transform: translateY(0);
        }

        .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
        }

        .submit-btn .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 0.6s linear infinite;
            margin: 0 auto;
        }

        .submit-btn.loading .btn-text {
            display: none;
        }

        .submit-btn.loading .spinner {
            display: block;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .secure-note {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.35);
        }

        .secure-note svg {
            width: 14px;
            height: 14px;
        }

        /* Error Messages */
        .alert-error {
            padding: 14px 18px;
            background: rgba(255, 59, 48, 0.15);
            border: 1px solid rgba(255, 59, 48, 0.3);
            border-radius: 12px;
            color: #ff6b6b;
            font-size: 14px;
            margin-bottom: 20px;
        }

        .alert-success {
            padding: 14px 18px;
            background: rgba(76, 217, 100, 0.15);
            border: 1px solid rgba(76, 217, 100, 0.3);
            border-radius: 12px;
            color: #4cd964;
            font-size: 14px;
            margin-bottom: 20px;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .checkout-container {
                flex-direction: column;
            }

            .order-summary {
                width: 100%;
                padding: 32px 24px;
                border-right: none;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            }

            .payment-form-panel {
                padding: 32px 24px;
            }
        }
    </style>
</head>

<body>
    <div class="checkout-container">
        {{-- Left: Order Summary --}}
        <div class="order-summary">
            <a href="{{ url('/') }}#pricing" class="back-link">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Retour aux tarifs
            </a>

            <div class="brand">LearningSkills</div>

            <span class="plan-badge">{{ $plan->name }}</span>
            <h2 class="plan-name">Plan {{ $plan->name }}</h2>
            <p class="plan-description">
                {{ $plan->description ?? 'Accédez à toutes les fonctionnalités de ce plan et lancez votre académie en ligne.' }}
            </p>

            <ul class="features-list">
                @php
                    $features = is_array($plan->features)
                        ? $plan->features
                        : (is_string($plan->features)
                            ? explode("\n", $plan->features)
                            : []);
                @endphp
                @foreach ($features as $feature)
                    @if (trim($feature))
                        <li>
                            <span class="check-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" stroke-width="3">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            {{ trim($feature) }}
                        </li>
                    @endif
                @endforeach
            </ul>

            <div class="price-section">
                <div class="price-row">
                    <span>Plan {{ $plan->name }}</span>
                    <span>{{ intval($plan->price) }} $</span>
                </div>
                <div class="price-row">
                    <span>Taxes</span>
                    <span>0 $</span>
                </div>
                <div class="price-row total">
                    <span>Total</span>
                    <span>{{ intval($plan->price) }} $ <span class="interval">/
                            {{ $plan->interval === 'yearly' ? 'an' : 'mois' }}</span></span>
                </div>
            </div>
        </div>

        {{-- Right: Payment Form --}}
        <div class="payment-form-panel">
            <h2 class="form-title">Informations de paiement</h2>
            <p class="form-subtitle">Remplissez les informations ci-dessous pour finaliser votre souscription.</p>

            @if (session('error'))
                <div class="alert-error">{{ session('error') }}</div>
            @endif

            @if ($errors->any())
                <div class="alert-error">
                    @foreach ($errors->all() as $error)
                        <div>{{ $error }}</div>
                    @endforeach
                </div>
            @endif

            <div class="card-icon-row">
                <div class="card-brand active">VISA</div>
                <div class="card-brand">MC</div>
                <div class="card-brand">AMEX</div>
            </div>

            <form id="checkout-form" method="POST" action="{{ route('checkout.process') }}">
                @csrf
                <input type="hidden" name="plan_slug" value="{{ $plan->slug }}">

                <div class="form-group">
                    <label>Nom sur la carte</label>
                    <input type="text" name="card_name" placeholder="Jean Dupont" value="{{ auth()->user()->name }}"
                        required>
                </div>

                <div class="form-group">
                    <label>Numéro de carte</label>
                    <input type="text" name="card_number" placeholder="4242 4242 4242 4242" maxlength="19" required
                        oninput="this.value = this.value.replace(/[^\d]/g, '').replace(/(.{4})/g, '$1 ').trim()">
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Date d'expiration</label>
                        <input type="text" name="card_expiry" placeholder="MM / AA" maxlength="7" required
                            oninput="this.value = this.value.replace(/[^\d]/g, '').replace(/^(\d{2})(\d)/, '$1 / $2')">
                    </div>
                    <div class="form-group">
                        <label>CVC</label>
                        <input type="text" name="card_cvc" placeholder="123" maxlength="4" required
                            oninput="this.value = this.value.replace(/[^\d]/g, '')">
                    </div>
                </div>

                <div class="academy-field">
                    <div class="academy-label">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Votre Académie
                    </div>
                    <div class="form-group">
                        <label>Nom de l'académie</label>
                        <input type="text" name="academy_name" placeholder="Mon Académie"
                            value="{{ auth()->user()->name }}'s Academy" required>
                    </div>
                </div>

                <button type="submit" class="submit-btn" id="submit-btn">
                    <span class="btn-text">Payer {{ intval($plan->price) }} $ et créer mon académie</span>
                    <span class="spinner"></span>
                </button>
            </form>

            <div class="secure-note">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Paiement sécurisé — Vos données sont chiffrées
            </div>
        </div>
    </div>

    <script>
        document.getElementById('checkout-form').addEventListener('submit', function(e) {
            const btn = document.getElementById('submit-btn');
            btn.classList.add('loading');
            btn.disabled = true;
        });
    </script>
</body>

</html>
