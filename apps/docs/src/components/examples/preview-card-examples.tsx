"use client"

import {
  PreviewCard,
  PreviewCardTrigger,
  PreviewCardContent,
  PreviewCardPortal,
  PreviewCardPositioner,
  PreviewCardPopup,
  PreviewCardArrow,
  PreviewCardViewport,
  createPreviewCardHandle,
} from '@/components/ui/preview-card';

export function DefaultPreviewCardExample() {
  return (
    <p className="text-sm leading-relaxed text-foreground max-w-md">
      Dinachi UI is heavily inspired by{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#">
          Base UI
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Base UI</h4>
            <p className="text-sm text-muted-foreground">
              Unstyled React components and hooks from the creators of Material UI. Ship accessible interfaces without compromising creative freedom.
            </p>
          </div>
        </PreviewCardContent>
      </PreviewCard>
      {' '}and provides accessible, composable components styled with{' '}
      <PreviewCard>
        <PreviewCardTrigger href="#">
          Tailwind CSS
        </PreviewCardTrigger>
        <PreviewCardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Tailwind CSS</h4>
            <p className="text-sm text-muted-foreground">
              A utility-first CSS framework for rapidly building custom designs without ever leaving your HTML.
            </p>
          </div>
        </PreviewCardContent>
      </PreviewCard>
      .
    </p>
  );
}

export function PreviewCardWithImageExample() {
  return (
    <PreviewCard>
      <PreviewCardTrigger href="#">
        @dinachi
      </PreviewCardTrigger>
      <PreviewCardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
              D
            </div>
            <div>
              <h4 className="text-sm font-semibold">Dinachi UI</h4>
              <p className="text-xs text-muted-foreground">@dinachi</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            A modern React component library built with Base UI and Tailwind CSS.
          </p>
        </div>
      </PreviewCardContent>
    </PreviewCard>
  );
}

const profiles = [
  { name: 'Alice Chen', handle: '@alice', bio: 'Design systems engineer. Building accessible UIs.', initials: 'AC' },
  { name: 'Bob Rivera', handle: '@bob', bio: 'Full-stack developer. Open source contributor.', initials: 'BR' },
  { name: 'Carol Park', handle: '@carol', bio: 'Frontend architect. Tailwind CSS enthusiast.', initials: 'CP' },
];

export function PreviewCardViewportExample() {
  const handle = createPreviewCardHandle();

  return (
    <div className="flex gap-4 items-center">
      {profiles.map((profile) => (
        <PreviewCardTrigger key={profile.handle} href="#" handle={handle} payload={profile}>
          {profile.handle}
        </PreviewCardTrigger>
      ))}
      <PreviewCard handle={handle}>
        {({ payload }) => {
          const profile = payload as (typeof profiles)[number] | undefined;
          return (
            <PreviewCardPortal>
              <PreviewCardPositioner>
                <PreviewCardPopup>
                  <PreviewCardArrow />
                  <PreviewCardViewport>
                    {profile && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            {profile.initials}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">{profile.name}</h4>
                            <p className="text-xs text-muted-foreground">{profile.handle}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{profile.bio}</p>
                      </div>
                    )}
                  </PreviewCardViewport>
                </PreviewCardPopup>
              </PreviewCardPositioner>
            </PreviewCardPortal>
          );
        }}
      </PreviewCard>
    </div>
  );
}
