-- Two more kida_settings keys so previously-hardcoded copy becomes CMS-editable:
-- the About KIDA page (story/vision/mission/objectives) and the Sign Up / Login side panel.

insert into kida_settings (key, value, label, "group") values
  (
    'about',
    '{"story":"Since 1998, KIDA has united generations of Kibabii High School graduates under one banner — “Advancing our Prosperity.” What began as informal reunions among former students has grown into a structured association with county chapters, a diaspora network, scholarship programmes, and a growing digital community connecting Kibabiians across the world.","vision":"To be the leading alumni association in Kenya, empowering Kibabiians to achieve excellence and give back to their community.","mission":"To connect, develop, and mobilize Kibabii High School alumni for lifelong networking, mentorship, and the sustained growth of our alma mater.","objectives":"Strengthen alumni networks, support scholarships and school infrastructure, promote mentorship, and champion the achievements of Kibabiians everywhere."}',
    'About KIDA Page Content',
    'about'
  ),
  (
    'auth_panel',
    '{"image_url":"https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop","quote":"Once a Kibabiian, always a Kibabiian. This platform keeps that bond alive across every county and continent.","quote_author":"KIDA Executive Committee"}',
    'Sign Up / Login Panel',
    'branding'
  )
on conflict (key) do nothing;
