// public footer section

export const PublicFooter = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className=" px-4 sm:px-5 md:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between px-4 gap-4">
          <span className="font-pixel text-base">Dinachi</span>
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
