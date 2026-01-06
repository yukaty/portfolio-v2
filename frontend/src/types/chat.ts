export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    message: string;
    history: ChatMessage[];
    conversation_id?: string;
}

export interface Source {
    document: string;
    relevance_score: number;
    excerpt: string;
}

export interface ChatResponse {
    response: string;
    sources: Source[];
    confidence: number;
    has_sufficient_context: boolean;
    conversation_id: string;
}
