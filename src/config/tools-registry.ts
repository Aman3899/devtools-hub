import dynamic from 'next/dynamic';

export const TOOLS_REGISTRY: Record<string, any> = {
  'json-formatter': {
    component: dynamic(() => import('@/features/json-formatter/components/json-formatter-client').then(m => m.JsonFormatterClient)),
  },
  'json-to-csv': {
    component: dynamic(() => import('@/features/json-to-csv/components/json-to-csv-client').then(m => m.JsonToCsvClient)),
  },
  'csv-to-json': {
    component: dynamic(() => import('@/features/csv-to-json/components/csv-to-json-client').then(m => m.CsvToJsonClient)),
  },
  'xml-formatter': {
    component: dynamic(() => import('@/features/xml-formatter/components/xml-formatter-client').then(m => m.XmlFormatterClient)),
  },
  'yaml-validator': {
    component: dynamic(() => import('@/features/yaml-validator/components/yaml-validator-client').then(m => m.YamlValidatorClient)),
  },
  'toml-validator': {
    component: dynamic(() => import('@/features/toml-validator/components/toml-validator-client').then(m => m.TomlValidatorClient)),
  },
  'markdown-previewer': {
    component: dynamic(() => import('@/features/markdown-previewer/components/markdown-previewer-client').then(m => m.MarkdownPreviewerClient)),
  },
  'code-diff-checker': {
    component: dynamic(() => import('@/features/code-diff-checker/components/code-diff-checker-client').then(m => m.CodeDiffCheckerClient)),
  },
  'word-counter': {
    component: dynamic(() => import('@/features/word-counter/components/word-counter-client').then(m => m.WordCounterClient)),
  },
  'lorem-ipsum': {
    component: dynamic(() => import('@/features/lorem-ipsum/components/lorem-ipsum-client').then(m => m.LoremIpsumClient)),
  },
  'case-converter': {
    component: dynamic(() => import('@/features/case-converter/components/case-converter-client').then(m => m.CaseConverterClient)),
  },
  'slug-generator': {
    component: dynamic(() => import('@/features/slug-generator/components/slug-generator-client').then(m => m.SlugGeneratorClient)),
  },
  'string-reverse': {
    component: dynamic(() => import('@/features/string-reverse/components/string-reverse-client').then(m => m.StringReverseClient)),
  },
  'duplicate-remover': {
    component: dynamic(() => import('@/features/duplicate-remover/components/duplicate-remover-client').then(m => m.DuplicateRemoverClient)),
  },
  'whitespace-remover': {
    component: dynamic(() => import('@/features/whitespace-remover/components/whitespace-remover-client').then(m => m.WhitespaceRemoverClient)),
  },
  'ascii-art': {
    component: dynamic(() => import('@/features/ascii-art/components/ascii-art-client').then(m => m.AsciiArtClient)),
  },
  'emoji-picker': {
    component: dynamic(() => import('@/features/emoji-picker/components/emoji-picker-client').then(m => m.EmojiPickerClient)),
  },
  'text-sorter': {
    component: dynamic(() => import('@/features/text-sorter/components/text-sorter-client').then(m => m.TextSorterClient)),
  },
  'line-number-adder': {
    component: dynamic(() => import('@/features/line-number-adder/components/line-number-adder-client').then(m => m.LineNumberAdderClient)),
  },
  'find-replace': {
    component: dynamic(() => import('@/features/find-replace/components/find-replace-client').then(m => m.FindReplaceClient)),
  },
  'jwt-decoder': {
    component: dynamic(() => import('@/features/jwt-decoder/components/jwt-decoder-client').then(m => m.JwtDecoderClient)),
  },
  'api-tester': {
    component: dynamic(() => import('@/features/api-tester/components/api-tester-client').then(m => m.ApiTesterClient)),
  },
  'base64-encoder': {
    component: dynamic(() => import('@/features/base64-encoder/components/base64-encoder-client').then(m => m.Base64EncoderClient)),
  },
  'color-palette-generator': {
    component: dynamic(() => import('@/features/color-palette-generator/components/color-palette-generator-client').then(m => m.ColorPaletteGeneratorClient)),
  },
  'css-gradient-generator': {
    component: dynamic(() => import('@/features/css-gradient-generator/components/css-gradient-generator-client').then(m => m.CssGradientGeneratorClient)),
  },
  'curl-generator': {
    component: dynamic(() => import('@/features/curl-generator/components/curl-generator-client').then(m => m.CurlGeneratorClient)),
  },
  'env-checker': {
    component: dynamic(() => import('@/features/env-checker/components/env-checker-client').then(m => m.EnvCheckerClient)),
  },
  'image-to-base64': {
    component: dynamic(() => import('@/features/image-to-base64/components/image-to-base64-client').then(m => m.ImageToBase64Client)),
  },
  'regex-tester': {
    component: dynamic(() => import('@/features/regex-tester/components/regex-tester-client').then(m => m.RegexTesterClient)),
  },
  'sql-formatter': {
    component: dynamic(() => import('@/features/sql-formatter/components/sql-formatter-client').then(m => m.SqlFormatterClient)),
  },
  'timestamp-converter': {
    component: dynamic(() => import('@/features/timestamp-converter/components/timestamp-converter-client').then(m => m.TimestampConverterClient)),
  },
  'uuid-generator': {
    component: dynamic(() => import('@/features/uuid-generator/components/uuid-generator-client').then(m => m.UuidGeneratorClient)),
  },
  'url-encoder': {
    component: dynamic(() => import('@/features/url-encoder/components/url-encoder-client').then(m => m.UrlEncoderClient)),
  },
  'html-entity-encoder': {
    component: dynamic(() => import('@/features/html-entity-encoder/components/html-entity-encoder-client').then(m => m.HtmlEntityEncoderClient)),
  },
  'jwt-builder': {
    component: dynamic(() => import('@/features/jwt-builder/components/jwt-builder-client').then(m => m.JwtBuilderClient)),
  },
  'md5-generator': {
    component: dynamic(() => import('@/features/md5-generator/components/md5-generator-client').then(m => m.Md5GeneratorClient)),
  },
  'sha-generator': {
    component: dynamic(() => import('@/features/sha-generator/components/sha-generator-client').then(m => m.ShaGeneratorClient)),
  },
  'bcrypt-generator': {
    component: dynamic(() => import('@/features/bcrypt-generator/components/bcrypt-generator-client').then(m => m.BcryptGeneratorClient)),
  },
  'argon2-generator': {
    component: dynamic(() => import('@/features/argon2-generator/components/argon2-generator-client').then(m => m.Argon2GeneratorClient)),
  },
  'hmac-generator': {
    component: dynamic(() => import('@/features/hmac-generator/components/hmac-generator-client').then(m => m.HmacGeneratorClient)),
  },
  'morse-converter': {
    component: dynamic(() => import('@/features/morse-converter/components/morse-converter-client').then(m => m.MorseConverterClient)),
  },
  'base-converter': {
    component: dynamic(() => import('@/features/base-converter/components/base-converter-client').then(m => m.BaseConverterClient)),
  },
  'caesar-cipher': {
    component: dynamic(() => import('@/features/caesar-cipher/components/caesar-cipher-client').then(m => m.CaesarCipherClient)),
  },
  'rot13-encoder': {
    component: dynamic(() => import('@/features/rot13-encoder/components/rot13-encoder-client').then(m => m.Rot13EncoderClient)),
  },
  'punycode-converter': {
    component: dynamic(() => import('@/features/punycode-converter/components/punycode-converter-client').then(m => m.PunycodeConverterClient)),
  },
  'unicode-inspector': {
    component: dynamic(() => import('@/features/unicode-inspector/components/unicode-inspector-client').then(m => m.UnicodeInspectorClient)),
  },
  'html-color-to-hex': {
    component: dynamic(() => import('@/features/html-color-to-hex/components/html-color-to-hex-client').then(m => m.HtmlColorToHexClient)),
  },
  'aes-encryptor': {
    component: dynamic(() => import('@/features/aes-encryptor/components/aes-encryptor-client').then(m => m.AesEncryptorClient)),
  },
  'rsa-key-generator': {
    component: dynamic(() => import('@/features/rsa-key-generator/components/rsa-key-generator-client').then(m => m.RsaKeyGeneratorClient)),
  },
  'qrcode-decoder': {
    component: dynamic(() => import('@/features/qrcode-decoder/components/qrcode-decoder-client').then(m => m.QrcodeDecoderClient)),
  },
  // Phase 2: HTML Processing Batch (Tools 41-46)
  'html-previewer': {
    component: dynamic(() => import('@/features/html-previewer/components/html-previewer-client').then(m => m.HtmlPreviewerClient)),
  },
  'html-minifier': {
    component: dynamic(() => import('@/features/html-minifier/components/html-minifier-client').then(m => m.HtmlMinifierClient)),
  },
  'html-beautifier': {
    component: dynamic(() => import('@/features/html-beautifier/components/html-beautifier-client').then(m => m.HtmlBeautifierClient)),
  },
  'html-to-markdown': {
    component: dynamic(() => import('@/features/html-to-markdown/components/html-to-markdown-client').then(m => m.HtmlToMarkdownClient)),
  },
  'markdown-to-html': {
    component: dynamic(() => import('@/features/markdown-to-html/components/markdown-to-html-client').then(m => m.MarkdownToHtmlClient)),
  },
  'html-to-jsx': {
    component: dynamic(() => import('@/features/html-to-jsx/components/html-to-jsx-client').then(m => m.HtmlToJsxClient)),
  },
  // Phase 3: Generators & SEO Batch
  'meta-tag-generator': {
    component: dynamic(() => import('@/features/meta-tag-generator/components/meta-tag-generator-client').then(m => m.MetaTagGeneratorClient)),
  },
  'favicon-generator': {
    component: dynamic(() => import('@/features/favicon-generator/components/favicon-generator-client').then(m => m.FaviconGeneratorClient)),
  },
  'robots-txt-generator': {
    component: dynamic(() => import('@/features/robots-txt-generator/components/robots-txt-generator-client').then(m => m.RobotsTxtGeneratorClient)),
  },
  'sitemap-generator': {
    component: dynamic(() => import('@/features/sitemap-generator/components/sitemap-generator-client').then(m => m.SitemapGeneratorClient)),
  },
  'htaccess-generator': {
    component: dynamic(() => import('@/features/htaccess-generator/components/htaccess-generator-client').then(m => m.HtaccessGeneratorClient)),
  },
  'iframe-generator': {
    component: dynamic(() => import('@/features/iframe-generator/components/iframe-generator-client').then(m => m.IframeGeneratorClient)),
  },
  'html-table-generator': {
    component: dynamic(() => import('@/features/html-table-generator/components/html-table-generator-client').then(m => m.HtmlTableGeneratorClient)),
  },
  // Phase 4: Parsers & References Batch
  'og-previewer': {
    component: dynamic(() => import('@/features/og-previewer/components/og-previewer-client').then(m => m.OgPreviewerClient)),
  },
  'link-extractor': {
    component: dynamic(() => import('@/features/link-extractor/components/link-extractor-client').then(m => m.LinkExtractorClient)),
  },
  'http-status-reference': {
    component: dynamic(() => import('@/features/http-status-reference/components/http-status-reference-client').then(m => m.HttpStatusReferenceClient)),
  },
  'mime-type-finder': {
    component: dynamic(() => import('@/features/mime-type-finder/components/mime-type-finder-client').then(m => m.MimeTypeFinderClient)),
  },
  'cookie-parser': {
    component: dynamic(() => import('@/features/cookie-parser/components/cookie-parser-client').then(m => m.CookieParserClient)),
  },
  'user-agent-parser': {
    component: dynamic(() => import('@/features/user-agent-parser/components/user-agent-parser-client').then(m => m.UserAgentParserClient)),
  },
  'url-parser': {
    component: dynamic(() => import('@/features/url-parser/components/url-parser-client').then(m => m.UrlParserClient)),
  },
};