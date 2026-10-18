# Documentation direction

The root is a developer hub; `/api` is the API workspace. OpenAI's user-provided screenshots inform hierarchy, not visual identity. Vremly's official wordmark, local Inter/IBM Plex fonts, neutral filled surfaces, pill controls, and the landing page's seeded AuroraGradient define the design. The favicon uses the white V. No entrance animation in technical content.

All guides share reading typography, filled code/table/admonition surfaces, navigation, pagination, and theme tokens. MCP uses filled step cards and branded client tabs. Technical guide content and the committed OpenAPI specification are preserved.

The AuroraGradient source is copied from the landing component; scoped CSS supplies its Tailwind paint utilities for the Delivered/Uploaded palettes used here. Keep geometry and palette changes aligned with that upstream implementation.

OpenAPI artwork source: https://github.com/OAI/OpenAPI-Style-Guide/blob/main/graphics/vector/OpenAPI_Logo_Black.svg (viewBox cropped to artwork; mark unchanged). MCP mark: Simple Icons modelcontextprotocol.svg. These marks identify their respective technologies.

Scalar 1.67.0's unchanged standalone renderer is vendored from https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.67.0 and served locally. Upgrade deliberately and verify API reference rendering, theme switching, search, and endpoint controls.
