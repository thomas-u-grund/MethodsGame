// Anonymous play statistics (STATS.md). enabled:true = recording is ON by default (players can switch it off in Settings or on privacy.html); false = nothing is recorded and no notice or Settings row is shown.
window.CB_STATS = {
  enabled: true,
  api: '/api',
  consent: 'notice'   // 'notice' = on, with a notice and a one-click "No thanks"; 'optin' = off until the player agrees
};
