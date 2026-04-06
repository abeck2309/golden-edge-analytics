export type DashboardConfig = {
  title: string;
  description: string;
  url: string;
  embedUrl: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type ProjectConfig = {
  title: string;
  slug: string;
  description: string;
  summary: string;
  status: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  tags: string[];
};

export type ArticleConfig = {
  title: string;
  slug: string;
  eyebrow: string;
  description: string;
  href: string;
  readTime: string;
};

export const siteConfig = {
  title: "Golden Edge Analytics",
  description:
    "Golden Edge Analytics is focused on Golden Knights analysis across projects, articles, player breakdowns, coaching insights, recaps, and stats.",
  navigation: [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/articles", label: "Articles" },
    { href: "/coming-soon", label: "Coming Soon" },
    { href: "/about", label: "About" }
  ] satisfies NavItem[],
  projects: [
    {
      title: "VGK Trade ROI",
      slug: "vgk-trade-roi",
      description:
        "A dashboard-led review of Vegas Golden Knights trades through realized player value, future asset value, and cap efficiency.",
      summary:
        "The first Golden Edge Analytics project studies whether Vegas consistently created value through its biggest front office decisions.",
      status: "Live project",
      href: "https://goldenedgeanalytics-traderoi.vercel.app/",
      imageSrc: "/trade-roi-dashboard-preview.png",
      imageAlt: "Preview of the VGK Trade ROI dashboard",
      tags: ["Tableau", "Hockey analytics", "Trade valuation"]
    }
  ] satisfies ProjectConfig[],
  articles: [
    {
      title: "The Tortorella Effect",
      slug: "the-tortorella-effect",
      eyebrow: "Article",
      description:
        "A look at Vegas under John Tortorella and how the team's pace and overall play have shifted in his first three games behind the bench.",
      href: "/articles/the-tortorella-effect",
      readTime: "4/6/26"
    },
    {
      title: "Rethinking VGK Trades: What the Data Actually Says",
      slug: "vgk-trade-roi",
      eyebrow: "Project Article",
      description:
        "A closer look at what the VGK Trade ROI project says about Fleury, Tatar, Suzuki, Eichel, and the value of evaluating trades over time.",
      href: "/articles/vgk-trade-roi",
      readTime: "4/6/26"
    }
  ] satisfies ArticleConfig[],
  dashboards: {
    tradeRoi: {
      title: "Trade ROI Dashboard",
      description:
        "Compare value received versus value given up across VGK trades, with realized player impact and future asset value brought into one view.",
      url: "https://public.tableau.com/shared/M5DPN5TWQ?:display_count=n&:origin=viz_share_link",
      embedUrl: "https://public.tableau.com/shared/M5DPN5TWQ?:showVizHome=no&:embed=yes"
    } satisfies DashboardConfig,
    capEfficiency: {
      title: "Cap Efficiency Dashboard",
      description:
        "Study how much on-ice value Vegas generated relative to the total cap hit carried over the evaluation period for each trade.",
      url: "https://public.tableau.com/shared/5T6QT42TZ?:display_count=n&:origin=viz_share_link",
      embedUrl: "https://public.tableau.com/shared/5T6QT42TZ?:showVizHome=no&:embed=yes"
    } satisfies DashboardConfig
  },
  links: {
    githubUrl: "https://github.com/abeck2309",
    linkedinUrl: "https://www.linkedin.com/in/andrewbeck23",
    instagramUrl: "https://www.instagram.com/andrew_beck23",
    email: "andrewjbeck23@outlook.com"
  }
};
