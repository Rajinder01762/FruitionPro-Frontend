import React from 'react';
import SuccessIcon from './success';

const Finish = () => (
	<div
		className="d-flex align-items-center justify-content-center"
		style={{ height: 560 }}
	>
		<div className="text-center">
			<SuccessIcon />
			<h2>
				Meeting Created
				<br />
				Successfully
			</h2>
		</div>
	</div>
);

export default Finish;
