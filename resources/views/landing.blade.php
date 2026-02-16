<!DOCTYPE html>
<html class="no-js" lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <title>LearningSkills - SaaS LMS</title>

    <meta name="description" content="Production grade SaaS LMS" />
    <meta name="keywords" content="LMS, SaaS, Multi-tenant" />
    <meta name="author" content="LearningSkills" />

    <!-- icons & favicons -->
    <link rel="shortcut icon" type="image/x-icon" href="{{ asset('landing/img/favicon/favicon.ico') }}" />
    <link rel="icon" type="image/x-icon" href="{{ asset('landing/img/favicon/favicon.ico') }}" />

    <!-- BOOTSTRAP CSS -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/bootstrap/css/bootstrap.min.css') }}" />
    <!-- FONT AWESOME CSS -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/fontawesome/css/font-awesome.min.css') }}" />
    <!-- GOOGLE FONT -->
    <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700,300,800%7CExo:300,400,500,600,700,900"
        rel="stylesheet" />
    <!--owl carousel css -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/owl-carousel/assets/owl.carousel.min.css') }}"
        media="all" />
    <link rel="stylesheet" href="{{ asset('landing/vendor/owl-carousel/assets/owl.theme.default.min.css') }}"
        media="all" />
    <!-- lity css -->
    <link rel="stylesheet" href="{{ asset('landing/vendor/lity/lity.min.css') }}" media="all" />
    <!-- MODERNIZER CSS  -->
    <script src="{{ asset('landing/vendor/modernizr/modernizr-2.8.3.min.js') }}"></script>
    <!-- CUSTOM  CSS  -->
    <link id="cbx-style" data-layout="1" rel="stylesheet" href="{{ asset('landing/css/style1-default.min.css') }}"
        media="all" />
    <style>
        .cbx-register-btn {
            background: #ff007a;
            color: #fff !important;
            border-radius: 30px;
            padding: 8px 25px !important;
            margin-top: 10px;
            transition: all 0.3s ease;
            font-weight: 700;
            box-shadow: 0 4px 15px rgba(255, 0, 122, 0.3);
        }

        .cbx-register-btn:hover {
            background: #e6006e;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 0, 122, 0.4);
            color: #fff !important;
        }

        @media (max-width: 991px) {
            .cbx-register-btn {
                margin-top: 5px;
                margin-bottom: 10px;
                display: inline-block;
            }
        }

        @media (max-width: 991px) {
            #cbx-parallax-banner .cbx-section .cbx-item-parallax-banner .leftlayer1 {
                background-image: url('{{ asset('landing/img/parallax/pl_style.png') }}') !important;
                background-size: 200px auto;
            }
        }

        @media (min-width: 992px) {
            .pricing-row {
                display: flex;
                flex-wrap: wrap;
            }

            .pricing-row>[class*='col-'] {
                display: flex;
                flex-direction: column;
            }

            .cbx-singlepricing {
                display: flex;
                flex-direction: column;
                height: 100%;
                width: 100%;
            }

            .cbx-singlepricing .cbx-featured-list {
                flex-grow: 1;
            }

            .cbx-singlepricing .price-button {
                margin-top: auto;
            }
        }
    </style>
</head>

