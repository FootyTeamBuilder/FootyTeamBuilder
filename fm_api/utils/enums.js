const ROLE = {
	CAPTAIN: "đội trưởng",
	MEMBER: "thành viên",
	USER: "User",
	TEAM: "Team",
	Nickname: 'Nickname'
};

const MATCH_STATUS = {
	NONE: "none",
	PENDING: "pending",
	CONFLICT: "conflict",
	CONFIRM: "confirm"
};

export default Object.freeze(ROLE, MATCH_STATUS);
