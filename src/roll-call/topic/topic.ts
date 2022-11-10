export enum RollCallTopic {
  REGISTER_SUCCESS = 'fingerprint/register-success',
  REGISTER = 'fingerprint/register',
  ATTENDACE = 'home/door/attendance',
  LEAVE = 'home/door/user-leave'
}
export interface RollcallMqttPayload {
  user_id: string;
}
export interface AttendancePayload {
  user_id: string;
  timestamp: string;
}
export interface LeavePayload {
   amount : number
}
