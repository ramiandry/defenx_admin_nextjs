export interface Prompt {
  id: number;
  utilisateur: string;
  prompt: string;
  prompt_masque: string;
  date: string;
  score: number;
  action: string;
  app: string;
}

export interface SiteBloque {
  id: number;
  site: string;
  redirection: string;
}


// Interface pour les accès bloqués
export interface AccesBloque {
  id: number;
  url: string;
  date: string;
}

export interface MotCle {
  id: number;
  mot_cles: string;
  regex: string;
}