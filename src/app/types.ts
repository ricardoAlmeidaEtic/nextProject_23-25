export interface Track {
    id: string;
    title: string;
    artist: string;
    duration: string;
    image: string;
    audioUrl: string;
    streamCount: number;
    likes: number;
    dislikes: number;
    comments: Comment[];
  }

export interface Comment {
    id: string;
    text: string;
    author: string;
    timestamp: Date;
}