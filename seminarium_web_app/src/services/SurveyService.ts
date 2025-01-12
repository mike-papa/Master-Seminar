import axios from "axios";
import { SurveyDto, SurveyAnswersDto } from "./types";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "mojaTajnaWartosc123",
  },
});

export const createSurvey = async (survey: SurveyDto): Promise<SurveyDto> => {
  try {
    const response = await apiClient.post<SurveyDto>("/surveys", survey);
    return response.data;
  } catch (error) {
    console.error("Błąd przy wysyłaniu ankiety:", error);
    throw error;
  }
};

export const submitSurveyAnswer = async (
  answerPayload: SurveyAnswersDto
): Promise<SurveyAnswersDto> => {
  try {
    const response = await apiClient.post<SurveyAnswersDto>(
      "/surveys/answers",
      answerPayload
    );
    return response.data;
  } catch (error) {
    console.error("Błąd przy wysyłaniu odpowiedzi ankiety:", error);
    throw error;
  }
};
