
import { PlatformAdapter, PlatformCapabilities, PlatformType } from './types';

// TypeScript declarations for File System Access API
declare global {
  interface Window {
    showSaveFilePicker?: (options?: any) => Promise<any>;
    showOpenFilePicker?: (options?: any) => Promise<any>;
  }
}

export class WebAdapter implements PlatformAdapter {
  type: PlatformType = 'web';
  
  capabilities: PlatformCapabilities = {
    hasCamera: !!navigator.mediaDevices?.getUserMedia,
    hasMicrophone: !!navigator.mediaDevices?.getUserMedia,
    hasFileSystem: !!window.showSaveFilePicker,
    hasNotifications: !!window.Notification,
    hasOfflineStorage: !!window.localStorage,
    maxStorageSize: 5 * 1024 * 1024, // 5MB typical localStorage limit
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  };
  
  async saveFile(data: Blob, filename: string): Promise<boolean> {
    try {
      if (this.capabilities.hasFileSystem && window.showSaveFilePicker) {
        // Use File System Access API if available
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Files',
            accept: { '*/*': [] }
          }]
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(data);
        await writable.close();
        return true;
      } else {
        // Fallback to download
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return true;
      }
    } catch (error) {
      console.error('Failed to save file:', error);
      return false;
    }
  }
  
  async readFile(filename: string): Promise<Blob | null> {
    try {
      if (this.capabilities.hasFileSystem && window.showOpenFilePicker) {
        const [fileHandle] = await window.showOpenFilePicker();
        const file = await fileHandle.getFile();
        return file;
      } else {
        // Use input element for file selection
        return new Promise((resolve) => {
          const input = document.createElement('input');
          input.type = 'file';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            resolve(file || null);
          };
          input.click();
        });
      }
    } catch (error) {
      console.error('Failed to read file:', error);
      return null;
    }
  }
  
  async deleteFile(filename: string): Promise<boolean> {
    // Web platform doesn't typically allow direct file deletion
    console.warn('File deletion not supported on web platform');
    return false;
  }
  
  async captureImage(): Promise<Blob | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();
      
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      stream.getTracks().forEach(track => track.stop());
      
      return new Promise((resolve) => {
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      });
    } catch (error) {
      console.error('Failed to capture image:', error);
      return null;
    }
  }
  
  async captureVideo(): Promise<Blob | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      return new Promise((resolve) => {
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
          resolve(new Blob(chunks, { type: 'video/webm' }));
        };
        
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 10000); // 10 second recording
      });
    } catch (error) {
      console.error('Failed to capture video:', error);
      return null;
    }
  }
  
  async recordAudio(): Promise<Blob | null> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      
      return new Promise((resolve) => {
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach(track => track.stop());
          resolve(new Blob(chunks, { type: 'audio/webm' }));
        };
        
        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 5000); // 5 second recording
      });
    } catch (error) {
      console.error('Failed to record audio:', error);
      return null;
    }
  }
  
  async playAudio(data: Blob): Promise<boolean> {
    try {
      const audio = new Audio(URL.createObjectURL(data));
      await audio.play();
      return true;
    } catch (error) {
      console.error('Failed to play audio:', error);
      return false;
    }
  }
  
  async showNotification(title: string, message: string): Promise<boolean> {
    try {
      if (!this.capabilities.hasNotifications) return false;
      
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification(title, { body: message });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to show notification:', error);
      return false;
    }
  }
  
  async shareContent(content: any): Promise<boolean> {
    try {
      if (navigator.share) {
        await navigator.share(content);
        return true;
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(JSON.stringify(content));
        return true;
      }
    } catch (error) {
      console.error('Failed to share content:', error);
      return false;
    }
  }
  
  async openExternalUrl(url: string): Promise<boolean> {
    try {
      window.open(url, '_blank');
      return true;
    } catch (error) {
      console.error('Failed to open external URL:', error);
      return false;
    }
  }
}
