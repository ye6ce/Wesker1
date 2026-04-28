'use client';
import React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { InstagramIcon, MessageSquareIcon, ShieldCheckIcon, FileTextIcon, GlobeIcon, ZapIcon } from 'lucide-react';

interface FooterLink {
	title: string;
	href: string;
	icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
	label: string;
	links: FooterLink[];
}

const footerLinks: FooterSection[] = [
	{
		label: 'Agency',
		links: [
			{ title: 'Core Systems', href: '#ai-interface', icon: ZapIcon },
			{ title: 'Pricing', href: '#pricing', icon: GlobeIcon },
		],
	},
	{
		label: 'Social',
		links: [
			{ title: 'Instagram', href: 'https://instagram.com/wesker_dev', icon: InstagramIcon },
			{ title: 'WhatsApp', href: 'https://wa.me/213542465402', icon: MessageSquareIcon },
		],
	},
	{
		label: 'Legal',
		links: [
			{ title: 'Privacy Policy', href: '#', icon: ShieldCheckIcon },
			{ title: 'Terms of Service', href: '#', icon: FileTextIcon },
		],
	},
];

export function Footer() {
	return (
		<footer className="relative w-full max-w-7xl mx-auto flex flex-col items-center justify-center border-t border-white/5 bg-black px-6 py-16 lg:py-24">
			<div className="absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D2FF00]/20 blur-md" />

			<div className="grid w-full gap-12 lg:grid-cols-3 xl:gap-24">
				<AnimatedContainer className="space-y-6">
					<div className="flex flex-col gap-4">
						<div className="script-text glass-logo text-4xl font-bold lowercase">Wesker</div>
						<p className="text-white/40 text-sm max-w-xs leading-relaxed">
							Elite automation agency empowering the next generation of businesses with high-level AI integration and precision design.
						</p>
					</div>

				</AnimatedContainer>

				<div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-2">
					{footerLinks.map((section, index) => (
						<AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
							<div className="space-y-4">
								<h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-green/60">{section.label}</h3>
								<ul className="space-y-3">
									{section.links.map((link) => (
										<li key={link.title}>
											<a
												href={link.href}
												className="text-white/40 hover:text-white inline-flex items-center transition-all duration-300 text-sm group"
											>
												{link.icon && <link.icon className="me-2 size-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
												{link.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</AnimatedContainer>
					))}
				</div>
			</div>

			<div className="w-full mt-20 pt-8 border-t border-white/5">
				<p className="text-[9px] font-mono uppercase tracking-widest text-white/10 text-center">
					© {new Date().getFullYear()} Wesker. All rights reserved. Precision in automation.
				</p>
			</div>
		</footer>
	);
};

type ViewAnimationProps = {
	delay?: number;
	className?: ComponentProps<typeof motion.div>['className'];
	children: ReactNode;
	key?: string | number;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return <div className={className}>{children}</div>;
	}

	return (
		<motion.div
			initial={{ filter: 'blur(4px)', translateY: 8, opacity: 0 }}
			whileInView={{ filter: 'blur(0px)', translateY: 0, opacity: 1 }}
			viewport={{ once: true }}
			transition={{ delay, duration: 0.8 }}
			className={className}
		>
			{children}
		</motion.div>
	);
};
