<div align="center">

# GifSourcePlus

**A polished BetterDiscord plugin that adds KLIPY as its own GIF source without replacing Discord's built-in GIF picker.**

[![Version](https://img.shields.io/badge/version-0.2.1-5865F2?style=for-the-badge)](./CHANGELOG.md)
[![BetterDiscord](https://img.shields.io/badge/BetterDiscord-plugin-3BA55D?style=for-the-badge)](https://betterdiscord.app/)
[![License](https://img.shields.io/badge/license-MIT-2B2D31?style=for-the-badge)](./LICENSE)

</div>

## Overview

GifSourcePlus adds a separate `KLIPY` tab next to Discord's native `GIFs`, `Stickers`, and `Emoji` tabs. Discord's original GIF experience stays untouched: Giphy results remain where they are, while KLIPY results appear in their own clean panel.

The plugin is designed for public distribution. It does **not** include a shared, hidden, or bundled KLIPY API key. Each user enters their own KLIPY developer key locally in BetterDiscord settings.

## Why Use It

| Feature | What it does |
| --- | --- |
| Separate KLIPY tab | Keeps KLIPY results isolated from Discord/Giphy results. |
| Direct GIF sending | Clicking a KLIPY GIF sends it to the current channel immediately. |
| Safe fallback | If Discord's send internals fail, the GIF URL is copied to the clipboard. |
| User-owned API key | No shared key, no embedded secret, no public credential exposure. |
| High-quality media mode | Prefers better KLIPY media fields such as `hd` and `gif` for previews and sends. |
| 20-language settings | Settings text and API key guide are localized across 20 selectable languages. |
| Ctrl+G shortcut | Optional shortcut opens the GIF picker directly on the KLIPY tab. |
| Clean shutdown | Removes injected UI, styles, observers, Flux listeners, timers, and pending requests. |

## Requirements

- Discord desktop with BetterDiscord installed.
- A personal KLIPY API key from [KLIPY Developers](https://klipy.com/developers).
- BetterDiscord plugin access to install a local `.plugin.js` file.

## Installation

1. Download `GifSourcePlus.plugin.js` from this repository or the latest release assets.
2. Move it into your BetterDiscord plugins folder:
   - Windows: `%appdata%\BetterDiscord\plugins`
3. Open Discord and enable `GifSourcePlus` in BetterDiscord settings.
4. Open the plugin settings.
5. Select your settings language, read the built-in API key guide, and paste your KLIPY API key.

## How It Works

GifSourcePlus watches for Discord's GIF picker and injects a dedicated `KLIPY` tab into the existing picker layout. KLIPY search and trending results are rendered in a separate panel with `Powered by KLIPY` attribution.

When a GIF is clicked, the plugin tries Discord's current message-sending action for the selected channel. If that internal Discord action is unavailable or changes, the plugin falls back to copying the GIF URL so the user can still paste it manually.

For compatibility, the plugin uses current BetterDiscord APIs such as `BdApi.Data`, `BdApi.DOM`, `BdApi.Net`, `BdApi.UI`, and `BdApi.Webpack`. Discord internals are not a stable public API, so the plugin combines Webpack store lookups, Flux event resync, DOM observer fallback, and conservative cleanup logic.

## Privacy and Security

- No shared KLIPY API key is bundled.
- Your KLIPY API key is stored only in BetterDiscord local plugin data.
- The plugin does not collect analytics.
- Network requests are limited to KLIPY API calls needed for GIF search/trending.
- If message sending fails, only the selected GIF URL is copied to your clipboard as a fallback.

## KLIPY API Key

Get your key from:

- [KLIPY Developers](https://klipy.com/developers)
- [KLIPY Documentation](https://docs.klipy.com/)
- [KLIPY Tenor migration guide](https://github.com/KLIPY-com/Migrate-From-Tenor-To-Klipy)

Keep your key private. Do not post it in screenshots, public issues, commits, support messages, or shared configuration files.

## Compatibility Notes

BetterDiscord plugins run inside Discord's desktop client and sometimes rely on Discord internals. GifSourcePlus avoids unnecessary invasive patching, but Discord picker DOM, Flux events, stores, or message action signatures may still change after Discord updates.

If a future Discord update breaks direct sending, the plugin should still fall back to copying the selected GIF URL.

## Development

The project is intentionally simple: one plugin file, no production dependencies.

Syntax check:

```powershell
node --check .\GifSourcePlus.plugin.js
```

Secret scan example:

```powershell
Select-String -Path .\GifSourcePlus.plugin.js,.\README.md,.\CHANGELOG.md,.\LICENSE -Pattern "api_key|apikey|token|secret|password" -CaseSensitive:$false
```

Expected matches are documentation and settings labels only, not real secrets.

## License

MIT. See [LICENSE](./LICENSE).
