// src/services/types.ts

export interface SurveyDto {
  frontendId: string;
  email: string;
}

export interface SurveyAnswersDto {
  id?: number;
  answer: boolean;
  videoEffectName: string;
  videoId: number;
  surveyId?: number;
  frontendId: string;
  createdAt?: string;
}
