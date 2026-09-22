# Product specification download cleanup — 2026-09-21

All 12 published products now link to stable ASCII download paths under `/downloads/`. Filenames are lowercase, descriptive and free of spaces, plus signs, Chinese punctuation and model separators that previously produced awkward encoded URLs.

The original `/product-documents/` files remain available for existing external links. Both legacy and new Word document paths return `X-Robots-Tag: noindex, nosnippet`; new downloads also return `Content-Disposition: attachment`. Google can continue indexing the corresponding product page instead of treating the Word file as the primary result.

The product pages already render the document's primary public information as HTML: overview, features, a technical specification table, applications, selection guidance and FAQs. Automated checks now require every product to retain substantial HTML content and a unique, existing clean download file.

Verification: 35 test files and 75 tests passed, TypeScript passed, and the production build generated all 50 pages.

Production deployment `dpl_GN6zPfXqT93WYcpwyRMaiqUkkedP` reached `READY` and was assigned to `https://www.link-jl.com`. All 12 clean files returned HTTP 200, `X-Robots-Tag: noindex, nosnippet` and `Content-Disposition: attachment`. A live product page linked the clean file and retained its HTML specification section. The sampled legacy file remained available with `noindex, nosnippet`.
