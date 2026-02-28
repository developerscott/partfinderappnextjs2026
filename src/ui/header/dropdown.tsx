import type { LinkList, Page } from '@/sanity/types'
import HoverDetails from '@/ui/hover-details'
import SanityLink, { type SanityLinkType } from '@/ui/sanity-link'

export default function ({
	link: summary,
	links,
	_key,
}: LinkList & { _key: string }) {
	const anchorName = `--dropdown-${_key}`

	return (
		<HoverDetails
			name="header"
			className="accordion group/dropdown relative"
			safeAreaOnHover
		>
			<summary
				className="grid h-full group-open/dropdown:max-md:font-bold md:place-content-center md:text-center md:text-balance"
				style={{ anchorName }}
			>
				{summary?.label || (summary?.internal as unknown as Page)?.title}
			</summary>

			<ul
				className="md:bg-background anim-fade-to-b border-stroke max-md:pl-ch mb-ch md:-ml-ch z-1 max-md:border-l md:fixed md:min-w-max md:p-3 md:shadow-lg"
				style={{
					positionAnchor: anchorName,
					positionArea: 'end span-end',
				}}
			>
				{links?.map((link, key) => (
					<li key={key}>
						<SanityLink link={link as SanityLinkType} className="link" />
					</li>
				))}
			</ul>
		</HoverDetails>
	)
}
