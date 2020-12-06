import React from 'react';
import cx from 'classnames';

const Listner = ({ isTop = false }) => (
	<div className="v-listner">
		<div className={cx('wrapper', { top: isTop })}>
			<div className="listing" />
			<h2 className="listing-msg mb-0">How can I help you?</h2>
		</div>
	</div>
);

export default Listner;
