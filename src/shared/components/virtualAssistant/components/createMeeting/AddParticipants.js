import React from "react";
import { Input } from "reactstrap";
import TickIcon from "../../../../../asset/images/virtual-assistant/tick.svg";
import CircleIcon from "./images/circle.svg";
import styled, { keyframes } from "styled-components";
import UserImg from "../../../../../asset/images/virtual-assistant/user.jpg";

const filterRecords = (participants, search) => {
  const search1 = search.trim().replace(/ +/g, " ");

  if (!search1) return participants;
  const isTrue = participants.filter((data) => {
    return data.email.toLowerCase().includes(search1);
  });
  return isTrue;
};
const AddParticipants = ({
  participants,
  selectParticipants,
  selectedParticipants: sp,
  search,
  onSearchChange,
}) => {
  const searchRecords = filterRecords(participants, search);

  return (
    <div className="add-participants">
      <div className="recent-users">
        <h5 className="list-title">Recently Added</h5>
        <div className="user-profile">
          {sp &&
            sp.map(({ image, name }, index) => (
              <ProfileImage
                key={index}
                src={UserImg}
                className="profile-img"
                alt={name}
                delay={0.1 * index + 0.35}
              />
            ))}
        </div>
      </div>
      <div className="search-wrapper">
        <Input
          type="search"
          name="search"
          placeholder="Search..."
          onChange={onSearchChange}
        />
      </div>
      {/* <div className="recentUserListWrapper">
				{searchRecords.map((el, index) => {
					const isSelected = sp.find((x) => x._id === el._id);

					return (
						<div
							onClick={selectParticipants(el)}
							key={index}
							className="recentUserList cursor-pointer"
						>
							<div className="d-flex align-items-center">
								<img src={UserImg} className="authorImg" alt={el.email} />
								<p className="name mb-0">{el.email}</p>
								<p className="mb-0">{el.name || "...."}</p>
							</div>
							<img
								src={isSelected ? TickIcon : CircleIcon}
								className=""
								alt="check"
								style={{ width: 20, height: 20 }}
							/>
						</div>
					);
				})}
			</div>
		</div> */}
      <div className="recentUserListWrapper">
        <div className="recentUserListHeader">
          <h4 className="mb-0">Participant Type</h4>
          <div className="d-flex justify-content-between align-items-center">
            <p className="blue mb-0">Co-organiser</p>
            <p className="mb-0">Participant</p>
          </div>
        </div>
        {searchRecords &&
          searchRecords.length > 0 &&
          searchRecords.map((el, index) => {
            const isSelected = sp.find((x) => x.id === el.id);

            return (
              <div
                // onClick={selectParticipants(el)}
                key={index}
                className="recentUserList cursor-pointer"
              >
                <div className="d-flex align-items-center">
                  <img
                    src={UserImg}
                    // src={el.image}

                    className="authorImg"
                    alt={el.name}
                  />
                  <p className="name mb-0">{el.email}</p>
                  {/* <p className="mb-0">{el.name || "...."}</p> */}
                </div>
                {/* <div className="switch-toggle">
                  <button className="state-on"></button>
                  <button className="state-handle"></button>
                  <button className="state-off"></button>
                </div> */}
                <div className="n-switch-toggle">
                  <div
                    className={`bar ${index === 0 ? "left" : ""} ${
                      index === 1 ? "right" : ""
                    } `}
                  >
                    <span className="wrapper">
                      <span className="fill" />
                    </span>
                    <span className="dot" />
                  </div>
                  <div className="btns">
                    <button />
                    <button />
                    <button />
                  </div>
                </div>
                {/* <img
                  src={isSelected ? TickIcon : CircleIcon}
                  className=""
                  alt="check"
                  style={{ width: 20, height: 20 }}
                /> */}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default AddParticipants;
const ani = keyframes`
0% {
    opacity: 0;
    transform: translate(20px, 20px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
`;
const ProfileImage = styled("img")`
  opacity: 0;
  animation: ${ani} 0.24s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation-delay: ${({ delay }) => delay}s;
`;
