const ROLE = {
	CAPTAIN: "đội trưởng",
	MEMBER: "thành viên",
	Nickname: "Nickname",
};

const MATCH_STATUS = {
	NONE: "none",
	PENDING: "pending",
	CONFLICT: "conflict",
	CONFIRM: "confirm",
};

const NOTI_TYPE = {
	INVITE: "invite", //mời thành viên vào đội
	JOIN: "join", //thành viên yêu cầu vào đội
	OPPONENT: "opponent", //bắt đối
	SYSTEM: "system",
};

const IMAGE_TYPE = {
	PNG: "image/png",
	JPG: "image/jpg",
	JPEG: "image/JPEG",
};

const MATCH_STATUS_ENUMS = Object.freeze(MATCH_STATUS);
export { MATCH_STATUS_ENUMS };

const NOTI_TYPE_ENUMS = Object.freeze(NOTI_TYPE);
export { NOTI_TYPE_ENUMS };

const IMAGE_TYPE_ENUMS = Object.freeze(IMAGE_TYPE);
export { IMAGE_TYPE_ENUMS };

export default Object.freeze(ROLE);
