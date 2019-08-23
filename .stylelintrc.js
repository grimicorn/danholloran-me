module.exports = {
    extends: "stylelint-config-recommended",
    plugins: ["stylelint-order"],
    rules: {
        "block-no-empty": null,
        "at-rule-no-vendor-prefix": true,
        "block-opening-brace-space-before": "always",
        "color-hex-case": "lower",
        "color-hex-length": "short",
        "color-named": "never",
        "declaration-bang-space-after": "never",
        "declaration-bang-space-before": "always",
        "declaration-block-semicolon-newline-after": "always",
        "declaration-block-semicolon-space-before": "never",
        "declaration-block-single-line-max-declarations": 1,
        "declaration-block-trailing-semicolon": "always",
        "declaration-colon-space-after": "always-single-line",
        "declaration-colon-space-before": "never",
        "declaration-property-value-blacklist": {
            "/^border/": ["none"]
        },
        "function-comma-space-after": "always-single-line",
        "function-parentheses-space-inside": "never",
        "function-url-quotes": "always",
        indentation: 2,
        "length-zero-no-unit": true,
        "max-nesting-depth": 2,
        "media-feature-name-no-vendor-prefix": true,
        "media-feature-parentheses-space-inside": "never",
        "no-missing-end-of-source-newline": true,
        "number-leading-zero": "always",
        "number-no-trailing-zeros": true,
        "order/properties-alphabetical-order": false,
        "property-no-vendor-prefix": true,
        "rule-empty-line-before": [
            "always-multi-line",
            {
                except: ["first-nested"],
                ignore: ["after-comment"]
            }
        ],
        "selector-class-pattern": [
            "^[a-z0-9\\-]+$",
            {
                message:
                    "Selector should be written in lowercase with hyphens (selector-class-pattern)"
            }
        ],
        "selector-list-comma-newline-after": "always",
        "selector-max-compound-selectors": 3,
        "selector-max-id": 0,
        "selector-no-qualifying-type": true,
        "selector-no-vendor-prefix": true,
        "selector-pseudo-element-colon-notation": "double",
        "shorthand-property-no-redundant-values": true,
        "string-quotes": "single",
        "value-no-vendor-prefix": true,
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "extend",
                    "extends",
                    "at-root",
                    "debug",
                    "warn",
                    "error",
                    "if",
                    "else",
                    "for",
                    "each",
                    "while",
                    "mixin",
                    "include",
                    "content",
                    "return",
                    "function",
                    "tailwind",
                    "screen",
                    "config",
                    "apply"
                ]
            }
        ]
    }
};
