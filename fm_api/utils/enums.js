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
const MATCH_STATUS_ENUMS = Object.freeze(MATCH_STATUS);
export { MATCH_STATUS_ENUMS };

export default Object.freeze(ROLE);
