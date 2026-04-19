import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Send, Trash, Bot, Paperclip, Mic, MicOff } from "lucide-react";
import { chatWithAssistant, extractTextFromFile } from "@/services/ai/assistantService";
import type { ChatMessage } from "@/services/ai/assistantService";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

// Global types for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function AIAssistantPage() {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI career assistant. How can I help you today? You can ask me about resume writing, interview tips, career advice, or any job-related questions.",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // New states for drag and drop & voice
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let finalTranscriptChunk = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscriptChunk += event.results[i][0].transcript + " ";
          }
        }
        if (finalTranscriptChunk) {
          setNewMessage((prev) => prev ? prev + " " + finalTranscriptChunk.trim() : finalTranscriptChunk.trim());
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
        if (event.error !== 'no-speech') {
          toast.error("Microphone error: " + event.error);
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Redirect if no user
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsLoading(true);
    
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    
    try {
      const history: ChatMessage[] = messages
        .filter((msg) => msg.id !== "welcome")
        .slice(-10)
        .map((msg) => ({
          role: msg.isUser ? "user" as const : "assistant" as const,
          content: msg.content,
        }));
      
      const response = await chatWithAssistant(
        userMessage.content,
        history,
        currentUser?.id
      );
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response.reply,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error querying AI:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        content: "Hello! I'm your AI career assistant. How can I help you today? You can ask me about resume writing, interview tips, career advice, or any job-related questions.",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
    toast.success("Conversation cleared");
  };

  // --- Drag and Drop Handlers ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    setIsExtracting(true);
    let extractedText = "";
    
    try {
      if (file.type.includes("image")) {
        toast.error("Image uploads are not supported yet.");
      } else {
        // Send to backend via AI assistant service
        extractedText = await extractTextFromFile(file);
      }

      if (extractedText) {
        setNewMessage((prev) => 
          prev 
            ? prev + `\n\n[Attached File: ${file.name}]\n${extractedText}\n`
            : `[Attached File: ${file.name}]\n${extractedText}\n`
        );
        toast.success(`Successfully extracted text from ${file.name}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process file.");
    } finally {
      setIsExtracting(false);
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
    // reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast.info("Microphone started. Please speak...");
      } catch (e) {
        console.error(e);
        toast.error("Microphone is already started or failed to initialize.");
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Career Assistant</h1>
          <p className="text-muted-foreground">
            Get personalized career advice, resume tips, and interview preparation
          </p>
        </div>
        
        <div 
          className="relative flex flex-col h-[75vh]"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 z-50 bg-primary/20 border-4 border-dashed border-primary rounded-xl flex items-center justify-center pointer-events-none backdrop-blur-sm">
              <div className="bg-background/80 shadow-glow p-6 rounded-lg text-center">
                <Paperclip className="h-10 w-10 mx-auto text-primary mb-2 animate-bounce" />
                <h3 className="text-lg font-bold">Drop files here</h3>
                <p className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT</p>
              </div>
            </div>
          )}

          <Card className="h-full flex flex-col flex-grow relative shadow-card overflow-hidden border-border/40">
            <CardHeader className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-6 w-6 text-primary" />
                  <CardTitle>Career Assistant</CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={clearConversation}>
                  <Trash className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </div>
              <CardDescription>
                Powered by Ollama AI (Local LLM)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow overflow-auto p-4 md:p-6 bg-gradient-to-b from-background to-muted/20">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${
                        message.isUser
                          ? "bg-primary text-primary-foreground shadow-glow-sm"
                          : "bg-card text-card-foreground shadow-card border border-border/50"
                      }`}
                    >
                      <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">{message.content}</div>
                      <div
                        className={`text-[11px] mt-2 text-right ${
                          message.isUser ? "text-primary-foreground/70" : "text-muted-foreground/70"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {(isLoading || isExtracting) && (
                  <div className="flex justify-start animate-fade-in opacity-80">
                    <div className="max-w-[80%] rounded-2xl px-5 py-4 bg-card border shadow-sm">
                      <div className="flex items-center text-sm font-medium">
                        <Loader2 className="h-5 w-5 animate-spin mr-3 text-primary" />
                        <span className="animate-pulse bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                          {isExtracting ? "Extracting text from file..." : "Assistant is typing..."}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t bg-background/95 p-4 flex-col gap-3">
              <div className="flex w-full gap-3 items-end relative bg-muted/30 p-2 rounded-2xl border border-border/50 focus-within:border-primary/50 focus-within:shadow-glow-sm transition-all duration-300">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileChange} 
                />
                
                <div className="flex flex-row gap-1 self-end pb-1 md:pb-2 pl-1">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full hover:bg-background shadow-sm bg-muted/50 text-muted-foreground hover:text-foreground transition-all duration-300"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isExtracting}
                    title="Attach File"
                  >
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button 
                    type="button" 
                    variant={isRecording ? "default" : "ghost"} 
                    size="icon" 
                    className={`h-10 w-10 md:h-12 md:w-12 rounded-full shadow-sm transition-all duration-300 ${
                      isRecording 
                        ? 'bg-destructive hover:bg-destructive/90 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                        : 'bg-muted/50 hover:bg-background text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={toggleRecording}
                    title={isRecording ? "Stop Recording" : "Start Voice Dictation"}
                  >
                    {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                </div>

                <div className="flex-1 relative flex items-center">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question or drop a resume file..."
                    disabled={isLoading || isExtracting}
                    className="flex-1 min-h-[50px] max-h-[250px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 px-2 py-3 md:py-4 text-base scrollbar-hide"
                  />
                  <Button 
                    type="button" 
                    onClick={() => handleSendMessage()}
                    disabled={isLoading || isExtracting || !newMessage.trim()}
                    size="icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-glow disabled:opacity-50 transition-all duration-300 ml-1 mb-1 md:mb-2 self-end"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5 translate-x-[2px]" />
                    )}
                    <span className="sr-only">Send</span>
                  </Button>
                </div>
              </div>
              <div className="w-full flex justify-between px-3">
                 <span className="text-[11px] md:text-xs text-muted-foreground flex items-center gap-1.5 opacity-80">
                   <Paperclip className="h-3 w-3 inline" /> Drag & drop a PDF/DOCX to send to AI
                 </span>
                 <span className="text-[11px] md:text-xs text-muted-foreground opacity-80 hidden sm:inline-block">
                   Press <kbd className="bg-muted px-1 rounded text-[10px]">Enter</kbd> to send, <kbd className="bg-muted px-1 rounded text-[10px]">Shift+Enter</kbd> for new line
                 </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
