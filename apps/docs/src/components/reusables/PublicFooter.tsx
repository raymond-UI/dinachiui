// public footer section
import Image from "next/image";

export const PublicFooter = () => {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto py-2 md:py-4">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/dinachi-logo.svg"
              alt="DinachiUI Logo"
              width={20}
              height={20}
            />
            <span className="font-bold text-sm">Dinachi</span>
          </div>
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
