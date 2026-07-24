-- Relabel the 4th homepage impact stat from "Active Chapters" to "Diaspora Countries".
-- Guarded on the current label so it's a no-op if an admin already edited this stat via the CMS.
update kida_settings
set value = jsonb_set(value, '{3}', '{"label":"Diaspora Countries","value":18}'::jsonb)
where key = 'impact_stats'
  and value -> 3 ->> 'label' = 'Active Chapters';
