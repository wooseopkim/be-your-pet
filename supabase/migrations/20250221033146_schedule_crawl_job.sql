select
  cron.schedule(
    'crawl',
    '6 hours',
    $$
    select
      net.http_post(
          url:='https://vrpyodyxhlbljkedyeoy.supabase.co/functions/v1/crawl?open_api_service_key=' || (select decrypted_secret from vault.decrypted_secrets where name = 'open_api_service_key'),
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_cron_api_key')
          ),
          body:=jsonb_build_object('time', now()),
          timeout_milliseconds:=30000
      ) as request_id;
    $$
  );
