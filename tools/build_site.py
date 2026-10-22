from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES_DIR = ROOT / "pages"
PARTIALS_DIR = ROOT / "partials"
INCLUDE_PATTERN = re.compile(r"<!--\s*include:\s*([\w-]+)\s*-->")
PLACEHOLDER_PATTERN = re.compile(r"\{\{([a-z_]+)\}\}")

COMMON_HEADER = {
    "brand_class": "brand",
    "nav_attributes": 'aria-label="Main navigation"',
    "product_label_attributes": "",
    "menu_kicker_attributes": "",
    "menu_series_attributes": "",
    "menu_eye_mask_attributes": "",
    "menu_travel_pillow_attributes": "",
    "menu_sleep_pillow_attributes": "",
    "menu_coming_attributes": "",
    "synap_link_attributes": "",
    "about_link_attributes": "",
    "language_id": "",
    "language_aria": "Language options",
    "language_pressed": "",
}

FOOTER_DEFAULTS = {
    "footer_brand_class": "brand",
    "footer_logo_markup": "",
    "footer_tagline_attributes": "",
    "footer_nav_attributes": "",
    "footer_explore_attributes": "",
    "footer_follow_attributes": "",
    "footer_nav_links": "",
    "footer_social": "",
}

DATA_ATTRIBUTES = {
    "home": {
        "nav_attributes": 'aria-label="Main navigation" data-home-aria="mainNav"',
        "product_label_attributes": 'data-home-i18n="navProducts"',
        "menu_kicker_attributes": 'data-home-i18n="menuSeriesLabel"',
        "menu_series_attributes": 'data-home-i18n="menuSeries"',
        "menu_eye_mask_attributes": 'data-home-i18n="menuEyeMask"',
        "menu_travel_pillow_attributes": 'data-home-i18n="menuTravelPillow"',
        "menu_sleep_pillow_attributes": 'data-home-i18n="menuSleepPillow"',
        "menu_coming_attributes": 'data-home-i18n="menuComingSoon"',
        "about_link_attributes": 'data-home-i18n="navAbout"',
    },
    "about": {
        "nav_attributes": 'aria-label="Main navigation" data-about-aria="mainNav"',
        "product_label_attributes": 'data-about-i18n="navProducts"',
        "about_link_attributes": 'data-about-i18n="navAbout"',
    },
    "eye-mask": {
        "nav_attributes": 'id="mainNavigation" aria-label="Main navigation"',
        "product_label_attributes": 'data-i18n="navCollection"',
        "about_link_attributes": 'data-i18n="navAbout"',
    },
    "pillow": {
        "product_label_attributes": 'data-pillow-text="navProducts"',
        "about_link_attributes": 'data-pillow-text="navAbout"',
    },
    "synap": {
        "product_label_attributes": 'data-synap-text="navProducts"',
        "menu_kicker_attributes": 'data-synap-text="menuKicker"',
        "menu_series_attributes": 'data-synap-text="menuSeries"',
        "menu_eye_mask_attributes": 'data-synap-text="menuEyeMask"',
        "menu_travel_pillow_attributes": 'data-synap-text="menuTravelPillow"',
        "menu_sleep_pillow_attributes": 'data-synap-text="menuSleepPillow"',
        "menu_coming_attributes": 'data-synap-text="menuComing"',
        "about_link_attributes": 'data-synap-text="navAbout"',
    },
    "purchase": {
        "product_label_attributes": 'data-purchase-text="navProducts"',
        "menu_kicker_attributes": 'data-purchase-text="menuKicker"',
        "menu_series_attributes": 'data-purchase-text="menuSeries"',
        "menu_eye_mask_attributes": 'data-purchase-text="menuEyeMask"',
        "menu_travel_pillow_attributes": 'data-purchase-text="menuTravelPillow"',
        "menu_sleep_pillow_attributes": 'data-purchase-text="menuSleepPillow"',
        "menu_coming_attributes": 'data-purchase-text="menuComing"',
        "about_link_attributes": 'data-purchase-text="navAbout"',
    },
}

FOOTER_ICONS = "<!-- include: social-icons -->"
FOOTER_LINKS = "<!-- include: social-links -->"

