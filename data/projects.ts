
export type ProjectType =
  | "Visualizer"
  | "Artist Unveiling Video"
  | "Content"
  | "Performance Reel";

export type Project = {
  slug: string;
  title: string;
  artist: string;
  client: string;
  type: ProjectType;

  // The part after /s/ in Bee's Wistia share link.
  wistiaShareSlug: string;

  // Groups different videos from the same project together.
  groupSlug: string;

  // Optional links to related projects.
  relatedSlugs?: string[];

  // Set to true when Bee chooses this for the homepage.
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "for-your-tears",
    title: "For Your Tears",
    artist: "Oshamo X Shiloh",
    client: "emPawa Africa",
    type: "Visualizer",
    wistiaShareSlug: "6nok9iikgu6ajg5",
    groupSlug: "for-your-tears",
    featured: false,
  },

  {
    slug: "fortidias-1",
    title: "Fortidias 1",
    artist: "DHYMA",
    client: "DHYMA",
    type: "Visualizer",
    wistiaShareSlug: "sdv11ukl3yr0chw",
    groupSlug: "fortidias",
    featured: false,
  },

  {
    slug: "the-signal",
    title: "The Signal",
    artist: "Alexa Vibez",
    client: "JMB RECORDS",
    type: "Artist Unveiling Video",
    wistiaShareSlug: "x4qn7gp6uchmwfv",
    groupSlug: "the-signal",
    relatedSlugs: ["daju-1"],
    featured: false,
  },

  {
    slug: "daju-1",
    title: "Daju 1",
    artist: "Faith Martins",
    client: "Faith Martins",
    type: "Content",
    wistiaShareSlug: "3z2nyqdxxu2fos8",
    groupSlug: "daju",
    relatedSlugs: ["the-signal"],
    featured: false,
  },

  {
    slug: "paragon-1",
    title: "Paragon 1",
    artist: "QUIRIES",
    client: "Dhope Management Team",
    type: "Content",
    wistiaShareSlug: "qe7pgn9wcd94hdo",
    groupSlug: "paragon",
    featured: false,
  },

  {
    slug: "paragon-2",
    title: "Paragon 2",
    artist: "QUIRIES",
    client: "Dhope Management Team",
    type: "Content",
    wistiaShareSlug: "u91jvx1jpg8u8mx",
    groupSlug: "paragon",
    featured: false,
  },

  {
    slug: "paragon-3",
    title: "Paragon 3",
    artist: "QUIRIES",
    client: "Dhope Management Team",
    type: "Content",
    wistiaShareSlug: "l9jl8pwgglhp68t",
    groupSlug: "paragon",
    featured: false,
  },

  {
    slug: "fortidias-2",
    title: "Fortidias 2",
    artist: "DHYMA",
    client: "DHYMA",
    type: "Content",
    wistiaShareSlug: "76afgtjajsotdjj",
    groupSlug: "fortidias",
    featured: false,
  },

  {
    slug: "mulla",
    title: "Mulla",
    artist: "Alexa Vibez",
    client: "JMB RECORDS",
    type: "Performance Reel",
    wistiaShareSlug: "b8odsy2kcosvgsn",
    groupSlug: "mulla",
    featured: false,
  },
];



export function getRelatedProjects(
  currentProject: Project
): Project[] {
  return projects.filter((candidate) => {
    // Never show the current project as its own related project.
    if (candidate.slug === currentProject.slug) {
      return false;
    }

    // Connect different videos from the same project group.
    const sameGroup =
      candidate.groupSlug === currentProject.groupSlug;

    // Connect other work from the same artist.
    const sameArtist =
      candidate.artist.toLowerCase() ===
      currentProject.artist.toLowerCase();

    // Respect manual links in either direction.
    const explicitlyRelated =
      currentProject.relatedSlugs?.includes(candidate.slug) ||
      candidate.relatedSlugs?.includes(currentProject.slug);

    return sameGroup || sameArtist || Boolean(explicitlyRelated);
  });
}

