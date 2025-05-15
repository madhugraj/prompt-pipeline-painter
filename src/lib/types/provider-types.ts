
// Provider type definitions
export type VectorDBProvider = 
  | 'ChromaDB' 
  | 'Pinecone'
  | 'Weaviate'
  | 'Milvus'
  | 'Qdrant'
  | 'PostgreSQL'
  | 'ElasticSearch'
  | 'RedisVL'
  | 'FAISS'
  | 'LanceDB';

export type EmbeddingProvider = 
  | 'OpenAI'
  | 'Cohere'
  | 'HuggingFace'
  | 'VoyageAI'
  | 'JinaAI'
  | 'GoogleGecko'
  | 'MistralEmbed'
  | 'AWSBedrock'
  | 'AlephAlpha';

export type LLMProvider = 
  | 'OpenAI'
  | 'Anthropic'
  | 'Mistral'
  | 'Groq'
  | 'Cohere'
  | 'DBRX'
  | 'Ollama'
  | 'Gemini'
  | 'Llama';

export type PromptOption = 
  | 'BasicTemplates'
  | 'FewShotLearning'
  | 'ChainOfThought'
  | 'LangChainHub'
  | 'MicrosoftPromptFlow';

export type RAGOption = 
  | 'BasicRAG'
  | 'HyDE'
  | 'ColBERT'
  | 'LlamaIndex'
  | 'AzureAISearch'
  | 'MultiQuery';

export type ChunkingOption = 
  | 'FixedSize'
  | 'SemanticSplitting'
  | 'MarkdownHTML'
  | 'NLTK'
  | 'PDFOCR';

export type FineTuningOption = 
  | 'LoRA'
  | 'QLoRA'
  | 'FullFineTuning'
  | 'Axolotl'
  | 'Unsloth'
  | 'AWSSagemaker';

export type TemperatureOption = 
  | 'FixedValue'
  | 'DynamicAdjustment'
  | 'PerToken'
  | 'LLMGuided';
