// import { Injectable } from '@nestjs/common';
// import axios from 'axios';
// import { AnalyzeResponseDto } from './Dto/respuesta.perspectice';

// @Injectable()
// export class PerspectiveService {
//   private readonly API_KEY = 'AIzaSyB0PMN3HDdKzkSeOmnBuJWj0WHM-f7C2b4'; 
//   private readonly PERSPECTIVE_API_URL ='https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

//   async analyzeText(text: string): Promise<AnalyzeResponseDto> {
//     try {
//       const response = await axios.post(
//         `${this.PERSPECTIVE_API_URL}?key=${this.API_KEY}`,
//         {
//           comment: { text },
//           languages: ['es'],
//           requestedAttributes: { TOXICITY: {} },
//         },
//       );
//       const toxicityScore =
//         response.data.attributeScores.TOXICITY.summaryScore.value;
//       let toxicityMessage = 'Este comentario no es tóxico.';

//       if (toxicityScore > 0.5) {
//         toxicityMessage = 'Este comentario es tóxico.';
//       } else if (toxicityScore > 0.3) {
//         toxicityMessage = 'Este comentario podría ser tóxico.';
//       }
//       const result: AnalyzeResponseDto = {
//         attributeScores: response.data.attributeScores,
//         toxicityMessage,
//         languages: response.data.languages,
//         detectedLanguages: response.data.detectedLanguages,
//       };
//       return result;
//     } catch (error) {
//       console.error('Error al analizar el texto:', error);
//       throw new Error('Error al analizar el texto');
//     }
//   }
// }



import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AnalyzeResponseDto } from './Dto/respuesta.perspectice';
@Injectable()
export class PerspectiveService {
  private readonly API_KEY = 'AIzaSyB0PMN3HDdKzkSeOmnBuJWj0WHM-f7C2b4'; 
  private readonly PERSPECTIVE_API_URL ='https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';
  async analyzeText(text: string): Promise<AnalyzeResponseDto> {
    try {
      const response = await axios.post(
        `${this.PERSPECTIVE_API_URL}?key=${this.API_KEY}`,
        {
          comment: { text },
          languages: ['es'],
          requestedAttributes: { TOXICITY: {} },
        },
      );
      const toxicityScore = response.data.attributeScores.TOXICITY.summaryScore.value;
      let toxicityMessage = 'Este comentario no es tóxico.';
      if (toxicityScore > 0.5) {
        toxicityMessage = 'Este comentario es tóxico.';
      } else if (toxicityScore > 0.3) {
        toxicityMessage = 'Este comentario podría ser tóxico.';
      }
      const result: AnalyzeResponseDto = {
        attributeScores: response.data.attributeScores,
        toxicityMessage,
        languages: response.data.languages,
        detectedLanguages: response.data.detectedLanguages,
      };
      return result;
    } catch (error) {
      console.error('Error al analizar el texto:', error);
      throw new Error('Error al analizar el texto');
    }
  }
}
