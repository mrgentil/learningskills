const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
                <span className="font-display font-bold text-accent-foreground text-sm">LS</span>
              </div>
              <span className="font-display font-bold text-lg">LearningSkills</span>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Infrastructure d'apprentissage de haut niveau pour les organisations exigeant propriété des données, évolutivité et excellence professionnelle.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Plateforme</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#features" className="hover:text-primary-foreground transition-colors">Fonctionnalités</a></li>
              <li><a href="#how-it-works" className="hover:text-primary-foreground transition-colors">Fonctionnement</a></li>
              <li><a href="#packages" className="hover:text-primary-foreground transition-colors">Tarifs</a></li>
              <li><a href="#faq" className="hover:text-primary-foreground transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#who-its-for" className="hover:text-primary-foreground transition-colors">Associations</a></li>
              <li><a href="#who-its-for" className="hover:text-primary-foreground transition-colors">Centres de Formation</a></li>
              <li><a href="#who-its-for" className="hover:text-primary-foreground transition-colors">Coaches & Consultants</a></li>
              <li><a href="#who-its-for" className="hover:text-primary-foreground transition-colors">Entreprises</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/60">
              <li><a href="#" className="hover:text-primary-foreground transition-colors">À propos</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Confidentialité</a></li>
              <li><a href="#" className="hover:text-primary-foreground transition-colors">Conditions d'Utilisation</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/40">
            © 2026 LearningSkills. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-primary-foreground/40">
            <a href="#" className="hover:text-primary-foreground transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-primary-foreground transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
