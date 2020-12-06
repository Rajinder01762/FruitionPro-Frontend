import React, { useState } from 'react';
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from 'reactstrap';
import cx from 'classnames';

const DropDown = ({ selected, options, onSelect, defaultSel }) => {
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const toggle = () => setDropdownOpen((prevState) => !prevState);
	return (
		<Dropdown
			isOpen={dropdownOpen}
			toggle={toggle}
			className={cx('virtual-dropdown', { active: selected })}
		>
			<DropdownToggle caret>{selected || defaultSel}</DropdownToggle>
			<DropdownMenu>
				{options.map(({ _id, value }) => (
					<DropdownItem key={_id} onClick={() => onSelect({ _id, value })}>
						{value}
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
};

export default DropDown;
