import styled from 'styled-components'

export const TeamsDropdown = () => {
	return <DropDown>

  </DropDown>
}

const DropDown = styled.ul`
	position: absolute;
	right: 0;
	top: 100%;
	list-style: none;
	border-radius: 4px;
	visibility: hidden;
	opacity: 0;
	transition: all 150ms ease-in-out;
	min-width: 150px;
	z-index: 10;
	overflow: hidden;
	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.05);

	&.toggle {
		visibility: visible;
		opacity: 1;
		transform: translateY(15px);
		transition: all 150ms ease-in-out;
	}
`

const DropDownItem = styled.li`
	color: ${({ theme: { colors } }) => colors.text};
	background-color: ${({ theme: { colors } }) => colors.bg.white};
	padding: 0.5rem 1rem;
	text-align: end;
	cursor: pointer;

	display: flex;
	justify-content: flex-start;
	align-items: center;

	&:hover {
		background-color: ${({ theme: { colors } }) => colors.primary};
		color: ${({ theme: { colors } }) => colors.text_white};

		svg {
			path {
				stroke: ${({ theme: { colors } }) => colors.bg.white};
			}
		}
	}

	svg {
		margin-right: 1rem;
		height: 24px;
		width: auto;

		path {
			stroke: ${({ theme: { colors } }) => colors.primary};
		}
	}
`
