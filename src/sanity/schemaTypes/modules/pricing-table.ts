import { defineArrayMember, defineField, defineType } from 'sanity'
import { TfiMoney } from 'react-icons/tfi'
import { getBlockText } from '@/lib/utils'

export default defineType({
	name: 'pricing-table',
	title: 'Pricing table',
	type: 'object',
	icon: TfiMoney,
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'attributes',
			type: 'module-attributes',
			group: 'options',
		}),
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'tiers',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'tier',
					type: 'object',
					fields: [
						defineField({
							name: 'title',
							type: 'string',
						}),
						defineField({
							name: 'badge',
							type: 'string',
							description: 'Optional badge text (e.g. "Most Popular")',
						}),
						defineField({
							name: 'price',
							type: 'string',
							description: 'e.g. "$49.95"',
						}),
						defineField({
							name: 'period',
							type: 'string',
							description: 'e.g. "/mo"',
						}),
						defineField({
							name: 'description',
							type: 'text',
							rows: 2,
						}),
						defineField({
							name: 'features',
							type: 'array',
							of: [{ type: 'string' }],
						}),
						defineField({
							name: 'cta',
							type: 'cta',
						}),
						defineField({
							name: 'highlighted',
							type: 'boolean',
							initialValue: false,
						}),
					],
					preview: {
						select: {
							title: 'title',
							price: 'price',
							period: 'period',
						},
						prepare: ({ title, price, period }) => ({
							title: title || 'Untitled tier',
							subtitle: [price, period].filter(Boolean).join(''),
						}),
					},
				}),
			],
			group: 'content',
		}),
		defineField({
			name: 'comparisonTable',
			title: 'Comparison table',
			type: 'array',
			of: [
				defineArrayMember({
					name: 'row',
					type: 'object',
					fields: [
						defineField({
							name: 'feature',
							type: 'string',
						}),
						defineField({
							name: 'isHeader',
							type: 'boolean',
							initialValue: false,
							description: 'Display as a section header row',
						}),
						defineField({
							name: 'values',
							type: 'array',
							of: [{ type: 'string' }],
							description: 'One value per tier (checkmark, dash, number)',
						}),
					],
					preview: {
						select: {
							feature: 'feature',
							isHeader: 'isHeader',
						},
						prepare: ({ feature, isHeader }) => ({
							title: feature || 'Untitled row',
							subtitle: isHeader ? 'Header' : undefined,
						}),
					},
				}),
			],
			group: 'content',
		}),
		defineField({
			name: 'afterContent',
			title: 'After content',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'ctas',
			title: 'Call-to-actions',
			type: 'array',
			of: [{ type: 'cta' }],
			group: 'content',
		}),
	],
	preview: {
		select: {
			intro: 'intro',
			tiers: 'tiers',
		},
		prepare: ({ intro, tiers }) => ({
			title: getBlockText(intro) || `${tiers?.length || 0} tier(s)`,
			subtitle: 'Pricing table',
		}),
	},
})
