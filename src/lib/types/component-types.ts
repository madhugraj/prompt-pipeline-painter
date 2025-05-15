
// Basic component type enums
export enum ComponentType {
  VECTOR_DB = 'vectordb',
  EMBEDDING = 'embedding',
  LLM = 'llm',
  PROMPT = 'prompt',
  RAG = 'rag',
  CHUNKING = 'chunking',
  FINE_TUNING = 'finetuning',
  TEMPERATURE = 'temperature',
}

export enum ConnectionType {
  DATA = 'data', 
  CONTROL = 'control',
  TEXT = 'text',
  EMBEDDING = 'embedding',
  VECTOR = 'vector',
  QUERY = 'query',
  RESULT = 'result',
  DOCUMENT = 'document',
  CONFIG = 'config',
}
