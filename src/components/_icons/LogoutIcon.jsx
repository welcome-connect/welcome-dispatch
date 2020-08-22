import { theme } from '../../styles'

export const LogoutIcon = ({ fill = theme.colors.text_white }) => {
	return (
		<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M20 25L21.25 25C22.2446 25 23.1984 24.6049 23.9017 23.9016C24.6049 23.1984 25 22.2446 25 21.25L25 8.75C25 7.75544 24.6049 6.80161 23.9017 6.09835C23.1984 5.39509 22.2446 5 21.25 5L20 5M15 10L20 15M20 15L15 20M20 15L5 15"
				stroke={fill}
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}
