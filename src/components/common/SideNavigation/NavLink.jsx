import styled from 'styled-components'
import Link from 'next/link'
import { useRouter } from 'next/router'

const NavLink = ({ href, children }) => {
	const router = useRouter()

	const isActive = router.pathname.includes(href)

	return (
		<ListItem isActive={isActive}>
			<Link href={href}>
				<a>{children}</a>
			</Link>
		</ListItem>
	)
}

const ListItem = styled.li`
	background-color: ${({ isActive }) => (isActive ? 'rgba(255, 255, 255, 0.1)' : null)};
	padding: 0.75rem 0;
	min-height: 50px;
	display: flex;
	align-content: center;
	transition: all 100ms ease-in-out;

	a {
		display: grid;
		grid-template-columns: 56px auto;
		text-decoration: none;
		color: ${({ theme: { colors } }) => colors.text_white};
		font-weight: 600px;
		align-items: center;

		svg {
			place-self: center;
		}
	}

	&:hover {
		background-color: rgba(255, 255, 255, 0.2);
		transition: all 100ms ease-in-out;
	}

	@media only screen and (max-width: ${({ theme: { media } }) => media.tablet_portrait}) {
		padding: 0 1rem;
		height: 100%;
		width: fit-content;
	}
`

export default NavLink
