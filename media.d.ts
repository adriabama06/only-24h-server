export function GetMediaById(mediaId: string): string | null;

export function GetMediaPath(mediaId: string): string | null;

export function GetMediaAbsolutePath(mediaId: string): string | null;

export function DeleteMedia(mediaId: string): string | null;

export async function ToDeleteMedia(toDelete: any[]): void;

export const MEDIA_PATH: string;