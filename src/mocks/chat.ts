import { ChatSessionResponse, ChatSessionListResponse, ChatMessageResponse, ChatMessageListResponse } from "@/types/api";

export const mockChatSessions: ChatSessionResponse[] = [
  {
    id: 1,
    tenant_id: 1,
    broker_user_id: 2,
    client_id: 1,
    title: "Apartment Search - Alice Cooper",
    status: "active",
    summary_text: "Discussing 2-3 bedroom apartments in downtown area",
    context_json: {
      client_name: "Alice Cooper",
      client_budget: "$300k-$500k",
      preferences: ["downtown", "apartment"],
    },
    created_at: "2024-06-10T14:00:00Z",
    updated_at: "2024-06-16T10:30:00Z",
  },
  {
    id: 2,
    tenant_id: 1,
    broker_user_id: 2,
    client_id: 2,
    title: "House Sale Discussion - Bob Davis",
    status: "active",
    summary_text: "Exploring options for selling house in suburbs",
    context_json: {
      client_name: "Bob Davis",
      property_location: "suburbs",
      goal: "quick selling",
    },
    created_at: "2024-06-05T09:00:00Z",
    updated_at: "2024-06-15T16:00:00Z",
  },
  {
    id: 3,
    tenant_id: 1,
    broker_user_id: 3,
    client_id: 3,
    title: "Investment Property Analysis - Carol Martinez",
    status: "active",
    summary_text: "Analyzing multi-unit investment opportunities",
    context_json: {
      client_name: "Carol Martinez",
      investment_type: "multi-unit",
      budget: "$500k-$1M",
    },
    created_at: "2024-06-01T11:00:00Z",
    updated_at: "2024-06-16T13:00:00Z",
  },
  {
    id: 4,
    tenant_id: 1,
    broker_user_id: 2,
    title: "General Real Estate Inquiry",
    status: "active",
    summary_text: "General questions about current market",
    context_json: {
      topic: "market_overview",
    },
    created_at: "2024-06-14T15:30:00Z",
    updated_at: "2024-06-16T09:00:00Z",
  },
];

export const mockChatSessionsResponse: ChatSessionListResponse = {
  items: mockChatSessions,
  total: mockChatSessions.length,
  limit: 20,
  offset: 0,
};

export const mockChatMessages: ChatMessageResponse[] = [
  {
    id: 1,
    session_id: 1,
    sender_type: "user",
    sender_user_id: 1,
    message_type: "text",
    content: "Hi! I'm looking for a 2-3 bedroom apartment in downtown area",
    meta_data: {},
    created_at: "2024-06-10T14:00:00Z",
  },
  {
    id: 2,
    session_id: 1,
    sender_type: "ai",
    message_type: "text",
    content:
      "Great! I found several options that match your criteria. Let me show you some properties within your budget of $300k-$500k.",
    meta_data: {},
    created_at: "2024-06-10T14:01:00Z",
  },
  {
    id: 3,
    session_id: 1,
    sender_type: "user",
    sender_user_id: 1,
    message_type: "text",
    content: "What about parking and balcony?",
    meta_data: {},
    created_at: "2024-06-10T14:02:00Z",
  },
  {
    id: 4,
    session_id: 1,
    sender_type: "ai",
    message_type: "text",
    content:
      "Perfect! I've filtered the results to show only apartments with both parking and balcony. Here are 3 excellent options that match all your requirements.",
    meta_data: {
      listing_ids: [1, 2],
    },
    created_at: "2024-06-10T14:03:00Z",
  },
  {
    id: 5,
    session_id: 1,
    sender_type: "user",
    sender_user_id: 1,
    message_type: "text",
    content: "Can you schedule a viewing for the first property?",
    meta_data: {},
    created_at: "2024-06-10T14:05:00Z",
  },
  {
    id: 6,
    session_id: 1,
    sender_type: "ai",
    message_type: "text",
    content:
      "I'll help you schedule a viewing. Would you prefer a weekday or weekend? What time works best for you?",
    meta_data: {},
    created_at: "2024-06-10T14:06:00Z",
  },
  {
    id: 7,
    session_id: 2,
    sender_type: "user",
    sender_user_id: 2,
    message_type: "text",
    content: "Hi, I want to sell my house. What's the current market value?",
    meta_data: {},
    created_at: "2024-06-05T09:00:00Z",
  },
  {
    id: 8,
    session_id: 2,
    sender_type: "ai",
    message_type: "text",
    content:
      "Hello! To provide an accurate market valuation, I need some details about your property. Can you tell me about the size, condition, and location?",
    meta_data: {},
    created_at: "2024-06-05T09:01:00Z",
  },
  {
    id: 9,
    session_id: 3,
    sender_type: "user",
    sender_user_id: 3,
    message_type: "text",
    content: "What are the current investment opportunities in multi-unit properties?",
    meta_data: {},
    created_at: "2024-06-01T11:00:00Z",
  },
  {
    id: 10,
    session_id: 3,
    sender_type: "ai",
    message_type: "text",
    content:
      "Great question! I've identified several promising multi-unit properties in your target market with strong ROI potential. Let me analyze the cash flow projections for you.",
    meta_data: {
      analysis_type: "investment_analysis",
    },
    created_at: "2024-06-01T11:02:00Z",
  },
];

export const mockChatMessagesResponse: ChatMessageListResponse = {
  items: mockChatMessages,
  total: mockChatMessages.length,
};

export const mockChatSessionDetail: ChatSessionResponse = mockChatSessions[0];
export const mockChatSessionMessages: ChatMessageListResponse = {
  items: mockChatMessages.filter((m) => m.session_id === 1),
  total: 6,
};
