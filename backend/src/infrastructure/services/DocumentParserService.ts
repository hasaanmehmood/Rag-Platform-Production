import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface IDocumentParserService {
  parseDocument(buffer: Buffer, fileType: string): Promise<string>;
}

export class DocumentParserService implements IDocumentParserService {
  async parseDocument(buffer: Buffer, fileType: string): Promise<string> {
    try {
      switch (fileType) {
        case 'application/pdf':
          return await this.parsePDF(buffer);
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.parseDOCX(buffer);
        case 'text/plain':
          return this.parseTXT(buffer);
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }
    } catch (error) {
      console.error('Failed to parse document:', error);
      throw error;
    }
  }
  
  private async parsePDF(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }
  
  private async parseDOCX(buffer: Buffer): Promise<string> {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  
  private parseTXT(buffer: Buffer): Promise<string> {
    return Promise.resolve(buffer.toString('utf-8'));
  }
}