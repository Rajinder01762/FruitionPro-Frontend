import React, { Component } from 'react';
// import { Button, Label, Container } from 'reactstrap';

export default class Notes extends Component {
	render() {
		const titleStyle = {
			textTransform: 'capitalize',
			fontSize: '16px',
			fontFamily: 'raleway',
			fontWeight: '700',
			color: 'rgb(43, 43, 43)',
		};
		const contentStyle = {
			fontSize: '14px',
			color: 'rgb(43, 43, 43)',
			fontFamily: 'raleway',
			fontWeight: '500',
			wordBreak: 'break-all',
			overflow: 'hidden',
		};
		const tableStyle = {
			width: '100%',
			fontFamily: 'Raleway',
			borderCollapse: 'collapse',
			borderSpacing: '0',
			border: 'none',
		};
		const { notes } = this.props;
		return (
			<>
				<table style={{ ...tableStyle, marginBottom: '15px' }}>
					<tr>
						<td style={{ ...titleStyle, color: 'rgb(41, 197, 236)' }}>
							Comments:
						</td>
					</tr>
				</table>

				<table style={tableStyle}>
					{/* <tr>
            <td style={contentStyle}>
              <p style={{ fontWeight: "100", width: "100%" }}>{notes}</p>
            </td>
          </tr> */}
					{notes &&
						notes.split('\n').map((line) => {
							return (
								<tr>
									<td style={contentStyle}>
										<p style={{ fontWeight: '100', width: '100%' }}>{line}</p>
									</td>
								</tr>
							);
						})}
				</table>
			</>
		);
	}
}
