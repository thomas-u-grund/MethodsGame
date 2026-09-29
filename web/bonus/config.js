// Course bonus points (ROADMAP 8-BONUS): the Supabase project the instructor and claim pages talk to.
// Both values are public by design (the anon key only reaches what the database's rules allow).
// Empty = the bonus feature is off everywhere, and the game never shows a claim button.
window.CB_BONUS = {
  url: '',        // e.g. 'https://abcdefghijkl.supabase.co'
  anonKey: '',    // Supabase > Project Settings > API > anon public
  game: 'https://thomas-u-grund.github.io/MethodsGame/the-secret-of-the-codebook.html'
};