PAGE_SETTINGS = {
    "index": {
        "header": {**DATA_ATTRIBUTES["home"], "brand_class": "logo", "language_id": 'id="homeLanguageToggle"'},
        "footer": {
            "brand_class": "logo",
            "footer_logo_markup": '<span class="brand-mark"><img src="assets/branding/icon_bottom.avif" alt=""></span>',
            "footer_tagline_attributes": 'data-home-i18n="footerTagline"',
            "footer_nav_attributes": 'data-home-aria="footerNav"',
            "footer_explore_attributes": 'data-home-i18n="footerExplore"',
            "footer_follow_attributes": 'data-home-i18n="footerFollow"',
            "footer_nav_links": '<a href="#products" data-home-i18n="footerProduct">Sleeping Wellness</a>\n<a href="synap-flow.html">SyNap Flow</a>\n<a href="about.html" data-home-i18n="footerAbout">About Invisible Tech</a>\n<a href="#top" data-home-i18n="footerTop">Back to top ↑</a>',
            "footer_social": FOOTER_ICONS,
        },
    },
    "about": {
        "header": {**DATA_ATTRIBUTES["about"], "brand_class": "logo", "language_id": 'id="aboutLanguageToggle"'},
        "footer": {
            "brand_class": "logo",
            "footer_logo_markup": '<span class="brand-mark"><img src="assets/branding/icon_bottom.avif" alt=""></span>',
            "footer_tagline_attributes": 'data-about-i18n="footerTagline"',
            "footer_nav_attributes": 'data-about-aria="footerNav"',
            "footer_explore_attributes": 'data-about-i18n="footerExplore"',
            "footer_follow_attributes": 'data-about-i18n="footerFollow"',
            "footer_nav_links": '<a href="index.html#products" data-about-i18n="footerProduct">Product collection</a>\n<a href="synap-flow.html">SyNap Flow</a>\n<a href="about.html" data-about-i18n="footerAbout">About Invisible Tech</a>\n<a href="#top" data-about-i18n="footerTop">Back to top ↑</a>',
            "footer_social": FOOTER_ICONS,
        },
    },
    "eye-mask": {
        "header": {**COMMON_HEADER, **DATA_ATTRIBUTES["eye-mask"], "language_id": 'id="languageToggle"'},
        "footer": {
            "brand_class": "brand",
            "footer_logo_markup": '<span class="brand-mark"><img src="assets/branding/icon_bottom.avif" alt=""></span>',
            "footer_tagline_attributes": 'data-i18n="footerTagline"',
            "footer_explore_attributes": 'data-i18n="footerExplore"',
            "footer_follow_attributes": 'data-i18n="footerFollow"',
            "footer_nav_links": '<a href="index.html#products" data-i18n="footerBack">Eye Mask</a>\n<a href="synap-flow.html">SyNap Flow</a>\n<a href="about.html" data-i18n="footerAbout">About Invisible Tech</a>\n<a href="#top" data-i18n="footerTop">Back to top ↑</a>',
            "footer_social": FOOTER_ICONS,
        },
    },
    "sleep-pillow": {
        "header": {**DATA_ATTRIBUTES["pillow"], "language_id": 'id="pillowLanguage"'},
        "footer": {
            "brand_class": "pillow-brand footer-pillow-brand",
            "footer_logo_markup": '<img src="assets/branding/icon_bottom.avif" alt="">',
            "footer_tagline_attributes": 'data-pillow-text="footerTagline"',
            "footer_explore_attributes": 'data-pillow-text="footerExplore"',
            "footer_follow_attributes": 'data-pillow-text="footerFollow"',
            "footer_nav_links": '<a href="index.html#products" data-pillow-text="series">Sleeping Wellness</a>\n<a href="synap-flow.html">SyNap Flow</a>\n<a href="about.html" data-pillow-text="navAbout">About Invisible Tech</a>\n<a href="#top" data-pillow-text="footerTop">Back to top ↑</a>',
            "footer_social": FOOTER_LINKS,
        },
    },
    "travel-pillow": {
        "header": {**DATA_ATTRIBUTES["pillow"], "language_id": 'id="pillowLanguage"'},
        "footer": {
            "brand_class": "pillow-brand footer-pillow-brand",
            "footer_logo_markup": '<img src="assets/branding/icon_bottom.avif" alt="">',
            "footer_tagline_attributes": 'data-pillow-text="footerTagline"',
            "footer_explore_attributes": 'data-pillow-text="footerExplore"',
            "footer_follow_attributes": 'data-pillow-text="footerFollow"',
            "footer_nav_links": '<a href="index.html#products" data-pillow-text="series">Sleeping Wellness</a>\n<a href="synap-flow.html">SyNap Flow</a>\n<a href="about.html" data-pillow-text="navAbout">About Invisible Tech</a>\n<a href="#top" data-pillow-text="footerTop">Back to top ↑</a>',
            "footer_social": FOOTER_LINKS,
        },
    },
    "synap-flow": {
        "header": {
            **COMMON_HEADER,
            **DATA_ATTRIBUTES["synap"],
            "language_id": 'id="synapLanguageToggle"',
            "synap_link_attributes": 'class="active" aria-current="page"',
        },
        "footer": {
            "brand_class": "brand",
            "footer_logo_markup": '<span class="brand-mark"><img src="assets/branding/icon_bottom.avif" alt=""></span>',
            "footer_tagline_attributes": 'data-synap-text="footerTagline"',
            "footer_explore_attributes": 'data-synap-text="footerExplore"',
            "footer_follow_attributes": 'data-synap-text="footerFollow"',
            "footer_nav_links": '<a href="eye-mask.html" data-synap-text="footerMask">Acoustic &amp; Heat Eye Mask</a>\n<a href="synap-flow.html">SyNap Flow</a>\n<a href="about.html" data-synap-text="footerAbout">About Invisible Tech</a>\n<a href="#top" data-synap-text="footerTop">Back to top ↑</a>',
            "footer_social": FOOTER_ICONS,
        },
    },
    "purchase": {
        "header": {**COMMON_HEADER, **DATA_ATTRIBUTES["purchase"], "language_id": 'id="purchaseLanguageToggle"'},
    },
}


