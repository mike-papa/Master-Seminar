// src/services/types.ts

export interface SurveyDto {
  frontendId: string;
  email: string;
}

export interface SurveyAnswersDto {
  id?: number;
  answer: boolean;
  videoEffectId: number;
  videoId: number;
  surveyId: number;
  frontendId: string;
  createdAt?: string;
}
