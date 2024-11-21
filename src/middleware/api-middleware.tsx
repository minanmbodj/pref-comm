import { Participant, StudyStep, useStudy } from 'rssa-api';

interface UserHeaders {
  study_id: string;
}

interface RequestMeta {
  user_id: string;
  study_id: string;
  page_id?: string | null;
}

export function getHeaders(userdata: UserHeaders) {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'OPTIONS,PUT,POST,GET',
    'study-id': userdata.study_id
  };
}

export const API = process.env.NODE_ENV !== "production" 
  ? "https://rssa.recsys.dev/rssa/api/"
  : "http://localhost:8000/";

// export async function post<T>(path: string, data: any, userdata: UserHeaders): Promise<T> {
//   const { studyApi } = useStudy();
//   return studyApi.post(path, data);
// }

// export async function put<T>(path: string, data: any, userdata: UserHeaders): Promise<T> {
//   const { studyApi } = useStudy();
//   return studyApi.put(path, data);
// }

// export async function get<T>(path: string, userdata: UserHeaders): Promise<T> {
//   const { studyApi } = useStudy();
//   return studyApi.get(path);
// }

// export function createUser(userType: string, studyId: string): Promise<Participant> {
//   return post('user/consent/', {
//     study_id: studyId,
//     user_type: userType
//   }, { study_id: studyId });
// }

// export function createTestUser(userType: string, studyId: string, conditionId: number): Promise<Participant> {
//   return post(`user/consent/${conditionId}/`, {
//     study_id: studyId,
//     user_type: userType
//   }, { study_id: studyId });
// }

// export function getStudy(studyId: string): Promise<StudyStep> {
//   return get(`study/${studyId}`, { study_id: studyId });
// }

// export function getFirstStudyStep(studyId: string): Promise<StudyStep> {
//   return get(`study/${studyId}/step/first/`, { study_id: studyId });
// }

// export function getNextStudyStep(studyId: string, stepId: string): Promise<StudyStep> {
//   return get(`study/${studyId}/step/${stepId}/next`, { study_id: studyId });
// }

// export function submitResponse(
//   responseType: string, 
//   userdata: Participant, 
//   pageId: string, 
//   responses: Array<{ question_id: string; response: any }>
// ): Promise<boolean> {
//   const data = {
//     user_id: userdata.id,
//     study_id: userdata.study_id,
//     page_id: pageId,
//     responses: responses
//   };
  
//   return put(`user/${userdata.id}/response/${responseType}/`, data, { study_id: userdata.study_id });
// }

// export function updateRating(
//   userdata: Participant,
//   studyStep: StudyStep,
//   pageLevel: string,
//   ratings: Array<{ movie_id: number; rating: number }>
// ): Promise<void> {
//   const data = {
//     user_id: userdata.id,
//     study_id: userdata.study_id,
//     page_id: studyStep.id,
//     page_level: pageLevel,
//     ratings: ratings
//   };

//   return put(`user/${userdata.id}/itemrating/`, data, { study_id: userdata.study_id });
// }

// export function sendLog(
//   userdata: Participant,
//   stepId: string,
//   pageId: string | null,
//   timeSpent: number,
//   intType: string,
//   target: string,
//   itemId: number | null,
//   rating: number | null
// ): Promise<void> {
//   const data = {
//     user_id: userdata.id,
//     study_id: userdata.study_id,
//     step_id: stepId,
//     page_id: pageId,
//     time_spent: timeSpent,
//     interaction_type: intType,
//     interaction_target: target,
//     item_id: itemId,
//     rating: rating
//   };

//   return put(`user/${userdata.id}/log/`, data, { study_id: userdata.study_id });
// }

export const imgurl = (identifier?: string): string => {
  if (identifier === undefined || identifier === null) {
    return 'https://rssa.recsys.dev/movie/poster/default_movie_icon.svg';
  }
  return `https://rssa.recsys.dev/movie/poster/${identifier}`;
};