class BuildError(Exception):
    pass


def expand_includes(content: str, context: dict[str, str], source: Path) -> str:
    include_re = INCLUDE_PATTERN
    depth = 0
    while match := include_re.search(content):
        depth += 1
        if depth > 20:
            raise BuildError(f"Include nesting is too deep in {source.relative_to(ROOT)}")
        partial_path = PARTIALS_DIR / f"{match.group(1)}.html"
        if not partial_path.is_file():
            raise BuildError(f"Missing partial: {partial_path.relative_to(ROOT)}")
        partial = partial_path.read_text(encoding="utf-8")
        partial = render_placeholders(partial, context, source)
        content = content[:match.start()] + partial + content[match.end():]
    return content


def render_placeholders(content: str, context: dict[str, str], source: Path) -> str:
    def substitute(match: re.Match[str]) -> str:
        name = match.group(1)
        if name not in context:
            raise BuildError(f"Missing '{name}' value while rendering {source.name}")
        return context[name]

    return PLACEHOLDER_PATTERN.sub(substitute, content)


def render_page(source: Path) -> str:
    name = source.stem
    try:
        settings = PAGE_SETTINGS[name]
    except KeyError as error:
        raise BuildError(f"No page settings are defined for {source.name}") from error

    content = source.read_text(encoding="utf-8")
    header_marker = "<!-- include: site-header -->"
    footer_marker = "<!-- include: global-footer -->"
    if content.count(header_marker) != 1:
        raise BuildError(f"{source.name} must include exactly one site header")
    expected_footer_count = 1 if "footer" in settings else 0
    if content.count(footer_marker) != expected_footer_count:
        raise BuildError(f"{source.name} has an unexpected number of global footers")
    components = (
        ("header", header_marker, "site-header.html"),
        ("footer", footer_marker, "global-footer.html"),
    )
    for section, marker, partial_name in components:
        if marker in content:
            if section not in settings:
                raise BuildError(f"{source.name} includes {section} without settings")
            component = PARTIALS_DIR / partial_name
            if not component.is_file():
                raise BuildError(f"Missing partial: {component.relative_to(ROOT)}")
            component_text = component.read_text(encoding="utf-8")
            defaults = COMMON_HEADER if section == "header" else FOOTER_DEFAULTS
            context = {**defaults, **settings[section]}
            if section == "footer":
                context["footer_social"] = expand_includes(
                    context.get("footer_social", ""),
                    context,
                    source,
                )
            component_text = render_placeholders(component_text, context, source)
            content = content.replace(marker, component_text)

    content = expand_includes(content, {}, source)
    if "<!-- include:" in content or "{{" in content:
        raise BuildError(f"Unresolved include or placeholder in {source.name}")
    return content


def build(check: bool) -> int:
    page_sources = sorted(PAGES_DIR.glob("*.html"))
    expected_names = {f"{name}.html" for name in PAGE_SETTINGS}
    actual_names = {path.name for path in page_sources}
    if actual_names != expected_names:
        missing = sorted(expected_names - actual_names)
        unexpected = sorted(actual_names - expected_names)
        raise BuildError(f"Page source mismatch; missing={missing}, unexpected={unexpected}")

    changed: list[str] = []
    for source in page_sources:
        destination = ROOT / source.name
        output = render_page(source)
        current = destination.read_text(encoding="utf-8") if destination.exists() else None
        if current != output:
            changed.append(source.name)
            if not check:
                with destination.open("w", encoding="utf-8", newline="\n") as generated:
                    generated.write(output)

    if check and changed:
        print("Generated pages are out of date: " + ", ".join(changed), file=sys.stderr)
        return 1
    if check:
        print(f"All {len(page_sources)} generated pages are up to date.")
    else:
        print(f"Built {len(page_sources)} pages at the site root.")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Build static pages from templates and shared partials.")
    parser.add_argument("--check", action="store_true", help="Check generated pages without writing files.")
    args = parser.parse_args()
    try:
        return build(args.check)
    except (BuildError, OSError) as error:
        print(f"Build failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
