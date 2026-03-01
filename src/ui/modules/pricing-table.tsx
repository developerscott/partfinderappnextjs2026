import { PortableText } from 'next-sanity'
import { cn } from '@/lib/utils'
import type { PricingTable } from '@/sanity/types'
import CTAList from '@/ui/cta-list'
import { moduleAttributes } from '.'

export default function ({
	intro = [],
	tiers,
	comparisonTable,
	afterContent = [],
	ctas,
	...props
}: PricingTable) {
	return (
		<section className="section space-y-12" {...moduleAttributes(props)}>
			{intro?.length > 0 && (
				<header className="prose mx-auto max-w-3xl text-center text-balance">
					<PortableText value={intro} />
				</header>
			)}

			{!!tiers?.length && (
				<ul className="grid gap-8 md:grid-cols-3">
					{tiers.map((tier) => (
						<li
							key={tier._key}
							className={cn(
								'flex flex-col gap-6 rounded-lg border p-6',
								tier.highlighted
									? 'border-accent shadow-lg shadow-accent/10 relative'
									: 'border-stroke',
							)}
						>
							{tier.badge && (
								<span className="bg-accent absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white">
									{tier.badge}
								</span>
							)}

							<div className="space-y-2 text-center">
								<h3 className="h3">{tier.title}</h3>
								<div className="flex items-baseline justify-center gap-1">
									<span className="text-4xl font-bold">{tier.price}</span>
									{tier.period && (
										<span className="text-foreground/60">{tier.period}</span>
									)}
								</div>
								{tier.description && (
									<p className="text-foreground/70 text-sm">
										{tier.description}
									</p>
								)}
							</div>

							{!!tier.features?.length && (
								<ul className="grow space-y-2">
									{tier.features.map((feature, i) => (
										<li key={i} className="flex items-start gap-2 text-sm">
											<svg
												className="text-accent mt-0.5 size-4 shrink-0"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth={2}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M5 13l4 4L19 7"
												/>
											</svg>
											{feature}
										</li>
									))}
								</ul>
							)}

							{tier.cta && (
								<CTAList
									ctas={[tier.cta]}
									className="mt-auto justify-center *:w-full"
								/>
							)}
						</li>
					))}
				</ul>
			)}

			{!!comparisonTable?.length && (
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-stroke">
								<th className="p-3 text-left font-semibold">Features</th>
								{tiers?.map((tier) => (
									<th key={tier._key} className="p-3 text-center font-semibold">
										{tier.title}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{comparisonTable.map((row) =>
								row.isHeader ? (
									<tr
										key={row._key}
										className="bg-foreground/5 border-t border-stroke"
									>
										<td
											colSpan={(tiers?.length || 0) + 1}
											className="p-3 font-semibold"
										>
											{row.feature}
										</td>
									</tr>
								) : (
									<tr key={row._key} className="border-t border-stroke">
										<td className="p-3">{row.feature}</td>
										{row.values?.map((value, i) => (
											<td key={i} className="p-3 text-center">
												{value}
											</td>
										))}
									</tr>
								),
							)}
						</tbody>
					</table>
				</div>
			)}

			{afterContent?.length > 0 && (
				<div className="prose mx-auto max-w-3xl text-center">
					<PortableText value={afterContent} />
				</div>
			)}

			<CTAList ctas={ctas} className="justify-center" />
		</section>
	)
}
