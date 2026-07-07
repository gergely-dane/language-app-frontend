import { useMutation } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface SynthesizeSpeechRequest {
  text: string;
  languageCode: string;
}

export const useSynthesizeSpeech = () => {
  return useMutation({
    mutationFn: async (request: SynthesizeSpeechRequest) => {
      const { data } = await apiClient.get<Blob>("/translations/tts", {
        params: request,
        responseType: "blob",
      });
      return data;
    },
  });
};
