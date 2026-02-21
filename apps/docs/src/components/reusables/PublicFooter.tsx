// public footer section

export const PublicFooter = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-2 md:py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <span className="font-pixel text-sm">Dinachi</span>
          <p className="text-sm text-muted-foreground">
            Built by{" "}
            <a
              href="https://mzed.studio"
              target="_blank"
              className="font-mono underline hover:opacity-80"
              aria-label="Mzed studio"
            >
              Mzed Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
