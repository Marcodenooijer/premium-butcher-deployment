# DNS Configuration Guide

## Setting Up biologischvleeschatelier.profile.elysia.marketing

This guide explains how to configure DNS for your Premium Biological Butcher customer profile application.

---

## Overview

**Full Domain**: `biologischvleeschatelier.profile.elysia.marketing`

**Domain Structure**:
- **Root Domain**: `elysia.marketing`
- **Subdomain**: `profile.elysia.marketing`
- **Sub-subdomain**: `biologischvleeschatelier.profile.elysia.marketing`

---

## Step-by-Step Configuration

### Step 1: Get Your Server IP Address

First, you need to know your Hetzner server's public IP address.

**Option A: From Hetzner Cloud Console**
1. Log in to [Hetzner Cloud Console](https://console.hetzner.cloud/)
2. Navigate to your project: "Manus Apps"
3. Click on your server
4. Note the **IPv4 address** (e.g., `123.456.789.012`)

**Option B: From Server SSH**
```bash
ssh root@your-server
curl ifconfig.me
```

Note this IP address - you'll need it for DNS configuration.

---

### Step 2: Access Your DNS Provider

The domain `elysia.marketing` is registered with a DNS provider. You need to access the DNS management panel.

**Common DNS Providers**:
- **Cloudflare** - https://dash.cloudflare.com/
- **AWS Route 53** - https://console.aws.amazon.com/route53/
- **Google Cloud DNS** - https://console.cloud.google.com/net-services/dns
- **Namecheap** - https://www.namecheap.com/myaccount/login/
- **GoDaddy** - https://account.godaddy.com/
- **Hetzner DNS** - https://dns.hetzner.com/

Log in to your DNS provider's control panel.

---

### Step 3: Navigate to DNS Records

1. Find the domain `elysia.marketing`
2. Click on "DNS Records", "Manage DNS", or similar option
3. You should see a list of existing DNS records

---

### Step 4: Add A Record

Add a new **A record** with these details:

| Field | Value | Description |
|-------|-------|-------------|
| **Type** | `A` | IPv4 address record |
| **Name** | `biologischvleeschatelier.profile` | Subdomain name |
| **Value** | `123.456.789.012` | Your server's IP address |
| **TTL** | `3600` | Time to live (1 hour) |
| **Proxy Status** | `DNS only` | If using Cloudflare, disable proxy initially |

**Example Configurations by Provider:**

#### Cloudflare
```
Type: A
Name: biologischvleeschatelier.profile
IPv4 address: 123.456.789.012
Proxy status: DNS only (gray cloud)
TTL: Auto
```

#### AWS Route 53
```
Record name: biologischvleeschatelier.profile
Record type: A
Value: 123.456.789.012
TTL: 3600
Routing policy: Simple routing
```

#### Hetzner DNS
```
Type: A
Name: biologischvleeschatelier.profile
Value: 123.456.789.012
TTL: 3600
```

---

### Step 5: Save and Wait for Propagation

1. **Save** the DNS record
2. **Wait** for DNS propagation (typically 5-30 minutes, can take up to 24 hours)

**Note**: Lower TTL values propagate faster but increase DNS query load.

---

### Step 6: Verify DNS Configuration

After waiting a few minutes, verify the DNS configuration:

**Option A: Using dig (Linux/Mac)**
```bash
dig biologischvleeschatelier.profile.elysia.marketing

# Should show:
# ;; ANSWER SECTION:
# biologischvleeschatelier.profile.elysia.marketing. 3600 IN A 123.456.789.012
```

**Option B: Using nslookup (Windows)**
```cmd
nslookup biologischvleeschatelier.profile.elysia.marketing

# Should show:
# Name: biologischvleeschatelier.profile.elysia.marketing
# Address: 123.456.789.012
```

**Option C: Using Online Tool**
- Visit: https://dnschecker.org/
- Enter: `biologischvleeschatelier.profile.elysia.marketing`
- Check: Should show your server IP from multiple locations worldwide

---

## Alternative: Using CNAME Record

If you already have a subdomain pointing to your server, you can use a CNAME record instead:

| Field | Value |
|-------|-------|
| **Type** | `CNAME` |
| **Name** | `biologischvleeschatelier.profile` |
| **Value** | `existing-server.elysia.marketing` |
| **TTL** | `3600` |

**Note**: CNAME records cannot coexist with other record types for the same name.

---

## Cloudflare-Specific Configuration

If using Cloudflare, follow these additional steps:

### Initial Setup (Before SSL)

1. Add A record as described above
2. Set **Proxy status** to `DNS only` (gray cloud icon)
3. This allows Let's Encrypt to verify domain ownership

### After SSL Setup (Optional)

1. Change **Proxy status** to `Proxied` (orange cloud icon)
2. This enables Cloudflare's CDN and DDoS protection
3. Configure SSL/TLS mode to `Full (strict)` in Cloudflare dashboard

**Benefits of Cloudflare Proxy**:
- DDoS protection
- CDN caching
- Web Application Firewall (WAF)
- Analytics

**Drawbacks**:
- Cloudflare sees all traffic (privacy consideration)
- Additional latency for dynamic content
- SSL certificate managed by Cloudflare (not Let's Encrypt)

---

## Troubleshooting

### DNS Not Resolving

**Problem**: `dig` or `nslookup` doesn't return your server IP

**Solutions**:
1. **Wait longer** - DNS propagation can take up to 24 hours
2. **Check record name** - Ensure it's `biologischvleeschatelier.profile` not `biologischvleeschatelier.profile.elysia.marketing`
3. **Check TTL** - Lower TTL (e.g., 300) for faster propagation during setup
4. **Clear DNS cache**:
   ```bash
   # Linux
   sudo systemd-resolve --flush-caches
   
   # Mac
   sudo dscacheutil -flushcache
   
   # Windows
   ipconfig /flushdns
   ```
5. **Use different DNS server** - Try Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1)

### Wrong IP Address Returned

**Problem**: DNS resolves to wrong IP address

**Solutions**:
1. **Check DNS provider** - Ensure you're editing the correct domain
2. **Check for conflicting records** - Remove old A records for the same name
3. **Wait for propagation** - Old records may still be cached

### SSL Certificate Fails

**Problem**: Let's Encrypt can't verify domain

**Solutions**:
1. **Verify DNS first** - Ensure domain resolves correctly before requesting SSL
2. **Disable Cloudflare proxy** - Set to `DNS only` during initial SSL setup
3. **Check port 80** - Ensure port 80 is open and accessible
4. **Check nginx** - Ensure nginx is running and serving `.well-known/acme-challenge/`

---

## DNS Record Examples

### Minimal Configuration (A Record Only)

```
Type: A
Name: biologischvleeschatelier.profile
Value: 123.456.789.012
TTL: 3600
```

### With IPv6 Support (A + AAAA Records)

```
Type: A
Name: biologischvleeschatelier.profile
Value: 123.456.789.012
TTL: 3600

Type: AAAA
Name: biologischvleeschatelier.profile
Value: 2001:db8::1
TTL: 3600
```

### With WWW Redirect (A + CNAME Records)

```
Type: A
Name: biologischvleeschatelier.profile
Value: 123.456.789.012
TTL: 3600

Type: CNAME
Name: www.biologischvleeschatelier.profile
Value: biologischvleeschatelier.profile.elysia.marketing
TTL: 3600
```

---

## Security Considerations

### CAA Records (Optional but Recommended)

CAA (Certification Authority Authorization) records specify which Certificate Authorities can issue SSL certificates for your domain.

```
Type: CAA
Name: biologischvleeschatelier.profile
Value: 0 issue "letsencrypt.org"
TTL: 3600
```

This prevents unauthorized SSL certificate issuance.

### DNSSEC (Optional)

If your DNS provider supports DNSSEC, enable it for additional security:
- Protects against DNS spoofing
- Ensures DNS responses are authentic
- Required for some compliance standards

---

## Testing Checklist

After DNS configuration, verify:

- [ ] DNS resolves to correct IP: `dig biologischvleeschatelier.profile.elysia.marketing`
- [ ] HTTP accessible: `curl -I http://biologischvleeschatelier.profile.elysia.marketing`
- [ ] Port 80 open: `telnet biologischvleeschatelier.profile.elysia.marketing 80`
- [ ] Port 443 open: `telnet biologischvleeschatelier.profile.elysia.marketing 443`
- [ ] No conflicting records: Check for duplicate A records
- [ ] Propagation complete: Check from multiple locations using dnschecker.org

---

## Quick Reference

**Domain**: `biologischvleeschatelier.profile.elysia.marketing`

**DNS Record**:
```
Type: A
Name: biologischvleeschatelier.profile
Value: [YOUR_SERVER_IP]
TTL: 3600
```

**Verification**:
```bash
dig +short biologischvleeschatelier.profile.elysia.marketing
# Should return: YOUR_SERVER_IP
```

**Next Steps**:
1. Configure DNS (this guide)
2. Deploy application: `./scripts/deploy.sh`
3. Setup SSL: `./scripts/setup-ssl.sh`
4. Access: https://biologischvleeschatelier.profile.elysia.marketing

---

## Support

For DNS configuration help:
- **Cloudflare Support**: https://support.cloudflare.com/
- **Hetzner Support**: https://docs.hetzner.com/dns-console/
- **General DNS Help**: https://www.whatsmydns.net/

---

**Document Version**: 1.0  
**Last Updated**: November 2025
