export const getAddress = place => {
	const address = {}
	place.address_components.forEach(component => {
		address[component.types[0]] = component.long_name
	})

	address.coords = {
		lat: place.geometry.location.lat(),
		lng: place.geometry.location.lng(),
	}

	address.place_id = place.place_id
	address.formatted_address = place.formatted_address

	return address
}
