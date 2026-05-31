# Changelog

## 0.2.4

- Fixed KLIPY GIF sends after Discord changed the `sendMessage` argument layout again.
- Prefer the current four-argument `sendMessage(channelId, message, shouldSend, options)` shape so nonce metadata is always passed in the options argument.
- Kept legacy and direct `_sendMessage` fallbacks for older Discord builds.
- Added a YABDP4Nitro compatibility path that bypasses its message-send patch for plain KLIPY GIF URL sends.
- Confirm sends by checking the outgoing message nonce in Discord's MessageStore when available.

## 0.2.3

- Added GitHub raw-file update checks with a BetterDiscord notification and one-click update action.
- Added a settings toggle for automatic update checks, enabled by default for new installs.
- Added `@updateUrl` metadata pointing to the public raw plugin file.

## 0.2.2

- Fixed the `Ctrl+G` shortcut fallback so it only targets Discord's message composer GIF picker button.
- Prevented chat GIF/media previews from being clicked accidentally when another user's GIF is visible in the conversation.
- Added a composer-specific visibility check for the shortcut path instead of reusing the taller GIF picker panel visibility threshold.
- Documented the GitHub-only manual update behavior and BetterDiscord website/store update path.

## 0.2.1

- Fixed checkbox setting layout on themes where the input stretched into an empty dark area.
- Hardened KLIPY tab sizing, active-state overrides, and label rendering to prevent tab text from being clipped when active.
- Added extra vertical clearance between the active KLIPY tab row and the custom KLIPY panel so the panel cannot cover the tab label.
- Added Flux event-based picker resync and cached Discord Webpack lookups while keeping the DOM observer fallback.
- Added a legacy clipboard fallback for clients where `navigator.clipboard` is blocked.
- Added an optional `Ctrl+G` shortcut that opens Discord's GIF picker directly on the KLIPY tab.
- Cleaned final settings styling for broader BetterDiscord theme compatibility.

## 0.2.0

- Reworked the settings panel into grouped, Discord-themed sections with language selection first.
- Extended localization from the API guide to the full settings panel across the 20 supported languages.
- Changed the default settings language to English for new installs.
- Added a media quality setting and defaulted to high quality previews/sends.
- Improved KLIPY media URL selection so sends prefer higher quality nested `hd`/`gif` assets before low-resolution direct URLs.

## 0.1.6

- Added nonce-error-only fallback calls for Discord `sendMessage` builds that read send options from a later argument position.

## 0.1.5

- Fixed Discord send failures caused by current `sendMessage` builds expecting message nonce metadata.
- Reduced failed-send fallback to a single warning toast after copying the GIF URL.

## 0.1.4

- Changed KLIPY GIF clicks to send through Discord's message action instead of writing directly into the Slate message editor.
- Migrated the legacy insert click behavior to immediate send, with copy-to-clipboard kept as the fallback.
- Prevented selected KLIPY GIF URLs from getting stuck as stale text over Discord's message placeholder.

## 0.1.3

- Fixed the KLIPY loading state staying visible beside search results.
- Reworked the KLIPY search bar to match Discord's current input layout more closely.
- Closed and cleaned the KLIPY overlay reliably when switching to Discord's GIF, sticker, or emoji tabs.
- Hid native picker tab panels while KLIPY is active to prevent background GIF/sticker bleed-through.

## 0.1.2

- Fixed empty KLIPY results by supporting the current KLIPY v1 `file` response shape, including `file.xs.jpg`, `file.hd.gif`, and `file.gif`.
- Normalized protocol-relative media URLs to `https://`.
- Made the KLIPY panel reuse Discord's current GIF panel/header/content class names so it follows the active Discord theme more closely.

## 0.1.1

- Fixed GIF picker placement by targeting Discord's current `#gif-picker-tab-panel` content wrapper instead of broad expression picker layers.
- Prevented mutation of Discord's outer absolute positioning layer.
- Matched the KLIPY tab more closely to Discord's current expression picker tablist.

## 0.1.0

- Initial public implementation.
- Added separate KLIPY GIF picker tab.
- Added user-provided KLIPY API key settings.
- Added a readable API key setup guide in 20 languages inside plugin settings.
- Added KLIPY search/trending API layer with v1 and Tenor-compatible v2 endpoint modes.
- Added local-only settings, attribution, error states, and clean plugin shutdown.
