export function GetMediaById(mediaId: string): string | null;

export function GetMediaPath(mediaId: string): string | null;

export function GetMediaAbsolutePath(mediaId: string): string | null;

export function DeleteMedia(mediaId: string): string | null;

export function FilterMedia(media: any[]): [any[], any[]];

export async function ToDeleteMedia(toDelete: any[]): void;

export function CheckTime(media: any, time?: number): boolean;

export const MEDIA_PATH: string;