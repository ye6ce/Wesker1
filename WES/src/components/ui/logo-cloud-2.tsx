import React from "react";
import { PlusIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

type Logo = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type LogoCloudProps = React.ComponentProps<"div">;

export function LogoCloud({ className, ...props }: LogoCloudProps) {
  return (
    <div
      className={cn(
        "relative grid grid-cols-2 border-x border-white/5 md:grid-cols-4",
        className
      )}
      {...props}
    >
      <div className="-translate-x-1/2 -top-px pointer-events-none absolute left-1/2 w-screen border-t border-white/5" />

      <LogoCard
        className="relative border-r border-b border-white/5 bg-white/[0.02]"
        logo={{
          src: "https://svgl.app/library/n8n.svg",
          alt: "n8n Logo",
        }}
      >
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-brand-green/20"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="border-b border-r border-white/5"
        logo={{
          src: "https://svgl.app/library/supabase_wordmark_light.svg",
          alt: "Supabase Logo",
        }}
      />

      <LogoCard
        className="relative border-r border-b border-white/5 md:bg-white/[0.02]"
        logo={{
          src: "https://svgl.app/library/github_wordmark_light.svg",
          alt: "GitHub Logo",
        }}
      >
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] absolute z-10 size-6 text-brand-green/20"
          strokeWidth={1}
        />
        <PlusIcon
          className="-bottom-[12.5px] -left-[12.5px] absolute z-10 hidden size-6 md:block text-brand-green/20"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="relative border-b border-white/5 bg-white/[0.02] md:bg-transparent"
        logo={{
          src: "https://svgl.app/library/openai_wordmark_light.svg",
          alt: "OpenAI Logo",
        }}
      />

      <LogoCard
        className="relative border-r border-b border-white/5 bg-white/[0.02] md:border-b-0 md:bg-transparent"
        logo={{
          src: "https://svgl.app/library/turso-wordmark-light.svg",
          alt: "Turso Logo",
        }}
      >
        <PlusIcon
          className="-right-[12.5px] -bottom-[12.5px] md:-left-[12.5px] absolute z-10 size-6 md:hidden text-brand-green/20"
          strokeWidth={1}
        />
      </LogoCard>

      <LogoCard
        className="border-b border-white/5 md:border-r md:border-b-0 md:bg-white/[0.02]"
        logo={{
          src: "https://svgl.app/library/clerk-wordmark-light.svg",
          alt: "Clerk Logo",
        }}
      />

      <LogoCard
        className="border-r border-white/5"
        logo={{
          src: "https://svgl.app/library/claude-ai-wordmark-icon_light.svg",
          alt: "Claude AI Logo",
        }}
      />

      <LogoCard
        className="bg-white/[0.02]"
        logo={{
          src: "https://svgl.app/library/vercel_wordmark.svg",
          alt: "Vercel Logo",
        }}
      />

      <div className="-translate-x-1/2 -bottom-px pointer-events-none absolute left-1/2 w-screen border-b border-white/5" />
    </div>
  );
}

type LogoCardProps = React.ComponentProps<"div"> & {
  logo: Logo;
};

function LogoCard({ logo, className, children, ...props }: LogoCardProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-4 py-8 md:p-12 transition-all duration-500 hover:bg-white/[0.03] group relative",
        className
      )}
      {...props}
    >
      <img
        alt={logo.alt}
        className="pointer-events-none h-6 select-none md:h-8 opacity-20 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 brightness-0 invert"
        height={logo.height || "auto"}
        src={logo.src}
        width={logo.width || "auto"}
        referrerPolicy="no-referrer"
      />
      {children}
    </div>
  );
}
