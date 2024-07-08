import React from "react";

const FilterButton = ({ text, handleFilter }) => {
	return (
		<button
			type="button"
			className="btn btn-filter"
			onClick={() => handleFilter(text)}
		>
			{text}
		</button>
	);
};
export default FilterButton;
