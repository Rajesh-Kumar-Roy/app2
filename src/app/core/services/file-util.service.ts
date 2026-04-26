import { Injectable } from '@angular/core';

export interface FileResult {
  base64: string;
  fileName: string;
  extension: string;
  mimeType: string;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class FileUtilService {

  toBase64(file: File): Promise<FileResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // strip data:...;base64,
        const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
        resolve({
          base64,
          fileName: file.name,
          extension: ext,
          mimeType: file.type,
          size: file.size
        });
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }

  base64ToUrl(base64: string, mimeType = 'image/jpeg'): string {
    return `data:${mimeType};base64,${base64}`;
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }

  getFileIcon(ext: string): string {
    const icons: Record<string, string> = {
      pdf: 'bi-file-earmark-pdf-fill text-danger',
      doc: 'bi-file-earmark-word-fill text-primary',
      docx: 'bi-file-earmark-word-fill text-primary',
      xls: 'bi-file-earmark-excel-fill text-success',
      xlsx: 'bi-file-earmark-excel-fill text-success',
      jpg: 'bi-file-earmark-image-fill text-warning',
      jpeg: 'bi-file-earmark-image-fill text-warning',
      png: 'bi-file-earmark-image-fill text-warning',
    };
    return icons[ext.toLowerCase()] ?? 'bi-file-earmark-fill text-secondary';
  }

  isImageFile(ext: string): boolean {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext.toLowerCase());
  }

  isValidImageType(file: File): boolean {
    return file.type.startsWith('image/');
  }

  isValidDocType(file: File): boolean {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png'];
    return allowed.includes(file.type);
  }
}
