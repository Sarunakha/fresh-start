export type WebsiteAssetPage = "Home" | "About" | "Reviews";

export type WebsiteAssetDefinition = {
  sectionKey: string;
  label: string;
  page: WebsiteAssetPage;
  hint: string;
};

/** Keys used by the Vite marketing site — keep in sync with Home / About / Reviews pages. */
export const WEBSITE_ASSET_DEFINITIONS: WebsiteAssetDefinition[] = [
  {
    sectionKey: "SOCIAL_INSTAGRAM_URL",
    label: "Global — Instagram URL",
    page: "Home",
    hint: "Full URL to your Instagram profile (e.g. https://instagram.com/yourhandle)."
  },
  {
    sectionKey: "HOME_HERO_BG",
    label: "Home — Hero background",
    page: "Home",
    hint: "Large split hero image (left column)."
  },
  {
    sectionKey: "HOME_METHODOLOGY_FEATURE",
    label: "Home — Methodology feature tile",
    page: "Home",
    hint: "Bottom-right image tile in “Clinical Standard” grid."
  },
  {
    sectionKey: "ABOUT_US_STORY_1",
    label: "About — Story image (top)",
    page: "About",
    hint: "First story section image."
  },
  {
    sectionKey: "ABOUT_US_STORY_2",
    label: "About — Expertise image",
    page: "About",
    hint: "Second section image (technicians / team)."
  },
  {
    sectionKey: "CLIENTS_TRANSFORMATION_1",
    label: "Reviews — Transformation grid (1)",
    page: "Reviews",
    hint: "Case study grid, top-left."
  },
  {
    sectionKey: "CLIENTS_TRANSFORMATION_2",
    label: "Reviews — Transformation grid (2)",
    page: "Reviews",
    hint: "Case study grid, top-right."
  },
  {
    sectionKey: "CLIENTS_TRANSFORMATION_3",
    label: "Reviews — Transformation grid (3)",
    page: "Reviews",
    hint: "Case study grid, bottom-left."
  },
  {
    sectionKey: "CLIENTS_TRANSFORMATION_4",
    label: "Reviews — Transformation grid (4)",
    page: "Reviews",
    hint: "Case study grid, bottom-right."
  }
];
