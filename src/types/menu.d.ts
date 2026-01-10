type MenuOption = {
	name: string
	price?: number // Optional price modifier
}

type MenuOptionGroup = {
	name: string
	options: MenuOption[]
}

type MenuItem = {
	image: string
	name: string
	description: string
	price: number
	spicy?: boolean
	optionGroups?: MenuOptionGroup[]
}

type MenuSection = {
	name: string
	items: MenuItem[]
}

type MenuData = MenuSection[]
