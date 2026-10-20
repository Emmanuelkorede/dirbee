
export type ProjectType =
  | "Visualizer"
  | "Artist Unveiling Video"
  | "Content"
  | "Performance Reel";

export type Project = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  client: string;
  type: ProjectType;

  // Verified Wistia media ID used by the video embed.
  wistiaId: string;

  // Original share slug supplied by Bee.
  wistiaShareSlug: string;

  // Optional project information.
  description?: string;
  services?: string[];
  year?: number;
  aspectRatio?: number;

  featured: boolean;
  relatedProjectIds: string[];
};

export const projects: Project[] = [
  {
    id: "daju",
    slug: "daju",
    title: "Daju",
    artist: "Faith Martins",
    client: "Faith Martins",
    type: "Content",
    wistiaId: "rx66w05za4",
    wistiaShareSlug: "3z2nyqdxxu2fos8",
    featured: true,
    relatedProjectIds: [],
  },
  {
    id: "for-your-tears",
    slug: "for-your-tears",
    title: "For Your Tears",
    artist: "Oshamo X Shiloh",
    client: "emPawa Africa",
    type: "Visualizer",
    wistiaId: "1ndnmqqlge",
    wistiaShareSlug: "6nok9iikgu6ajg5",
    featured: true,
    relatedProjectIds: [],
  },

  {
    id: "fortidias",
    slug: "fortidias",
    title: "Fortidias 1",
    artist: "DHYMA",
    client: "DHYMA",
    type: "Visualizer",
    wistiaId: "mt73ms4vyb",
    wistiaShareSlug: "sdv11ukl3yr0chw",
    featured: true,
    relatedProjectIds: ["fortidias-2"],
  },

  {
    id: "fortidias-2",
    slug: "fortidias-2",
    title: "Fortidias 2",
    artist: "DHYMA",
    client: "DHYMA",
    type: "Content",
    wistiaId: "4l4h8ms3wa",
    wistiaShareSlug: "76afgtjajsotdjj",
    featured: false,
    relatedProjectIds: ["fortidias"],
  },

  {
    id: "the-signal",
    slug: "the-signal",
    title: "The Signal",
    artist: "Alexa Vibez",
    client: "JMB Records",
    type: "Artist Unveiling Video",
    wistiaId: "m8vl24h5me",
    wistiaShareSlug: "x4qn7gp6uchmwfv",
    featured: true,
    relatedProjectIds: ["mulla"],
  },

  {
    id: "mulla",
    slug: "mulla",
    title: "Mulla",
    artist: "Alexa Vibez",
    client: "JMB Records",
    type: "Performance Reel",
    wistiaId: "8f9rz9nbh9",
    wistiaShareSlug: "b8odsy2kcosvgsn",
    featured: false,
    relatedProjectIds: ["the-signal"],
  },

  {
    id: "paragon-1",
    slug: "paragon-1",
    title: "Paragon 1",
    artist: "QUIRIES",
    client: "Dhope Management Team",
    type: "Content",
    wistiaId: "uixlf0amvx",
    wistiaShareSlug: "qe7pgn9wcd94hdo",
    featured: false,
    relatedProjectIds: ["paragon-2", "paragon-3"],
  },

  {
    id: "paragon-2",
    slug: "paragon-2",
    title: "Paragon 2",
    artist: "QUIRIES",
    client: "Dhope Management Team",
    type: "Content",
    wistiaId: "kg5y69qhpx",
    wistiaShareSlug: "u91jvx1jpg8u8mx",
    featured: false,
    relatedProjectIds: ["paragon-1", "paragon-3"],
  },

  {
    id: "paragon-3",
    slug: "paragon-3",
    title: "Paragon 3",
    artist: "QUIRIES",
    client: "Dhope Management Team",
    type: "Content",
    wistiaId: "c0oh988cql",
    wistiaShareSlug: "l9jl8pwgglhp68t",
    featured: false,
    relatedProjectIds: ["paragon-1", "paragon-2"],
  },
    {
    id: "dont-say-bye",
    slug: "dont-say-bye",
    title: "Don’t Say Bye",
    artist: "Oshamo X Shiloh",
    client: "emPawa Africa",
    type: "Content",
    wistiaId: "c9osezob26",
    wistiaShareSlug: "wgqub673c5qsxio",
    featured: false,
    relatedProjectIds: ["dont-say-bye-2"],
  },

  {
    id: "dont-say-bye-2",
    slug: "dont-say-bye-2",
    title: "Don’t Say Bye 2",
    artist: "Oshamo X Shiloh",
    client: "emPawa Africa",
    type: "Content",
    wistiaId: "mpf51delyi",
    wistiaShareSlug: "e96pdghq8pim0x3",
    featured: true,
    relatedProjectIds: ["dont-say-bye"],
  },

  {
    id: "daju-2",
    slug: "daju-2",
    title: "Daju 2",
    artist: "Faith Martins",
    client: "Faith Martins",
    type: "Content",
    wistiaId: "i37x6rajm9",
    wistiaShareSlug: "vq1zt780wfoa1rk",
    featured: false,
    relatedProjectIds: ["daju"],
  },
];

export function getProjectBySlug(
  slug: string
): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(
  limit = 5
): Project[] {
  return projects
    .filter((project) => project.featured)
    .slice(0, limit);
}

// Only explicit relationships count.
// A relationship works in either direction.
export function getRelatedProjects(
  current: Project
): Project[] {
  return projects.filter((candidate) => {
    if (candidate.id === current.id) {
      return false;
    }

    return (
      current.relatedProjectIds.includes(candidate.id) ||
      candidate.relatedProjectIds.includes(current.id)
    );
  });
}
