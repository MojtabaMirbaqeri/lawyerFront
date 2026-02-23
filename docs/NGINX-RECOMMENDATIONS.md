# Nginx recommendations (production)

If you control the Nginx in front of the Nuxt app and Laravel API, use the following.

## Compression

```nginx
# Enable gzip
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml;

# Brotli (if nginx is built with brotli module)
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```

## Static assets (Nuxt)

```nginx
location /_nuxt/ {
    # Nuxt routeRules already set this; Nginx can reinforce
    add_header Cache-Control "public, max-age=31536000, immutable";
    try_files $uri =404;
}
```

## Security headers

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
# HSTS only if TLS is always correctly configured and you understand the implications
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## API proxy (Laravel backend)

```nginx
location /api/ {
    proxy_pass http://backend_upstream;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffer_size 128k;
    proxy_buffers 4 256k;
    proxy_busy_buffers_size 256k;
    proxy_read_timeout 60s;
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
}
```

## Block sensitive paths

Do not serve `.env`, `/storage`, or `/vendor` as static files:

```nginx
location ~* ^/(\.env|storage/|vendor/) {
    deny all;
    return 404;
}
```

These complement the Laravel security headers middleware and Nuxt routeRules already set in the project.
