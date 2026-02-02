# MCP Installation Guide - TubeSpark Turbo

## Quick Setup

Run these commands in your project directory to configure MCPs via Claude Code CLI:

```bash
# Supabase MCP (Database Management)
claude mcp add supabase --type stdio -- npx -y @supabase/mcp-server-supabase@latest
# After adding, set the environment variable:
# SUPABASE_ACCESS_TOKEN=your_supabase_access_token

# Playwright MCP (Browser Automation)
claude mcp add playwright --type stdio -- npx @playwright/mcp@latest

# Firecrawl MCP (Web Scraping)
claude mcp add firecrawl --type stdio -- npx -y firecrawl-mcp
# Set: FIRECRAWL_API_KEY=your_firecrawl_api_key

# Shadcn UI MCP (Component Library)
claude mcp add shadcn-ui --type stdio -- npx @jpisnice/shadcn-ui-mcp-server
# Set: GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token

# Stripe MCP (Payments)
claude mcp add stripe -- npx -y @stripe/mcp --tools=all --api-key=your_stripe_api_key

# Context7 MCP (Documentation - HTTP)
claude mcp add upstash-context-7-mcp --type http --url "https://server.smithery.ai/@upstash/context7-mcp/mcp"
```

---

## Manual Configuration

### Option 1: Project-level `.mcp.json`

Create a `.mcp.json` file in your project root:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase@latest"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_SUPABASE_ACCESS_TOKEN"
      }
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"],
      "env": {}
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "YOUR_FIRECRAWL_API_KEY"
      }
    },
    "shadcn-ui": {
      "command": "npx",
      "args": ["@jpisnice/shadcn-ui-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_TOKEN"
      }
    },
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all", "--api-key=YOUR_STRIPE_API_KEY"]
    }
  }
}
```

### Option 2: User-level `~/.claude.json`

Add to the `mcpServers` object inside your project entry:

```json
{
  "projects": {
    "/path/to/your/project": {
      "mcpServers": {
        "supabase": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "@supabase/mcp-server-supabase@latest"],
          "env": {
            "SUPABASE_ACCESS_TOKEN": "YOUR_TOKEN"
          }
        },
        "playwright": {
          "type": "stdio",
          "command": "npx",
          "args": ["@playwright/mcp@latest"],
          "env": {}
        },
        "firecrawl": {
          "type": "stdio",
          "command": "npx",
          "args": ["-y", "firecrawl-mcp"],
          "env": {
            "FIRECRAWL_API_KEY": "YOUR_API_KEY"
          }
        },
        "shadcn-ui": {
          "type": "stdio",
          "command": "npx",
          "args": ["@jpisnice/shadcn-ui-mcp-server"],
          "env": {
            "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_TOKEN"
          }
        },
        "upstash-context-7-mcp": {
          "type": "http",
          "url": "https://server.smithery.ai/@upstash/context7-mcp/mcp"
        },
        "stripe": {
          "command": "npx",
          "args": ["-y", "@stripe/mcp", "--tools=all", "--api-key=YOUR_STRIPE_KEY"]
        }
      }
    }
  }
}
```

---

## Plugins (Claude Code Extensions)

Enable plugins in `.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "claude-mem@thedotmack": true,
    "ralph-loop@claude-plugins-official": true
  }
}
```

---

## MCP Descriptions

| MCP | Purpose | Required Env Vars |
|-----|---------|-------------------|
| **supabase** | Database management, SQL execution, migrations | `SUPABASE_ACCESS_TOKEN` |
| **playwright** | Browser automation, screenshots, testing | None |
| **firecrawl** | Web scraping, content extraction | `FIRECRAWL_API_KEY` |
| **shadcn-ui** | Get shadcn/ui components and docs | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| **stripe** | Payment management, customers, invoices | API key in args |
| **context7** | Up-to-date library documentation | None (HTTP) |

---

## Getting API Keys

1. **Supabase**: https://supabase.com/dashboard/account/tokens
2. **Firecrawl**: https://firecrawl.dev/dashboard
3. **GitHub Token**: https://github.com/settings/tokens
4. **Stripe**: https://dashboard.stripe.com/apikeys

---

## One-liner Full Setup

Copy and run each command (replace placeholders with your actual keys):

```bash
# Add all MCPs at once
claude mcp add supabase --type stdio -- npx -y @supabase/mcp-server-supabase@latest && \
claude mcp add playwright --type stdio -- npx @playwright/mcp@latest && \
claude mcp add firecrawl --type stdio -- npx -y firecrawl-mcp && \
claude mcp add shadcn-ui --type stdio -- npx @jpisnice/shadcn-ui-mcp-server && \
claude mcp add upstash-context-7-mcp --type http --url "https://server.smithery.ai/@upstash/context7-mcp/mcp"
```

Then edit `~/.claude.json` to add the environment variables for each MCP.
