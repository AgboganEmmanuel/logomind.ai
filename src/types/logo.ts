export interface LogoFormData {
  style: 'moderne' | 'minimaliste' | 'vintage' | 'futuriste' | '3d' | 'typographique' | 'dessin-anime';
  couleur: string;
  type: 'icone-seule' | 'texte-seul' | 'icone-texte';
  structure: 'symetrique' | 'circulaire' | 'rectangulaire' | 'libre';
  texte: string;
  description?: string; // Optional field for additional logo description
}
