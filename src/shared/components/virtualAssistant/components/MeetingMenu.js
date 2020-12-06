import React from 'react';
import { Button } from 'reactstrap';
import CreateIcon from '../../../../asset/images/virtual-assistant/createNewMeeting.png';
import PastMeeting from '../../../../asset/images/virtual-assistant/showPastMeeting.png';
import TodaySchedule from '../../../../asset/images/virtual-assistant/todaySchedule.png';
import UpdateMeeting from '../../../../asset/images/virtual-assistant/updateMeeting.png';
import CalendarIcon from '../../../../asset/images/virtual-assistant/calendarIcon.png';

const MeetingMenu = ({ setActiveStep }) => {
	return (
		<div className="assistant-meeting">
			<h4 className="meetings">
				<img src={CalendarIcon} className="mr-2" />
				Meeting
			</h4>
			<div>
				<Button
					onClick={() => setActiveStep(3)}
					className="subMeetingsBtn red pr-3 "
				>
					<span className="mr-2">
						<img src={CreateIcon} />
					</span>
					Create new meeting
				</Button>
				<Button className="subMeetingsBtn green pr-3">
					<span className="mr-2">
						<img src={PastMeeting} />
					</span>
					Show past meetings
				</Button>
				<Button className="subMeetingsBtn blue pr-3">
					<span className="mr-2">
						<img src={TodaySchedule} />
					</span>
					Today’s Schedule
				</Button>
				<Button className="subMeetingsBtn orange pr-3">
					<span className="mr-2">
						<img src={UpdateMeeting} />
					</span>
					Update a meeting
				</Button>
			</div>
		</div>
	);
};

export default MeetingMenu;
