import { GitHubConfig } from '../types';

export class GitHubService {
  static async fetchCustomJson<T>(url: string): Promise<T | null> {
    if (!url || !url.trim()) return null;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data as T;
    } catch (err) {
      console.warn('Failed to load GitHub JSON from URL:', url, err);
      return null;
    }
  }

  static getRawGitHubUrl(repoUrl: string, filePath: string): string {
    // Converts https://github.com/user/repo to https://raw.githubusercontent.com/user/repo/main/filePath
    try {
      const cleanRepo = repoUrl.replace('https://github.com/', '').replace(/\/$/, '');
      return `https://raw.githubusercontent.com/${cleanRepo}/main/${filePath}`;
    } catch (e) {
      return repoUrl;
    }
  }
}
