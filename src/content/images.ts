export interface CuratedImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

function unsplash(id: string, width: number, height: number): string {
  return `https://images.unsplash.com/photo-${id}?w=${width}&q=80&auto=format&fit=crop`;
}

export const curatedImages = {
  collaboration: {
    src: unsplash("1522071820081-009f0129c71c", 1200, 1400),
    alt: "Four engineers working together on laptops around a wooden table",
    width: 1200,
    height: 1400,
  } satisfies CuratedImage,
  overheadWorkspace: {
    src: unsplash("1519389950473-47ba0277781c", 1400, 1000),
    alt: "Overhead view of a desk with multiple laptops open mid-build",
    width: 1400,
    height: 1000,
  } satisfies CuratedImage,
  engineeringFloor: {
    src: unsplash("1504384308090-c894fdcc538d", 1800, 1000),
    alt: "Large open-plan engineering office with rows of desks",
    width: 1800,
    height: 1000,
  } satisfies CuratedImage,
  pairReview: {
    src: unsplash("1531482615713-2afd69097998", 1200, 1400),
    alt: "Two engineers reviewing code together on a laptop screen",
    width: 1200,
    height: 1400,
  } satisfies CuratedImage,
  glassOffice: {
    src: unsplash("1541746972996-4e0b0f43e02a", 1400, 1000),
    alt: "Team working late in a modern glass-walled office",
    width: 1400,
    height: 1000,
  } satisfies CuratedImage,
  brightDesk: {
    src: unsplash("1498050108023-c5249f4df085", 1200, 1000),
    alt: "A laptop with code on screen on a bright, minimal desk setup",
    width: 1200,
    height: 1000,
  } satisfies CuratedImage,
};
