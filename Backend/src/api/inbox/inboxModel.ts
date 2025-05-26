export interface InboxItem {
  id: Number;
  content: string;
  capturedAt: Date;
  processed: boolean;
  userId: string;
}
