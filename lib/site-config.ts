export type DashboardConfig = {
  title: string;
  description: string;
  url: string;
  embedUrl: string;
};

export type NavItem = {
  href: string;
  label: string;
  isExternal?: boolean;
};

export type ProjectConfig = {
  title: string;
  slug: string;
  description: string;
  summary: string;
  status: string;
  href: string;
  isExternal?: boolean;
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
    { href: "/quizzes", label: "Quizzes" },
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
      isExternal: true,
      imageSrc: "/marner-press-conference.png",
      imageAlt: "Golden Knights project visual for the VGK Trade ROI site",
      tags: ["Tableau", "Hockey analytics", "Trade valuation"]
    },
    {
      title: "NHL Trade Simulator",
      slug: "nhl-trade-simulator",
      description:
        "A live interactive trade lab where users can build rosters, explore transactions across the league, and work through live data-driven team construction scenarios.",
      summary:
        "Build the roster you want and test how the numbers hold up.",
      status: "Live project",
      href: "https://goldenedgeanalytics-nhltradesim.vercel.app/",
      isExternal: true,
      imageSrc: "/hanifin-acquisition.png",
      imageAlt: "Noah Hanifin acquisition visual for the NHL Trade Simulator project",
      tags: ["Interactive", "Roster creation", "Live data"]
    },
    {
      title: "Lineup Builder",
      slug: "lineup-builder",
      description:
        "A live lineup-building tool that lets users experiment with roster combinations and think through how a team can be structured on the ice.",
      summary:
        "Build different looks, move pieces around the lineup, and explore team construction in a more hands-on format.",
      status: "Live project",
      href: "https://goldenedgeanalytics-lineupbuilder.vercel.app/",
      isExternal: true,
      imageSrc: "/vgk-pregame.png",
      imageAlt: "Golden Knights pregame visual for the Lineup Builder project",
      tags: ["Interactive", "Lineups", "Team building"]
    }
  ] satisfies ProjectConfig[],
  articles: [
    {
      title: "The Jets Come Crashing Down in\u00A0Vegas",
      slug: "the-jets-come-crashing-down-in-vegas",
      eyebrow: "Article",
      description:
        "Vegas hangs six on Connor Hellebuyck, gets six different goal scorers, and pushes toward the Pacific Division title with one game left.",
      href: "/articles/the-jets-come-crashing-down-in-vegas",
      readTime: "4/14/26"
    },
    {
      title: "The Golden Knights Emerge Victorious Over Vancouver",
      slug: "golden-knights-emerge-victorious-over-vancouver",
      eyebrow: "Article",
      description:
        "Vegas completes the season sweep of Vancouver and improves to 4-0-0 under John Tortorella after another important late-season win.",
      href: "/articles/golden-knights-emerge-victorious-over-vancouver",
      readTime: "4/8/26"
    },
    {
      title: "Rethinking VGK Trades: What the Data Actually Says",
      slug: "vgk-trade-roi",
      eyebrow: "Project Article",
      description:
        "A closer look at what the VGK Trade ROI project says about Fleury, Tatar, Suzuki, Eichel, and the value of evaluating trades over time.",
      href: "/articles/vgk-trade-roi",
      readTime: "4/6/26"
    },
    {
      title: "The Tortorella Effect",
      slug: "the-tortorella-effect",
      eyebrow: "Article",
      description:
        "A look at Vegas under John Tortorella and how the team's pace and overall play have shifted in his first three games behind the bench.",
      href: "/articles/the-tortorella-effect",
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
