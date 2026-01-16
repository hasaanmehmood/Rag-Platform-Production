import { config } from '../../config/index.js';

export interface TextChunk {
  content: string;
  index: number;
  metadata: Record<string, any>;
}

export interface IChunkingService {
  chunkText(text: string): TextChunk[];
}

export class RecursiveChunkingService implements IChunkingService {
  private readonly chunkSize: number;
  private readonly chunkOverlap: number;
  private readonly separators: string[];
  
  constructor() {
    this.chunkSize = config.chunking.chunkSize;
    this.chunkOverlap = config.chunking.chunkOverlap;
    this.separators = ['\n\n', '\n', '. ', ' ', ''];
  }
  
  chunkText(text: string): TextChunk[] {
    const chunks: TextChunk[] = [];
    const cleanedText = text.replace(/\r\n/g, '\n').trim();
    
    this.splitTextRecursive(cleanedText, 0, chunks);
    
    return chunks.map((chunk, index) => ({
      ...chunk,
      index,
    }));
  }
  
  private splitTextRecursive(
    text: string,
    startIndex: number,
    chunks: TextChunk[]
  ): void {
    if (text.length <= this.chunkSize) {
      if (text.trim().length > 0) {
        chunks.push({
          content: text.trim(),
          index: chunks.length,
          metadata: { startIndex, length: text.length },
        });
      }
      return;
    }
    
    for (const separator of this.separators) {
      if (text.includes(separator)) {
        const splits = text.split(separator);
        let currentChunk = '';
        let currentStart = startIndex;
        
        for (let i = 0; i < splits.length; i++) {
          const split = splits[i];
          const testChunk = currentChunk + (currentChunk ? separator : '') + split;
          
          if (testChunk.length <= this.chunkSize) {
            currentChunk = testChunk;
          } else {
            if (currentChunk.trim().length > 0) {
              chunks.push({
                content: currentChunk.trim(),
                index: chunks.length,
                metadata: { startIndex: currentStart, length: currentChunk.length },
              });
            }
            
            if (split.length > this.chunkSize) {
              this.splitTextRecursive(split, currentStart + currentChunk.length, chunks);
              currentChunk = '';
            } else {
              const overlapStart = Math.max(0, currentChunk.length - this.chunkOverlap);
              currentChunk = currentChunk.substring(overlapStart) + separator + split;
              currentStart += overlapStart;
            }
          }
        }
        
        if (currentChunk.trim().length > 0) {
          chunks.push({
            content: currentChunk.trim(),
            index: chunks.length,
            metadata: { startIndex: currentStart, length: currentChunk.length },
          });
        }
        
        return;
      }
    }
    
    // Fallback: split by character
    const mid = Math.floor(this.chunkSize);
    chunks.push({
      content: text.substring(0, mid).trim(),
      index: chunks.length,
      metadata: { startIndex, length: mid },
    });
    
    const overlapStart = Math.max(0, mid - this.chunkOverlap);
    this.splitTextRecursive(
      text.substring(overlapStart),
      startIndex + overlapStart,
      chunks
    );
  }
}

export default RecursiveChunkingService;