<body id="hometop">

    <div class="cbx-container">
        <!-- SITE CONTENT -->
        <nav id="cbx-header" class="navbar navbar-default cbx-header">
            <div class="container">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                        data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand cbx-logo gotome" href="{{ url('/') }}">Learning<span>Skills</span></a>
                </div>

                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#hometop" class="gotome"><span>Accueil</span></a></li>
                        <li><a href="#cbx-sfeature" class="gotome"><span>Fonctionnalités</span></a></li>
                        <li><a href="#cbx-screenshot" class="gotome"><span>Aperçus</span></a></li>
                        <li><a href="#cbx-pricing" class="gotome"><span>Tarifs</span></a></li>
                        <li><a href="#cbx-latestnews" class="gotome"><span>Blog</span></a></li>
                        <li><a href="#cbx-contact" class="gotome "><span>Contact</span></a></li>
                        @guest
                            <li><a href="{{ route('login') }}"><span>Connexion</span></a></li>
                            <li><a href="{{ route('register') }}" class="cbx-register-btn"><span>S'inscrire</span></a></li>
                        @else
                            <li><a href="{{ url('/dashboard') }}" class="cbx-register-btn"><span>Mon Tableau de
                                        Bord</span></a>
                            </li>
                            <li>
                                <a href="#"
                                    onclick="event.preventDefault(); document.getElementById('logout-form').submit();"
                                    style="color: #64748b; font-weight: 600; margin-left: 15px;">
                                    <span>Déconnexion</span>
                                </a>
                                <form id="logout-form" action="{{ route('logout') }}" method="POST"
                                    style="display: none;">
                                    @csrf
                                </form>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <section id="cbx-parallax-banner">
            <div class="cbx-section">
                <div id="layer-wrapper" class="cbx-item-parallax-banner">
                    <div id="object1" class="bglayer1 hidden-sm hidden-xs"></div>
                    <div id="object3" class="bottomlayer1"></div>
                    <div id="object4" class="bottomlayer2"></div>
                    <div id="object5" class="rightlayer1 hidden-sm hidden-xs"></div>
                    <div id="object2" class="bglayer2 hidden-sm hidden-xs"></div>
                    <div id="object10" class="leftlayer1">
                        <div class="banner-content">
                            <h2>LEARNING <br>SKILLS</h2>
                            <p>Votre Plateforme LMS SaaS Professionnelle</p>
                            <span class="hidden-sm hidden-xs"></span>
                            <a class="paramore gotome" href="#cbx-sfeature">En savoir plus</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- *************SPECIAL FEATURE ************* -->
        <section>
            <div id="cbx-sfeature" class="cbx-section cbx-sfeature">
                <div class="cbx-inner">
                    <div class="container">
                        <div class="text-center cbx-content">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="cbx-heading">
                                        <h2 class="uppercase">Fonctionnalités</h2>
                                        <p>Isolation stricte des locataires, gestion des rôles et intégration Stripe
                                            Connect.</p>
                                    </div>
                                    <div>
                                        <div class="row">
                                            <div class="col-md-3 col-sm-6 col-xs-12 xs-text-center">
                                                <div class="cbx-single-feature">
                                                    <div class="cbx-sficon">
                                                        <img src="{{ asset('landing/img/feature/001-speech-bubble.png') }}"
                                                            alt="">
                                                    </div>
                                                    <h4 class=""><a href="#">Multi-Tenant</a></h4>
                                                    <p>Espaces de travail dédiés pour chaque académie avec une sécurité
                                                        absolue des données.</p>
                                                    <a class="cbx-learnmore gotome" href="#cbx-screenshot">En savoir
                                                        plus</a>
                                                </div>
                                            </div>
                                            <div class="col-md-3 col-sm-6 col-xs-12 xs-text-center">
                                                <div class="cbx-single-feature">
                                                    <div class="cbx-sficon">
                                                        <img src="{{ asset('landing/img/feature/002-youtube.png') }}"
                                                            alt="">
                                                    </div>
                                                    <h4 class=""><a href="#">Leçons Vidéo</a></h4>
                                                    <p>Gestion fluide du curriculum avec modules et streaming vidéo.</p>
                                                    <a class="cbx-learnmore gotome" href="#cbx-screenshot">En savoir
                                                        plus</a>
                                                </div>
                                            </div>
                                            <div class="col-md-3 col-sm-6 col-xs-12 xs-text-center">
                                                <div class="cbx-single-feature">
                                                    <div class="cbx-sficon">
                                                        <img src="{{ asset('landing/img/feature/003-locked.png') }}"
                                                            alt="">
                                                    </div>
                                                    <h4 class=""><a href="#">Sécurité Maximale</a></h4>
                                                    <p>Authentification de niveau entreprise et accès autorisé par
                                                        locataire.</p>
                                                    <a class="cbx-learnmore gotome" href="#cbx-screenshot">En savoir
                                                        plus</a>
                                                </div>
                                            </div>
                                            <div class="col-md-3 col-sm-6 col-xs-12 xs-text-center">
                                                <div class="cbx-single-feature">
                                                    <div class="cbx-sficon">
                                                        <img src="{{ asset('landing/img/feature/004-cloud.png') }}"
                                                            alt="">
                                                    </div>
                                                    <h4 class=""><a href="#">Stripe Connect</a></h4>
                                                    <p>Commissions et paiements automatisés pour les instructeurs via
                                                        Stripe.</p>
                                                    <a class="cbx-learnmore gotome" href="#cbx-screenshot">En savoir
                                                        plus</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- *************SCREENSHOTS ************* -->
        <section>
            <div id="cbx-screenshot" class="cbx-section">
                <div class="cbx-inner">
                    <div class="container">
                        <div class=" cbx-content">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="text-center cbx-heading">
                                        <h2 class="uppercase">Aperçus</h2>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="owl-carousel owl-theme" id="screenshot">
                                        <div class="item"><img
                                                src="{{ asset('landing/img/screenshots/screen1.png') }}"
                                                alt=""></div>
                                        <div class="item"><img
                                                src="{{ asset('landing/img/screenshots/screen2.png') }}"
                                                alt=""></div>
                                        <div class="item"><img
                                                src="{{ asset('landing/img/screenshots/screen3.png') }}"
                                                alt=""></div>
                                        <div class="item"><img
                                                src="{{ asset('landing/img/screenshots/screen4.png') }}"
                                                alt=""></div>
                                        <div class="item"><img
                                                src="{{ asset('landing/img/screenshots/screen5.png') }}"
                                                alt=""></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- *************PRICING ************* -->
        <section>
            <div id="cbx-pricing" class="cbx-section cbx-pricing">
                <div class="cbx-inner">
                    <div class="container">
                        <div class="text-center cbx-content">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="cbx-heading">
                                        <h2 class="uppercase">Tarifs</h2>
                                        <p>Choisissez le plan adapté à la croissance de votre académie.</p>
                                    </div>
                                    <div class="row pricing-row">
                                        @foreach ($plans as $plan)
                                            <div class="col-md-4 col-sm-12 col-xs-12 xs-text-center">
                                                <div class="cbx-singlepricing">
                                                    <div class="cbx-featured-header">
                                                        <h4 class="uppercase">{{ $plan->name }}</h4>
                                                        <div class="cbx-doller">
                                                            <p>${{ intval($plan->price) }} <span>/ Mois</span></p>
                                                        </div>
                                                        @if ($plan->slug === 'pro')
                                                            <div class="cbx-recommended">
                                                                <div class="ribbon"><span>hot</span></div>
                                                            </div>
                                                        @endif
                                                    </div>
                                                    <ul class="list-unstyled cbx-featured-list">
                                                        @if (is_array($plan->features))
                                                            @foreach ($plan->features as $feature)
                                                                <li>{{ $feature }}</li>
                                                            @endforeach
                                                        @elseif(is_string($plan->features))
                                                            @foreach (explode("\n", $plan->features) as $feature)
                                                                <li>{{ $feature }}</li>
                                                            @endforeach
                                                        @endif
                                                    </ul>
                                                    <p class="price-button">
                                                        @guest
                                                            <a href="{{ route('register') }}">Commencer</a>
                                                        @else
                                                            <a
                                                                href="{{ route('checkout.session', ['plan_slug' => $plan->slug]) }}">Choisir
                                                                {{ $plan->name }}</a>
                                                        @endguest
                                                    </p>
                                                </div>
                                            </div>
                                        @endforeach
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- *************Statistics ************* -->
        <div id="cbx-stats" class="cbx-section cbx-stats">
            <div class="cbx-inner">
                <div class="container">
                    <div class="text-center cbx-content">
                        <div class="row">
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="single-stats">
                                    <div class="stat-icon"><img
                                            src="{{ asset('landing/img/statistics/001-headphones.png') }}"
                                            alt=""></div>
                                    <div class="stat-content">
                                        <p><span class="counter statcounter">100</span>+</p>
                                        <p>Académies</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="single-stats">
                                    <div class="stat-icon"><img
                                            src="{{ asset('landing/img/statistics/002-happy.png') }}" alt="">
                                    </div>
                                    <div class="stat-content">
                                        <p><span class="counter statcounter">1200</span>+</p>
                                        <p>Cours</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="single-stats">
                                    <div class="stat-icon"><img
                                            src="{{ asset('landing/img/statistics/003-users.png') }}" alt="">
                                    </div>
                                    <div class="stat-content">
                                        <p><span class="counter statcounter">5000</span>+</p>
                                        <p>Étudiants</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 col-sm-6 col-xs-12">
                                <div class="single-stats">
                                    <div class="stat-icon"><img
                                            src="{{ asset('landing/img/statistics/004-cloud-computing.png') }}"
                                            alt=""></div>
                                    <div class="stat-content">
                                        <p><span class="counter statcounter">10000</span>+</p>
                                        <p>Téléchargements</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- *************LATEST NEWS (BLOG) ************* -->
        <section>
            <div id="cbx-latestnews" class="cbx-section cbx-latestnews">
                <div class="cbx-inner">
                    <div class="container">
                        <div class=" cbx-content">
                            <div class="row">
                                <div class="col-xs-12">
                                    <div class="text-center cbx-heading">
                                        <h2 class="uppercase">Blog</h2>
                                        <p>Conseils et actualités de l'écosystème LearningSkills.</p>
                                    </div>
                                    <div>
                                        <div class="row">
                                            <div class="col-md-4 col-sm-12 col-xs-12">
                                                <div class="single-blog-item">
                                                    <div class="blog-thumb"><a href="#"><img
                                                                src="{{ asset('landing/img/blog/blog4.png') }}"
                                                                alt="" class="img-responsive"></a></div>
                                                    <div class="blog-content">
                                                        <h4><a href="#">Comment bâtir une académie à succès</a>
                                                        </h4>
                                                        <p>Découvrez les étapes clés pour lancer votre première
                                                            plateforme de cours multi-tenant.</p>
                                                        <a class="readmore" href="#">Lire la suite</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-12 col-xs-12">
                                                <div class="single-blog-item">
                                                    <div class="blog-thumb"><a href="#"><img
                                                                src="{{ asset('landing/img/blog/blog5.png') }}"
                                                                alt="" class="img-responsive"></a></div>
                                                    <div class="blog-content">
                                                        <h4><a href="#">Maximiser les revenus des
                                                                instructeurs</a></h4>
                                                        <p>Apprenez comment notre intégration Stripe Connect peut
                                                            automatiser vos paiements.</p>
                                                        <a class="readmore" href="#">Lire la suite</a>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-sm-12 col-xs-12">
                                                <div class="single-blog-item">
                                                    <div class="blog-thumb"><a href="#"><img
                                                                src="{{ asset('landing/img/blog/blog6.png') }}"
                                                                alt="" class="img-responsive"></a></div>
                                                    <div class="blog-content">
                                                        <h4><a href="#">Quiz Interactifs & Certificats</a>
                                                        </h4>
                                                        <p>Engagez vos étudiants avec notre module d'évaluation avancé.
                                                        </p>
                                                        <a class="readmore" href="#">Lire la suite</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ************* VIDEO SECTION ************* -->
        <section id="cbx-video">
            <div class="cbx-section">
                <div class="container">
                    <div class="row">
                        <div class="video-section text-center">
                            <a href="http://www.youtube.com/watch?v=C0DPdy98e4c" data-lity>
                                <img src="{{ asset('landing/img/video/play-button.png') }}" alt="video">
                            </a>
                            <h3>DÉCOUVREZ NOS FONCTIONNALITÉS EN VIDÉO</h3>
                            <p>JETEZ UN ŒIL</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ************* FAQ ************* -->
        <section>
            <div id="cbx-faq" class="cbx-section cbx-faq">
                <div class="cbx-inner">
                    <div class="container">
                        <div class="cbx-content">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="text-center cbx-heading">
                                        <h2 class="uppercase">FAQ</h2>
                                    </div>
                                    <div class="row paddingTop">
                                        <div class="col-md-6 col-sm-12">
                                            <div class="faq-img"><img src="{{ asset('landing/img/faq/faq.png') }}"
                                                    alt=""></div>
                                        </div>
                                        <div class="col-md-6 col-sm-12">
                                            <div class="cbx-single-faq">
                                                <div class="panel-group" id="accordionthree" role="tablist">
                                                    <div class="panel panel-default cbx-panel">
                                                        <div class="panel-heading">
                                                            <p class="panel-title"><a data-toggle="collapse"
                                                                    href="#faq1"><span>Les données sont-elles isolées
                                                                        entre les académies ?</span></a></p>
                                                        </div>
                                                        <div id="faq1" class="panel-collapse collapse in">
                                                            <div class="panel-body">
                                                                <p>Oui, nous utilisons une isolation stricte via des
                                                                    scopes de base de données. Chaque académie possède
                                                                    ses propres données.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="panel panel-default cbx-panel">
                                                        <div class="panel-heading">
                                                            <p class="panel-title"><a class="collapsed"
                                                                    data-toggle="collapse"
                                                                    href="#faq2"><span>Comment fonctionnent les
                                                                        paiements ?</span></a></p>
                                                        </div>
                                                        <div id="faq2" class="panel-collapse collapse">
                                                            <div class="panel-body">
                                                                <p>Les paiements sont gérés automatiquement via
                                                                    l'intégration Stripe Connect avec des frais de
                                                                    plateforme personnalisés.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ************* CALL TO ACTION ************* -->
        <section id="cbx-call-to-action">
            <div class="cbx-section">
                <div class="container">
                    <div class="row">
                        <div class="call-to-action text-center">
                            <h3>Démarrez avec <a href="#">LearningSkills</a> Maintenant</h3>
                            <p>Lancez votre académie en quelques minutes avec notre solution SaaS.</p>
                            <div class="call-to-action-btn">
                                <ul>
                                    <li class="apple"><a href="#"><i class="fa fa-apple"></i>
                                            <div class="cta-btn-content">Télécharger <span>App Store</span></div>
                                        </a></li>
                                    <li class="play"><a href="#"><i class="fa fa-android"></i>
                                            <div class="cta-btn-content">Télécharger <span>Play Store</span></div>
                                        </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ************* TESTIMONIALS ************* -->
        <section>
            <div id="cbx-testimonial" class="cbx-section cbx-testimonial">
                <div class="cbx-inner">
                    <div class="container">
                        <div class="cbx-content">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="text-center cbx-heading">
                                        <h2 class="uppercase">Témoignages</h2>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-8 col-md-offset-2">
                                    <div class="owl-carousel owl-theme" id="testimonial">
                                        <div class="item">
                                            <div class="content text-center">
                                                <div class="testimonial-thumb"><img
                                                        src="{{ asset('landing/img/team/profile-4.png') }}"
                                                        alt=""></div>
                                                <blockquote>
                                                    <p>LearningSkills a transformé notre façon de dispenser des cours en
                                                        ligne.</p>
                                                </blockquote>
                                                <div class="testimonial-client-info">
                                                    <p class="name">Adam Smith</p>
                                                    <p class="company">Academy Pro</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ************* CONTACT SECTION ************* -->
        <section>
            <div id="cbx-contact" class="cbx-section cbx-contact">
                <div class="cbx-inner">
                    <div class="container">
                        <div class="text-center cbx-heading">
                            <h2 class="uppercase">Contactez-nous</h2>
                        </div>
                        <div class="cbx-content">
                            <div class="row">
                                <div class="col-md-4 col-sm-4 col-xs-12">
                                    <div class="cbx-box"><span class="cbx-icon"><i
                                                class="fa fa-map-marker"></i></span>
                                        <address><strong>LearningSkills HQ</strong><br>123 Tech Avenue<br>Silicon
                                            Valley, CA 94107.</address>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-4 col-xs-12">
                                    <div class="cbx-box"><span class="cbx-icon"><i
                                                class="fa fa-headphones"></i></span>
                                        <address>
                                            <p>+1-800-LMS-SAAS<br>+1-800-SKILLS</p>
                                        </address>
                                    </div>
                                </div>
                                <div class="col-md-4 col-sm-4 col-xs-12">
                                    <div class="cbx-box"><span class="cbx-icon"><i class="fa fa-envelope"></i></span>
                                        <address>
                                            <p>support@learningskills.com<br>sales@learningskills.com</p>
                                        </address>
                                    </div>
                                </div>
                            </div>
                            <div class="row" style="margin-top: 50px;">
                                <div class="col-md-12 cbx-form">
                                    <form method="POST" class="cbx-contactform">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group"><input type="text" name="cbxname"
                                                        class="form-control" placeholder="Nom" required></div>
                                                <div class="form-group"><input type="email" name="cbxemail"
                                                        class="form-control" placeholder="Email" required></div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <textarea class="form-control" name="cbxmessage" rows="4" placeholder="Message" required></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-block"
                                            style="background: #ff007a; color: #fff;">Envoyer le message</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer>
            <div id="cbx-footer">
                <div class="container">
                    <div class="cbx-content">
                        <div class="row">
                            <div class="col-md-6 col-sm-12">
                                <p class="copyrightinformation">Copyright {{ date('Y') }} © <a
                                        href="#">LearningSkills</a>. Tous droits réservés.</p>
                            </div>
                            <div class="col-md-6 col-sm-12">
                                <ul class="social">
                                    <li><a class="facebok" href="#"><i class="fa fa-facebook"></i></a></li>
                                    <li><a class="twitter" href="#"><i class="fa fa-twitter"></i></a></li>
                                    <li><a class="linkedin" href="#"><i class="fa fa-linkedin"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>

    </div>

    <!-- SITE SCRIPT  -->
    <script src="{{ asset('landing/js/plugins.js') }}"></script>
    <script src="{{ asset('landing/vendor/jquery/jquery-3.2.1.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/bootstrap/js/bootstrap.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/jquery-smooth-scrolling/jquery.smooth-scroll.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/validation/jquery.validate.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/owl-carousel/owl.carousel.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/lity/lity.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/waypoints/jquery.waypoints.min.js') }}"></script>
    <script src="{{ asset('landing/vendor/counter-up/jquery.counterup.min.js') }}"></script>
    <script src="{{ asset('landing/js/theme.min.js') }}"></script>
    <script src="{{ asset('landing/js/custom.js') }}"></script>

    <script>
        // Auto-scroll to pricing section when redirected with #cbx-pricing
        document.addEventListener('DOMContentLoaded', function() {
            if (window.location.hash === '#cbx-pricing') {
                setTimeout(function() {
                    var el = document.getElementById('cbx-pricing');
                    if (el) {
                        el.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }, 300);
            }
        });
    </script>

</body>

</html>
