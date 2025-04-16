select
    cron.schedule(
        'crawl',
        '0 */6 * * *',
        $$
    select
      net.http_post(
          url:='https://vrpyodyxhlbljkedyeoy.supabase.co/functions/v1/crawl',
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_cron_api_key')
          ),
          body:=jsonb_build_object('time', now(), 'open_api_service_key', (select decrypted_secret from vault.decrypted_secrets where name = 'open_api_service_key')),
          timeout_milliseconds:=5000
      ) as request_id;
    $$
    );
