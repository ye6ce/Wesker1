'use client';
import React from 'react';
import { Button, buttonVariants } from '@/src/components/ui/button';
import { cn } from '@/src/lib/utils';
import { MenuToggleIcon } from '@/src/components/ui/menu-toggle-icon';
import { useScroll } from '@/src/components/ui/use-scroll';
import { ShinyButton } from '@/src/components/ui/shiny-button';

export function Header() {
	const [open, setOpen] = React.useState(false);
	const scrolled = useScroll(10);

	const links = [
		{
			label: 'Features',
			href: '#services',
		},
		{
			label: 'Pricing',
			href: '#pricing',
		},
		{
			label: 'About',
			href: '#',
		},
	];

	React.useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [open]);

    const scrollToPricing = () => {
        setOpen(false);
        const el = document.querySelector("#pricing");
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

	return (
		<header
			className={cn(
				'fixed top-0 z-50 mx-auto w-full border-b border-transparent transition-all duration-300 ease-out',
				{
					'bg-black/80 border-white/10 backdrop-blur-lg md:top-4 md:max-w-4xl md:rounded-full md:left-1/2 md:-translate-x-1/2 md:shadow-[0_0_20px_rgba(0,0,0,0.5)]':
						scrolled && !open,
                    'top-0 left-0 w-full': !scrolled || open
				},
			)}
		>
			<nav
				className={cn(
					'flex h-16 w-full items-center justify-between px-6 transition-all duration-300 ease-out',
					{
						'h-14 md:px-6': scrolled,
					},
				)}
			>
				<div className="script-text glass-logo text-2xl font-bold lowercase">Wesker</div>
				
                <div className="hidden items-center gap-8 md:flex">
					{links.map((link, i) => (
						<a 
                            key={i} 
                            className="font-heading text-xs uppercase tracking-widest text-white/60 hover:text-brand-green transition-colors" 
                            href={link.href}
                        >
							{link.label}
						</a>
					))}
                    <ShinyButton 
                        className="scale-75 origin-right"
                        onClick={scrollToPricing}
                    >
                        Get Started
                    </ShinyButton>
				</div>

				<Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setOpen(!open)} 
                    className="md:hidden text-white hover:bg-white/5"
                >
					<MenuToggleIcon open={open} className="size-6" duration={300} />
				</Button>
			</nav>

			<div
				className={cn(
					'fixed inset-0 top-16 z-40 bg-black/95 backdrop-blur-xl md:hidden transition-all duration-500',
					open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none',
				)}
			>
				<div
					className={cn(
						'flex h-full w-full flex-col p-8 gap-12 pt-20 transition-transform duration-500',
						open ? 'translate-y-0' : 'translate-y-10'
					)}
				>
					<div className="flex flex-col gap-8">
						{links.map((link) => (
							<a
								key={link.label}
								className="font-heading text-2xl uppercase tracking-[0.2em] text-white/60 hover:text-brand-green transition-colors"
								href={link.href}
                                onClick={() => setOpen(false)}
							>
								{link.label}
							</a>
						))}
					</div>
					<div className="mt-auto pb-20">
						<ShinyButton 
                            className="w-full"
                            onClick={scrollToPricing}
                        >
                            Get Started
                        </ShinyButton>
					</div>
				</div>
			</div>
		</header>
	);
}
