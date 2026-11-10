# iOS experimental rules channel

Stable URL: https://raw.githubusercontent.com/charles0329979/AuroraReader-book-sources/main/ios-rules/catalog.json

For the iOS prototype on `ios/reading-loop-cloud` only. Revision must increase on every catalog change. Keep source IDs stable. This is an experimental channel, not an assertion of App Store authorization or full health of every source.

The client validates the whole catalog before committing, retains last valid rules on errors, and provides a previous-version restore action. Same-revision modifications and silent revision downgrades are rejected. Refresh runs manually or when opening the source screen after 24 hours; it is not an iOS background scheduling guarantee.

Initial capability batch: 漫画1234, LINE WEBTOON 繁體中文, 咚漫漫画. Client capabilities and reviewed hosts are compiled into the app; adding unsupported capabilities requires an app update. Changes to selectors within supported capabilities can arrive through this URL.

Trust: HTTPS with a restricted catalog host, engine capability/host validation and locally stored SHA-256. This is not publisher signature verification. Signing and key rotation remain release preparation work.
