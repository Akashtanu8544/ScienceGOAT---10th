import { GitHubConfig, UserProgress, UserProfile } from '../types';
import { StorageService } from './db';

export interface SyncTestResult {
  success: boolean;
  repoReachable: boolean;
  quizJsonOk: boolean;
  pyqJsonOk: boolean;
  message: string;
  timestamp: string;
}

export class GitHubService {
  /**
   * Automatically convert GitHub repository or blob URLs to raw.githubusercontent.com URLs
   */
  static convertToRawUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (!trimmed) return '';

    // Already raw URL
    if (trimmed.includes('raw.githubusercontent.com')) {
      return trimmed;
    }

    // Convert github.com/user/repo/blob/branch/file.json
    // to raw.githubusercontent.com/user/repo/branch/file.json
    const blobMatch = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/);
    if (blobMatch) {
      const [, user, repo, branch, path] = blobMatch;
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
    }

    // Convert github.com/user/repo/raw/branch/file.json
    const rawMatch = trimmed.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/raw\/([^/]+)\/(.+)$/);
    if (rawMatch) {
      const [, user, repo, branch, path] = rawMatch;
      return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path}`;
    }

    return trimmed;
  }

  /**
   * Convert repository root to raw URL with file path
   */
  static getRawGitHubUrl(repoUrl: string, filePath: string): string {
    if (!repoUrl) return '';
    try {
      const cleanRepo = repoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
      const cleanPath = filePath.replace(/^\//, '');
      return `https://raw.githubusercontent.com/${cleanRepo}/main/${cleanPath}`;
    } catch {
      return repoUrl;
    }
  }

  /**
   * Fetch custom JSON with timeout & cache headers
   */
  static async fetchCustomJson<T>(url: string, timeoutMs = 8000): Promise<T | null> {
    if (!url || !url.trim()) return null;
    const rawUrl = this.convertToRawUrl(url);

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(rawUrl, {
        signal: controller.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      clearTimeout(id);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as T;
    } catch (err: any) {
      console.warn('[GitHubService] Failed to load JSON from:', rawUrl, err?.message || err);
      return null;
    }
  }

  /**
   * Test live connection to GitHub repo and custom data links
   */
  static async testConnection(config: GitHubConfig): Promise<SyncTestResult> {
    const timestamp = new Date().toLocaleTimeString('hi-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    let repoReachable = false;
    let quizJsonOk = false;
    let pyqJsonOk = false;
    const messages: string[] = [];

    // 1. Check Repo URL
    if (config.githubRepoUrl && config.githubRepoUrl.trim()) {
      try {
        const repoClean = config.githubRepoUrl.replace(/^https?:\/\/github\.com\//, '').replace(/\/$/, '');
        const apiUrl = `https://api.github.com/repos/${repoClean}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeout);

        if (res.ok || res.status === 403) {
          // 403 usually rate limit for unauthenticated api, but repo exists
          repoReachable = true;
          messages.push('GitHub रिपॉजिटरी कनेक्शन सक्रिय है');
        } else {
          messages.push('GitHub रिपॉजिटरी नहीं मिली');
        }
      } catch {
        repoReachable = false;
        messages.push('रिपॉजिटरी से संपर्क नहीं हो सका');
      }
    } else {
      messages.push('डिफ़ॉल्ट रिपॉजिटरी का उपयोग किया जा रहा है');
      repoReachable = true;
    }

    // 2. Check Custom Quiz JSON if provided
    if (config.customQuizJsonUrl && config.customQuizJsonUrl.trim()) {
      try {
        const quizData = await this.fetchCustomJson<any>(config.customQuizJsonUrl, 6000);
        if (quizData && (Array.isArray(quizData) || typeof quizData === 'object')) {
          quizJsonOk = true;
          messages.push('कस्टम क्विज़ JSON सफलतापूर्वक लोड हुआ');
        } else {
          messages.push('कस्टम क्विज़ JSON प्रारूप अमान्य है');
        }
      } catch {
        quizJsonOk = false;
        messages.push('कस्टम क्विज़ JSON से संपर्क विफल');
      }
    } else {
      quizJsonOk = true;
    }

    // 3. Check Custom PYQ JSON if provided
    if (config.customPyqJsonUrl && config.customPyqJsonUrl.trim()) {
      try {
        const pyqData = await this.fetchCustomJson<any>(config.customPyqJsonUrl, 6000);
        if (pyqData && (Array.isArray(pyqData) || typeof pyqData === 'object')) {
          pyqJsonOk = true;
          messages.push('कस्टम PYQ डेटा सफलतापूर्वक प्राप्त हुआ');
        } else {
          messages.push('कस्टम PYQ JSON प्रारूप अमान्य है');
        }
      } catch {
        pyqJsonOk = false;
        messages.push('कस्टम PYQ URL से संपर्क विफल');
      }
    } else {
      pyqJsonOk = true;
    }

    const overallSuccess = repoReachable && quizJsonOk && pyqJsonOk;

    return {
      success: overallSuccess,
      repoReachable,
      quizJsonOk,
      pyqJsonOk,
      message: messages.join(' • '),
      timestamp,
    };
  }

  /**
   * Export all app study data, progress, and settings to a JSON file
   */
  static exportDataBackup(): void {
    try {
      const progress = StorageService.getProgress();
      const profile = StorageService.getUserProfile();
      const config = StorageService.getGitHubConfig();

      const backup = {
        app: 'Science GOAT - 10th RBSE',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        progress,
        profile,
        githubConfig: config,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `science_goat_backup_${new Date().toISOString().split('T')[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (e) {
      console.error('Failed to export backup:', e);
    }
  }

  /**
   * Import data backup JSON string into local storage
   */
  static importDataBackup(jsonContent: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'अमान्य JSON फ़ाइल प्रारूप' };
      }

      if (parsed.progress) {
        StorageService.saveProgress(parsed.progress);
      }
      if (parsed.profile) {
        StorageService.saveUserProfile(parsed.profile);
      }
      if (parsed.githubConfig) {
        StorageService.saveGitHubConfig(parsed.githubConfig);
      }

      return {
        success: true,
        message: 'सभी अध्ययन प्रगति एवं सेटिंग्स सफलतापूर्वक पुनर्स्थापित (Restore) हो गईं!',
      };
    } catch (e: any) {
      return {
        success: false,
        message: `आयात विफल: ${e?.message || 'अमान्य डेटा संरचना'}`,
      };
    }
  }
}
